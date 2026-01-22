/**
 * Property type enum - shared between client and server
 */
export enum PropertyType {
    HOUSE = 'house',
    APARTMENT = 'apartment',
    LAND = 'land',
    COMMERCIAL = 'commercial',
    VILLA = 'villa',
}

/**
 * Property status enum
 */
export enum PropertyStatus {
    AVAILABLE = 'available',
    SOLD = 'sold',
    PENDING = 'pending',
    RENTED = 'rented',
    UNDER_CONTRACT = 'under_contract',
}

/**
 * Listing type enum
 */
export enum ListingType {
    SALE = 'sale',
    RENT = 'rent',
    LEASE = 'lease',
}

/**
 * Location interface for client-side
 */
export interface LocationData {
    address: string;
    district: string;
    city?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

/**
 * Property image interface for client-side
 */
export interface PropertyImageData {
    url: string;
    publicId: string;
    isPrimary: boolean;
}

/**
 * Property interface for client-side
 */
export interface PropertyData {
    _id: string;
    propertyId: string;
    slug: string;
    name: string;
    description: string;
    propertyType: PropertyType;
    status: PropertyStatus;
    listingType: ListingType;
    price: number;
    priceUnit?: string;
    area?: number;
    areaUnit?: string;
    bedrooms?: number;
    bathrooms?: number;
    features?: string[];
    images: PropertyImageData[];
    videoUrl?: string;
    location: LocationData;
    owner?: string;
    isFeatured: boolean;
    isActive: boolean;
    views: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * Property filter options
 */
export interface PropertyFilters {
    propertyType?: PropertyType;
    status?: PropertyStatus;
    listingType?: ListingType;
    minPrice?: number;
    maxPrice?: number;
    district?: string;
    bedrooms?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc';
}

/**
 * Nepal districts list
 */
export const NEPAL_DISTRICTS = [
    'Achham', 'Arghakhanchi', 'Baglung', 'Baitadi', 'Bajhang', 'Bajura', 'Banke', 'Bara',
    'Bardiya', 'Bhaktapur', 'Bhojpur', 'Chitwan', 'Dadeldhura', 'Dailekh', 'Dang', 'Darchula',
    'Dhading', 'Dhankuta', 'Dhanusa', 'Dolakha', 'Dolpa', 'Doti', 'Gorkha', 'Gulmi',
    'Humla', 'Ilam', 'Jajarkot', 'Jhapa', 'Jumla', 'Kailali', 'Kalikot', 'Kanchanpur',
    'Kapilvastu', 'Kaski', 'Kathmandu', 'Kavrepalanchok', 'Khotang', 'Lalitpur', 'Lamjung', 'Mahottari',
    'Makwanpur', 'Manang', 'Morang', 'Mugu', 'Mustang', 'Myagdi', 'Nawalparasi', 'Nuwakot',
    'Okhaldhunga', 'Palpa', 'Panchthar', 'Parbat', 'Parsa', 'Pyuthan', 'Ramechhap', 'Rasuwa',
    'Rautahat', 'Rolpa', 'Rukum', 'Rupandehi', 'Salyan', 'Sankhuwasabha', 'Saptari', 'Sarlahi',
    'Sindhuli', 'Sindhupalchok', 'Siraha', 'Solukhumbu', 'Sunsari', 'Surkhet', 'Syangja', 'Tanahun',
    'Taplejung', 'Terhathum', 'Udayapur'
];

/**
 * Property type labels
 */
export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
    [PropertyType.HOUSE]: 'House',
    [PropertyType.APARTMENT]: 'Apartment',
    [PropertyType.LAND]: 'Land',
    [PropertyType.COMMERCIAL]: 'Commercial',
    [PropertyType.VILLA]: 'Villa',
};

/**
 * Property status labels
 */
export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
    [PropertyStatus.AVAILABLE]: 'Available',
    [PropertyStatus.SOLD]: 'Sold',
    [PropertyStatus.PENDING]: 'Pending',
    [PropertyStatus.RENTED]: 'Rented',
    [PropertyStatus.UNDER_CONTRACT]: 'Under Contract',
};

/**
 * Listing type labels
 */
export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
    [ListingType.SALE]: 'For Sale',
    [ListingType.RENT]: 'For Rent',
    [ListingType.LEASE]: 'For Lease',
};



