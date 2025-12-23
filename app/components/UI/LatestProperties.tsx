'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Property {
    id: number;
    title: string;
    location: string;
    price: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    area: string;
    image: string;
    featured?: boolean;
}

const LatestProperties = () => {
    const [visibleProperties, setVisibleProperties] = useState(8);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Mock property data - Replace with your actual data
    const allProperties: Property[] = [
        {
            id: 1,
            title: 'Luxury Villa in Kathmandu',
            location: 'Kathmandu, Nepal',
            price: 'NPR 2.5 Crore',
            type: 'Villa',
            bedrooms: 4,
            bathrooms: 3,
            area: '3500 sq.ft',
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
            featured: true
        },
        {
            id: 2,
            title: 'Modern Apartment in Pokhara',
            location: 'Pokhara, Nepal',
            price: 'NPR 85 Lakh',
            type: 'Apartment',
            bedrooms: 3,
            bathrooms: 2,
            area: '1800 sq.ft',
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'
        },
        {
            id: 3,
            title: 'Commercial Space in Lalitpur',
            location: 'Lalitpur, Nepal',
            price: 'NPR 1.8 Crore',
            type: 'Commercial',
            bedrooms: 0,
            bathrooms: 2,
            area: '2500 sq.ft',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'
        },
        {
            id: 4,
            title: 'Cozy House in Bhaktapur',
            location: 'Bhaktapur, Nepal',
            price: 'NPR 1.2 Crore',
            type: 'House',
            bedrooms: 3,
            bathrooms: 2,
            area: '2200 sq.ft',
            image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
            featured: true
        },
        {
            id: 5,
            title: 'Premium Land in Chitwan',
            location: 'Chitwan, Nepal',
            price: 'NPR 65 Lakh',
            type: 'Land',
            bedrooms: 0,
            bathrooms: 0,
            area: '5 Ropani',
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'
        },
        {
            id: 6,
            title: 'Spacious Apartment in Biratnagar',
            location: 'Biratnagar, Nepal',
            price: 'NPR 75 Lakh',
            type: 'Apartment',
            bedrooms: 2,
            bathrooms: 2,
            area: '1500 sq.ft',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'
        },
        {
            id: 7,
            title: 'Beautiful Villa in Butwal',
            location: 'Butwal, Nepal',
            price: 'NPR 1.5 Crore',
            type: 'Villa',
            bedrooms: 4,
            bathrooms: 3,
            area: '3000 sq.ft',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'
        },
        {
            id: 8,
            title: 'Modern House in Kathmandu',
            location: 'Kathmandu, Nepal',
            price: 'NPR 1.8 Crore',
            type: 'House',
            bedrooms: 3,
            bathrooms: 2,
            area: '2800 sq.ft',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
            featured: true
        },
        {
            id: 9,
            title: 'Luxury Apartment in Pokhara',
            location: 'Pokhara, Nepal',
            price: 'NPR 95 Lakh',
            type: 'Apartment',
            bedrooms: 3,
            bathrooms: 2,
            area: '2000 sq.ft',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'
        },
        {
            id: 10,
            title: 'Commercial Building in Lalitpur',
            location: 'Lalitpur, Nepal',
            price: 'NPR 3.5 Crore',
            type: 'Commercial',
            bedrooms: 0,
            bathrooms: 4,
            area: '4500 sq.ft',
            image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80'
        },
        {
            id: 11,
            title: 'Elegant House in Bhaktapur',
            location: 'Bhaktapur, Nepal',
            price: 'NPR 1.4 Crore',
            type: 'House',
            bedrooms: 4,
            bathrooms: 3,
            area: '2600 sq.ft',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'
        },
        {
            id: 12,
            title: 'Prime Land in Kathmandu',
            location: 'Kathmandu, Nepal',
            price: 'NPR 1.2 Crore',
            type: 'Land',
            bedrooms: 0,
            bathrooms: 0,
            area: '8 Ropani',
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'
        }
    ];

    // Intersection Observer for scroll animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const loadMore = () => {
        setVisibleProperties((prev) => Math.min(prev + 4, allProperties.length));
    };

    const displayedProperties = allProperties.slice(0, visibleProperties);
    const hasMore = visibleProperties < allProperties.length;

    return (
        <section ref={sectionRef} className='py-20 px-4 md:px-8 lg:px-12 bg-linear-to-b from-gray-50 to-white'>
            {/* Section Header */}
            <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
                    <div
                        key={property.id}
                        className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                        style={{
                            transitionDelay: `${index * 100}ms`
                        }}
                    >
                        {/* Property Image */}
                        <div className='relative h-64 overflow-hidden'>
                            <img
                                src={property.image}
                                alt={property.title}
                                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                            />
                            {/* Gradient Overlay */}
                            <div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent'></div>

                            {/* Featured Badge */}
                            {property.featured && (
                                <div className='absolute top-4 left-4 bg-[#9ac842] text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg'>
                                    Featured
                                </div>
                            )}

                            {/* Property Type Badge */}
                            <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold'>
                                {property.type}
                            </div>

                            {/* Price Tag */}
                            <div className='absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl'>
                                <p className='text-xl font-bold text-gray-900'>{property.price}</p>
                            </div>
                        </div>

                        {/* Property Details */}
                        <div className='p-6'>
                            <h3 className='text-xl font-bold text-gray-900 mb-2 group-hover:text-[#9ac842] transition-colors line-clamp-1'>
                                {property.title}
                            </h3>
                            <div className='flex items-center text-gray-600 mb-4'>
                                <svg className='w-4 h-4 mr-2 text-[#36c2d9]' fill='currentColor' viewBox='0 0 20 20'>
                                    <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                                </svg>
                                <span className='text-sm'>{property.location}</span>
                            </div>

                            {/* Property Features */}
                            <div className='flex items-center justify-between text-gray-700 mb-4 pb-4 border-b border-gray-200'>
                                {property.bedrooms > 0 && (
                                    <div className='flex items-center gap-1'>
                                        <svg className='w-5 h-5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                                        </svg>
                                        <span className='text-sm font-medium'>{property.bedrooms} Bed</span>
                                    </div>
                                )}
                                {property.bathrooms > 0 && (
                                    <div className='flex items-center gap-1'>
                                        <svg className='w-5 h-5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' />
                                        </svg>
                                        <span className='text-sm font-medium'>{property.bathrooms} Bath</span>
                                    </div>
                                )}
                                <div className='flex items-center gap-1'>
                                    <svg className='w-5 h-5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' />
                                    </svg>
                                    <span className='text-sm font-medium'>{property.area}</span>
                                </div>
                            </div>

                            {/* View Details Button */}
                            <button className='w-full cursor-pointer py-3 bg-[#9ac842] hover:bg-[#36c2d9] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#36c2d9]/30 transform hover:scale-105 active:scale-95 transition-all duration-150'>
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className={`text-center mt-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '800ms' }}>
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
