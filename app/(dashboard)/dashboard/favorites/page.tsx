'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { PropertyData, PropertyType, ListingType, PROPERTY_TYPE_LABELS, LISTING_TYPE_LABELS } from '@/lib/types/property';
import { FavoriteData } from '@/lib/types/favorite';

export default function FavoritesPage() {
    const { data: session } = useSession();
    const [favorites, setFavorites] = useState<FavoriteData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/favorites');
            const data = await response.json();

            if (response.ok) {
                setFavorites(data.favorites);
            }
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (propertyId: string) => {
        try {
            const response = await fetch(`/api/favorites?propertyId=${propertyId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setFavorites(favorites.filter(fav => fav.propertyId !== propertyId));
            }
        } catch (error) {
            console.error('Failed to remove favorite:', error);
        }
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
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
                    <p className="text-gray-600">Properties you've saved for later</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9ac842]"></div>
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Favorites Yet</h3>
                        <p className="text-gray-600 mb-4">Start exploring and save properties you love</p>
                        <Link href="/properties" className="text-[#9ac842] hover:underline">
                            Browse Properties
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((favorite) => {
                            const property = favorite.propertyId as unknown as PropertyData;
                            if (!property) return null;

                            return (
                                <div
                                    key={favorite._id}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group relative"
                                >
                                    <Link href={`/properties/${property.slug || property._id}`}>
                                        {/* Image */}
                                        <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                                            {property.images && property.images[0] ? (
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

                                    {/* Remove Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleRemoveFavorite(property._id);
                                        }}
                                        className="absolute top-3 right-3 w-10 h-10 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center transition-all shadow-lg hover:scale-110 text-red-500"
                                        title="Remove from favorites"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

