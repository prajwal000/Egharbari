import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Property from '@/lib/models/Property';
import { authOptions } from '@/lib/auth';
import { uploadMultipleImages } from '@/lib/cloudinary';

/**
 * GET /api/properties
 * Get all properties with filters
 */
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const propertyType = searchParams.get('propertyType');
        const status = searchParams.get('status');
        const listingType = searchParams.get('listingType');
        const district = searchParams.get('district');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const bedrooms = searchParams.get('bedrooms');
        const sortBy = searchParams.get('sortBy') || 'date_desc';
        const featured = searchParams.get('featured');
        const search = searchParams.get('search');

        const skip = (page - 1) * limit;

        // Build query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = { isActive: true };

        if (propertyType) query.propertyType = propertyType;
        if (status) query.status = status;
        if (listingType) query.listingType = listingType;
        if (district) query['location.district'] = district;
        if (bedrooms) query.bedrooms = parseInt(bedrooms);
        if (featured === 'true') query.isFeatured = true;

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseInt(minPrice);
            if (maxPrice) query.price.$lte = parseInt(maxPrice);
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'location.address': { $regex: search, $options: 'i' } },
                { 'location.district': { $regex: search, $options: 'i' } },
            ];
        }

        // Build sort
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let sort: any = { createdAt: -1 };
        switch (sortBy) {
            case 'price_asc':
                sort = { price: 1 };
                break;
            case 'price_desc':
                sort = { price: -1 };
                break;
            case 'date_asc':
                sort = { createdAt: 1 };
                break;
            case 'date_desc':
            default:
                sort = { createdAt: -1 };
        }

        const [properties, total] = await Promise.all([
            Property.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Property.countDocuments(query),
        ]);

        return NextResponse.json({
            properties,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get properties error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch properties' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/properties
 * Create a new property (admin only)
 */
export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        // Only admin can create properties
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const {
            name,
            description,
            propertyType,
            listingType,
            price,
            priceUnit,
            area,
            areaUnit,
            bedrooms,
            bathrooms,
            features,
            images, // Array of base64 strings
            location,
            isFeatured,
        } = body;

        // Validation
        if (!name || !description || !propertyType || !listingType || !price || !location) {
            return NextResponse.json(
                { error: 'Required fields: name, description, propertyType, listingType, price, location' },
                { status: 400 }
            );
        }

        // Upload images to Cloudinary
        let uploadedImages: { url: string; publicId: string; isPrimary: boolean }[] = [];
        if (images && images.length > 0) {
            const uploadResults = await uploadMultipleImages(images);
            uploadedImages = uploadResults.map((result, index) => ({
                url: result.url,
                publicId: result.publicId,
                isPrimary: index === 0,
            }));
        }

        // Create property
        const property = await Property.create({
            name,
            description,
            propertyType,
            listingType,
            price,
            priceUnit: priceUnit || 'NPR',
            area,
            areaUnit: areaUnit || 'sq.ft',
            bedrooms,
            bathrooms,
            features: features || [],
            images: uploadedImages,
            location,
            isFeatured: isFeatured || false,
            owner: session.user.id,
        });

        return NextResponse.json(
            {
                message: 'Property created successfully',
                property,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create property error:', error);
        return NextResponse.json(
            { error: 'Failed to create property' },
            { status: 500 }
        );
    }
}



