import 'dotenv/config';
import sequelize from '../src/config/database.js';

async function migrate() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database for schema fixes.');

    // 1. Clean up duplicate order notifications (keep only lowest ID)
    console.log('🧹 Cleaning up duplicate order notifications...');
    try {
      const [delResult] = await sequelize.query(`
        DELETE n1 FROM Notifications n1
        INNER JOIN Notifications n2 
        ON n1.orderId = n2.orderId 
           AND n1.userId = n2.userId 
           AND n1.type = n2.type
        WHERE n1.id > n2.id 
          AND n1.type = 'order';
      `);
      console.log('✅ Duplicate notifications deleted.');
    } catch (err) {
      console.warn('⚠️ Error during duplicate notification cleanup:', err.message);
    }

    // 2. Add UNIQUE index on Notifications (orderId, userId, type)
    console.log('🔒 Adding unique constraint on Notifications...');
    try {
      await sequelize.query(`
        ALTER TABLE Notifications 
        ADD UNIQUE INDEX uq_order_notif (orderId, userId, type);
      `);
      console.log('✅ Added unique index uq_order_notif to Notifications table.');
    } catch (err) {
      if (err.message.includes('Duplicate key') || err.message.includes('already exists')) {
        console.log('ℹ️  Unique index uq_order_notif already exists.');
      } else {
        console.warn('⚠️ Could not add unique index:', err.message);
      }
    }

    // 3. Add boostLevel and boostExpiryDate to products table
    console.log('🌾 Adjusting products table boosting columns...');
    
    // Add boostLevel
    try {
      await sequelize.query('ALTER TABLE products ADD COLUMN boostLevel INT DEFAULT 0;');
      console.log('✅ Added boostLevel column.');
    } catch (err) {
      if (err.message.includes('Duplicate column')) {
        console.log('ℹ️  boostLevel column already exists.');
      } else {
        console.warn('⚠️ Could not add boostLevel:', err.message);
      }
    }

    // Add boostExpiryDate
    try {
      await sequelize.query('ALTER TABLE products ADD COLUMN boostExpiryDate DATETIME NULL DEFAULT NULL;');
      console.log('✅ Added boostExpiryDate column.');
    } catch (err) {
      if (err.message.includes('Duplicate column')) {
        console.log('ℹ️  boostExpiryDate column already exists.');
      } else {
        console.warn('⚠️ Could not add boostExpiryDate:', err.message);
      }
    }


    // 5. Reset incorrect data as requested
    console.log('🔄 Resetting isBoosted and boostLevel where invalid...');
    try {
      const [updateResult] = await sequelize.query(`
        UPDATE products
        SET isBoosted = 0, boostLevel = 0
        WHERE isBoosted IS NULL OR isBoosted = 1;
      `);
      console.log('✅ Reset isBoosted and boostLevel to 0.');
    } catch (err) {
      console.error('❌ Failed to reset incorrect boost data:', err.message);
    }

    console.log('\n🎉 Zar3a schema fixes migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    process.exit(0);
  }
}

migrate();
