import sequelize from '../src/config/database.js';
import { Product, OrderTracking } from '../src/models/index.js';

async function test() {
  try {
    console.log("Testing connection...");
    await sequelize.authenticate();
    console.log("Connected successfully.");

    // Run the column check/alter code directly
    console.log("Ensuring columns of products, OrderTracking, and OrderItems allow SENSOR_MARKET...");
    const enumTables = [
      { table: 'products', column: 'marketplaceType' },
      { table: 'OrderTracking', column: 'marketplaceType' },
      { table: 'OrderItems', column: 'marketplaceType' }
    ];
    for (const item of enumTables) {
      const [cols] = await sequelize.query(`SHOW COLUMNS FROM \`${item.table}\` LIKE '${item.column}';`);
      if (cols.length > 0) {
        const type = cols[0].Type.toLowerCase();
        console.log(`Current type of ${item.table}.${item.column}: ${type}`);
        if (!type.includes('sensor_market')) {
          console.log(`Altering \`${item.table}\`.\`${item.column}\` to allow SENSOR_MARKET...`);
          await sequelize.query(`ALTER TABLE \`${item.table}\` MODIFY COLUMN \`${item.column}\` ENUM('CROP_MARKET', 'AGRI_MARKET', 'SENSOR_MARKET') DEFAULT 'CROP_MARKET';`);
          console.log(`✅ \`${item.table}\`.\`${item.column}\` updated to support SENSOR_MARKET.`);
        } else {
          console.log(`✅ \`${item.table}\`.\`${item.column}\` already supports SENSOR_MARKET.`);
        }
      } else {
        console.log(`Column ${item.column} in table ${item.table} not found!`);
      }
    }

    console.log("Attempting to insert test product...");
    // Let's find an admin user first
    const [users] = await sequelize.query("SELECT id, role FROM Users WHERE role = 'ADMIN' LIMIT 1;");
    if (users.length === 0) {
      console.error("No admin user found in database. Cannot test creation.");
      process.exit(1);
    }
    const adminId = users[0].id;
    console.log(`Found admin with ID: ${adminId}`);

    const product = await Product.create({
      userId: adminId,
      title: "Test Sensor Product " + Date.now(),
      description: "Smart sensor for automated soil testing.",
      category: "EQUIPMENT",
      price: 150.00,
      unit: "unit",
      region: "Delta",
      imageUrl: "",
      marketplaceType: "SENSOR_MARKET",
      productSource: "MANUAL",
      isVerified: false,
    });
    console.log("Product created successfully! ID:", product.id);

    console.log("Attempting to create OrderTracking entry...");
    const tracking = await OrderTracking.create({
      productId: product.id,
      userId: adminId,
      marketplaceType: product.marketplaceType,
      productSource: product.productSource,
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      unit: product.unit,
      region: product.region,
      imageUrl: product.imageUrl,
      quantity: 1,
      status: product.status || 'AVAILABLE',
    });
    console.log("OrderTracking entry created successfully! ID:", tracking.id);

    // Clean up
    console.log("Cleaning up test records...");
    await OrderTracking.destroy({ where: { id: tracking.id } });
    await Product.destroy({ where: { id: product.id } });
    console.log("Cleanup complete.");

  } catch (err) {
    console.error("ERROR ENCOUNTERED:");
    console.error(err);
  } finally {
    process.exit(0);
  }
}

test();
