'use client';
import React, { useState, useEffect, useRef } from 'react';

const AboutUs = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const [activeCard, setActiveCard] = useState<number | null>(null);

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

    const stats = [
        { number: '10+', label: 'Years Experience', icon: '🏆', color: 'from-yellow-400 to-orange-500' },
        { number: '500+', label: 'Happy Clients', icon: '😊', color: 'from-pink-400 to-rose-500' },
        { number: '1000+', label: 'Properties Sold', icon: '🏠', color: 'from-blue-400 to-cyan-500' },
        { number: '50+', label: 'Expert Agents', icon: '👥', color: 'from-purple-400 to-indigo-500' }
    ];

    const values = [
        {
            title: 'Trust & Transparency',
            description: 'We believe in honest communication and transparent dealings. Your trust is our foundation.',
            icon: '🤝',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'Customer First',
            description: 'Your dreams are our priority. We go the extra mile to ensure your satisfaction.',
            icon: '⭐',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            title: 'Innovation',
            description: 'Embracing modern technology to make your property journey smooth and hassle-free.',
            icon: '💡',
            color: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Local Expertise',
            description: 'Deep knowledge of Nepal\'s real estate market to help you make informed decisions.',
            icon: '🗺️',
            color: 'from-green-500 to-emerald-500'
        }
    ];

    return (
        <section ref={sectionRef} className='py-20 px-4 md:px-8 lg:px-12 bg-linear-to-br from-indigo-50 via-white to-purple-50 overflow-hidden relative'>
            {/* Floating Shapes Background */}
            <div className='absolute top-20 left-10 w-32 h-32 bg-yellow-300 rounded-full opacity-20 blur-3xl animate-pulse'></div>
            <div className='absolute bottom-20 right-10 w-40 h-40 bg-pink-300 rounded-full opacity-20 blur-3xl animate-pulse' style={{ animationDelay: '1s' }}></div>
            <div className='absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300 rounded-full opacity-20 blur-3xl animate-pulse' style={{ animationDelay: '2s' }}></div>

            {/* Section Header */}
            <div className={`text-center mb-16 transition-all duration-1000 relative z-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className='inline-block mb-4'>
                    <span className='text-6xl animate-bounce inline-block'>👋</span>
                </div>
                <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4'>
                    About <span className='bg-linear-to-r from-[#9ac842] to-[#36c2d9] bg-clip-text text-transparent'>eGharBari</span>
                </h2>
                <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
                    We're not just another real estate company - we're your trusted partner in finding the perfect place to call home! 🏡
                </p>
                <div className='w-24 h-1 bg-linear-to-r from-[#9ac842] to-[#36c2d9] mx-auto mt-6 rounded-full'></div>
            </div>

            {/* Story Section */}
            <div className={`max-w-6xl mx-auto mb-20 transition-all duration-1000 delay-200 relative z-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className='bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 relative overflow-hidden'>
                    {/* Decorative Corner */}
                    <div className='absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-yellow-200 to-pink-200 opacity-50 rounded-bl-full'></div>
                    <div className='absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-blue-200 to-purple-200 opacity-50 rounded-tr-full'></div>

                    <div className='relative z-10'>
                        <h3 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3'>
                            <span className='text-4xl'>📖</span>
                            Our Story
                        </h3>
                        <div className='space-y-4 text-gray-700 text-lg leading-relaxed'>
                            <p>
                                Founded with a passion for connecting people with their dream properties, <span className='font-bold text-[#9ac842]'>eGharBari</span> has been transforming the real estate landscape in Nepal for over a decade! 🚀
                            </p>
                            <p>
                                What started as a small team of dedicated professionals has grown into one of Nepal's most trusted real estate platforms. We've helped thousands of families find their perfect homes, investors discover lucrative opportunities, and sellers get the best value for their properties.
                            </p>
                            <p>
                                Our secret? We treat every client like family, every property like a treasure, and every transaction with the utmost care and professionalism. That's the <span className='font-bold text-[#36c2d9]'>eGharBari</span> difference! ✨
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className={`max-w-6xl mx-auto mb-20 transition-all duration-1000 delay-400 relative z-10 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className='bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-110 hover:-rotate-2 transition-all duration-300 cursor-pointer border border-gray-100'
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className={`text-5xl mb-3 animate-bounce inline-block`} style={{ animationDelay: `${index * 200}ms` }}>
                                {stat.icon}
                            </div>
                            <div className={`text-4xl font-bold bg-linear-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                                {stat.number}
                            </div>
                            <div className='text-gray-600 font-semibold'>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Values Section */}
            <div className={`max-w-6xl mx-auto mb-12 transition-all duration-1000 delay-600 relative z-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h3 className='text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 flex items-center justify-center gap-3'>
                    <span className='text-4xl'>💎</span>
                    Our Core Values
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {values.map((value, index) => (
                        <div
                            key={index}
                            onMouseEnter={() => setActiveCard(index)}
                            onMouseLeave={() => setActiveCard(null)}
                            className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform transition-all duration-500 cursor-pointer border-2 ${activeCard === index ? 'scale-105 border-transparent' : 'border-gray-100'
                                }`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className='flex items-start gap-4'>
                                <div className={`text-5xl transform transition-all duration-500 ${activeCard === index ? 'scale-125 rotate-12' : ''}`}>
                                    {value.icon}
                                </div>
                                <div className='flex-1'>
                                    <h4 className={`text-2xl font-bold mb-3 bg-linear-to-r ${value.color} bg-clip-text text-transparent`}>
                                        {value.title}
                                    </h4>
                                    <p className='text-gray-600 leading-relaxed'>{value.description}</p>
                                </div>
                            </div>
                            {/* Animated Border */}
                            {activeCard === index && (
                                <div className={`absolute inset-0 rounded-2xl bg-linear-to-r ${value.color} opacity-20 -z-10`}></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 delay-800 relative z-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className='bg-linear-to-r from-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 shadow-2xl transform hover:scale-105 transition-all duration-300'>
                    <h3 className='text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3'>
                        <span className='text-4xl animate-bounce'>🎯</span>
                        Ready to Find Your Dream Property?
                    </h3>
                    <p className='text-white/90 text-lg mb-8'>
                        Join thousands of happy homeowners who trusted us with their property journey!
                    </p>
                    <button className='px-10 py-4 bg-white text-purple-600 font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-200 inline-flex items-center gap-3 group'>
                        <span>Let's Get Started</span>
                        <span className='text-2xl group-hover:translate-x-2 transition-transform'>🚀</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
