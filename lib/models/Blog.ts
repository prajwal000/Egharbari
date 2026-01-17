import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Blog interface
 */
export interface IBlog extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    author: mongoose.Types.ObjectId;
    category: string;
    tags: string[];
    isPublished: boolean;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Blog schema
 */
const BlogSchema: Schema<IBlog> = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [5, 'Title must be at least 5 characters'],
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        slug: {
            type: String,
            unique: true,
            index: true,
        },
        excerpt: {
            type: String,
            required: [true, 'Excerpt is required'],
            trim: true,
            maxlength: [500, 'Excerpt cannot exceed 500 characters'],
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        featuredImage: {
            type: String,
            default: null,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['Real Estate News', 'Property Tips', 'Market Trends', 'Legal Guide', 'Investment', 'Home Improvement'],
            default: 'Real Estate News',
        },
        tags: {
            type: [String],
            default: [],
        },
        isPublished: {
            type: Boolean,
            default: false,
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

// Generate unique slug before saving
BlogSchema.pre('save', async function (next) {
    if (this.isModified('title') || this.isNew) {
        const baseSlug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');

        let uniqueSlug = baseSlug;
        let counter = 1;
        
        while (true) {
            const existingBlog = await mongoose.models.Blog.findOne({ slug: uniqueSlug });
            if (!existingBlog || existingBlog._id.equals(this._id)) {
                break;
            }
            uniqueSlug = `${baseSlug}-${counter++}`;
        }
        
        this.slug = uniqueSlug;
    }
    next();
});

// Indexes for faster queries
BlogSchema.index({ title: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ isPublished: 1 });
BlogSchema.index({ createdAt: -1 });

const Blog: Model<IBlog> =
    mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;








