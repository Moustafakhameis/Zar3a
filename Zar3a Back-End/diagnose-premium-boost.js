import 'dotenv/config';
import sequelize from './src/config/database.js';
import { Product } from './src/models/index.js';

/**
 * Diagnostic script to check:
 * 1. Database schema (columns)
 * 2. Sample products with boost status
 * 3. Sorting order verification
 */

async function diagnose() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database.\n');

    // 1. Check table structure
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📋 CHECKING DATABASE SCHEMA');
    console.log('═══════════════════════════════════════════════════════════\n');

    try {
      const result = await sequelize.query(`
        SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'products' AND COLUMN_NAME IN ('isBoosted', 'boostLevel', 'boostExpiryDate')
      `);
      
      if (result[0].length === 0) {
        console.log('❌ MISSING COLUMNS: isBoosted, boostLevel, and/or boostExpiryDate');
        console.log('   Run: node scripts/migrate-zar3a-schema-fixes.js\n');
      } else {
        console.log('✅ Required columns exist:');
        result[0].forEach(col => {
          console.log(`   - ${col.COLUMN_NAME}: ${col.COLUMN_TYPE} (NULL: ${col.IS_NULLABLE})`);
        });
        console.log();
      }
    } catch (e) {
      console.log('⚠️  Could not check columns:', e.message);
    }

    // 2. Check boosted products by marketplace
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 BOOSTED PRODUCTS STATUS');
    console.log('═══════════════════════════════════════════════════════════\n');

    const boostedByCrop = await Product.count({
      where: { marketplaceType: 'CROP_MARKET', isBoosted: true }
    });
    
    const boostedByAgri = await Product.count({
      where: { marketplaceType: 'AGRI_MARKET', isBoosted: true }
    });

    const boostedBySensor = await Product.count({
      where: { marketplaceType: 'SENSOR_MARKET', isBoosted: true }
    });

    console.log(`CROP_MARKET:   ${boostedByCrop} boosted products`);
    console.log(`AGRI_MARKET:   ${boostedByAgri} boosted products`);
    console.log(`SENSOR_MARKET: ${boostedBySensor} boosted products`);
    console.log();

    // 3. Show sample crop market products with their boost status
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🌾 CROP MARKET PRODUCTS (should show boosted first)');
    console.log('═══════════════════════════════════════════════════════════\n');

    const cropProducts = await Product.findAll({
      where: { marketplaceType: 'CROP_MARKET' },
      attributes: ['id', 'title', 'isBoosted', 'boostLevel', 'boostExpiryDate', 'createdAt'],
      limit: 10,
      order: [
        [sequelize.literal('CASE WHEN isBoosted = 1 AND (boostExpiryDate IS NULL OR boostExpiryDate > NOW()) THEN 0 ELSE 1 END'), 'ASC'],
        ['createdAt', 'DESC'],
      ],
      raw: true,
    });

    cropProducts.forEach((product, idx) => {
      const boosted = product.isBoosted ? '⭐ BOOSTED' : '  regular';
      console.log(`${idx + 1}. [${boosted}] ID ${product.id}: "${product.title}"`);
    });
    console.log();

    // 4. Show sample agri shop products
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🛠️  AGRI SHOP PRODUCTS (should show boosted first)');
    console.log('═══════════════════════════════════════════════════════════\n');

    const agriProducts = await Product.findAll({
      where: { marketplaceType: 'AGRI_MARKET' },
      attributes: ['id', 'title', 'isBoosted', 'boostLevel', 'boostExpiryDate', 'createdAt'],
      limit: 10,
      order: [
        [sequelize.literal('CASE WHEN isBoosted = 1 AND (boostExpiryDate IS NULL OR boostExpiryDate > NOW()) THEN 0 ELSE 1 END'), 'ASC'],
        ['createdAt', 'DESC'],
      ],
      raw: true,
    });

    agriProducts.forEach((product, idx) => {
      const boosted = product.isBoosted ? '⭐ BOOSTED' : '  regular';
      console.log(`${idx + 1}. [${boosted}] ID ${product.id}: "${product.title}"`);
    });
    console.log();

    // 5. Summary and next steps
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ DIAGNOSTICS COMPLETE');
    console.log('═══════════════════════════════════════════════════════════\n');

    if (boostedByCrop === 0 && boostedByAgri === 0) {
      console.log('⚠️  NO BOOSTED PRODUCTS FOUND');
      console.log('Action required:');
      console.log('   1. Run migration: node migrate-premium-boost.js');
      console.log('   2. Seed data:     node seed-premium-boost.js');
    } else {
      console.log('✅ Boosted products are ready!');
      console.log('\nTo test endpoints:');
      console.log('   GET http://localhost:3000/market/products');
      console.log('   GET http://localhost:3000/marketplace/crop-products');
      console.log('   GET http://localhost:3000/marketplace/agri-products');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    process.exit(0);
  }
}

diagnose();
