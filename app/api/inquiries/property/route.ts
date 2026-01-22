import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Inquiry from '@/lib/models/Inquiry';
import Property from '@/lib/models/Property';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/inquiries/property
 * Get property-specific inquiries (admin only)
 */
export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        // Only admin can view property inquiries
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');
        const propertyId = searchParams.get('propertyId');

        const skip = (page - 1) * limit;

        // Build query - only property type inquiries
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = { type: 'property' };

        if (status) query.status = status;
        if (propertyId) query.propertyId = propertyId;

        const [inquiries, total] = await Promise.all([
            Inquiry.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Inquiry.countDocuments(query),
        ]);

        // Fetch property details for each inquiry
        const propertyIds = [...new Set(inquiries.map(i => i.propertyId).filter(Boolean))];
        const properties = await Property.find({ _id: { $in: propertyIds } })
            .select('propertyId name location.district images')
            .lean();

        // Create property map
        const propertyMap = new Map(properties.map(p => [p._id.toString(), p]));

        // Attach property info to inquiries
        const inquiriesWithProperty = inquiries.map(inquiry => ({
            ...inquiry,
            property: inquiry.propertyId ? propertyMap.get(inquiry.propertyId.toString()) : null,
        }));

        return NextResponse.json({
            inquiries: inquiriesWithProperty,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get property inquiries error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch property inquiries' },
            { status: 500 }
        );
    }
}












