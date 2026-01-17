'use client';
import React, { useState, useEffect, useRef } from 'react';
import HumanVerification from './HumanVerification';

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [formStartTime] = useState(Date.now());
    const [submitStatus, setSubmitStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({ type: null, message: '' });

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

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear status when user starts typing
        if (submitStatus.type) {
            setSubmitStatus({ type: null, message: '' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isVerified) {
            setSubmitStatus({
                type: 'error',
                message: 'Please verify that you are human before submitting.',
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus({ type: null, message: '' });

        try {
            const response = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    type: 'general',
                    startTime: formStartTime,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus({
                    type: 'success',
                    message: data.message || 'Your message has been sent successfully! We will get back to you soon.',
                });
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: data.error || 'Something went wrong. Please try again.',
                });
            }
        } catch {
            setSubmitStatus({
                type: 'error',
                message: 'Failed to send message. Please check your connection and try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section ref={sectionRef} className='py-16 sm:py-20 px-4 md:px-8 lg:px-12 bg-gradient-to-br from-gray-50 via-white to-gray-50'>
            {/* Section Header */}
            <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4'>
                    Get In <span className='bg-gradient-to-r from-[#9ac842] to-[#36c2d9] bg-clip-text text-transparent'>Touch</span>
                </h2>
                <p className='text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4'>
                    Have a question? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                </p>
                <div className='w-24 h-1 bg-gradient-to-r from-[#9ac842] to-[#36c2d9] mx-auto mt-6 rounded-full'></div>
            </div>

            <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
                {/* Contact Information */}
                <div className={`space-y-6 sm:space-y-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className='bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100'>
                        <h3 className='text-xl sm:text-2xl font-bold text-gray-900 mb-6'>Contact Information</h3>

                        {/* Address */}
                        <div className='flex items-start gap-4 mb-6 group'>
                            <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#9ac842] to-[#36c2d9] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform'>
                                <svg className='w-5 h-5 sm:w-6 sm:h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                                </svg>
                            </div>
                            <div>
                                <h4 className='font-semibold text-gray-900 mb-1'>Address</h4>
                                <p className='text-gray-600 text-sm sm:text-base'>Kathmandu, Nepal</p>
                                <p className='text-gray-600 text-sm sm:text-base'>Baneshwor, Ward No. 26</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className='flex items-start gap-4 mb-6 group'>
                            <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#36c2d9] to-[#9ac842] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform'>
                                <svg className='w-5 h-5 sm:w-6 sm:h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                                </svg>
                            </div>
                            <div>
                                <h4 className='font-semibold text-gray-900 mb-1'>Phone</h4>
                                <p className='text-gray-600 text-sm sm:text-base'>+977 9863614398</p>
                                <p className='text-gray-600 text-sm sm:text-base'>+977 9815084499</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className='flex items-start gap-4 mb-6 group'>
                            <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#9ac842] to-[#36c2d9] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform'>
                                <svg className='w-5 h-5 sm:w-6 sm:h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                                </svg>
                            </div>
                            <div>
                                <h4 className='font-semibold text-gray-900 mb-1'>Email</h4>
                                <p className='text-gray-600 text-sm sm:text-base'>info@egharbari.com.np</p>
                                <p className='text-gray-600 text-sm sm:text-base'>support@egharbari.com.np</p>
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div className='flex items-start gap-4 group'>
                            <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#36c2d9] to-[#9ac842] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform'>
                                <svg className='w-5 h-5 sm:w-6 sm:h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                </svg>
                            </div>
                            <div>
                                <h4 className='font-semibold text-gray-900 mb-1'>Working Hours</h4>
                                <p className='text-gray-600 text-sm sm:text-base'>Sunday - Friday: 10:00 AM - 6:00 PM</p>
                                <p className='text-gray-600 text-sm sm:text-base'>Saturday: Closed</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className='bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100'>
                        <h3 className='text-xl sm:text-2xl font-bold text-gray-900 mb-6'>Follow Us</h3>
                        <div className='flex gap-3 sm:gap-4'>
                            <a href='https://www.facebook.com/gharbarisewa' target='_blank' rel='noopener noreferrer' className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform'>
                                <svg className='w-5 h-5 sm:w-6 sm:h-6 text-white' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                    <div className='bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100'>
                        <h3 className='text-xl sm:text-2xl font-bold text-gray-900 mb-6'>Send us a Message</h3>

                        {/* Status Message */}
                        {submitStatus.type && (
                            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                                submitStatus.type === 'success' 
                                    ? 'bg-green-50 border border-green-200 text-green-700' 
                                    : 'bg-red-50 border border-red-200 text-red-700'
                            }`}>
                                {submitStatus.type === 'success' ? (
                                    <svg className='w-5 h-5 flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                                    </svg>
                                ) : (
                                    <svg className='w-5 h-5 flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                                    </svg>
                                )}
                                <p className='text-sm sm:text-base'>{submitStatus.message}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-6'>
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
                                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9ac842] focus:border-transparent transition-all outline-none text-sm sm:text-base'
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
                                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9ac842] focus:border-transparent transition-all outline-none text-sm sm:text-base'
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
                                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9ac842] focus:border-transparent transition-all outline-none text-sm sm:text-base'
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
                                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9ac842] focus:border-transparent transition-all outline-none text-sm sm:text-base'
                                    placeholder='How can we help you?'
                                />
                            </div>
                            <div>
                                <label htmlFor='message' className='block text-sm font-semibold text-gray-700 mb-2'>
                                    Message * (minimum 10 characters)
                                </label>
                                <textarea
                                    id='message'
                                    name='message'
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    minLength={10}
                                    maxLength={5000}
                                    rows={4}
                                    className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9ac842] focus:border-transparent transition-all outline-none resize-none text-sm sm:text-base'
                                    placeholder='Tell us more about your inquiry...'
                                />
                                <p className='text-xs text-gray-500 mt-1'>
                                    {formData.message.length}/10 characters minimum
                                </p>
                            </div>
                            
                            {/* Human Verification */}
                            <HumanVerification onVerify={setIsVerified} />

                            <button
                                type='submit'
                                disabled={isSubmitting || !isVerified}
                                className='w-full py-3 sm:py-4 bg-gradient-to-r from-[#9ac842] to-[#36c2d9] hover:opacity-90 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className='animate-spin h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                        </svg>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
