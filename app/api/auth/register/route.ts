import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User, { UserRole } from '@/lib/models/User';

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const { name, email, password, phone, address } = body;

        // Validation
        if (!name || !email || !password || !phone) {
            return NextResponse.json(
                { error: 'Name, email, phone, and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Create new user (always as USER role for security)
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            phone,
            address: address || undefined,
            role: UserRole.USER,
        });

        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);

        if (error instanceof Error) {
            // Handle mongoose validation errors
            if (error.name === 'ValidationError') {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

