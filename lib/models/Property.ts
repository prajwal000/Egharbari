import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Property type enum
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
 * Location interface
 */
export interface ILocation {
    address: string;
    district: string;
    city?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

/**
 * Property image interface
 */
export interface IPropertyImage {
    url: string;
    publicId: string;
    isPrimary: boolean;
}

/**
 * Property interface
 */
export interface IProperty extends Document {
    _id: mongoose.Types.ObjectId;
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
    images: IPropertyImage[];
    videoUrl?: string;
    location: ILocation;
    owner?: mongoose.Types.ObjectId;
    isFeatured: boolean;
    isActive: boolean;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Property image schema
 */
const PropertyImageSchema = new Schema<IPropertyImage>(
    {
        url: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
        isPrimary: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false }
);

/**
 * Location schema
 */
const LocationSchema = new Schema<ILocation>(
    {
        address: {
            type: String,
            required: [true, 'Address is required'],
            trim: true,
        },
        district: {
            type: String,
            required: [true, 'District is required'],
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number },
        },
    },
    { _id: false }
);

/**
 * Property schema
 */
const PropertySchema: Schema<IProperty> = new Schema(
    {
        propertyId: {
            type: String,
            unique: true,
        },
        slug: {
            type: String,
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Property name is required'],
            trim: true,
            minlength: [3, 'Name must be at least 3 characters'],
            maxlength: [200, 'Name cannot exceed 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            minlength: [20, 'Description must be at least 20 characters'],
            maxlength: [5000, 'Description cannot exceed 5000 characters'],
        },
        propertyType: {
            type: String,
            enum: Object.values(PropertyType),
            required: [true, 'Property type is required'],
        },
        status: {
            type: String,
            enum: Object.values(PropertyStatus),
            default: PropertyStatus.AVAILABLE,
        },
        listingType: {
            type: String,
            enum: Object.values(ListingType),
            required: [true, 'Listing type is required'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        priceUnit: {
            type: String,
            default: 'NPR',
        },
        area: {
            type: Number,
            min: [0, 'Area cannot be negative'],
        },
        areaUnit: {
            type: String,
            default: 'sq.ft',
        },
        bedrooms: {
            type: Number,
            min: [0, 'Bedrooms cannot be negative'],
        },
        bathrooms: {
            type: Number,
            min: [0, 'Bathrooms cannot be negative'],
        },
        features: [{
            type: String,
            trim: true,
        }],
        images: [PropertyImageSchema],
        videoUrl: {
            type: String,
            trim: true,
        },
        location: {
            type: LocationSchema,
            required: true,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        views: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Helper function to generate slug from name
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

// Generate unique property ID and slug before saving
PropertySchema.pre('save', async function (next) {
    // Generate property ID if not exists
    if (!this.propertyId) {
        const count = await mongoose.models.Property.countDocuments();
        const prefix = this.propertyType.substring(0, 3).toUpperCase();
        this.propertyId = `EGB-${prefix}-${String(count + 1).padStart(5, '0')}`;
    }
    
    // Generate slug if not exists or name changed
    if (!this.slug || this.isModified('name')) {
        let baseSlug = generateSlug(this.name);
        let slug = baseSlug;
        let counter = 1;
        
        // Check for uniqueness and add counter if needed
        while (await mongoose.models.Property.findOne({ slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        
        this.slug = slug;
    }
    
    next();
});

// Indexes for faster queries (propertyId and slug already have unique indexes)
PropertySchema.index({ propertyType: 1 });
PropertySchema.index({ status: 1 });
PropertySchema.index({ listingType: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ 'location.district': 1 });
PropertySchema.index({ createdAt: -1 });
PropertySchema.index({ isFeatured: 1, isActive: 1 });

const Property: Model<IProperty> =
    mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);

export default Property;



