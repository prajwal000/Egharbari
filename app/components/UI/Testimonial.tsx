'use client';
import React, { useState, useEffect, useRef } from 'react';

interface Testimonial {
    id: number;
    name: string;
    location: string;
    rating: number;
    text: string;
    avatar: string;
    propertyType: string;
}

const Testimonials = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: 'Rajesh Sharma',
            location: 'Kathmandu',
            rating: 5,
            text: 'Found my dream home in just 2 weeks! The team was incredibly helpful and professional. Highly recommend their services to anyone looking for property in Nepal.',
            avatar: 'https://ui-avatars.com/api/?name=Rajesh+Sharma&background=8b5cf6&color=fff&size=200',
            propertyType: 'Villa'
        },
        {
            id: 2,
            name: 'Sita Thapa',
            location: 'Pokhara',
            rating: 5,
            text: 'Excellent service! They helped me find the perfect apartment with a beautiful lake view. The entire process was smooth and transparent.',
            avatar: 'https://ui-avatars.com/api/?name=Sita+Thapa&background=f97316&color=fff&size=200',
            propertyType: 'Apartment'
        },
        {
            id: 3,
            name: 'Bikram Rai',
            location: 'Lalitpur',
            rating: 5,
            text: 'Professional and trustworthy! Sold my property at a great price. Their market knowledge and negotiation skills are outstanding.',
            avatar: 'https://ui-avatars.com/api/?name=Bikram+Rai&background=ec4899&color=fff&size=200',
            propertyType: 'House'
        },
        {
            id: 4,
            name: 'Anita Gurung',
            location: 'Bhaktapur',
            rating: 5,
            text: 'Best real estate experience ever! They understood exactly what I was looking for and found me the perfect family home. Forever grateful!',
            avatar: 'https://ui-avatars.com/api/?name=Anita+Gurung&background=6366f1&color=fff&size=200',
            propertyType: 'House'
        },
        {
            id: 5,
            name: 'Ramesh Adhikari',
            location: 'Chitwan',
            rating: 5,
            text: 'Invested in commercial property through them. Great ROI and excellent support throughout. Very satisfied with their professionalism.',
            avatar: 'https://ui-avatars.com/api/?name=Ramesh+Adhikari&background=14b8a6&color=fff&size=200',
            propertyType: 'Commercial'
        },
        {
            id: 6,
            name: 'Sunita Karki',
            location: 'Biratnagar',
            rating: 5,
            text: 'Amazing team! They made buying my first property stress-free. Always available to answer questions and guide me through every step.',
            avatar: 'https://ui-avatars.com/api/?name=Sunita+Karki&background=8b5cf6&color=fff&size=200',
            propertyType: 'Apartment'
        },
        {
            id: 7,
            name: 'Dipak Tamang',
            location: 'Butwal',
            rating: 5,
            text: 'Highly professional service! Found a great investment property with excellent returns. Their market insights are invaluable.',
            avatar: 'https://ui-avatars.com/api/?name=Dipak+Tamang&background=f97316&color=fff&size=200',
            propertyType: 'Land'
        },
        {
            id: 8,
            name: 'Kamala Shrestha',
            location: 'Kathmandu',
            rating: 5,
            text: 'Wonderful experience from start to finish! They helped me find a beautiful villa in my dream location. Couldn\'t be happier!',
            avatar: 'https://ui-avatars.com/api/?name=Kamala+Shrestha&background=ec4899&color=fff&size=200',
            propertyType: 'Villa'
        },
        {
            id: 9,
            name: 'Prakash Magar',
            location: 'Pokhara',
            rating: 5,
            text: 'Outstanding service! Very knowledgeable about the local market. Helped me get the best deal on my commercial space.',
            avatar: 'https://ui-avatars.com/api/?name=Prakash+Magar&background=6366f1&color=fff&size=200',
            propertyType: 'Commercial'
        },
        {
            id: 10,
            name: 'Gita Poudel',
            location: 'Lalitpur',
            rating: 5,
            text: 'Trustworthy and reliable! They went above and beyond to help me find the perfect home for my family. Highly recommended!',
            avatar: 'https://ui-avatars.com/api/?name=Gita+Poudel&background=14b8a6&color=fff&size=200',
            propertyType: 'House'
        },
        {
            id: 11,
            name: 'Suresh Limbu',
            location: 'Dharan',
            rating: 5,
            text: 'Exceptional service! Made my property buying journey smooth and hassle-free. Their expertise and dedication are commendable.',
            avatar: 'https://ui-avatars.com/api/?name=Suresh+Limbu&background=8b5cf6&color=fff&size=200',
            propertyType: 'Apartment'
        },
        {
            id: 12,
            name: 'Maya Basnet',
            location: 'Kathmandu',
            rating: 5,
            text: 'Best decision to work with them! Found my dream apartment in the heart of the city. Professional, friendly, and efficient!',
            avatar: 'https://ui-avatars.com/api/?name=Maya+Basnet&background=f97316&color=fff&size=200',
            propertyType: 'Apartment'
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

    return (
        <section ref={sectionRef} className='py-20 px-4 md:px-8 lg:px-12 bg-linear-to-b from-white to-gray-50'>
            {/* Section Header */}
            <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4'>
                    What Our <span className='bg-linear-to-r from-[#9ac842] to-[#36c2d9] bg-clip-text text-transparent'>Clients Say</span>
                </h2>
                <p className='text-lg md:text-xl text-gray-600 max-w-2xl mx-auto'>
                    Don't just take our word for it - hear from our satisfied clients
                </p>
                <div className='w-24 h-1 bg-linear-to-r from-[#9ac842] to-[#36c2d9] mx-auto mt-6 rounded-full'></div>
            </div>

            {/* Testimonials Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto'>
                {testimonials.map((testimonial, index) => (
                    <div
                        key={testimonial.id}
                        className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                        style={{
                            transitionDelay: `${index * 100}ms`
                        }}
                    >
                        {/* Rating Stars */}
                        <div className='flex gap-1 mb-4'>
                            {[...Array(testimonial.rating)].map((_, i) => (
                                <svg
                                    key={i}
                                    className='w-5 h-5 text-yellow-400 fill-current'
                                    viewBox='0 0 20 20'
                                >
                                    <path d='M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z' />
                                </svg>
                            ))}
                        </div>

                        {/* Testimonial Text */}
                        <p className='text-gray-700 mb-6 leading-relaxed italic'>
                            "{testimonial.text}"
                        </p>

                        {/* Client Info */}
                        <div className='flex items-center gap-4 pt-6 border-t border-gray-200'>
                            <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className='w-14 h-14 rounded-full ring-2 ring-[#9ac842]/20'
                            />
                            <div>
                                <h4 className='font-bold text-gray-900 text-lg'>{testimonial.name}</h4>
                                <p className='text-sm text-gray-600'>{testimonial.location}</p>
                                <span className='inline-block mt-1 text-xs font-semibold text-[#9ac842] bg-[#9ac842]/10 px-2 py-1 rounded-full'>
                                    {testimonial.propertyType}
                                </span>
                            </div>
                        </div>

                        {/* Quote Icon */}
                        <div className='absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity'>
                            <svg className='w-12 h-12 text-[#9ac842]' fill='currentColor' viewBox='0 0 32 32'>
                                <path d='M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm12 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z' />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Stats */}
            <div className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '1200ms' }}>
                <div className='text-center'>
                    <div className='text-4xl font-bold text-[#9ac842] mb-2'>500+</div>
                    <div className='text-gray-600'>Happy Clients</div>
                </div>
                <div className='text-center'>
                    <div className='text-4xl font-bold text-[#36c2d9] mb-2'>1000+</div>
                    <div className='text-gray-600'>Properties Sold</div>
                </div>
                <div className='text-center'>
                    <div className='text-4xl font-bold text-[#9ac842] mb-2'>4.9/5</div>
                    <div className='text-gray-600'>Average Rating</div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
