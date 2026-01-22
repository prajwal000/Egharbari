'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import FavoriteButton from '@/app/components/UI/FavoriteButton';
import {
    PropertyData,
    PROPERTY_TYPE_LABELS,
    PROPERTY_STATUS_LABELS,
    LISTING_TYPE_LABELS,
    ListingType,
    PropertyStatus,
} from '@/lib/types/property';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: session } = useSession();
    const [property, setProperty] = useState<PropertyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
    const [showInquiryForm, setShowInquiryForm] = useState(false);
    const [inquirySubmitting, setInquirySubmitting] = useState(false);
    const [inquiryStatus, setInquiryStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

    const [inquiryForm, setInquiryForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    // Helper function to extract YouTube video ID
    const getYouTubeVideoId = (url: string): string | null => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Helper function to extract Vimeo video ID
    const getVimeoVideoId = (url: string): string | null => {
        if (!url) return null;
        const regExp = /vimeo.com\/(\d+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await fetch(`/api/properties/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setProperty(data.property);
                }
            } catch (error) {
                console.error('Failed to fetch property:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    useEffect(() => {
        if (session?.user) {
            setInquiryForm(prev => ({
                ...prev,
                name: session.user.name || '',
                email: session.user.email || '',
            }));
        }
    }, [session]);

    const handleInquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setInquirySubmitting(true);
        setInquiryStatus({ type: null, message: '' });

        try {
            const response = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...inquiryForm,
                    subject: `Inquiry about: ${property?.name}`,
                    type: 'property',
                    propertyId: property?._id,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setInquiryStatus({ type: 'success', message: 'Inquiry sent successfully! We will contact you soon.' });
                setInquiryForm(prev => ({ ...prev, message: '' }));
                setShowInquiryForm(false);
            } else {
                setInquiryStatus({ type: 'error', message: data.error || 'Failed to send inquiry' });
            }
        } catch {
            setInquiryStatus({ type: 'error', message: 'Failed to send inquiry' });
        } finally {
            setInquirySubmitting(false);
        }
    };

    const formatPrice = (price: number, listingType: ListingType) => {
        const suffix = listingType === ListingType.RENT ? '/month' : '';
        if (price >= 10000000) return `Rs. ${(price / 10000000).toFixed(2)} Crore${suffix}`;
        if (price >= 100000) return `Rs. ${(price / 100000).toFixed(2)} Lakh${suffix}`;
        return `Rs. ${price.toLocaleString()}${suffix}`;
    };

    const getStatusColor = (status: PropertyStatus) => {
        switch (status) {
            case PropertyStatus.AVAILABLE: return 'bg-green-100 text-green-700';
            case PropertyStatus.SOLD: return 'bg-red-100 text-red-700';
            case PropertyStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
            case PropertyStatus.RENTED: return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9ac842]"></div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
                    <Link href="/properties" className="text-[#9ac842] hover:underline">
                        Back to Properties
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32  pb-10">
            <div className="max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center gap-2 text-gray-600">
                        <li><Link href="/" className="hover:text-[#9ac842]">Home</Link></li>
                        <li>/</li>
                        <li><Link href="/properties" className="hover:text-[#9ac842]">Properties</Link></li>
                        <li>/</li>
                        <li className="text-gray-900 font-medium truncate max-w-[200px]">{property.name}</li>
                    </ol>
                </nav>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image & Video Gallery */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            {/* Main Media Display */}
                            <div className="relative aspect-[16/10] bg-gray-200">
                                {/* Check if current selection is video (last index if video exists) */}
                                {property.videoUrl && selectedMediaIndex === property.images.length ? (
                                    <div className="w-full h-full">
                                        {getYouTubeVideoId(property.videoUrl) ? (
                                            <iframe
                                                src={`https://www.youtube.com/embed/${getYouTubeVideoId(property.videoUrl)}`}
                                                title={property.name}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="w-full h-full"
                                            />
                                        ) : getVimeoVideoId(property.videoUrl) ? (
                                            <iframe
                                                src={`https://player.vimeo.com/video/${getVimeoVideoId(property.videoUrl)}`}
                                                title={property.name}
                                                allow="autoplay; fullscreen; picture-in-picture"
                                                allowFullScreen
                                                className="w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <p>Video not available</p>
                                            </div>
                                        )}
                                    </div>
                                ) : property.images.length > 0 ? (
                                    <Image
                                        src={property.images[selectedMediaIndex]?.url || property.images[0].url}
                                        alt={property.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                {/* Badges - Only show on images, not video */}
                                {(!property.videoUrl || selectedMediaIndex !== property.images.length) && (
                                    <>
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(property.status)}`}>
                                                {PROPERTY_STATUS_LABELS[property.status]}
                                            </span>
                                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#9ac842] text-white">
                                                {LISTING_TYPE_LABELS[property.listingType]}
                                            </span>
                                        </div>
                                        {/* Favorite Button */}
                                        <div className="absolute top-4 right-4">
                                            <FavoriteButton propertyId={property._id} size="lg" />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {(property.images.length > 1 || property.videoUrl) && (
                                <div className="flex gap-2 p-4 overflow-x-auto">
                                    {/* Image Thumbnails */}
                                    {property.images.map((image, index) => (
                                        <button
                                            key={`img-${index}`}
                                            onClick={() => setSelectedMediaIndex(index)}
                                            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                                                selectedMediaIndex === index ? 'border-[#9ac842]' : 'border-transparent'
                                            }`}
                                        >
                                            <Image
                                                src={image.url}
                                                alt={`${property.name} ${index + 1}`}
                                                width={80}
                                                height={64}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                    {/* Video Thumbnail */}
                                    {property.videoUrl && (
                                        <button
                                            key="video"
                                            onClick={() => setSelectedMediaIndex(property.images.length)}
                                            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors relative ${
                                                selectedMediaIndex === property.images.length ? 'border-[#9ac842]' : 'border-transparent'
                                            }`}
                                        >
                                            {getYouTubeVideoId(property.videoUrl) ? (
                                                <Image
                                                    src={`https://img.youtube.com/vi/${getYouTubeVideoId(property.videoUrl)}/default.jpg`}
                                                    alt="Video"
                                                    width={80}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            )}
                                            {/* Play Icon Overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Property Info */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">{property.propertyId}</p>
                                    <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
                                    <p className="text-gray-600 flex items-center gap-1 mt-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        {property.location.address}, {property.location.district}
                                    </p>
                                </div>
                                <p className="text-2xl font-bold bg-gradient-to-r from-[#9ac842] to-[#36c2d9] bg-clip-text text-transparent whitespace-nowrap">
                                    {formatPrice(property.price, property.listingType)}
                                </p>
                            </div>

                            {/* Quick Info */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-100">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{property.bedrooms || '-'}</p>
                                    <p className="text-sm text-gray-600">Bedrooms</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{property.bathrooms || '-'}</p>
                                    <p className="text-sm text-gray-600">Bathrooms</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{property.area || '-'}</p>
                                    <p className="text-sm text-gray-600">{property.areaUnit || 'sq.ft'}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{PROPERTY_TYPE_LABELS[property.propertyType]}</p>
                                    <p className="text-sm text-gray-600">Type</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                                <p className="text-gray-600 whitespace-pre-wrap">{property.description}</p>
                            </div>

                            {/* Features */}
                            {property.features && property.features.length > 0 && (
                                <div className="mt-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Features</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {property.features.map((feature, index) => (
                                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Map */}
                            {property.location.coordinates && (
                                <div className="mt-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Location</h2>
                                    <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
                                        <iframe
                                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${property.location.coordinates.lat},${property.location.coordinates.lng}&zoom=15`}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        ></iframe>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Inquiry Form */}
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interested in this property?</h3>

                            {inquiryStatus.type && (
                                <div className={`mb-4 p-3 rounded-lg text-sm ${
                                    inquiryStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>
                                    {inquiryStatus.message}
                                </div>
                            )}

                            {!showInquiryForm ? (
                                <button
                                    onClick={() => setShowInquiryForm(true)}
                                    className="w-full py-3 bg-gradient-to-r from-[#9ac842] to-[#36c2d9] text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                                >
                                    Make an Inquiry
                                </button>
                            ) : (
                                <form onSubmit={handleInquirySubmit} className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Your Name *"
                                            required
                                            value={inquiryForm.name}
                                            onChange={(e) => setInquiryForm(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Email Address *"
                                            required
                                            value={inquiryForm.email}
                                            onChange={(e) => setInquiryForm(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="Phone Number *"
                                            required
                                            value={inquiryForm.phone}
                                            onChange={(e) => setInquiryForm(prev => ({ ...prev, phone: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            placeholder="Your Message (min 10 characters) *"
                                            required
                                            minLength={10}
                                            maxLength={5000}
                                            rows={3}
                                            value={inquiryForm.message}
                                            onChange={(e) => setInquiryForm(prev => ({ ...prev, message: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none resize-none"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            {inquiryForm.message.length}/10 characters minimum
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowInquiryForm(false)}
                                            className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={inquirySubmitting}
                                            className="flex-1 py-2 bg-gradient-to-r from-[#9ac842] to-[#36c2d9] text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
                                        >
                                            {inquirySubmitting ? 'Sending...' : 'Send'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Contact Info */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-sm text-gray-600 mb-3">Or contact us directly:</p>
                                <a href="tel:+9779863614398" className="flex items-center gap-2 text-gray-700 hover:text-[#9ac842] mb-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    +977 9863614398
                                </a>
                                <a href="mailto:info@egharbari.com.np" className="flex items-center gap-2 text-gray-700 hover:text-[#9ac842]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    info@egharbari.com.np
                                </a>
                            </div>
                        </div>

                        {/* Property Stats */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Property ID</span>
                                    <span className="font-medium text-gray-900">{property.propertyId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Type</span>
                                    <span className="font-medium text-gray-900">{PROPERTY_TYPE_LABELS[property.propertyType]}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status</span>
                                    <span className="font-medium text-gray-900">{PROPERTY_STATUS_LABELS[property.status]}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Listed</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(property.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Views</span>
                                    <span className="font-medium text-gray-900">{property.views}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



