'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/lib/types/user';
import Link from 'next/link';

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Double-check admin access on client side
    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role !== UserRole.ADMIN) {
            router.push('/dashboard');
        }
    }, [status, session, router]);

    if (status === 'loading') {
        return (
            <div className='flex items-center justify-center h-64'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#9ac842]'></div>
            </div>
        );
    }

    if (session?.user?.role !== UserRole.ADMIN) {
        return null;
    }

    const stats = [
        { label: 'Total Users', value: '1,234', change: '+12%', icon: '👥', color: 'from-blue-500 to-cyan-500' },
        { label: 'Active Listings', value: '567', change: '+8%', icon: '🏠', color: 'from-green-500 to-emerald-500' },
        { label: 'Pending Inquiries', value: '23', change: '-5%', icon: '📩', color: 'from-orange-500 to-amber-500' },
        { label: 'Revenue (NPR)', value: '12.5L', change: '+24%', icon: '💰', color: 'from-purple-500 to-pink-500' },
    ];

    const recentUsers = [
        { id: 1, name: 'Rajesh Sharma', email: 'rajesh@example.com', role: 'user', date: '2 hours ago' },
        { id: 2, name: 'Sita Thapa', email: 'sita@example.com', role: 'user', date: '5 hours ago' },
        { id: 3, name: 'Bikram Rai', email: 'bikram@example.com', role: 'admin', date: '1 day ago' },
    ];

    const recentProperties = [
        { id: 1, title: 'Luxury Villa in Kathmandu', owner: 'Rajesh S.', status: 'pending', date: '1 hour ago' },
        { id: 2, title: 'Modern Apartment in Pokhara', owner: 'Sita T.', status: 'approved', date: '3 hours ago' },
        { id: 3, title: 'Commercial Space in Lalitpur', owner: 'Bikram R.', status: 'rejected', date: '1 day ago' },
    ];

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
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow'
                    >
                        <div className='flex items-center justify-between mb-4'>
                            <span className='text-3xl'>{stat.icon}</span>
                            <span
                                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                    stat.change.startsWith('+')
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                }`}
                            >
                                {stat.change}
                            </span>
                        </div>
                        <p className='text-3xl font-bold text-gray-900 mb-1'>{stat.value}</p>
                        <p className='text-gray-600 text-sm'>{stat.label}</p>
                    </div>
                ))}
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
                        {recentUsers.map((user) => (
                            <div
                                key={user.id}
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
                                    <p className='text-xs text-gray-500 mt-1'>{user.date}</p>
                                </div>
                            </div>
                        ))}
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
                        {recentProperties.map((property) => (
                            <div
                                key={property.id}
                                className='flex items-center justify-between p-4 rounded-xl bg-gray-50'
                            >
                                <div>
                                    <p className='font-semibold text-gray-900'>{property.title}</p>
                                    <p className='text-xs text-gray-500'>by {property.owner}</p>
                                </div>
                                <div className='text-right'>
                                    <span
                                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                            property.status === 'approved'
                                                ? 'bg-green-100 text-green-700'
                                                : property.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {property.status}
                                    </span>
                                    <p className='text-xs text-gray-500 mt-1'>{property.date}</p>
                                </div>
                            </div>
                        ))}
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

