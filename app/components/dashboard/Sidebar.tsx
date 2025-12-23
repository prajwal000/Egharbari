'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/lib/types/user';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    userRole: UserRole;
}

const userNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'home' },
    { name: 'My Properties', href: '/dashboard/properties', icon: 'building' },
    { name: 'My Inquiries', href: '/dashboard/inquiries', icon: 'inquiry' },
    { name: 'Saved', href: '/dashboard/saved', icon: 'heart' },
    { name: 'Messages', href: '/dashboard/messages', icon: 'message' },
    { name: 'Profile', href: '/dashboard/profile', icon: 'user' },
];

const adminNavItems = [
    { name: 'Dashboard', href: '/admin', icon: 'home' },
    { name: 'Users', href: '/admin/users', icon: 'users' },
    { name: 'Properties', href: '/admin/properties', icon: 'building' },
    { name: 'Inquiries', href: '/admin/inquiries', icon: 'message' },
    { name: 'Reports', href: '/admin/reports', icon: 'chart' },
    { name: 'Settings', href: '/admin/settings', icon: 'settings' },
];

const icons: Record<string, JSX.Element> = {
    home: (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
        </svg>
    ),
    inquiry: (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
        </svg>
    ),
    building: (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
        </svg>
    ),
    heart: (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
        </svg>
    ),
    message: (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
        </svg>
    ),
    user: (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
        </svg>
    ),
    users: (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />
        </svg>
    ),
    chart: (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
        </svg>
    ),
    settings: (
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
        </svg>
    ),
};

export default function DashboardSidebar({ isOpen, onClose, userRole }: SidebarProps) {
    const pathname = usePathname();
    const isAdmin = userRole === UserRole.ADMIN;
    const navItems = isAdmin ? adminNavItems : userNavItems;

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className='fixed inset-0 bg-black/50 z-40 lg:hidden'
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo */}
                <div className='h-16 flex items-center justify-between px-6 border-b border-gray-200'>
                    <Link href='/' className='flex items-center'>
                        <span className='text-2xl font-bold text-gray-900'>e</span>
                        <span className='text-2xl font-bold bg-gradient-to-r from-[#9ac842] to-[#36c2d9] bg-clip-text text-transparent'>
                            GharBari
                        </span>
                    </Link>
                    <button
                        onClick={onClose}
                        className='lg:hidden p-2 rounded-lg hover:bg-gray-100'
                    >
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                    </button>
                </div>

                {/* Role Badge */}
                <div className='px-6 py-4 border-b border-gray-200'>
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            isAdmin
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-green-100 text-green-700'
                        }`}
                    >
                        {isAdmin ? '👑 Admin Panel' : '👤 User Panel'}
                    </span>
                </div>

                {/* Navigation */}
                <nav className='px-4 py-6 space-y-2'>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    isActive
                                        ? 'bg-gradient-to-r from-[#9ac842] to-[#36c2d9] text-white shadow-lg'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {icons[item.icon]}
                                <span className='font-medium'>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Switch Panel (for admin) */}
                {isAdmin && (
                    <div className='absolute bottom-20 left-0 right-0 px-4'>
                        <Link
                            href='/dashboard'
                            className='flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all'
                        >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' />
                            </svg>
                            <span className='font-medium'>Switch to User View</span>
                        </Link>
                    </div>
                )}
            </aside>
        </>
    );
}

