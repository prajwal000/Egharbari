import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Inquiry from '@/lib/models/Inquiry';
import Property from '@/lib/models/Property';
import { authOptions } from '@/lib/auth';
import { validateEmail, checkRateLimit, verifyHumanSubmission } from '@/lib/utils/emailValidation';

/**
 * GET /api/inquiries
 * Get inquiries - Admin gets all, users get their own
 */
export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');
        const type = searchParams.get('type');

        const skip = (page - 1) * limit;

        // Build query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        // If not admin, only show user's own inquiries (by email)
        if (!session || session.user.role !== 'admin') {
            if (session?.user?.email) {
                query.email = session.user.email;
            } else {
                return NextResponse.json(
                    { error: 'Please login to view your inquiries' },
                    { status: 401 }
                );
            }
        }

        if (status) query.status = status;
        if (type) query.type = type;

        const [inquiries, total] = await Promise.all([
            Inquiry.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Inquiry.countDocuments(query),
        ]);

        // Fetch property details for property inquiries
        const propertyIds = [...new Set(inquiries.map(i => i.propertyId).filter(Boolean))];
        let propertyMap = new Map();
        
        if (propertyIds.length > 0) {
            const properties = await Property.find({ _id: { $in: propertyIds } })
                .select('propertyId name location.district images')
                .lean();
            propertyMap = new Map(properties.map(p => [p._id.toString(), p]));
        }

        // Attach property info to inquiries
        const inquiriesWithProperty = inquiries.map(inquiry => ({
            ...inquiry,
            property: inquiry.propertyId ? propertyMap.get(inquiry.propertyId.toString()) : null,
        }));

        return NextResponse.json({
            inquiries: inquiriesWithProperty,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get inquiries error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch inquiries' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/inquiries
 * Create a new inquiry (contact form submission)
 */
export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const body = await request.json();

        const { name, email, phone, subject, message, type, propertyId, startTime, verificationToken } = body;

        // Basic validation
        if (!name || !email || !phone || !subject || !message) {
            return NextResponse.json(
                { error: 'Name, email, phone, subject, and message are required' },
                { status: 400 }
            );
        }

        // Email validation (format and disposable email check)
        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            return NextResponse.json(
                { error: emailValidation.message },
                { status: 400 }
            );
        }

        // Human verification (check form fill time)
        if (startTime) {
            const humanVerification = verifyHumanSubmission({
                startTime: parseInt(startTime),
                endTime: Date.now(),
            });

            if (!humanVerification.verified) {
                return NextResponse.json(
                    { error: humanVerification.message },
                    { status: 400 }
                );
            }
        }

        // Rate limiting - max 3 submissions per hour per email
        const rateLimitCheck = checkRateLimit(email.toLowerCase(), 3, 3600000);
        if (!rateLimitCheck.allowed) {
            return NextResponse.json(
                { error: rateLimitCheck.message },
                { status: 429 }
            );
        }

        // Additional rate limiting by IP (if available)
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        if (ip !== 'unknown') {
            const ipRateLimitCheck = checkRateLimit(ip, 5, 3600000);
            if (!ipRateLimitCheck.allowed) {
                return NextResponse.json(
                    { error: 'Too many requests from this location. Please try again later.' },
                    { status: 429 }
                );
            }
        }

        // Create inquiry
        const inquiry = await Inquiry.create({
            name,
            email: email.toLowerCase(),
            phone,
            subject,
            message,
            type: type || 'general',
            propertyId: propertyId || null,
            userId: session?.user?.id || null,
        });

        return NextResponse.json(
            {
                message: 'Inquiry submitted successfully! We will get back to you soon via email.',
                inquiry: {
                    _id: inquiry._id,
                    subject: inquiry.subject,
                    status: inquiry.status,
                    createdAt: inquiry.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create inquiry error:', error);
        
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json(
                { error: errors.join(', ') },
                { status: 400 }
            );
        }
        
        return NextResponse.json(
            { error: 'Failed to submit inquiry. Please try again.' },
            { status: 500 }
        );
    }
}

