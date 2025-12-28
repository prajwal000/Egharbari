'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PropertyData, PropertyStatus, PropertyType, ListingType, PROPERTY_TYPE_LABELS, PROPERTY_STATUS_LABELS, LISTING_TYPE_LABELS } from '@/lib/types/property';

export default function AdminPropertiesPage() {
    const [properties, setProperties] = useState<PropertyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ propertyType: '', status: '', listingType: '' });
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchProperties = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            params.set('page', pagination.page.toString());
            params.set('limit', '10');
            if (filter.propertyType) params.set('propertyType', filter.propertyType);
            if (filter.status) params.set('status', filter.status);
            if (filter.listingType) params.set('listingType', filter.listingType);

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
    }, [pagination.page, filter]);

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this property?')) return;

        setDeleting(id);
        try {
            const response = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchProperties();
            }
        } catch (error) {
            console.error('Failed to delete property:', error);
        } finally {
            setDeleting(null);
        }
    };

    const handleStatusChange = async (id: string, status: PropertyStatus) => {
        try {
            const response = await fetch(`/api/properties/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (response.ok) {
                fetchProperties();
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const getStatusColor = (status: PropertyStatus) => {
        switch (status) {
            case PropertyStatus.AVAILABLE: return 'bg-green-100 text-green-700';
            case PropertyStatus.SOLD: return 'bg-red-100 text-red-700';
            case PropertyStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
            case PropertyStatus.RENTED: return 'bg-blue-100 text-blue-700';
            case PropertyStatus.UNDER_CONTRACT: return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getListingColor = (type: ListingType) => {
        switch (type) {
            case ListingType.SALE: return 'bg-emerald-100 text-emerald-700';
            case ListingType.RENT: return 'bg-sky-100 text-sky-700';
            case ListingType.LEASE: return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const formatPrice = (price: number) => {
        if (price >= 10000000) return `Rs. ${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `Rs. ${(price / 100000).toFixed(2)} Lakh`;
        return `Rs. ${price.toLocaleString()}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9ac842]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
                    <p className="text-gray-600">Manage all property listings</p>
                </div>
                <Link
                    href="/admin/properties/create"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9ac842] to-[#36c2d9] text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Property
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex flex-wrap gap-4">
                    <select
                        value={filter.propertyType}
                        onChange={(e) => {
                            setFilter(prev => ({ ...prev, propertyType: e.target.value }));
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                    >
                        <option value="">All Types</option>
                        {Object.values(PropertyType).map(type => (
                            <option key={type} value={type}>{PROPERTY_TYPE_LABELS[type]}</option>
                        ))}
                    </select>
                    <select
                        value={filter.status}
                        onChange={(e) => {
                            setFilter(prev => ({ ...prev, status: e.target.value }));
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                    >
                        <option value="">All Status</option>
                        {Object.values(PropertyStatus).map(status => (
                            <option key={status} value={status}>{PROPERTY_STATUS_LABELS[status]}</option>
                        ))}
                    </select>
                    <select
                        value={filter.listingType}
                        onChange={(e) => {
                            setFilter(prev => ({ ...prev, listingType: e.target.value }));
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                    >
                        <option value="">All Listings</option>
                        {Object.values(ListingType).map(type => (
                            <option key={type} value={type}>{LISTING_TYPE_LABELS[type]}</option>
                        ))}
                    </select>
                    <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">{pagination.total}</span> properties
                    </div>
                </div>
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Property</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Listing</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Views</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {properties.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <p>No properties found</p>
                                        <Link href="/admin/properties/create" className="text-[#9ac842] hover:underline mt-2 inline-block">
                                            Add your first property
                                        </Link>
                                    </td>
                                </tr>
                            ) : (
                                properties.map((property) => (
                                    <tr key={property._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                    {property.images[0] ? (
                                                        <Image
                                                            src={property.images[0].url}
                                                            alt={property.name}
                                                            width={64}
                                                            height={48}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-900 truncate max-w-[200px]">{property.name}</p>
                                                    <p className="text-xs text-gray-500">{property.propertyId}</p>
                                                    <p className="text-xs text-gray-500 truncate">{property.location.district}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                {PROPERTY_TYPE_LABELS[property.propertyType]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-semibold text-gray-900">{formatPrice(property.price)}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={property.status}
                                                onChange={(e) => handleStatusChange(property._id, e.target.value as PropertyStatus)}
                                                className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(property.status)}`}
                                            >
                                                {Object.values(PropertyStatus).map(status => (
                                                    <option key={status} value={status}>{PROPERTY_STATUS_LABELS[status]}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getListingColor(property.listingType)}`}>
                                                {LISTING_TYPE_LABELS[property.listingType]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {property.views}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/properties/${property._id}`}
                                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="View"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </Link>
                                                <Link
                                                    href={`/admin/properties/${property._id}/edit`}
                                                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(property._id)}
                                                    disabled={deleting === property._id}
                                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    {deleting === property._id ? (
                                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page === 1}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {pagination.page} of {pagination.pages}
                        </span>
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page === pagination.pages}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}



