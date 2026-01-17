import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db/mongodb';
import Favorite from '@/lib/models/Favorite';

/**
 * GET /api/favorites/check?propertyId=xxx
 * Check if a property is favorited by the current user
 */
export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ isFavorite: false }, { status: 200 });
        }

        const { searchParams } = new URL(request.url);
        const propertyId = searchParams.get('propertyId');

        if (!propertyId) {
            return NextResponse.json(
                { error: 'Property ID is required' },
                { status: 400 }
            );
        }

        const favorite = await Favorite.findOne({
            userId: session.user.id,
            propertyId,
        });

        return NextResponse.json(
            { isFavorite: !!favorite },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Check favorite error:', error);
        return NextResponse.json(
            { error: 'Failed to check favorite status' },
            { status: 500 }
        );
    }
}

