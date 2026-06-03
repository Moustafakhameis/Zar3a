import { Sequelize } from 'sequelize';

const remoteUrl = 'mysql://root:YWvPNPxfowhyJXGTCFyoMpjjuXIudpRG@zephyr.proxy.rlwy.net:35402/railway';

(async () => {
  const remoteDb = new Sequelize(remoteUrl, { dialect: 'mysql', logging: false });
  try {
    await remoteDb.authenticate();
    console.log('✅ Connected to remote database');

    const [transactions] = await remoteDb.query('SELECT * FROM Transactions ORDER BY id DESC LIMIT 20');
    console.log('\n--- Recent Transactions ---');
    transactions.forEach(t => {
      console.log(`Tx ID: ${t.id} | userId: ${t.userId} | orderId: ${t.orderId} | amount: ${t.amount} | paymentMethod: ${t.paymentMethod} | status: ${t.status} | gatewayRef: ${t.gatewayReference}`);
    });

    const [orderItems] = await remoteDb.query('SELECT * FROM OrderItems ORDER BY id DESC LIMIT 20');
    console.log('\n--- Recent OrderItems ---');
    orderItems.forEach(oi => {
      console.log(`OI ID: ${oi.id} | orderId: ${oi.orderId} | productId: ${oi.productId} | title: ${oi.title} | price: ${oi.price} | ownerId: ${oi.ownerId}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await remoteDb.close();
  }
})();
