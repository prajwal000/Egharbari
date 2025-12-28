'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    PropertyData,
    PropertyType,
    ListingType,
    PROPERTY_TYPE_LABELS,
    LISTING_TYPE_LABELS,
    NEPAL_DISTRICTS,
} from '@/lib/types/property';

export default function PropertiesPage() {
    const searchParams = useSearchParams();
    const [properties, setProperties] = useState<PropertyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);

    const [filters, setFilters] = useState({
        propertyType: '',
        listingType: '',
        district: '',
        minPrice: '',
        maxPrice: '',
        bedrooms: '',
        sortBy: 'date_desc',
        search: '',
    });

    const fetchProperties = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', pagination.page.toString());
            params.set('limit', '12');
            if (filters.propertyType) params.set('propertyType', filters.propertyType);
            if (filters.listingType) params.set('listingType', filters.listingType);
            if (filters.district) params.set('district', filters.district);
            if (filters.minPrice) params.set('minPrice', filters.minPrice);
            if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
            if (filters.bedrooms) params.set('bedrooms', filters.bedrooms);
            if (filters.sortBy) params.set('sortBy', filters.sortBy);
            if (filters.search) params.set('search', filters.search);

            const response = await fetch(`/api/properties?${params}`);
            const data = await response.json();

            if (response.ok) {
                setProperties(data.properties);
                setPagination(prev => ({ ...prev, ...data.pagination }));
            }
        } catch (error) {
            console.error('Failed to fetch properties:', error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, filters]);

    // Read URL parameters on mount and populate filters
    useEffect(() => {
        const urlPropertyType = searchParams.get('propertyType') || '';
        const urlListingType = searchParams.get('listingType') || '';
        const urlDistrict = searchParams.get('district') || '';
        const urlMinPrice = searchParams.get('minPrice') || '';
        const urlMaxPrice = searchParams.get('maxPrice') || '';
        const urlBedrooms = searchParams.get('bedrooms') || '';
        const urlSortBy = searchParams.get('sortBy') || 'date_desc';
        const urlSearch = searchParams.get('search') || '';

        setFilters({
            propertyType: urlPropertyType,
            listingType: urlListingType,
            district: urlDistrict,
            minPrice: urlMinPrice,
            maxPrice: urlMaxPrice,
            bedrooms: urlBedrooms,
            sortBy: urlSortBy,
            search: urlSearch,
        });
    }, [searchParams]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    // Fetch available districts on component mount
    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const response = await fetch('/api/properties/districts');
                const data = await response.json();
                if (response.ok) {
                    setAvailableDistricts(data.districts);
                }
            } catch (error) {
                console.error('Failed to fetch districts:', error);
                // Fallback to all districts if API fails
                setAvailableDistricts(NEPAL_DISTRICTS);
            }
        };
        fetchDistricts();
    }, []);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const clearFilters = () => {
        setFilters({
            propertyType: '',
            listingType: '',
            district: '',
            minPrice: '',
            maxPrice: '',
            bedrooms: '',
            sortBy: 'date_desc',
            search: '',
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const formatPrice = (price: number, listingType: ListingType) => {
        const suffix = listingType === ListingType.RENT ? '/mo' : '';
        if (price >= 10000000) return `Rs. ${(price / 10000000).toFixed(2)} Cr${suffix}`;
        if (price >= 100000) return `Rs. ${(price / 100000).toFixed(2)} Lakh${suffix}`;
        return `Rs. ${price.toLocaleString()}${suffix}`;
    };

    const getListingBadgeColor = (type: ListingType) => {
        switch (type) {
            case ListingType.SALE: return 'bg-emerald-500';
            case ListingType.RENT: return 'bg-sky-500';
            case ListingType.LEASE: return 'bg-orange-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#9ac842] to-[#36c2d9] py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                        Find Your Dream Property
                    </h1>
                    <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                        Explore our extensive collection of properties across Nepal
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                placeholder="Search by name, location..."
                                className="flex-1 px-6 py-4 rounded-xl border-0 outline-none text-gray-900"
                            />
                            <button
                                onClick={() => fetchProperties()}
                                className="px-6 py-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Filter Toggle (Mobile) */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="w-full py-3 px-4 bg-white rounded-xl shadow-sm flex items-center justify-between"
                    >
                        <span className="font-medium text-gray-700">Filters</span>
                        <svg className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Filters Sidebar */}
                    <div className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">Filters</h3>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-[#9ac842] hover:underline"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Property Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Property Type
                                </label>
                                <select
                                    value={filters.propertyType}
                                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                                >
                                    <option value="">All Types</option>
                                    {Object.values(PropertyType).map(type => (
                                        <option key={type} value={type}>{PROPERTY_TYPE_LABELS[type]}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Listing Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Listing Type
                                </label>
                                <select
                                    value={filters.listingType}
                                    onChange={(e) => handleFilterChange('listingType', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                                >
                                    <option value="">All Listings</option>
                                    {Object.values(ListingType).map(type => (
                                        <option key={type} value={type}>{LISTING_TYPE_LABELS[type]}</option>
                                    ))}
                                </select>
                            </div>

                            {/* District */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    District
                                </label>
                                <select
                                    value={filters.district}
                                    onChange={(e) => handleFilterChange('district', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                                >
                                    <option value="">All Districts</option>
                                    {availableDistricts.map(district => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price Range (NPR)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none text-sm"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none text-sm"
                                    />
                                </div>
                            </div>

                            {/* Bedrooms */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bedrooms
                                </label>
                                <select
                                    value={filters.bedrooms}
                                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                                >
                                    <option value="">Any</option>
                                    <option value="1">1+</option>
                                    <option value="2">2+</option>
                                    <option value="3">3+</option>
                                    <option value="4">4+</option>
                                    <option value="5">5+</option>
                                </select>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                                >
                                    <option value="date_desc">Newest First</option>
                                    <option value="date_asc">Oldest First</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Properties Grid */}
                    <div className="flex-1">
                        {/* Results Info */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                Showing <span className="font-semibold">{properties.length}</span> of{' '}
                                <span className="font-semibold">{pagination.total}</span> properties
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9ac842]"></div>
                            </div>
                        ) : properties.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
                                <p className="text-gray-600 mb-4">Try adjusting your filters to find more results</p>
                                <button
                                    onClick={clearFilters}
                                    className="text-[#9ac842] hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {properties.map((property) => (
                                        <Link
                                            key={property._id}
                                            href={`/properties/${property.slug}`}
                                            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
                                        >
                                            {/* Image */}
                                            <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                                                {property.images[0] ? (
                                                    <Image
                                                        src={property.images[0].url}
                                                        alt={property.name}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                {/* Listing Badge */}
                                                <div className={`absolute top-3 left-3 px-3 py-1 ${getListingBadgeColor(property.listingType)} text-white text-xs font-semibold rounded-full`}>
                                                    {LISTING_TYPE_LABELS[property.listingType]}
                                                </div>
                                                {property.isFeatured && (
                                                    <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                                                        Featured
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-4">
                                                <p className="text-xs text-gray-500 mb-1">{property.propertyId}</p>
                                                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                                                    {property.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {property.location.district}
                                                </p>

                                                {/* Features */}
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                    {property.bedrooms !== undefined && (
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                            </svg>
                                                            {property.bedrooms} Beds
                                                        </span>
                                                    )}
                                                    {property.bathrooms !== undefined && (
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                                            </svg>
                                                            {property.bathrooms} Baths
                                                        </span>
                                                    )}
                                                    {property.area && (
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                                            </svg>
                                                            {property.area} {property.areaUnit}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Price */}
                                                <div className="flex items-center justify-between">
                                                    <p className="text-lg font-bold bg-gradient-to-r from-[#9ac842] to-[#36c2d9] bg-clip-text text-transparent">
                                                        {formatPrice(property.price, property.listingType)}
                                                    </p>
                                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                                        {PROPERTY_TYPE_LABELS[property.propertyType]}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.pages > 1 && (
                                    <div className="mt-8 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                            disabled={pagination.page === 1}
                                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Previous
                                        </button>
                                        <span className="px-4 py-2 text-gray-600">
                                            Page {pagination.page} of {pagination.pages}
                                        </span>
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                            disabled={pagination.page === pagination.pages}
                                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}



