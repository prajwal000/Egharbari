import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/lib/models/Property';

/**
 * GET /api/properties/districts
 * Get list of districts that have active properties
 */
export async function GET() {
    try {
        await dbConnect();

        // Get distinct districts from active properties
        const districts = await Property.distinct('location.district', { isActive: true });

        // Sort districts alphabetically
        const sortedDistricts = districts.sort();

        return NextResponse.json({
            districts: sortedDistricts,
        });
    } catch (error) {
        console.error('Get districts error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch districts' },
            { status: 500 }
        );
    }
}





