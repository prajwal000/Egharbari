'use client';
import React, { useState, useEffect, useRef } from 'react';

interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

const FAQ = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    const faqs: FAQItem[] = [
        {
            id: 1,
            question: 'How do I start my property search?',
            answer: 'Simply browse our property listings or use our advanced search filters to find properties that match your criteria. You can filter by location, price range, property type, and more. Once you find a property you like, contact us for a viewing!'
        },
        {
            id: 2,
            question: 'What documents do I need to buy a property in Nepal?',
            answer: 'You\'ll need citizenship certificate, recent passport-size photos, PAN card, and proof of income. For foreign nationals, additional documents may be required. Our team will guide you through the entire documentation process.'
        },
        {
            id: 3,
            question: 'How do I list my property for sale?',
            answer: 'Contact us through our website or call our office. We\'ll schedule a property evaluation, discuss pricing strategy, take professional photos, and create a compelling listing. Our marketing team will then promote your property across multiple channels.'
        },
        {
            id: 4,
            question: 'Are your property listings verified?',
            answer: 'Absolutely! Every property listing goes through our verification process. We verify ownership documents, conduct property inspections, and ensure all information is accurate before listing.'
        },
        {
            id: 5,
            question: 'Can I schedule a property viewing?',
            answer: 'Yes! You can schedule viewings through our website, phone, or email. We offer flexible viewing times including evenings and weekends to accommodate your schedule.'
        },
        {
            id: 6,
            question: 'Do you assist with home loans?',
            answer: 'Yes, we have partnerships with major banks and financial institutions in Nepal. We can help you understand loan options, compare rates, and assist with the application process.'
        },
        {
            id: 7,
            question: 'What areas do you cover in Nepal?',
            answer: 'We cover major cities including Kathmandu, Pokhara, Lalitpur, Bhaktapur, Biratnagar, Butwal, and many other locations across Nepal. Our network is constantly expanding!'
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

    const toggleFAQ = (id: number) => {
        setOpenFAQ(openFAQ === id ? null : id);
    };

    return (
        <section ref={sectionRef} className='py-20 px-4 md:px-8 lg:px-12 bg-linear-to-b from-gray-50 to-white'>
            {/* Section Header */}
            <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className='inline-block mb-4'>
                    <span className='text-6xl'>❓</span>
                </div>
                <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4'>
                    Frequently Asked <span className='bg-linear-to-r from-[#9ac842] to-[#36c2d9] bg-clip-text text-transparent'>Questions</span>
                </h2>
                <p className='text-lg md:text-xl text-gray-600 max-w-2xl mx-auto'>
                    Got questions? We've got answers! Find everything you need to know about buying, selling, and renting properties.
                </p>
                <div className='w-24 h-1 bg-linear-to-r from-[#9ac842] to-[#36c2d9] mx-auto mt-6 rounded-full'></div>
            </div>

            {/* FAQ List */}
            <div className='max-w-4xl mx-auto space-y-4'>
                {faqs.map((faq, index) => (
                    <div
                        key={faq.id}
                        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                    >
                        {/* Question */}
                        <button
                            onClick={() => toggleFAQ(faq.id)}
                            className='w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors'
                        >
                            <div className='flex items-center gap-4 flex-1'>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${openFAQ === faq.id
                                    ? 'bg-linear-to-r from-[#9ac842] to-[#36c2d9] text-white rotate-180'
                                    : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                    </svg>
                                </div>
                                <h3 className='text-lg md:text-xl font-bold text-gray-900 flex-1'>
                                    {faq.question}
                                </h3>
                            </div>
                        </button>

                        {/* Answer */}
                        <div
                            className={`overflow-hidden transition-all duration-500 ${openFAQ === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className='px-6 pb-6 pt-2'>
                                <div className='pl-14 pr-4'>
                                    <p className='text-gray-700 leading-relaxed'>
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQ;
