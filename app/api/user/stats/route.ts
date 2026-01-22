import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Inquiry from '@/lib/models/Inquiry';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/user/stats
 * Get user dashboard statistics
 */
export async function GET() {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        // Require authentication
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized - Authentication required' },
                { status: 401 }
            );
        }

        const userEmail = session.user.email;

        // Fetch user's inquiry statistics
        const [
            totalInquiries,
            pendingInquiries,
            resolvedInquiries,
            recentInquiries,
            generalInquiries,
            propertyInquiries,
        ] = await Promise.all([
            // Total inquiries by this user
            Inquiry.countDocuments({ email: userEmail }),
            
            // Pending inquiries
            Inquiry.countDocuments({ email: userEmail, status: 'pending' }),
            
            // Resolved inquiries
            Inquiry.countDocuments({ email: userEmail, status: 'resolved' }),
            
            // Recent inquiries
            Inquiry.find({ email: userEmail })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('propertyId', 'name location propertyId')
                .lean(),
            
            // General inquiries (no property)
            Inquiry.countDocuments({ email: userEmail, propertyId: null }),
            
            // Property-specific inquiries
            Inquiry.countDocuments({ email: userEmail, propertyId: { $ne: null } }),
        ]);

        return NextResponse.json({
            inquiries: {
                total: totalInquiries,
                pending: pendingInquiries,
                resolved: resolvedInquiries,
                general: generalInquiries,
                propertySpecific: propertyInquiries,
                recent: recentInquiries,
            },
            user: {
                name: session.user.name,
                email: session.user.email,
            },
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user statistics' },
            { status: 500 }
        );
    }
}










