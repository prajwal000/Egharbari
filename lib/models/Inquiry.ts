import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Inquiry status enum
 */
export enum InquiryStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    RESOLVED = 'resolved',
    CLOSED = 'closed',
}

/**
 * Inquiry type enum
 */
export enum InquiryType {
    GENERAL = 'general',
    PROPERTY = 'property',
    SUPPORT = 'support',
    FEEDBACK = 'feedback',
}

/**
 * Reply interface
 */
export interface IReply {
    _id?: mongoose.Types.ObjectId;
    message: string;
    isAdmin: boolean;
    createdAt: Date;
}

/**
 * Inquiry interface
 */
export interface IInquiry extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    type: InquiryType;
    status: InquiryStatus;
    propertyId?: mongoose.Types.ObjectId;
    userId?: mongoose.Types.ObjectId;
    replies: IReply[];
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Reply schema
 */
const ReplySchema = new Schema<IReply>(
    {
        message: {
            type: String,
            required: [true, 'Reply message is required'],
            trim: true,
            maxlength: [2000, 'Reply cannot exceed 2000 characters'],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: true }
);

/**
 * Inquiry schema
 */
const InquirySchema: Schema<IInquiry> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please enter a valid email',
            ],
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            trim: true,
            minlength: [5, 'Subject must be at least 5 characters'],
            maxlength: [200, 'Subject cannot exceed 200 characters'],
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true,
            minlength: [10, 'Message must be at least 10 characters'],
            maxlength: [5000, 'Message cannot exceed 5000 characters'],
        },
        type: {
            type: String,
            enum: Object.values(InquiryType),
            default: InquiryType.GENERAL,
        },
        status: {
            type: String,
            enum: Object.values(InquiryStatus),
            default: InquiryStatus.PENDING,
        },
        propertyId: {
            type: Schema.Types.ObjectId,
            ref: 'Property',
            default: null,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        replies: [ReplySchema],
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
InquirySchema.index({ email: 1 });
InquirySchema.index({ userId: 1 });
InquirySchema.index({ status: 1 });
InquirySchema.index({ type: 1 });
InquirySchema.index({ createdAt: -1 });
InquirySchema.index({ isRead: 1 });

const Inquiry: Model<IInquiry> =
    mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);

export default Inquiry;

