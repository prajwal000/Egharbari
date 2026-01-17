import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

/**
 * POST /api/upload
 * Upload image to Cloudinary (admin only)
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Only admin can upload images
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { image, folder } = body;

        if (!image) {
            return NextResponse.json(
                { error: 'Image is required' },
                { status: 400 }
            );
        }

        const result = await uploadImage(image, folder || 'egharbari/properties');

        return NextResponse.json({
            message: 'Image uploaded successfully',
            ...result,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/upload
 * Delete image from Cloudinary (admin only)
 */
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Only admin can delete images
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { publicId } = body;

        if (!publicId) {
            return NextResponse.json(
                { error: 'Public ID is required' },
                { status: 400 }
            );
        }

        const success = await deleteImage(publicId);

        if (success) {
            return NextResponse.json({ message: 'Image deleted successfully' });
        } else {
            return NextResponse.json(
                { error: 'Failed to delete image' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete image' },
            { status: 500 }
        );
    }
}









