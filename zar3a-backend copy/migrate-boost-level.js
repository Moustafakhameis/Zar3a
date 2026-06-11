import sequelize from './src/config/database.js';

/**
 * Migration: Add boostLevel to Products table
 * 
 * Allows multiple boost tiers:
 * - 0: No boost
 * - 1: Basic boost
 * - 2: Premium boost
 * - 3: Diamond boost
 * 
 * This enables more granular control over product visibility priority.
 */

async function migrate() {
  try {
    // Add boostLevel column if it doesn't exist
    try {
      await sequelize.query(
        "ALTER TABLE Products ADD COLUMN boostLevel INT DEFAULT 0;"
      );
      console.log("✅ Added boostLevel column");
    } catch (e) {
      if (e.message.includes('Duplicate column')) {
        console.log("ℹ️  boostLevel column already exists");
      } else {
        throw e;
      }
    }

    // Create index for boost sorting optimization
    try {
      await sequelize.query(
        "CREATE INDEX idx_boost_sort ON Products (isBoosted DESC, boostLevel DESC, boostExpiryDate ASC, createdAt DESC);"
      );
      console.log("✅ Created boost sorting index for query optimization");
    } catch (e) {
      if (e.message.includes('Duplicate key')) {
        console.log("ℹ️  Boost sorting index already exists");
      } else {
        console.warn("⚠️  Could not create index:", e.message);
      }
    }

    console.log("\n✅ Migration completed successfully!");
    console.log("📊 Products table now supports:");
    console.log("   • boostLevel (0-3 for tiered boosts)");
    console.log("   • Optimized indexes for fast sorting");
  } catch (err) {
    console.error("❌ Migration error:", err.message || err);
  } finally {
    process.exit(0);
  }
}

migrate();
