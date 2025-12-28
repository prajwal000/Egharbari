/**
 * Script to generate slugs for existing properties
 * Run with: node scripts/generate-slugs.js
 */

const mongoose = require('mongoose');

async function generateSlugs() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.error('MONGODB_URI not found in environment variables');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Get the Property model
        const Property = mongoose.model('Property');

        // Find all properties
        const properties = await Property.find({});
        console.log(`📊 Found ${properties.length} properties`);

        let updated = 0;
        for (const property of properties) {
            if (!property.slug) {
                // Save will trigger the pre-save hook which generates the slug
                await property.save();
                console.log(`✨ Generated slug: ${property.name} -> ${property.slug}`);
                updated++;
            } else {
                console.log(`⏭️  Skipped (already has slug): ${property.name} -> ${property.slug}`);
            }
        }

        console.log(`\n✅ Done! Generated ${updated} new slugs`);
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

generateSlugs();

