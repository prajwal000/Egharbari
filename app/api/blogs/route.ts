import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Blog from '@/lib/models/Blog';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/blogs
 * Get all blogs (public can see published, admin can see all)
 */
export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(request.url);
        
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        
        const skip = (page - 1) * limit;

        // Build query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        // Non-admin users can only see published blogs
        if (!session || session.user.role !== 'admin') {
            query.isPublished = true;
        }

        if (category) query.category = category;

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
            ];
        }

        const [blogs, total] = await Promise.all([
            Blog.find(query)
                .populate('author', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Blog.countDocuments(query),
        ]);

        return NextResponse.json({
            blogs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get blogs error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blogs' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/blogs
 * Create a new blog (admin only)
 */
export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        // Only admin can create blogs
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { title, excerpt, content, featuredImage, category, tags, isPublished } = body;

        const blog = await Blog.create({
            title,
            excerpt,
            content,
            featuredImage,
            author: session.user.id,
            category,
            tags: tags || [],
            isPublished: isPublished || false,
        });

        return NextResponse.json(
            {
                message: 'Blog created successfully',
                blog,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create blog error:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return NextResponse.json(
                { error: errors.join(', ') },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create blog' },
            { status: 500 }
        );
    }
}


