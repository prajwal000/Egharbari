import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/users/stats
 * Get user statistics (admin only)
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

        const [total, totalAdmins, totalUsers, recentUsers] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'admin' }),
            User.countDocuments({ role: 'user' }),
            User.find()
                .select('-password')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
        ]);

        return NextResponse.json({
            total,
            totalAdmins,
            totalUsers,
            recentUsers,
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user statistics' },
            { status: 500 }
        );
    }
}

