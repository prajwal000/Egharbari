import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    );
}

/**
 * Global type declaration for mongoose cache
 */
declare global {
    // eslint-disable-next-line no-var
    var mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

/**
 * Cached connection to MongoDB
 * This prevents connection accumulation during hot reloads in development
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB database
 * Uses connection caching to prevent multiple connections
 */
async function dbConnect(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            console.log('✅ MongoDB connected successfully');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error('❌ MongoDB connection error:', e);
        throw e;
    }

    return cached.conn;
}

export default dbConnect;

