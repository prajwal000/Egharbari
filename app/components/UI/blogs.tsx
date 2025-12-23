'use client';
import React, { useState, useEffect, useRef } from 'react';

interface Blog {
    id: number;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
    category: string;
}

const Blogs = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const blogs: Blog[] = [
        {
            id: 1,
            title: 'Top 10 Tips for First-Time Home Buyers in Nepal',
            excerpt: 'Buying your first home is exciting but can be overwhelming. Here are essential tips to help you navigate the process smoothly and make informed decisions.',
            author: 'Rajesh Sharma',
            date: 'Dec 10, 2024',
            readTime: '5 min read',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
            category: 'Buying Guide'
        },
        {
            id: 2,
            title: 'Real Estate Investment Trends in Kathmandu Valley',
            excerpt: 'Discover the latest market trends and investment opportunities in Kathmandu Valley. Learn where smart investors are putting their money in 2024.',
            author: 'Sita Thapa',
            date: 'Dec 8, 2024',
            readTime: '7 min read',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
            category: 'Investment'
        },
        {
            id: 3,
            title: 'How to Stage Your Home for a Quick Sale',
            excerpt: 'Home staging can significantly impact your sale price and time on market. Learn professional staging techniques that attract buyers and maximize value.',
            author: 'Bikram Rai',
            date: 'Dec 5, 2024',
            readTime: '6 min read',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
            category: 'Selling Tips'
        },
        {
            id: 4,
            title: 'Understanding Property Laws in Nepal: A Complete Guide',
            excerpt: 'Navigate Nepal\'s property laws with confidence. This comprehensive guide covers everything from ownership rights to legal documentation requirements.',
            author: 'Anita Gurung',
            date: 'Dec 3, 2024',
            readTime: '10 min read',
            image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
            category: 'Legal'
        },
        {
            id: 5,
            title: 'Best Neighborhoods in Pokhara for Families',
            excerpt: 'Looking for a family-friendly neighborhood in Pokhara? Explore the best areas with great schools, parks, and community amenities.',
            author: 'Prakash Magar',
            date: 'Nov 30, 2024',
            readTime: '8 min read',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
            category: 'Lifestyle'
        },
        {
            id: 6,
            title: 'Smart Home Technology: Increasing Your Property Value',
            excerpt: 'Discover how smart home upgrades can boost your property value and attract tech-savvy buyers. Learn which investments offer the best returns.',
            author: 'Maya Basnet',
            date: 'Nov 28, 2024',
            readTime: '6 min read',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
            category: 'Technology'
        }
    ];

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
        <section ref={sectionRef} className='py-20 px-4 md:px-8 lg:px-12 bg-white'>
            {/* Section Header */}
            <div className={`max-w-7xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className='flex items-center justify-between mb-6'>
                    <div>
                        <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4'>
                            Latest <span className='bg-linear-to-r from-[#9ac842] to-[#36c2d9] bg-clip-text text-transparent'>Blogs</span>
                        </h2>
                        <p className='text-lg md:text-xl text-gray-600 max-w-2xl'>
                            Stay updated with the latest insights, tips, and trends in Nepal's real estate market
                        </p>
                    </div>
                    <a
                        href='/blogs'
                        className='hidden md:flex items-center gap-2 text-[#9ac842] hover:text-[#36c2d9] font-semibold text-lg transition-colors group'
                    >
                        <span>View All Blogs</span>
                        <svg className='w-5 h-5 group-hover:translate-x-2 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                        </svg>
                    </a>
                </div>
                <div className='w-24 h-1 bg-linear-to-r from-[#9ac842] to-[#36c2d9] rounded-full'></div>
            </div>

            {/* Blogs Grid */}
            <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {blogs.map((blog, index) => (
                    <div
                        key={blog.id}
                        className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                    >
                        {/* Blog Image */}
                        <div className='relative h-56 overflow-hidden'>
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                            />
                            <div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent'></div>

                            {/* Category Badge */}
                            <div className='absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold'>
                                {blog.category}
                            </div>
                        </div>

                        {/* Blog Content */}
                        <div className='p-6'>
                            {/* Title */}
                            <h3 className='text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#9ac842] transition-colors'>
                                {blog.title}
                            </h3>

                            {/* Excerpt */}
                            <p className='text-gray-600 mb-4 line-clamp-3 leading-relaxed'>
                                {blog.excerpt}
                            </p>

                            {/* Meta Info */}
                            <div className='flex items-center justify-between pt-4 border-t border-gray-200'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-linear-to-br from-[#9ac842] to-[#36c2d9] rounded-full flex items-center justify-center text-white font-bold text-sm'>
                                        {blog.author.charAt(0)}
                                    </div>
                                    <div>
                                        <p className='text-sm font-semibold text-gray-900'>{blog.author}</p>
                                        <p className='text-xs text-gray-500'>{blog.date}</p>
                                    </div>
                                </div>
                                <div className='text-xs text-gray-500 font-medium'>
                                    {blog.readTime}
                                </div>
                            </div>

                            {/* Read More Link */}
                            <a
                                href={`/blog/${blog.id}`}
                                className='mt-4 inline-flex items-center gap-2 text-[#9ac842] hover:text-[#36c2d9] font-semibold text-sm transition-colors group/link'
                            >
                                <span>Read More</span>
                                <svg className='w-4 h-4 group-hover/link:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                                </svg>
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile View All Link */}
            <div className={`md:hidden text-center mt-12 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <a
                    href='/blogs'
                    className='inline-flex items-center gap-2 text-[#9ac842] hover:text-[#36c2d9] font-semibold text-lg transition-colors group'
                >
                    <span>View All Blogs</span>
                    <svg className='w-5 h-5 group-hover:translate-x-2 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                    </svg>
                </a>
            </div>
        </section>
    );
};

export default Blogs;
