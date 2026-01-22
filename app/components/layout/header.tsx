'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Logo from '../UI/Logo';

const Header = () => {
    const { data: session, status } = useSession();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    const isAuthenticated = status === 'authenticated';

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Close mobile menu when scrolling
            if (isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }

            // Update scrolled state for background change
            setIsScrolled(currentScrollY > 50);

            // Hide/show header based on scroll direction
            if (currentScrollY > 100) {
                // Only hide/show when scrolled past 100px
                if (currentScrollY > lastScrollY) {
                    // Scrolling down - hide header
                    setIsVisible(false);
                } else if (currentScrollY < lastScrollY) {
                    // Scrolling up - show header
                    setIsVisible(true);
                }
            } else {
                // Always show header when near top
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, isMobileMenuOpen]);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Properties', href: '/properties' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' }
    ];

    return (
        <header
            className={`w-full z-50 transition-all duration-300 ${isHomePage
                ? `fixed top-0 left-0 ${isScrolled
                    ? 'bg-white shadow-lg'
                    : 'bg-transparent'
                }`
                : 'fixed top-0 left-0 bg-white shadow-md'
                } ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
        >
            <div className='max-w-7xl mx-auto px-7 md:px-8 lg:px-12 '>
                <div className='flex items-center justify-between h-20'>
                    {/* Logo */}
                    <Link href='/' className='flex items-center'>
                        <div className={`transition-colors ${isHomePage && !isScrolled ? 'text-white' : ''
                            }`}>
                            <Logo />
                        </div>
                    </Link>

                    <nav className='hidden md:flex items-center gap-8'>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`font-semibold transition-colors ${isHomePage && !isScrolled
                                    ? 'text-white hover:text-[#9ac842]'
                                    : 'text-gray-700 hover:text-[#9ac842]'
                                    } ${pathname === link.href ? 'text-[#9ac842]' : ''}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Buttons */}
                    <div className='hidden md:flex items-center gap-4'>
                        {isAuthenticated ? (
                            <Link
                                href={session?.user?.role === 'admin' ? '/admin' : '/dashboard'}
                                className='px-6 py-3 bg-gradient-to-r from-[#9ac842] to-[#36c2d9] text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200'
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href='/auth/login'
                                    className={`font-semibold transition-colors ${
                                        isHomePage && !isScrolled
                                            ? 'text-white hover:text-[#9ac842]'
                                            : 'text-gray-700 hover:text-[#9ac842]'
                                    }`}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href='/auth/register'
                                    className='px-6 py-3 bg-gradient-to-r from-[#9ac842] to-[#36c2d9] text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200'
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`md:hidden p-2 rounded-lg transition-colors ${isHomePage && !isScrolled
                            ? 'text-white hover:bg-white/10'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <svg
                            className='w-6 h-6'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                        >
                            {isMobileMenuOpen ? (
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M6 18L18 6M6 6l12 12'
                                />
                            ) : (
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M4 6h16M4 12h16M4 18h16'
                                />
                            )}
                        </svg>
                    </button>
                </div>


                {/* Mobile Menu */}
                <div
                    className={`absolute left-0 right-0 top-full md:hidden bg-white border-t border-gray-200 overflow-hidden transition-all duration-300 ease-in-out shadow-lg ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <nav className='flex flex-col gap-4 py-4 px-4'>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`font-semibold py-2 text-gray-700 hover:text-[#9ac842] transition-colors ${pathname === link.href ? 'text-[#9ac842]' : ''}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {isAuthenticated ? (
                            <Link
                                href={session?.user?.role === 'admin' ? '/admin' : '/dashboard'}
                                className='px-6 py-3 bg-gradient-to-r from-[#9ac842] to-[#36c2d9] text-white font-bold rounded-xl text-center hover:shadow-lg transform hover:scale-105 transition-all duration-200'
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href='/auth/login'
                                    className='font-semibold py-2 text-gray-700 hover:text-[#9ac842] transition-colors'
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href='/auth/register'
                                    className='px-6 py-3 bg-gradient-to-r from-[#9ac842] to-[#36c2d9] text-white font-bold rounded-xl text-center hover:shadow-lg transform hover:scale-105 transition-all duration-200'
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;