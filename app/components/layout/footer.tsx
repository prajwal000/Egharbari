import React from 'react';
import Link from 'next/link';
import Logo from '../UI/Logo';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className='bg-gray-900 text-gray-300'>
            {/* Main Footer Content */}
            <div className='max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
                    {/* Company Info */}
                    <div>
                        <div className='mb-6'>
                            <Logo />
                        </div>
                        <p className='text-gray-400 mb-6 leading-relaxed'>
                            Your trusted partner in finding the perfect property in Nepal. We make your real estate dreams come true.
                        </p>
                        {/* Social Media */}
                        <div className='flex gap-4'>
                            <a href='https://www.facebook.com/gharbarisewa' target='_blank' rel='noopener noreferrer' className='w-10 h-10 bg-gray-800 hover:bg-[#1877F2] rounded-lg flex items-center justify-center transition-colors'>
                                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className='text-white text-lg font-bold mb-6'>Quick Links</h3>
                        <ul className='space-y-3'>
                            <li>
                                <Link href='/' className='hover:text-[#9ac842] transition-colors flex items-center gap-2'>
                                    <span className='text-[#9ac842]'>›</span>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href='/properties' className='hover:text-[#9ac842] transition-colors flex items-center gap-2'>
                                    <span className='text-[#9ac842]'>›</span>
                                    Properties
                                </Link>
                            </li>
                            <li>
                                <Link href='/about' className='hover:text-[#9ac842] transition-colors flex items-center gap-2'>
                                    <span className='text-[#9ac842]'>›</span>
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href='/contact' className='hover:text-[#9ac842] transition-colors flex items-center gap-2'>
                                    <span className='text-[#9ac842]'>›</span>
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className='text-white text-lg font-bold mb-6'>Our Services</h3>
                        <ul className='space-y-3'>
                            <li>
                                <Link href='/buy' className='hover:text-[#36c2d9] transition-colors flex items-center gap-2'>
                                    <span className='text-[#36c2d9]'>›</span>
                                    Buy Property
                                </Link>
                            </li>
                            <li>
                                <Link href='/sell' className='hover:text-[#36c2d9] transition-colors flex items-center gap-2'>
                                    <span className='text-[#36c2d9]'>›</span>
                                    Sell Property
                                </Link>
                            </li>
                            <li>
                                <Link href='/rent' className='hover:text-[#36c2d9] transition-colors flex items-center gap-2'>
                                    <span className='text-[#36c2d9]'>›</span>
                                    Rent Property
                                </Link>
                            </li>
                            <li>
                                <Link href='/valuation' className='hover:text-[#36c2d9] transition-colors flex items-center gap-2'>
                                    <span className='text-[#36c2d9]'>›</span>
                                    Property Valuation
                                </Link>
                            </li>
                            <li>
                                <Link href='/consultation' className='hover:text-[#36c2d9] transition-colors flex items-center gap-2'>
                                    <span className='text-[#36c2d9]'>›</span>
                                    Consultation
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className='text-white text-lg font-bold mb-6'>Contact Us</h3>
                        <ul className='space-y-4'>
                            <li className='flex items-start gap-3'>
                                <svg className='w-5 h-5 text-[#9ac842] shrink-0 mt-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                                </svg>
                                <span className='text-sm'>
                                    Baneshwor, Ward No. 26<br />
                                    Kathmandu, Nepal
                                </span>
                            </li>
                            <li className='flex items-center gap-3'>
                                <svg className='w-5 h-5 text-[#36c2d9] shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                                </svg>
                                <div className='text-sm'>
                                    <div>+977 9863614398</div>
                                    <div>+977 9815084499</div>
                                </div>
                            </li>
                            <li className='flex items-center gap-3'>
                                <svg className='w-5 h-5 text-[#9ac842] shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                </svg>
                                <span className='text-sm'>info@egharbari.com.np</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className='border-t border-gray-800'>
                <div className='max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6'>
                    <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                        <p className='text-sm text-gray-400'>
                            © {currentYear} eGharBari. All rights reserved.
                        </p>
                        <div className='flex gap-6 text-sm'>
                            <Link href='/privacy' className='text-gray-400 hover:text-[#9ac842] transition-colors'>
                                Privacy Policy
                            </Link>
                            <Link href='/terms' className='text-gray-400 hover:text-[#9ac842] transition-colors'>
                                Terms of Service
                            </Link>
                            <Link href='/sitemap' className='text-gray-400 hover:text-[#9ac842] transition-colors'>
                                Sitemap
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
