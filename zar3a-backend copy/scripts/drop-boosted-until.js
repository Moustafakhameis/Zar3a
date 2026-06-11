import 'dotenv/config';
import sequelize from '../src/config/database.js';

async function cleanup() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database.');

    // 1. Drop the idx_boost_sort index if it exists
    console.log('🧹 Checking / dropping old boost sorting index (idx_boost_sort)...');
    try {
      await sequelize.query('ALTER TABLE products DROP INDEX idx_boost_sort;');
      console.log('✅ Dropped index idx_boost_sort.');
    } catch (e) {
      console.log('ℹ️  idx_boost_sort index did not exist or could not be dropped:', e.message);
    }

    // 2. Drop boostedUntil column if it exists
    console.log('🧹 Dropping boostedUntil column if it exists...');
    try {
      await sequelize.query('ALTER TABLE products DROP COLUMN boostedUntil;');
      console.log('✅ Column boostedUntil dropped successfully.');
    } catch (e) {
      console.log('ℹ️  Column boostedUntil did not exist or could not be dropped:', e.message);
    }

    // 3. Recreate the idx_boost_sort index using boostExpiryDate instead of boostedUntil
    console.log('🔒 Recreating idx_boost_sort index using boostExpiryDate...');
    try {
      await sequelize.query(
        'CREATE INDEX idx_boost_sort ON products (isBoosted DESC, boostLevel DESC, boostExpiryDate ASC, createdAt DESC);'
      );
      console.log('✅ Created idx_boost_sort using boostExpiryDate.');
    } catch (e) {
      console.error('❌ Failed to recreate index idx_boost_sort:', e.message);
    }

    console.log('\n🎉 Database cleanup complete!');
  } catch (err) {
    console.error('❌ Cleanup failed:', err.message || err);
  } finally {
    process.exit(0);
  }
}

cleanup();
