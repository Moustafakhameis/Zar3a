import 'dotenv/config';
import sequelize from './src/config/database.js';
import { Product } from './src/models/index.js';

/**
 * Seed script to add PREMIUM BOOST to select Crop Market and Agri Shop products
 * These products will appear at the top of their respective marketplaces
 */

const seedPremiumBoost = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database.');


    // ═══════════════════════════════════════════════════════════════════════════
    // CROP MARKET PREMIUM BOOST
    // ═══════════════════════════════════════════════════════════════════════════
    // Select top produce and premium crop market items
    const cropMarketProductIds = [
      19, // Egyptian Lemon (Hamad)
      20, // Egyptian Lemon – Wholesale Tonne
      25, // Egyptian Mango (Alphonso)
      26, // Mango – Wholesale Tonne
      29, // Fresh Strawberry (Festival)
      36, // Egyptian Grapes (Red Globe)
    ];

    console.log('\n📌 Boosting CROP MARKET products...');
    for (const productId of cropMarketProductIds) {
      const product = await Product.findByPk(productId);
      if (product && product.marketplaceType === 'CROP_MARKET') {
        await product.update({
          isBoosted: true,
          boostLevel: 500,
          boostExpiryDate: null, // Permanent boost (null means no expiry)
        });
        console.log(`  ✨ BOOSTED: "${product.title}" (ID: ${productId})`);
      }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // AGRI SHOP (AGRI_MARKET) PREMIUM BOOST
    // ═══════════════════════════════════════════════════════════════════════════
    // Select premium fertilizers, tools, and seeds
    const agriShopProductIds = [
      38, // NPK 20-20-20 Compound Fertilizer
      42, // Potassium Sulfate (SOP)
      51, // Drip Irrigation Starter Kit
      48, // Forged Steel Hoe
      53, // Hybrid Tomato Seeds
      55, // Hybrid Cucumber Seeds
    ];

    console.log('\n📌 Boosting AGRI SHOP (AGRI_MARKET) products...');
    for (const productId of agriShopProductIds) {
      const product = await Product.findByPk(productId);
      if (product && product.marketplaceType === 'AGRI_MARKET') {
        await product.update({
          isBoosted: true,
          boostLevel: 500,
          boostExpiryDate: null, // Permanent boost
        });
        console.log(`  ✨ BOOSTED: "${product.title}" (ID: ${productId})`);
      }
    }

    console.log('\n✅ Premium Boost seeding completed successfully!');
    console.log(`\n📊 Boosted products will now appear at the top of their respective marketplaces.`);
    console.log(`📅 Boost expiry: Permanent (null expiry date)\n`);
  } catch (err) {
    console.error('❌ Error:', err.message || err);
  } finally {
    process.exit(0);
  }
};

seedPremiumBoost();
