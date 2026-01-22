import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Blog from '@/lib/models/Blog';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/blogs/[slug]
 * Get a single blog by slug
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { slug } = await params;

        const blog = await Blog.findOne({ slug })
            .populate('author', 'name email')
            .lean();

        if (!blog) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        // Non-admin users can only see published blogs
        if (!blog.isPublished && (!session || session.user.role !== 'admin')) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        // Increment views
        await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

        return NextResponse.json({ blog });
    } catch (error) {
        console.error('Get blog error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blog' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/blogs/[slug]
 * Update a blog (admin only)
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { slug } = await params;

        // Only admin can update blogs
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { title, excerpt, content, featuredImage, category, tags, isPublished } = body;

        const blog = await Blog.findOne({ slug });
        
        if (!blog) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        // Update fields
        if (title) blog.title = title;
        if (excerpt) blog.excerpt = excerpt;
        if (content) blog.content = content;
        if (featuredImage !== undefined) blog.featuredImage = featuredImage;
        if (category) blog.category = category;
        if (tags !== undefined) blog.tags = tags;
        if (isPublished !== undefined) blog.isPublished = isPublished;

        await blog.save();

        return NextResponse.json({
            message: 'Blog updated successfully',
            blog,
        });
    } catch (error: any) {
        console.error('Update blog error:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return NextResponse.json(
                { error: errors.join(', ') },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update blog' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/blogs/[slug]
 * Delete a blog (admin only)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        const { slug } = await params;

        // Only admin can delete blogs
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        const blog = await Blog.findOneAndDelete({ slug });

        if (!blog) {
            return NextResponse.json(
                { error: 'Blog not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Blog deleted successfully',
        });
    } catch (error) {
        console.error('Delete blog error:', error);
        return NextResponse.json(
            { error: 'Failed to delete blog' },
            { status: 500 }
        );
    }
}











