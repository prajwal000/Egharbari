'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserRole } from '@/lib/types/user';
import Link from 'next/link';

interface UserStats {
    inquiries: {
        total: number;
        pending: number;
        resolved: number;
        general: number;
        propertySpecific: number;
        recent: any[];
    };
    user: {
        name: string;
        email: string;
    };
}

export default function UserDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);

    // Redirect admins to admin panel
    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role === UserRole.ADMIN) {
            router.push('/admin');
        }
    }, [status, session, router]);

    // Fetch user statistics
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/user/stats');
                const data = await response.json();
                if (response.ok) {
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch user stats:', error);
            } finally {
                setLoading(false);
            }
        };
        
        if (status === 'authenticated' && session?.user?.role !== UserRole.ADMIN) {
            fetchStats();
        }
    }, [status, session]);

    if (status === 'loading' || loading) {
        return (
            <div className='flex items-center justify-center h-64'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#9ac842]'></div>
            </div>
        );
    }

    if (!session || session.user.role === UserRole.ADMIN || !stats) {
        return null;
    }

    return (
        <div className='space-y-8'>
            {/* User Welcome */}
            <div className='bg-gradient-to-r from-[#9ac842] to-[#36c2d9] rounded-2xl p-8 text-white'>
                <div className='flex items-center gap-3 mb-2'>
                    <span className='text-3xl'>👤</span>
                    <h1 className='text-3xl font-bold'>Welcome Back!</h1>
                </div>
                <p className='text-white/90'>
                    Hello, {stats.user.name}. Manage your inquiries and explore properties here.
                </p>
            </div>

            {/* Stats Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                <Link
                    href='/dashboard/inquiries'
                    className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all transform hover:-translate-y-1'
                >
                    <div className='flex items-center justify-between mb-4'>
                        <span className='text-3xl'>📩</span>
                    </div>
                    <p className='text-3xl font-bold text-gray-900 mb-1'>{stats.inquiries.total}</p>
                    <p className='text-gray-600 text-sm'>Total Inquiries</p>
                </Link>

                <Link
                    href='/dashboard/inquiries?status=pending'
                    className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all transform hover:-translate-y-1'
                >
                    <div className='flex items-center justify-between mb-4'>
                        <span className='text-3xl'>⏳</span>
                    </div>
                    <p className='text-3xl font-bold text-gray-900 mb-1'>{stats.inquiries.pending}</p>
                    <p className='text-gray-600 text-sm'>Pending Responses</p>
                </Link>

                <Link
                    href='/dashboard/inquiries?status=resolved'
                    className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all transform hover:-translate-y-1'
                >
                    <div className='flex items-center justify-between mb-4'>
                        <span className='text-3xl'>✅</span>
                    </div>
                    <p className='text-3xl font-bold text-gray-900 mb-1'>{stats.inquiries.resolved}</p>
                    <p className='text-gray-600 text-sm'>Resolved Inquiries</p>
                </Link>
            </div>

            {/* Inquiry Breakdown */}
            <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                <h2 className='text-xl font-bold text-gray-900 mb-6'>Inquiry Breakdown</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='flex items-center justify-between p-4 rounded-xl bg-blue-50'>
                        <div>
                            <p className='text-sm text-gray-600'>General Inquiries</p>
                            <p className='text-2xl font-bold text-blue-600'>{stats.inquiries.general}</p>
                        </div>
                        <span className='text-3xl'>💬</span>
                    </div>
                    <div className='flex items-center justify-between p-4 rounded-xl bg-purple-50'>
                        <div>
                            <p className='text-sm text-gray-600'>Property Inquiries</p>
                            <p className='text-2xl font-bold text-purple-600'>{stats.inquiries.propertySpecific}</p>
                        </div>
                        <span className='text-3xl'>🏠</span>
                    </div>
                </div>
            </div>

            {/* Recent Inquiries */}
            <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-xl font-bold text-gray-900'>Recent Inquiries</h2>
                    <Link
                        href='/dashboard/inquiries'
                        className='text-[#9ac842] hover:text-[#36c2d9] font-semibold text-sm transition-colors'
                    >
                        View All →
                    </Link>
                </div>
                <div className='space-y-4'>
                    {stats.inquiries.recent.length > 0 ? (
                        stats.inquiries.recent.map((inquiry: any) => (
                            <div
                                key={inquiry._id}
                                className='flex items-start justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors'
                            >
                                <div className='flex-1'>
                                    <p className='font-semibold text-gray-900'>{inquiry.subject}</p>
                                    {inquiry.propertyId ? (
                                        <p className='text-xs text-gray-500 mt-1'>
                                            Property: {inquiry.propertyId.name} • {inquiry.propertyId.location?.district}
                                        </p>
                                    ) : (
                                        <p className='text-xs text-gray-500 mt-1'>General Inquiry</p>
                                    )}
                                    <p className='text-xs text-gray-400 mt-1'>
                                        {new Date(inquiry.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ml-4 ${
                                        inquiry.status === 'resolved'
                                            ? 'bg-green-100 text-green-700'
                                            : inquiry.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : inquiry.status === 'in_progress'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {inquiry.status}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className='text-center text-gray-500 py-8'>No inquiries yet. Start exploring properties!</p>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                <h2 className='text-xl font-bold text-gray-900 mb-6'>Quick Actions</h2>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                    <Link
                        href='/properties'
                        className='p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors text-center'
                    >
                        <span className='text-3xl block mb-2'>🔍</span>
                        <p className='font-semibold text-green-900'>Browse Properties</p>
                    </Link>
                    <Link
                        href='/dashboard/inquiries'
                        className='p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors text-center'
                    >
                        <span className='text-3xl block mb-2'>📩</span>
                        <p className='font-semibold text-orange-900'>My Inquiries</p>
                    </Link>
                    <Link
                        href='/contact'
                        className='p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-center'
                    >
                        <span className='text-3xl block mb-2'>💬</span>
                        <p className='font-semibold text-blue-900'>Contact Support</p>
                    </Link>
                </div>
            </div>

            {/* Getting Started */}
            <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100'>
                <h2 className='text-xl font-bold text-gray-900 mb-4'>Getting Started</h2>
                <div className='space-y-3'>
                    <div className='flex items-start gap-3'>
                        <span className='text-2xl'>✅</span>
                        <div>
                            <h3 className='font-semibold text-gray-900'>Complete Your Profile</h3>
                            <p className='text-sm text-gray-600'>Add more details to your profile to get better matches</p>
                        </div>
                    </div>
                    <div className='flex items-start gap-3'>
                        <span className='text-2xl'>🔍</span>
                        <div>
                            <h3 className='font-semibold text-gray-900'>Browse Properties</h3>
                            <p className='text-sm text-gray-600'>Explore thousands of properties available in Nepal</p>
                        </div>
                    </div>
                    <div className='flex items-start gap-3'>
                        <span className='text-2xl'>💬</span>
                        <div>
                            <h3 className='font-semibold text-gray-900'>Contact Sellers</h3>
                            <p className='text-sm text-gray-600'>Send inquiries directly to property owners</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

