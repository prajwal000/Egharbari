import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Favorite from '@/lib/models/Favorite';
import Property from '@/lib/models/Property';

/**
 * GET /api/favorites
 * Get all favorites for the current user
 */
export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const favorites = await Favorite.find({ userId: session.user.id })
            .populate('propertyId')
            .sort({ createdAt: -1 });

        // Filter out favorites where property no longer exists
        const validFavorites = favorites.filter(fav => fav.propertyId);

        return NextResponse.json({ favorites: validFavorites }, { status: 200 });
    } catch (error: any) {
        console.error('Get favorites error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch favorites' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/favorites
 * Add a property to favorites
 */
export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { propertyId } = body;

        if (!propertyId) {
            return NextResponse.json(
                { error: 'Property ID is required' },
                { status: 400 }
            );
        }

        // Check if property exists
        const property = await Property.findById(propertyId);
        if (!property) {
            return NextResponse.json(
                { error: 'Property not found' },
                { status: 404 }
            );
        }

        // Check if already favorited
        const existingFavorite = await Favorite.findOne({
            userId: session.user.id,
            propertyId,
        });

        if (existingFavorite) {
            return NextResponse.json(
                { error: 'Property already in favorites' },
                { status: 400 }
            );
        }

        // Create favorite
        const favorite = await Favorite.create({
            userId: session.user.id,
            propertyId,
        });

        return NextResponse.json(
            {
                message: 'Property added to favorites',
                favorite: {
                    _id: favorite._id,
                    propertyId: favorite.propertyId,
                    createdAt: favorite.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Add favorite error:', error);

        // Handle duplicate key error
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'Property already in favorites' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to add favorite' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/favorites
 * Remove a property from favorites
 */
export async function DELETE(request: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const propertyId = searchParams.get('propertyId');

        if (!propertyId) {
            return NextResponse.json(
                { error: 'Property ID is required' },
                { status: 400 }
            );
        }

        const favorite = await Favorite.findOneAndDelete({
            userId: session.user.id,
            propertyId,
        });

        if (!favorite) {
            return NextResponse.json(
                { error: 'Favorite not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Property removed from favorites' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Delete favorite error:', error);
        return NextResponse.json(
            { error: 'Failed to remove favorite' },
            { status: 500 }
        );
    }
}



