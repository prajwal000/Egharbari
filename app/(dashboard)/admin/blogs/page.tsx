'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { BlogData, BLOG_CATEGORIES } from '@/lib/types/blog';

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<BlogData[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ category: '', search: '' });
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchBlogs = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            params.set('page', pagination.page.toString());
            params.set('limit', '10');
            if (filter.category) params.set('category', filter.category);
            if (filter.search) params.set('search', filter.search);

            const response = await fetch(`/api/blogs?${params}`);
            const data = await response.json();

            if (response.ok) {
                setBlogs(data.blogs);
                setPagination(prev => ({ ...prev, ...data.pagination }));
            }
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, filter]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const handleDelete = async (slug: string) => {
        if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
            return;
        }

        setDeleting(slug);
        try {
            const response = await fetch(`/api/blogs/${slug}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchBlogs();
            } else {
                alert('Failed to delete blog');
            }
        } catch (error) {
            console.error('Failed to delete blog:', error);
            alert('Failed to delete blog');
        } finally {
            setDeleting(null);
        }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center h-64'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#9ac842]'></div>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>Blog Management</h1>
                    <p className='text-gray-600'>Create and manage blog posts</p>
                </div>
                <Link
                    href='/admin/blogs/create'
                    className='px-6 py-3 bg-gradient-to-r from-[#9ac842] to-[#36c2d9] text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all'
                >
                    + Create Blog
                </Link>
            </div>

            {/* Filters */}
            <div className='bg-white rounded-xl shadow-sm p-4'>
                <div className='flex flex-col sm:flex-row gap-4'>
                    <div className='flex-1'>
                        <input
                            type='text'
                            placeholder='Search blogs...'
                            value={filter.search}
                            onChange={(e) => {
                                setFilter(prev => ({ ...prev, search: e.target.value }));
                                setPagination(prev => ({ ...prev, page: 1 }));
                            }}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none'
                        />
                    </div>
                    <select
                        value={filter.category}
                        onChange={(e) => {
                            setFilter(prev => ({ ...prev, category: e.target.value }));
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none'
                    >
                        <option value=''>All Categories</option>
                        {BLOG_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Blogs List */}
            <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50 border-b border-gray-200'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Title
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Category
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Status
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Views
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Date
                                </th>
                                <th className='px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-200'>
                            {blogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className='px-6 py-12 text-center text-gray-500'>
                                        No blogs found. Create your first blog!
                                    </td>
                                </tr>
                            ) : (
                                blogs.map((blog) => (
                                    <tr key={blog._id} className='hover:bg-gray-50'>
                                        <td className='px-6 py-4'>
                                            <div>
                                                <p className='font-semibold text-gray-900'>{blog.title}</p>
                                                <p className='text-xs text-gray-500 mt-1 line-clamp-1'>{blog.excerpt}</p>
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <span className='px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700'>
                                                {blog.category}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    blog.isPublished
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                            >
                                                {blog.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 text-sm text-gray-600'>
                                            {blog.views}
                                        </td>
                                        <td className='px-6 py-4 text-sm text-gray-600'>
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center justify-end gap-2'>
                                                <Link
                                                    href={`/blogs/${blog.slug}`}
                                                    target='_blank'
                                                    className='p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'
                                                    title='View'
                                                >
                                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                                                    </svg>
                                                </Link>
                                                <Link
                                                    href={`/admin/blogs/${blog.slug}/edit`}
                                                    className='p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors'
                                                    title='Edit'
                                                >
                                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(blog.slug)}
                                                    disabled={deleting === blog.slug}
                                                    className='p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50'
                                                    title='Delete'
                                                >
                                                    {deleting === blog.slug ? (
                                                        <svg className='w-5 h-5 animate-spin' fill='none' viewBox='0 0 24 24'>
                                                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                                        </svg>
                                                    ) : (
                                                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className='px-6 py-4 border-t border-gray-200 flex items-center justify-between'>
                        <div className='text-sm text-gray-600'>
                            Showing {((pagination.page - 1) * 10) + 1} to {Math.min(pagination.page * 10, pagination.total)} of {pagination.total} blogs
                        </div>
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1}
                                className='px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors'
                            >
                                Previous
                            </button>
                            <span className='text-sm text-gray-600'>
                                Page {pagination.page} of {pagination.pages}
                            </span>
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page === pagination.pages}
                                className='px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors'
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}








