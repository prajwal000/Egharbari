import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Inquiry from '@/lib/models/Inquiry';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/inquiries/[id]
 * Get a single inquiry by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { id } = await params;

        const inquiry = await Inquiry.findById(id).lean();

        if (!inquiry) {
            return NextResponse.json(
                { error: 'Inquiry not found' },
                { status: 404 }
            );
        }

        // Check access - admin can see all, users can only see their own
        if (session?.user?.role !== 'admin') {
            if (inquiry.email !== session?.user?.email) {
                return NextResponse.json(
                    { error: 'You do not have permission to view this inquiry' },
                    { status: 403 }
                );
            }
        }

        return NextResponse.json({ inquiry });
    } catch (error) {
        console.error('Get inquiry error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch inquiry' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/inquiries/[id]
 * Update inquiry status (admin only)
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { id } = await params;

        // Only admin can update inquiry status
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { status, isRead } = body;

        const updateData: { status?: string; isRead?: boolean } = {};
        if (status) updateData.status = status;
        if (typeof isRead === 'boolean') updateData.isRead = isRead;

        const inquiry = await Inquiry.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).lean();

        if (!inquiry) {
            return NextResponse.json(
                { error: 'Inquiry not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Inquiry updated successfully',
            inquiry,
        });
    } catch (error) {
        console.error('Update inquiry error:', error);
        return NextResponse.json(
            { error: 'Failed to update inquiry' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/inquiries/[id]
 * Delete an inquiry (admin only)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { id } = await params;

        // Only admin can delete inquiries
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        const inquiry = await Inquiry.findByIdAndDelete(id);

        if (!inquiry) {
            return NextResponse.json(
                { error: 'Inquiry not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Inquiry deleted successfully',
        });
    } catch (error) {
        console.error('Delete inquiry error:', error);
        return NextResponse.json(
            { error: 'Failed to delete inquiry' },
            { status: 500 }
        );
    }
}

