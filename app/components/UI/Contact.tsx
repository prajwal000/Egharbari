'use client';
import React, { useState, useEffect, useRef } from 'react';

const Contact = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Add your form submission logic here
    };

    return (
        <section ref={sectionRef} className='py-20 px-4 md:px-8 lg:px-12 bg-linear-to-br from-gray-50 via-white to-gray-50'>
            {/* Section Header */}
            <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4'>
                    Get In <span className='bg-linear-to-r from-[#9ac842] to-[#36c2d9] bg-clip-text text-transparent'>Touch</span>
                </h2>
                <p className='text-lg md:text-xl text-gray-600 max-w-2xl mx-auto'>
                    Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
                <div className='w-24 h-1 bg-linear-to-r from-[#9ac842] to-[#36c2d9] mx-auto mt-6 rounded-full'></div>
            </div>

            <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12'>
                {/* Contact Information */}
                <div className={`space-y-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className='bg-white rounded-2xl p-8 shadow-xl border border-gray-100'>
                        <h3 className='text-2xl font-bold text-gray-900 mb-6'>Contact Information</h3>

                        {/* Address */}
                        <div className='flex items-start gap-4 mb-6 group'>
                            <div className='w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform'>
                                <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                                </svg>
                            </div>
                            <div>
                                <h4 className='font-semibold text-gray-900 mb-1'>Address</h4>
                                <p className='text-gray-600'>Kathmandu, Nepal</p>
                                <p className='text-gray-600'>Baneshwor, Ward No. 26</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className='flex items-start gap-4 mb-6 group'>
                            <div className='w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform'>
                                <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                                </svg>
                            </div>
                            <div>
                                <h4 className='font-semibold text-gray-900 mb-1'>Phone</h4>
                                <p className='text-gray-600'>+977 9863614398</p>
                                <p className='text-gray-600'>+977 9815084499</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className='flex items-start gap-4 mb-6 group'>
                            <div className='w-12 h-12 bg-linear-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform'>
                                <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                </svg>
                            </div>
                            <div>
                                <h4 className='font-semibold text-gray-900 mb-1'>Email</h4>
                                <p className='text-gray-600'>info@egharbari.com.np</p>
                                <p className='text-gray-600'>support@egharbari.com.np</p>
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div className='flex items-start gap-4 group'>
                            <div className='w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform'>
                                <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                </svg>
                            </div>
                            <div>
                                <h4 className='font-semibold text-gray-900 mb-1'>Working Hours</h4>
                                <p className='text-gray-600'>Sunday - Friday: 9:00 AM - 6:00 PM</p>
                                <p className='text-gray-600'>Saturday: Closed</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className='bg-white rounded-2xl p-8 shadow-xl border border-gray-100'>
                        <h3 className='text-2xl font-bold text-gray-900 mb-6'>Follow Us</h3>
                        <div className='flex gap-4'>
                            <a href='#' className='w-12 h-12 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center hover:scale-110 transition-transform'>
                                <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                                </svg>
                            </a>
                            <a href='#' className='w-12 h-12 bg-linear-to-br from-pink-600 to-pink-700 rounded-xl flex items-center justify-center hover:scale-110 transition-transform'>
                                <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                                </svg>
                            </a>
                            <a href='#' className='w-12 h-12 bg-linear-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center hover:scale-110 transition-transform'>
                                <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
                                </svg>
                            </a>
                            <a href='#' className='w-12 h-12 bg-linear-to-br from-blue-700 to-blue-800 rounded-xl flex items-center justify-center hover:scale-110 transition-transform'>
                                <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                    <div className='bg-white rounded-2xl p-8 shadow-xl border border-gray-100'>
                        <h3 className='text-2xl font-bold text-gray-900 mb-6'>Send us a Message</h3>
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            <div>
                                <label htmlFor='name' className='block text-sm font-semibold text-gray-700 mb-2'>
                                    Full Name *
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none'
                                    placeholder='Enter your full name'
                                />
                            </div>
                            <div>
                                <label htmlFor='email' className='block text-sm font-semibold text-gray-700 mb-2'>
                                    Email Address *
                                </label>
                                <input
                                    type='email'
                                    id='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none'
                                    placeholder='your.email@example.com'
                                />
                            </div>
                            <div>
                                <label htmlFor='phone' className='block text-sm font-semibold text-gray-700 mb-2'>
                                    Phone Number *
                                </label>
                                <input
                                    type='tel'
                                    id='phone'
                                    name='phone'
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all outline-none'
                                    placeholder='+977 9801234567'
                                />
                            </div>
                            <div>
                                <label htmlFor='subject' className='block text-sm font-semibold text-gray-700 mb-2'>
                                    Subject *
                                </label>
                                <input
                                    type='text'
                                    id='subject'
                                    name='subject'
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none'
                                    placeholder='How can we help you?'
                                />
                            </div>
                            <div>
                                <label htmlFor='message' className='block text-sm font-semibold text-gray-700 mb-2'>
                                    Message *
                                </label>
                                <textarea
                                    id='message'
                                    name='message'
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none'
                                    placeholder='Tell us more about your inquiry...'
                                />
                            </div>
                            <button
                                type='submit'
                                className='w-full py-4 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2'
                            >
                                <span>Send Message</span>
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
