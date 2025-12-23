'use client';

import { signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface HeaderProps {
    onMenuClick: () => void;
    user: {
        name?: string | null;
        email?: string | null;
        role: string;
    };
}

export default function DashboardHeader({ onMenuClick, user }: HeaderProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    return (
        <header className='h-14 sm:h-16 bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30'>
            <div className='h-full px-3 sm:px-4 lg:px-8 flex items-center justify-between gap-2 sm:gap-4'>
                {/* Mobile menu button */}
                <button
                    onClick={onMenuClick}
                    className='lg:hidden p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors flex-shrink-0'
                    aria-label='Open menu'
                >
                    <svg className='w-6 h-6 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                    </svg>
                </button>

                {/* Search - Hidden on mobile, shown on tablet+ */}
                <div className='hidden md:flex flex-1 max-w-md'>
                    <div className='relative w-full'>
                        <input
                            type='text'
                            placeholder='Search...'
                            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none transition-all text-sm'
                        />
                        <svg
                            className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                        >
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                        </svg>
                    </div>
                </div>

                {/* Mobile search button */}
                <button className='md:hidden p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors'>
                    <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                    </svg>
                </button>

                {/* Spacer for mobile */}
                <div className='flex-1 md:hidden' />

                {/* Right section */}
                <div className='flex items-center gap-1 sm:gap-3'>
                    {/* Notifications */}
                    <button className='relative p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors'>
                        <svg className='w-5 sm:w-6 h-5 sm:h-6 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
                        </svg>
                        <span className='absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full'></span>
                    </button>

                    {/* User dropdown */}
                    <div className='relative' ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className='flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors'
                        >
                            <div className='w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-[#9ac842] to-[#36c2d9] rounded-full flex items-center justify-center text-white font-bold text-sm'>
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className='hidden sm:block text-left'>
                                <p className='text-sm font-semibold text-gray-900 truncate max-w-[100px] lg:max-w-[120px]'>
                                    {user.name || 'User'}
                                </p>
                                <p className='text-xs text-gray-500 capitalize'>{user.role}</p>
                            </div>
                            <svg className='hidden sm:block w-4 h-4 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                            </svg>
                        </button>

                        {/* Dropdown menu */}
                        {dropdownOpen && (
                            <div className='absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50'>
                                <div className='px-4 py-3 border-b border-gray-100'>
                                    <p className='text-sm font-semibold text-gray-900'>{user.name}</p>
                                    <p className='text-xs text-gray-500 truncate'>{user.email}</p>
                                    <p className='text-xs text-gray-400 capitalize mt-1'>{user.role}</p>
                                </div>
                                <div className='py-2'>
                                    <Link
                                        href='/dashboard/profile'
                                        className='flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors'
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                                        </svg>
                                        My Profile
                                    </Link>
                                    <Link
                                        href='/'
                                        className='flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors'
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                                        </svg>
                                        Back to Website
                                    </Link>
                                </div>
                                <div className='border-t border-gray-100 pt-2'>
                                    <button
                                        onClick={handleSignOut}
                                        className='flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors'
                                    >
                                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                                        </svg>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
