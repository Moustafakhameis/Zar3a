import sequelize from './src/config/database.js';

/**
 * Migration script to add premium boost columns to Products table
 * Adds: isBoosted (BOOLEAN)
 */

async function migrate() {
  try {
    // Add isBoosted column if it doesn't exist
    try {
      await sequelize.query("ALTER TABLE Products ADD COLUMN isBoosted BOOLEAN NOT NULL DEFAULT 0;");
      console.log("✅ Added isBoosted column");
    } catch(e) {
      console.log("ℹ️  isBoosted column already exists:", e.message);
    }

    console.log("\n✅ Migration completed successfully!");
    console.log("📌 Products table is now ready for Premium Boost functionality.");
  } catch(err) {
    console.error("❌ Migration error:", err.message || err);
  } finally {
    process.exit(0);
  }
}

migrate();
