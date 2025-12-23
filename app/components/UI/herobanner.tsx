'use client';
import React, { useState } from 'react';

const Herobanner = () => {
    const [propertyType, setPropertyType] = useState('');
    const [location, setLocation] = useState('');
    const [priceRange, setPriceRange] = useState('');

    const propertyTypes = ['House', 'Apartment', 'Land', 'Commercial', 'Villa'];
    const locations = ['Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur', 'Biratnagar', 'Chitwan', 'Butwal'];
    const priceRanges = [
        'Under NPR 50 Lakh',
        'NPR 50 Lakh - 1 Crore',
        'NPR 1 Crore - 2 Crore',
        'NPR 2 Crore - 5 Crore',
        'Above NPR 5 Crore'
    ];

    return (
        <div className='relative py-28 bg-[url("https://shorturl.at/MVHvl")] bg-cover bg-center bg-no-repeat m-1 rounded-xl overflow-hidden'>
            {/* Gradient Overlay */}
            <div className='absolute inset-0 bg-linear-to-br from-black/70 via-black/50 to-transparent'></div>
            {/* Animated Background Accent */}
            <div className='absolute top-0 right-0 w-[600px] h-[600px] bg-linear-to-br from-[#9ac842]/20 to-[#36c2d9]/20 rounded-full blur-3xl animate-pulse'></div>

            {/* Content Container */}
            <div className='relative h-full flex flex-col justify-center items-center px-6 md:px-12 lg:px-20'>
                {/* Hero Text */}
                <div className='text-center mb-12 space-y-6 animate-fadeIn'>
                    <h1 className='text-5xl md:text-7xl  font-bold text-white '>
                        Find Your Dream
                        <span className='block bg-linear-to-r from-[#9ac842] to-[#36c2d9] bg-clip-text text-transparent mt-2'>
                            Property in Nepal
                        </span>
                    </h1>
                    <p className='text-base md:text-xl text-gray-200 font-light max-w-3xl mx-auto'>
                        Discover the perfect home, land, or commercial space across Nepal's most sought-after locations
                    </p>
                </div>

                {/* Search Card with Glassmorphism */}
                <div className='w-full max-w-5xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 shadow-2xl hover:shadow-[#36c2d9]/20 transition-all duration-500'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                        {/* Property Type Dropdown */}
                        <div className='group'>
                            <label className='block text-sm font-semibold text-white/90 mb-2 group-hover:text-[#9ac842] transition-colors'>
                                Property Type
                            </label>
                            <div className='relative'>
                                <select
                                    value={propertyType}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                    className='w-full px-4 py-4 bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-xl text-gray-800 font-medium appearance-none cursor-pointer focus:outline-none focus:border-[#9ac842] focus:ring-4 focus:ring-[#9ac842]/30 transition-all duration-300 hover:bg-white hover:shadow-lg'
                                >
                                    <option value=''>Select Type</option>
                                    {propertyTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                                    <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Location Dropdown */}
                        <div className='group'>
                            <label className='block text-sm font-semibold text-white/90 mb-2 group-hover:text-[#36c2d9] transition-colors'>
                                Location
                            </label>
                            <div className='relative'>
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className='w-full px-4 py-4 bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-xl text-gray-800 font-medium appearance-none cursor-pointer focus:outline-none focus:border-[#36c2d9] focus:ring-4 focus:ring-[#36c2d9]/30 transition-all duration-300 hover:bg-white hover:shadow-lg'
                                >
                                    <option value=''>Select Location</option>
                                    {locations.map((loc) => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                                <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                                    <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className='group'>
                            <label className='block text-sm font-semibold text-white/90 mb-2 group-hover:text-[#9ac842] transition-colors'>
                                Price Range
                            </label>
                            <div className='relative'>
                                <select
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    className='w-full px-4 py-4 bg-white/95 backdrop-blur-sm border-2 border-white/30 rounded-xl text-gray-800 font-medium appearance-none cursor-pointer focus:outline-none focus:border-[#9ac842] focus:ring-4 focus:ring-[#9ac842]/30 transition-all duration-300 hover:bg-white hover:shadow-lg'
                                >
                                    <option value=''>Select Price</option>
                                    {priceRanges.map((range) => (
                                        <option key={range} value={range}>{range}</option>
                                    ))}
                                </select>
                                <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                                    <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className='flex items-end'>
                            <button className='cursor-pointer w-full px-8 py-4 bg-linear-to-r from-[#9ac842] to-[#36c2d9] text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-[#36c2d9]/50 transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group'>
                                <svg className='w-5 h-5 group-hover:rotate-12 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                </svg>
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className='grid grid-cols-3 gap-6 pt-6 border-t border-white/20'>
                        <div className='text-center group cursor-pointer'>
                            <p className='text-3xl font-bold text-white group-hover:text-[#9ac842] transition-colors'>2,500+</p>
                            <p className='text-sm text-gray-300 font-medium'>Properties</p>
                        </div>
                        <div className='text-center group cursor-pointer'>
                            <p className='text-3xl font-bold text-white group-hover:text-[#36c2d9] transition-colors'>15+</p>
                            <p className='text-sm text-gray-300 font-medium'>Cities</p>
                        </div>
                        <div className='text-center group cursor-pointer'>
                            <p className='text-3xl font-bold text-white group-hover:text-[#9ac842] transition-colors'>1,200+</p>
                            <p className='text-sm text-gray-300 font-medium'>Happy Clients</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce'>
                <svg className='w-6 h-6 text-white/70' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                </svg>
            </div>
        </div>
    );
};

export default Herobanner;