import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User, { UserRole } from '@/lib/models/User';

/**
 * GET /api/seed
 * Seeds the initial admin user
 * Only works in development or if no admin exists
 */
export async function GET() {
    try {
        await dbConnect();

        // Check if any admin exists
        const existingAdmin = await User.findOne({ role: UserRole.ADMIN });

        if (existingAdmin) {
            return NextResponse.json(
                { 
                    message: 'Admin user already exists',
                    admin: {
                        email: existingAdmin.email,
                        name: existingAdmin.name,
                    }
                },
                { status: 200 }
            );
        }

        // Create admin user
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@egharbari.com.np';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

        const admin = await User.create({
            name: 'Admin User',
            email: adminEmail,
            password: adminPassword,
            role: UserRole.ADMIN,
            isActive: true,
        });

        return NextResponse.json(
            {
                message: 'Admin user created successfully',
                admin: {
                    email: admin.email,
                    name: admin.name,
                },
                note: 'Please change the default password immediately!',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json(
            { error: 'Failed to seed admin user' },
            { status: 500 }
        );
    }
}







