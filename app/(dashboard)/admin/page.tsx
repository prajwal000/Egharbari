'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserRole } from '@/lib/types/user';
import Link from 'next/link';

interface AdminStats {
    users: {
        total: number;
        admins: number;
        regular: number;
        recent: any[];
    };
    properties: {
        total: number;
        active: number;
        pending: number;
        sold: number;
        recent: any[];
    };
    inquiries: {
        total: number;
        pending: number;
        general: number;
        propertySpecific: number;
    };
}

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    // Redirect non-admins to user dashboard
    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role !== UserRole.ADMIN) {
            router.push('/dashboard');
        }
    }, [status, session, router]);

    // Fetch all admin statistics
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/admin/stats');
                const data = await response.json();
                if (response.ok) {
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
            } finally {
                setLoading(false);
            }
        };
        
        if (status === 'authenticated' && session?.user?.role === UserRole.ADMIN) {
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

    if (!session || session.user.role !== UserRole.ADMIN || !stats) {
        return null;
    }

    const statsCards = [
        { label: 'Total Users', value: stats.users.total.toString(), icon: '👥', color: 'from-blue-500 to-cyan-500', link: '/admin/users' },
        { label: 'Active Listings', value: stats.properties.active.toString(), icon: '🏠', color: 'from-green-500 to-emerald-500', link: '/admin/properties' },
        { label: 'Pending Inquiries', value: stats.inquiries.pending.toString(), icon: '📩', color: 'from-orange-500 to-amber-500', link: '/admin/inquiries' },
        { label: 'Total Properties', value: stats.properties.total.toString(), icon: '🏢', color: 'from-purple-500 to-pink-500', link: '/admin/properties' },
    ];

    const recentUsers = stats.users.recent.slice(0, 3);
    const recentProperties = stats.properties.recent.slice(0, 3);

    return (
        <div className='space-y-8'>
            {/* Admin Welcome */}
            <div className='bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white'>
                <div className='flex items-center gap-3 mb-2'>
                    <span className='text-3xl'>👑</span>
                    <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
                </div>
                <p className='text-white/90'>
                    Welcome back, {session?.user?.name}. Here&apos;s what&apos;s happening with your platform.
                </p>
            </div>

            {/* Stats Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {statsCards.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.link}
                        className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all transform hover:-translate-y-1'
                    >
                        <div className='flex items-center justify-between mb-4'>
                            <span className='text-3xl'>{stat.icon}</span>
                        </div>
                        <p className='text-3xl font-bold text-gray-900 mb-1'>{stat.value}</p>
                        <p className='text-gray-600 text-sm'>{stat.label}</p>
                    </Link>
                ))}
            </div>

            {/* Detailed Stats Overview */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {/* Users Breakdown */}
                <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                    <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                        <span className='text-2xl'>👥</span>
                        User Statistics
                    </h3>
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>Total Users</span>
                            <span className='font-bold text-gray-900'>{stats.users.total}</span>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>Admins</span>
                            <span className='font-bold text-purple-600'>{stats.users.admins}</span>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>Regular Users</span>
                            <span className='font-bold text-blue-600'>{stats.users.regular}</span>
                        </div>
                    </div>
                </div>

                {/* Properties Breakdown */}
                <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                    <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                        <span className='text-2xl'>🏠</span>
                        Property Statistics
                    </h3>
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>Total Properties</span>
                            <span className='font-bold text-gray-900'>{stats.properties.total}</span>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>Active</span>
                            <span className='font-bold text-green-600'>{stats.properties.active}</span>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>Pending</span>
                            <span className='font-bold text-yellow-600'>{stats.properties.pending}</span>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>Sold</span>
                            <span className='font-bold text-blue-600'>{stats.properties.sold}</span>
                        </div>
                    </div>
                </div>

                {/* Inquiries Breakdown */}
                <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                    <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                        <span className='text-2xl'>📩</span>
                        Inquiry Statistics
                    </h3>
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>Total Inquiries</span>
                            <span className='font-bold text-gray-900'>{stats.inquiries.total}</span>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>Pending</span>
                            <span className='font-bold text-orange-600'>{stats.inquiries.pending}</span>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>General</span>
                            <span className='font-bold text-blue-600'>{stats.inquiries.general}</span>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-600'>Property Specific</span>
                            <span className='font-bold text-purple-600'>{stats.inquiries.propertySpecific}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Recent Users */}
                <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                    <div className='flex items-center justify-between mb-6'>
                        <h2 className='text-xl font-bold text-gray-900'>Recent Users</h2>
                        <Link
                            href='/admin/users'
                            className='text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors'
                        >
                            View All →
                        </Link>
                    </div>
                    <div className='space-y-4'>
                        {recentUsers.length > 0 ? (
                            recentUsers.map((user: any) => (
                                <div
                                    key={user._id}
                                    className='flex items-center justify-between p-4 rounded-xl bg-gray-50'
                                >
                                    <div className='flex items-center gap-3'>
                                        <div className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold'>
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className='font-semibold text-gray-900'>{user.name}</p>
                                            <p className='text-xs text-gray-500'>{user.email}</p>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <span
                                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                        <p className='text-xs text-gray-500 mt-1'>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className='text-center text-gray-500 py-8'>No users yet</p>
                        )}
                    </div>
                </div>

                {/* Recent Properties */}
                <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                    <div className='flex items-center justify-between mb-6'>
                        <h2 className='text-xl font-bold text-gray-900'>Recent Properties</h2>
                        <Link
                            href='/admin/properties'
                            className='text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors'
                        >
                            View All →
                        </Link>
                    </div>
                    <div className='space-y-4'>
                        {recentProperties.length > 0 ? (
                            recentProperties.map((property: any) => (
                                <div
                                    key={property._id}
                                    className='flex items-center justify-between p-4 rounded-xl bg-gray-50'
                                >
                                    <div className='flex-1'>
                                        <p className='font-semibold text-gray-900'>{property.name}</p>
                                        <p className='text-xs text-gray-500'>
                                            {property.location?.district} • {property.propertyType}
                                        </p>
                                    </div>
                                    <div className='text-right ml-4'>
                                        <span
                                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                property.status === 'available'
                                                    ? 'bg-green-100 text-green-700'
                                                    : property.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : property.status === 'sold'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {property.status}
                                        </span>
                                        <p className='text-xs text-gray-500 mt-1'>
                                            {new Date(property.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className='text-center text-gray-500 py-8'>No properties yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Admin Actions */}
            <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                <h2 className='text-xl font-bold text-gray-900 mb-6'>Quick Actions</h2>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                    <Link
                        href='/admin/users'
                        className='p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors text-center'
                    >
                        <span className='text-3xl block mb-2'>👥</span>
                        <p className='font-semibold text-purple-900'>Manage Users</p>
                    </Link>
                    <Link
                        href='/admin/properties'
                        className='p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-center'
                    >
                        <span className='text-3xl block mb-2'>🏠</span>
                        <p className='font-semibold text-blue-900'>Properties</p>
                    </Link>
                    <Link
                        href='/admin/inquiries'
                        className='p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors text-center'
                    >
                        <span className='text-3xl block mb-2'>📩</span>
                        <p className='font-semibold text-orange-900'>Inquiries</p>
                    </Link>
                    <Link
                        href='/admin/settings'
                        className='p-4 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-center'
                    >
                        <span className='text-3xl block mb-2'>⚙️</span>
                        <p className='font-semibold text-gray-900'>Settings</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

