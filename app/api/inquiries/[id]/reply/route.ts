import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Inquiry, { InquiryStatus } from '@/lib/models/Inquiry';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/inquiries/[id]/reply
 * Add a reply to an inquiry
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session) {
            return NextResponse.json(
                { error: 'Please login to reply' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { message } = body;

        if (!message || message.trim().length === 0) {
            return NextResponse.json(
                { error: 'Reply message is required' },
                { status: 400 }
            );
        }

        const inquiry = await Inquiry.findById(id);

        if (!inquiry) {
            return NextResponse.json(
                { error: 'Inquiry not found' },
                { status: 404 }
            );
        }

        // Check access - admin can reply to all, users can only reply to their own
        const isAdmin = session.user.role === 'admin';
        if (!isAdmin && inquiry.email !== session.user.email) {
            return NextResponse.json(
                { error: 'You do not have permission to reply to this inquiry' },
                { status: 403 }
            );
        }

        // Add reply
        inquiry.replies.push({
            message: message.trim(),
            isAdmin,
            createdAt: new Date(),
        });

        // If admin is replying, update status to in_progress if it was pending
        if (isAdmin && inquiry.status === InquiryStatus.PENDING) {
            inquiry.status = InquiryStatus.IN_PROGRESS;
        }

        await inquiry.save();

        return NextResponse.json({
            message: 'Reply added successfully',
            inquiry,
        });
    } catch (error) {
        console.error('Add reply error:', error);
        return NextResponse.json(
            { error: 'Failed to add reply' },
            { status: 500 }
        );
    }
}



