import mongoose, { Document, Schema } from 'mongoose';

/**
 * Favorite interface
 */
export interface IFavorite extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    propertyId: mongoose.Types.ObjectId;
    createdAt: Date;
}

/**
 * Favorite schema
 */
const FavoriteSchema: Schema<IFavorite> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        propertyId: {
            type: Schema.Types.ObjectId,
            ref: 'Property',
            required: [true, 'Property ID is required'],
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure a user can favorite a property only once
FavoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

// Index for faster queries
FavoriteSchema.index({ userId: 1, createdAt: -1 });

const Favorite = mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);

export default Favorite;

