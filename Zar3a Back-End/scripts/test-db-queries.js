import { Sequelize } from 'sequelize';

const remoteUrl = 'mysql://root:YWvPNPxfowhyJXGTCFyoMpjjuXIudpRG@zephyr.proxy.rlwy.net:35402/railway';

(async () => {
  const remoteDb = new Sequelize(remoteUrl, { dialect: 'mysql', logging: false });
  try {
    await remoteDb.authenticate();
    console.log('✅ Connected to remote database');

    // 1. Check all unique marketplaceType in Products table
    const [productsInfo] = await remoteDb.query('SELECT id, title, marketplaceType, userId, price FROM Products');
    console.log('\n--- Products in Remote DB ---');
    console.log(`Total Products: ${productsInfo.length}`);
    productsInfo.forEach(p => {
      console.log(`Product ID: ${p.id} | Title: ${p.title} | marketplaceType: ${p.marketplaceType} | userId (owner): ${p.userId} | Price: ${p.price}`);
    });

    // 2. Check all users in database
    const [usersInfo] = await remoteDb.query('SELECT id, fullName, role FROM Users');
    console.log('\n--- Users in Remote DB ---');
    usersInfo.forEach(u => {
      console.log(`User ID: ${u.id} | Name: ${u.fullName} | Role: ${u.role}`);
    });

    // 3. Check for any orders
    const [ordersInfo] = await remoteDb.query('SELECT * FROM Orders ORDER BY id DESC LIMIT 5');
    console.log('\n--- Recent Orders in Remote DB ---');
    ordersInfo.forEach(o => {
      console.log(`Order ID: ${o.id} | userId: ${o.userId} | totalAmount: ${o.totalAmount} | status: ${o.status} | paymentStatus: ${o.paymentStatus} | paymentMethod: ${o.paymentMethod}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await remoteDb.close();
  }
})();
