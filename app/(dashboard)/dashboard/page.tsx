'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserRole } from '@/lib/types/user';
import Link from 'next/link';

export default function UserDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    // Redirect admins to admin panel
    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role === UserRole.ADMIN) {
            router.push('/admin');
        }
    }, [status, session, router]);

    useEffect(() => {
        if (status === 'authenticated') {
            setLoading(false);
        }
    }, [status]);

    if (status === 'loading' || loading) {
        return (
            <div className='flex items-center justify-center h-64'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#9ac842]'></div>
            </div>
        );
    }

    if (!session || session.user.role === UserRole.ADMIN) {
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
                    Hello, {session?.user?.name}. Manage your properties and inquiries here.
                </p>
            </div>

            {/* Stats Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center justify-between mb-4'>
                        <span className='text-3xl'>🏠</span>
                    </div>
                    <p className='text-3xl font-bold text-gray-900 mb-1'>0</p>
                    <p className='text-gray-600 text-sm'>My Properties</p>
                </div>

                <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center justify-between mb-4'>
                        <span className='text-3xl'>📩</span>
                    </div>
                    <p className='text-3xl font-bold text-gray-900 mb-1'>0</p>
                    <p className='text-gray-600 text-sm'>My Inquiries</p>
                </div>

                <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center justify-between mb-4'>
                        <span className='text-3xl'>❤️</span>
                    </div>
                    <p className='text-3xl font-bold text-gray-900 mb-1'>0</p>
                    <p className='text-gray-600 text-sm'>Saved Properties</p>
                </div>

                <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow'>
                    <div className='flex items-center justify-between mb-4'>
                        <span className='text-3xl'>👁️</span>
                    </div>
                    <p className='text-3xl font-bold text-gray-900 mb-1'>0</p>
                    <p className='text-gray-600 text-sm'>Property Views</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'>
                <h2 className='text-xl font-bold text-gray-900 mb-6'>Quick Actions</h2>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                    <Link
                        href='/properties'
                        className='p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors text-center'
                    >
                        <span className='text-3xl block mb-2'>🔍</span>
                        <p className='font-semibold text-green-900'>Browse Properties</p>
                    </Link>
                    <Link
                        href='/dashboard/properties'
                        className='p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-center'
                    >
                        <span className='text-3xl block mb-2'>🏠</span>
                        <p className='font-semibold text-blue-900'>My Properties</p>
                    </Link>
                    <Link
                        href='/dashboard/inquiries'
                        className='p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors text-center'
                    >
                        <span className='text-3xl block mb-2'>📩</span>
                        <p className='font-semibold text-orange-900'>My Inquiries</p>
                    </Link>
                    <Link
                        href='/dashboard/saved'
                        className='p-4 rounded-xl bg-red-50 hover:bg-red-100 transition-colors text-center'
                    >
                        <span className='text-3xl block mb-2'>❤️</span>
                        <p className='font-semibold text-red-900'>Saved</p>
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

