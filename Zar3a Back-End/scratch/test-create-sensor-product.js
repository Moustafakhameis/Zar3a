import 'dotenv/config';
import sequelize from '../src/config/database.js';
import { Product, OrderTracking, User } from '../src/models/index.js';

async function test() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB Connected.');

    const adminUser = await User.findOne({ where: { role: 'ADMIN' } });
    if (!adminUser) {
      console.error('❌ No admin user found to test with.');
      process.exit(1);
    }
    console.log(`👤 Using Admin User ID: ${adminUser.id}`);

    // Try creating a product exactly as in createSensorMarketProduct
    console.log('\n--- Creating Product ---');
    const product = await Product.create({
      userId: adminUser.id,
      title: 'Test Sensor Product ' + Date.now(),
      description: 'Test Description',
      category: 'EQUIPMENT',
      price: 99.99,
      unit: 'unit',
      region: 'Cairo',
      imageUrl: '/uploads/products/test.png',
      marketplaceType: 'SENSOR_MARKET',
      productSource: 'MANUAL',
      isVerified: false,
    });
    console.log('✅ Product created successfully:', product.id);

    console.log('\n--- Creating OrderTracking ---');
    const tracking = await OrderTracking.create({
      productId: product.id,
      userId: adminUser.id,
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
    console.log('✅ OrderTracking created successfully:', tracking.id);

    // Clean up
    await OrderTracking.destroy({ where: { id: tracking.id } });
    await Product.destroy({ where: { id: product.id } });
    console.log('\n🧹 Cleaned up test data.');

  } catch (err) {
    console.error('❌ Error during creation:', err);
  } finally {
    process.exit(0);
  }
}

test();
