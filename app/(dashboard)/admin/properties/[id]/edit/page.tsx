'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import PropertyForm from '@/app/components/admin/PropertyForm';
import { PropertyData } from '@/lib/types/property';

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [property, setProperty] = useState<PropertyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await fetch(`/api/properties/${id}`);
                const data = await response.json();

                if (response.ok) {
                    setProperty(data.property);
                } else {
                    setError(data.error || 'Failed to load property');
                }
            } catch {
                setError('Failed to load property');
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9ac842]"></div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Not Found</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <Link
                    href="/admin/properties"
                    className="text-[#9ac842] hover:underline"
                >
                    Back to Properties
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/properties"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
                    <p className="text-gray-600">{property.propertyId} - {property.name}</p>
                </div>
            </div>

            {/* Form */}
            <PropertyForm property={property} isEditing />
        </div>
    );
}












