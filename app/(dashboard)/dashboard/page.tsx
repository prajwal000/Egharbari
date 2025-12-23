'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function UserDashboard() {
    const { data: session } = useSession();

    const stats = [
        { label: 'Saved Properties', value: '12', icon: '❤️', color: 'from-pink-500 to-rose-500' },
        { label: 'Active Inquiries', value: '3', icon: '📨', color: 'from-blue-500 to-cyan-500' },
        { label: 'Property Views', value: '156', icon: '👁️', color: 'from-purple-500 to-indigo-500' },
        { label: 'Messages', value: '5', icon: '💬', color: 'from-green-500 to-emerald-500' },
    ];

    const recentProperties = [
        { id: 1, title: 'Luxury Villa in Kathmandu', price: 'NPR 2.5 Crore', status: 'Available' },
        { id: 2, title: 'Modern Apartment in Pokhara', price: 'NPR 85 Lakh', status: 'Available' },
        { id: 3, title: 'Commercial Space in Lalitpur', price: 'NPR 1.8 Crore', status: 'Sold' },
    ];

    return (
        <div className='space-y-8'>
            {/* Welcome Section */}
            <div className='bg-gradient-to-r from-[#9ac842] to-[#36c2d9] rounded-2xl p-8 text-white'>
                <h1 className='text-3xl font-bold mb-2'>
                    Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}! 👋
                </h1>
                <p className='text-white/90'>
                    Discover your dream property today. We have new listings waiting for you.
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
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} opacity-20`}></div>
                        </div>
                        <p className='text-3xl font-bold text-gray-900 mb-1'>{stat.value}</p>
                        <p className='text-gray-600 text-sm'>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                <h2 className='text-xl font-bold text-gray-900 mb-6'>Quick Actions</h2>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    <Link
                        href='/properties'
                        className='flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors'
                    >
                        <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-[#9ac842] to-[#36c2d9] flex items-center justify-center text-white text-xl'>
                            🔍
                        </div>
                        <div>
                            <p className='font-semibold text-gray-900'>Browse Properties</p>
                            <p className='text-sm text-gray-500'>Find your dream home</p>
                        </div>
                    </Link>
                    <Link
                        href='/dashboard/saved'
                        className='flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors'
                    >
                        <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-xl'>
                            ❤️
                        </div>
                        <div>
                            <p className='font-semibold text-gray-900'>Saved Properties</p>
                            <p className='text-sm text-gray-500'>View your favorites</p>
                        </div>
                    </Link>
                    <Link
                        href='/contact'
                        className='flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors'
                    >
                        <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl'>
                            📞
                        </div>
                        <div>
                            <p className='font-semibold text-gray-900'>Contact Agent</p>
                            <p className='text-sm text-gray-500'>Get expert help</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-xl font-bold text-gray-900'>Recently Viewed</h2>
                    <Link
                        href='/dashboard/properties'
                        className='text-[#9ac842] hover:text-[#36c2d9] font-semibold text-sm transition-colors'
                    >
                        View All →
                    </Link>
                </div>
                <div className='space-y-4'>
                    {recentProperties.map((property) => (
                        <div
                            key={property.id}
                            className='flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors'
                        >
                            <div className='flex items-center gap-4'>
                                <div className='w-16 h-16 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300'></div>
                                <div>
                                    <p className='font-semibold text-gray-900'>{property.title}</p>
                                    <p className='text-sm text-gray-500'>{property.price}</p>
                                </div>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    property.status === 'Available'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                }`}
                            >
                                {property.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

