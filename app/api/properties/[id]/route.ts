import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Property from '@/lib/models/Property';
import { authOptions } from '@/lib/auth';
import { uploadMultipleImages, deleteMultipleImages } from '@/lib/cloudinary';

/**
 * GET /api/properties/[id]
 * Get a single property by ID or slug
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        // Try to find by slug first, then by ID
        let property = await Property.findOne({ slug: id }).lean();
        
        if (!property) {
            // If not found by slug, try by MongoDB ID
            property = await Property.findById(id).lean();
        }

        if (!property) {
            return NextResponse.json(
                { error: 'Property not found' },
                { status: 404 }
            );
        }

        // Increment views using the actual _id
        await Property.findByIdAndUpdate(property._id, { $inc: { views: 1 } });

        return NextResponse.json({ property });
    } catch (error) {
        console.error('Get property error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch property' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/properties/[id]
 * Update a property (admin only)
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { id } = await params;

        // Only admin can update properties
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
            status,
            listingType,
            price,
            priceUnit,
            area,
            areaUnit,
            bedrooms,
            bathrooms,
            features,
            newImages, // New images to upload (base64)
            removeImages, // Public IDs of images to remove
            location,
            isFeatured,
            isActive,
        } = body;

        const property = await Property.findById(id);
        if (!property) {
            return NextResponse.json(
                { error: 'Property not found' },
                { status: 404 }
            );
        }

        // Handle image removals
        if (removeImages && removeImages.length > 0) {
            await deleteMultipleImages(removeImages);
            property.images = property.images.filter(
                (img) => !removeImages.includes(img.publicId)
            );
        }

        // Handle new image uploads
        if (newImages && newImages.length > 0) {
            const uploadResults = await uploadMultipleImages(newImages);
            const newUploadedImages = uploadResults.map((result) => ({
                url: result.url,
                publicId: result.publicId,
                isPrimary: false,
            }));
            property.images.push(...newUploadedImages);
        }

        // Ensure at least one primary image
        if (property.images.length > 0 && !property.images.some((img) => img.isPrimary)) {
            property.images[0].isPrimary = true;
        }

        // Update other fields
        if (name) property.name = name;
        if (description) property.description = description;
        if (propertyType) property.propertyType = propertyType;
        if (status) property.status = status;
        if (listingType) property.listingType = listingType;
        if (price !== undefined) property.price = price;
        if (priceUnit) property.priceUnit = priceUnit;
        if (area !== undefined) property.area = area;
        if (areaUnit) property.areaUnit = areaUnit;
        if (bedrooms !== undefined) property.bedrooms = bedrooms;
        if (bathrooms !== undefined) property.bathrooms = bathrooms;
        if (features) property.features = features;
        if (location) property.location = location;
        if (typeof isFeatured === 'boolean') property.isFeatured = isFeatured;
        if (typeof isActive === 'boolean') property.isActive = isActive;

        await property.save();

        return NextResponse.json({
            message: 'Property updated successfully',
            property,
        });
    } catch (error) {
        console.error('Update property error:', error);
        return NextResponse.json(
            { error: 'Failed to update property' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/properties/[id]
 * Delete a property (admin only)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { id } = await params;

        // Only admin can delete properties
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        const property = await Property.findById(id);
        if (!property) {
            return NextResponse.json(
                { error: 'Property not found' },
                { status: 404 }
            );
        }

        // Delete images from Cloudinary
        if (property.images.length > 0) {
            const publicIds = property.images.map((img) => img.publicId);
            await deleteMultipleImages(publicIds);
        }

        await Property.findByIdAndDelete(id);

        return NextResponse.json({
            message: 'Property deleted successfully',
        });
    } catch (error) {
        console.error('Delete property error:', error);
        return NextResponse.json(
            { error: 'Failed to delete property' },
            { status: 500 }
        );
    }
}



