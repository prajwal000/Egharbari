/**
 * Script to generate slugs for all existing properties
 * Run this with: npx ts-node --project tsconfig.json scripts/generate-property-slugs.ts
 */

import mongoose from 'mongoose';
import Property from '../lib/models/Property';
import dbConnect from '../lib/db';

async function generatePropertySlugs() {
    try {
        console.log('🔌 Connecting to database...');
        await dbConnect();
        
        console.log('📋 Fetching properties without slugs...');
        const properties = await Property.find({
            $or: [
                { slug: { $exists: false } },
                { slug: null },
                { slug: '' }
            ]
        });
        
        console.log(`✅ Found ${properties.length} properties without slugs`);
        
        if (properties.length === 0) {
            console.log('🎉 All properties already have slugs!');
            process.exit(0);
        }
        
        console.log('🔄 Generating slugs...');
        
        for (const property of properties) {
            // Trigger the pre-save hook which will generate the slug
            await property.save();
            console.log(`✓ Generated slug for: ${property.name} → ${property.slug}`);
        }
        
        console.log(`\n🎉 Successfully generated slugs for ${properties.length} properties!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error generating slugs:', error);
        process.exit(1);
    }
}

// Run the script
generatePropertySlugs();

