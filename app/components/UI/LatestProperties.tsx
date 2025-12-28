'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PropertyData, ListingType, PROPERTY_TYPE_LABELS } from '@/lib/types/property';

const LatestProperties = () => {
    const [allProperties, setAllProperties] = useState<PropertyData[]>([]);
    const [visibleProperties, setVisibleProperties] = useState(8);
    const [loading, setLoading] = useState(true);

    // Fetch latest properties from API
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch('/api/properties?limit=12&sortBy=date_desc');
                const data = await response.json();
                if (response.ok) {
                    setAllProperties(data.properties);
                }
            } catch (error) {
                console.error('Failed to fetch properties:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    // Format price helper
    const formatPrice = (price: number, listingType: ListingType) => {
        const suffix = listingType === ListingType.RENT ? '/mo' : '';
        if (price >= 10000000) return `Rs. ${(price / 10000000).toFixed(2)} Cr${suffix}`;
        if (price >= 100000) return `Rs. ${(price / 100000).toFixed(2)} Lakh${suffix}`;
        return `Rs. ${price.toLocaleString()}${suffix}`;
    };


    const loadMore = () => {
        setVisibleProperties((prev) => Math.min(prev + 4, allProperties.length));
    };

    const displayedProperties = allProperties.slice(0, visibleProperties);
    const hasMore = visibleProperties < allProperties.length;

    if (loading) {
        return (
            <section className='py-20 px-4 md:px-8 lg:px-12 bg-linear-to-b from-gray-50 to-white'>
                <div className='flex items-center justify-center h-64'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#9ac842]'></div>
                </div>
            </section>
        );
    }

    if (allProperties.length === 0) {
        return (
            <section className='py-20 px-4 md:px-8 lg:px-12 bg-linear-to-b from-gray-50 to-white'>
                <div className='text-center'>
                    <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4'>
                        Latest <span className='bg-linear-to-r from-[#9ac842] to-[#36c2d9] bg-clip-text text-transparent'>Properties</span>
                    </h2>
                    <p className='text-lg text-gray-600'>No properties available at the moment.</p>
                </div>
            </section>
        );
    }

    return (
        <section className='py-20 px-4 md:px-8 lg:px-12 bg-linear-to-b from-gray-50 to-white'>
            {/* Section Header */}
            <div className='text-center mb-16'>
                <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4'>
                    Latest <span className='bg-linear-to-r from-[#9ac842] to-[#36c2d9] bg-clip-text text-transparent'>Properties</span>
                </h2>
                <p className='text-lg md:text-xl text-gray-600 max-w-2xl mx-auto'>
                    Discover our newest listings of premium properties across Nepal
                </p>
                <div className='w-24 h-1 bg-linear-to-r from-[#9ac842] to-[#36c2d9] mx-auto mt-6 rounded-full'></div>
            </div>

            {/* Properties Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto'>
                {displayedProperties.map((property, index) => (
                    <Link
                        key={property._id}
                        href={`/properties/${property.slug}`}
                        className='group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2'
                    >
                        {/* Property Image */}
                        <div className='relative h-64 overflow-hidden'>
                            <img
                                src={property.images[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'}
                                alt={property.name}
                                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                            />
                            {/* Gradient Overlay */}
                            <div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent'></div>

                            {/* Featured Badge */}
                            {property.isFeatured && (
                                <div className='absolute top-4 left-4 bg-[#9ac842] text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg'>
                                    Featured
                                </div>
                            )}

                            {/* Property Type Badge */}
                            <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold'>
                                {PROPERTY_TYPE_LABELS[property.propertyType]}
                            </div>

                            {/* Price Tag */}
                            <div className='absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl'>
                                <p className='text-xl font-bold text-gray-900'>{formatPrice(property.price, property.listingType)}</p>
                            </div>
                        </div>

                        {/* Property Details */}
                        <div className='p-6'>
                            <h3 className='text-xl font-bold text-gray-900 mb-2 group-hover:text-[#9ac842] transition-colors line-clamp-1'>
                                {property.name}
                            </h3>
                            <div className='flex items-center text-gray-600 mb-4'>
                                <svg className='w-4 h-4 mr-2 text-[#36c2d9]' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                                </svg>
                                <span className='text-sm'>{property.location.district}</span>
                            </div>

                            {/* Property Features */}
                            <div className='flex items-center justify-between text-gray-700 mb-4 pb-4 border-b border-gray-200'>
                                {property.bedrooms && property.bedrooms > 0 && (
                                    <div className='flex items-center gap-1'>
                                        <svg className='w-5 h-5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                                        </svg>
                                        <span className='text-sm font-medium'>{property.bedrooms} Bed</span>
                                    </div>
                                )}
                                {property.bathrooms && property.bathrooms > 0 && (
                                    <div className='flex items-center gap-1'>
                                        <svg className='w-5 h-5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' />
                                        </svg>
                                        <span className='text-sm font-medium'>{property.bathrooms} Bath</span>
                                    </div>
                                )}
                                {property.area && (
                                    <div className='flex items-center gap-1'>
                                        <svg className='w-5 h-5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' />
                                        </svg>
                                        <span className='text-sm font-medium'>{property.area} {property.areaUnit}</span>
                                    </div>
                                )}
                            </div>

                            {/* View Details Button */}
                            <div className='w-full py-3 bg-[#9ac842] hover:bg-[#36c2d9] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#36c2d9]/30 transform group-hover:scale-105 transition-all duration-150 text-center'>
                                View Details
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {hasMore && (
                <div className='text-center mt-12'>
                    <button
                        onClick={loadMore}
                        className='px-12 py-4 cursor-pointer bg-[#36c2d9] hover:bg-[#9ac842] text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-[#36c2d9]/50 transform hover:scale-105 active:scale-95 transition-all duration-150 flex items-center gap-3 mx-auto group'
                    >
                        <span>Load More Properties</span>
                        <svg className='w-5 h-5 group-hover:translate-y-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                        </svg>
                    </button>
                    <p className='text-gray-600 mt-4 text-sm'>
                        Showing {visibleProperties} of {allProperties.length} properties
                    </p>
                </div>
            )}

            {!hasMore && (
                <div className='text-center mt-12'>
                    <p className='text-gray-600 text-lg font-medium'>
                        You've viewed all available properties
                    </p>
                </div>
            )}
        </section>
    );
};

export default LatestProperties;
