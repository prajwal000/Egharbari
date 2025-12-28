import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Property from '@/lib/models/Property';
import Inquiry from '@/lib/models/Inquiry';
import User from '@/lib/models/User';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/admin/stats
 * Get comprehensive admin dashboard statistics
 */
export async function GET() {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        // Only admin can view stats
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        // Fetch all statistics in parallel
        const [
            // User stats
            totalUsers,
            totalAdmins,
            totalRegularUsers,
            recentUsers,

            // Property stats
            totalProperties,
            activeProperties,
            pendingProperties,
            soldProperties,
            recentProperties,

            // Inquiry stats
            totalInquiries,
            pendingInquiries,
            generalInquiries,
            propertySpecificInquiries,
        ] = await Promise.all([
            // Users
            User.countDocuments(),
            User.countDocuments({ role: 'admin' }),
            User.countDocuments({ role: 'user' }),
            User.find()
                .select('-password')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            // Properties
            Property.countDocuments(),
            Property.countDocuments({ isActive: true }),
            Property.countDocuments({ status: 'pending' }),
            Property.countDocuments({ status: 'sold' }),
            Property.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            // Inquiries
            Inquiry.countDocuments(),
            Inquiry.countDocuments({ status: 'pending' }),
            Inquiry.countDocuments({ propertyId: null }), // General inquiries (no property)
            Inquiry.countDocuments({ propertyId: { $ne: null } }), // Property-specific inquiries
        ]);

        return NextResponse.json({
            users: {
                total: totalUsers,
                admins: totalAdmins,
                regular: totalRegularUsers,
                recent: recentUsers,
            },
            properties: {
                total: totalProperties,
                active: activeProperties,
                pending: pendingProperties,
                sold: soldProperties,
                recent: recentProperties,
            },
            inquiries: {
                total: totalInquiries,
                pending: pendingInquiries,
                general: generalInquiries,
                propertySpecific: propertySpecificInquiries,
            },
        });
    } catch (error) {
        console.error('Get admin stats error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch admin statistics' },
            { status: 500 }
        );
    }
}

