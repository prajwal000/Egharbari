/**
 * Admin Seed Script
 * Run with: npx ts-node --project tsconfig.json scripts/seed-admin.ts
 * Or add to package.json scripts
 */

import mongoose from 'mongoose';
import User, { UserRole } from '../lib/models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/egharbari';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@egharbari.com.np';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123456';
const ADMIN_NAME = 'Admin User';

async function seedAdmin() {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

        if (existingAdmin) {
            console.log('⚠️ Admin user already exists:', ADMIN_EMAIL);
            console.log('   Role:', existingAdmin.role);
            console.log('   Created:', existingAdmin.createdAt);
        } else {
            // Create admin user
            const admin = await User.create({
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                role: UserRole.ADMIN,
                isActive: true,
            });

            console.log('✅ Admin user created successfully!');
            console.log('   Email:', admin.email);
            console.log('   Name:', admin.name);
            console.log('   Role:', admin.role);
        }

        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

seedAdmin();









