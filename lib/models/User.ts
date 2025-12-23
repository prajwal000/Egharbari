import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '@/lib/types/user';

// Re-export UserRole for convenience
export { UserRole };

/**
 * User interface for TypeScript
 */
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: UserRole;
    isActive: boolean;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User schema definition
 */
const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please enter a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false, // Don't return password by default
        },
        phone: {
            type: String,
            trim: true,
            match: [/^(\+977)?[0-9]{10}$/, 'Please enter a valid Nepal phone number'],
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        avatar: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                delete ret.password;
                delete ret.__v;
                return ret;
            },
        },
    }
);

/**
 * Index for faster queries
 * Note: email index is auto-created by unique: true
 */
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

/**
 * Hash password before saving
 */
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compare password method
 */
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Prevent model recompilation in development
 */
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

