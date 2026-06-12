import { sequelize, Order, OrderItem, Transaction, Product, User } from '../src/models/index.js';

(async () => {
  try {
    const user = await User.findByPk(2); // Let's use user ID 2 (ahmed, which we saw in the DB)
    if (!user) {
      console.error('User with ID 2 not found in remote DB!');
      process.exit(1);
    }
    console.log(`Found User: ${user.fullName} (ID: ${user.id})`);

    const items = [
      { productId: 37, quantity: 1 } // Let's try to order "NPK 20-20-20 Compound Fertilizer" (productId 37, marketplaceType AGRI_MARKET)
    ];

    const orderItemsData = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        console.warn(`Product ${item.productId} not found`);
        continue;
      }
      const quantity = Number(item.quantity) || 1;
      const itemTotal = Number(product.price) * quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        productId: product.id,
        title: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        unit: product.unit,
        quantity,
        totalPrice: itemTotal,
        imageUrl: product.imageUrl,
        marketplaceType: product.marketplaceType,
        productSource: product.productSource,
        region: product.region,
        ownerId: product.userId,
        status: 'AVAILABLE',
      });
    }

    console.log('Creating Order...');
    const order = await Order.create({
      userId: user.id,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      totalAmount,
      paymentMethod: 'STRIPE',
      shippingAddress: 'Test Address',
    });
    console.log('Order created successfully:', order.id);

    console.log('Creating OrderItems...');
    const createdOrderItems = await Promise.all(
      orderItemsData.map(async (item) => {
        return await OrderItem.create({ orderId: order.id, ...item });
      })
    );
    console.log('OrderItems created successfully:', createdOrderItems.map(i => i.id));

    console.log('Creating Transaction...');
    const transaction = await Transaction.create({
      userId: user.id,
      orderId: order.id,
      amount: totalAmount,
      currency: 'EGP',
      paymentMethod: 'STRIPE',
      status: 'PENDING',
    });
    console.log('Transaction created successfully:', transaction.id);

    // Clean up created entities
    console.log('Cleaning up...');
    await Transaction.destroy({ where: { id: transaction.id } });
    await Promise.all(createdOrderItems.map(item => OrderItem.destroy({ where: { id: item.id } })));
    await Order.destroy({ where: { id: order.id } });
    console.log('Cleanup completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Checkout simulation failed with error:');
    console.error(error);
    process.exit(1);
  }
})();
