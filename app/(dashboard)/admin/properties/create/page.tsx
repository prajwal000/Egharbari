'use client';

import Link from 'next/link';
import PropertyForm from '@/app/components/admin/PropertyForm';

export default function CreatePropertyPage() {
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
                    <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
                    <p className="text-gray-600">Create a new property listing</p>
                </div>
            </div>

            {/* Form */}
            <PropertyForm />
        </div>
    );
}



