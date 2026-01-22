'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    PropertyData,
    PropertyType,
    PropertyStatus,
    ListingType,
    PROPERTY_TYPE_LABELS,
    PROPERTY_STATUS_LABELS,
    LISTING_TYPE_LABELS,
    NEPAL_DISTRICTS,
} from '@/lib/types/property';

interface PropertyFormProps {
    property?: PropertyData;
    isEditing?: boolean;
}

interface FormData {
    name: string;
    description: string;
    propertyType: PropertyType;
    status: PropertyStatus;
    listingType: ListingType;
    price: string;
    area: string;
    bedrooms: string;
    bathrooms: string;
    features: string;
    videoUrl: string;
    address: string;
    district: string;
    city: string;
    lat: string;
    lng: string;
    isFeatured: boolean;
}

interface ImagePreview {
    file?: File;
    url: string;
    publicId?: string;
    isExisting: boolean;
}

export default function PropertyForm({ property, isEditing = false }: PropertyFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<FormData>({
        name: property?.name || '',
        description: property?.description || '',
        propertyType: property?.propertyType || PropertyType.HOUSE,
        status: property?.status || PropertyStatus.AVAILABLE,
        listingType: property?.listingType || ListingType.SALE,
        price: property?.price?.toString() || '',
        area: property?.area?.toString() || '',
        bedrooms: property?.bedrooms?.toString() || '',
        bathrooms: property?.bathrooms?.toString() || '',
        features: property?.features?.join(', ') || '',
        videoUrl: property?.videoUrl || '',
        address: property?.location?.address || '',
        district: property?.location?.district || '',
        city: property?.location?.city || '',
        lat: property?.location?.coordinates?.lat?.toString() || '',
        lng: property?.location?.coordinates?.lng?.toString() || '',
        isFeatured: property?.isFeatured || false,
    });

    const [images, setImages] = useState<ImagePreview[]>(
        property?.images?.map((img) => ({
            url: img.url,
            publicId: img.publicId,
            isExisting: true,
        })) || []
    );

    const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: ImagePreview[] = [];
        Array.from(files).forEach((file) => {
            if (file.type.startsWith('image/')) {
                const url = URL.createObjectURL(file);
                newImages.push({ file, url, isExisting: false });
            }
        });

        setImages((prev) => [...prev, ...newImages]);
    };

    const handleRemoveImage = (index: number) => {
        const image = images[index];
        if (image.isExisting && image.publicId) {
            setImagesToRemove((prev) => [...prev, image.publicId!]);
        }
        if (image.url && !image.isExisting) {
            URL.revokeObjectURL(image.url);
        }
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Convert new images to base64
            const newImageFiles = images.filter((img) => !img.isExisting && img.file);
            const base64Images = await Promise.all(
                newImageFiles.map((img) => convertToBase64(img.file!))
            );

            const payload = {
                name: formData.name,
                description: formData.description,
                propertyType: formData.propertyType,
                status: formData.status,
                listingType: formData.listingType,
                price: parseInt(formData.price),
                area: formData.area ? parseInt(formData.area) : undefined,
                bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
                bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
                features: formData.features
                    ? formData.features.split(',').map((f) => f.trim()).filter(Boolean)
                    : [],
                videoUrl: formData.videoUrl || undefined,
                location: {
                    address: formData.address,
                    district: formData.district,
                    city: formData.city || undefined,
                    coordinates: formData.lat && formData.lng
                        ? { lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) }
                        : undefined,
                },
                isFeatured: formData.isFeatured,
                ...(isEditing
                    ? {
                          newImages: base64Images,
                          removeImages: imagesToRemove,
                      }
                    : {
                          images: base64Images,
                      }),
            };

            const url = isEditing ? `/api/properties/${property?._id}` : '/api/properties';
            const method = isEditing ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                router.push('/admin/properties');
                router.refresh();
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (err) {
            console.error('Submit error:', err);
            setError('Failed to save property');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    {error}
                </div>
            )}

            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Property Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                            placeholder="Beautiful 3BHK Apartment"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Property Type *
                        </label>
                        <select
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                        >
                            {Object.values(PropertyType).map((type) => (
                                <option key={type} value={type}>
                                    {PROPERTY_TYPE_LABELS[type]}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Listing Type *
                        </label>
                        <select
                            name="listingType"
                            value={formData.listingType}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                        >
                            {Object.values(ListingType).map((type) => (
                                <option key={type} value={type}>
                                    {LISTING_TYPE_LABELS[type]}
                                </option>
                            ))}
                        </select>
                    </div>
                    {isEditing && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                            >
                                {Object.values(PropertyStatus).map((status) => (
                                    <option key={status} value={status}>
                                        {PROPERTY_STATUS_LABELS[status]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (NPR) *
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                            placeholder="5000000"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none resize-none"
                            placeholder="Describe the property in detail..."
                        />
                    </div>
                </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Area (sq.ft)
                        </label>
                        <input
                            type="number"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                            placeholder="1500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bedrooms
                        </label>
                        <input
                            type="number"
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                            placeholder="3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Bathrooms
                        </label>
                        <input
                            type="number"
                            name="bathrooms"
                            value={formData.bathrooms}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                            placeholder="2"
                        />
                    </div>
                    <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleChange}
                                className="w-5 h-5 text-[#9ac842] border-gray-300 rounded focus:ring-[#9ac842]"
                            />
                            <span className="text-sm font-medium text-gray-700">Featured</span>
                        </label>
                    </div>
                    <div className="sm:col-span-2 md:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Features (comma separated)
                        </label>
                        <input
                            type="text"
                            name="features"
                            value={formData.features}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                            placeholder="Parking, Garden, Swimming Pool, Gym"
                        />
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address *
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                            placeholder="Street address, ward, area"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            District *
                        </label>
                        <select
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                        >
                            <option value="">Select District</option>
                            {NEPAL_DISTRICTS.map((district) => (
                                <option key={district} value={district}>
                                    {district}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                            placeholder="City name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Latitude
                        </label>
                        <input
                            type="text"
                            name="lat"
                            value={formData.lat}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                            placeholder="27.7172"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Longitude
                        </label>
                        <input
                            type="text"
                            name="lng"
                            value={formData.lng}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                            placeholder="85.3240"
                        />
                    </div>
                </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
                <div className="space-y-4">
                    {/* Image Preview Grid */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                        <Image
                                            src={image.url}
                                            alt={`Property image ${index + 1}`}
                                            width={200}
                                            height={150}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    {index === 0 && (
                                        <span className="absolute bottom-2 left-2 px-2 py-1 bg-[#9ac842] text-white text-xs rounded">
                                            Primary
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Upload Button */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#9ac842] transition-colors"
                    >
                        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-600 mb-1">Click to upload images</p>
                        <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Property Video */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Video</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Video URL (YouTube, Vimeo, etc.)
                        </label>
                        <input
                            type="url"
                            name="videoUrl"
                            value={formData.videoUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9ac842] focus:border-transparent outline-none"
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                        <p className="mt-2 text-sm text-gray-500">
                            Add a YouTube or Vimeo video URL to showcase your property. The video will appear in the property gallery.
                        </p>
                    </div>
                    {formData.videoUrl && (
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Video Preview:</p>
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                {formData.videoUrl.includes('youtube.com') || formData.videoUrl.includes('youtu.be') ? (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${
                                            formData.videoUrl.includes('youtube.com')
                                                ? new URL(formData.videoUrl).searchParams.get('v')
                                                : formData.videoUrl.split('youtu.be/')[1]?.split('?')[0]
                                        }`}
                                        title="Property Video Preview"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                ) : formData.videoUrl.includes('vimeo.com') ? (
                                    <iframe
                                        src={`https://player.vimeo.com/video/${formData.videoUrl.split('vimeo.com/')[1]?.split('?')[0]}`}
                                        title="Property Video Preview"
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        <p>Video preview not available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-[#9ac842] to-[#36c2d9] text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {isEditing ? 'Update Property' : 'Create Property'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}











