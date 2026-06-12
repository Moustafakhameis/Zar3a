import 'dotenv/config';
import sequelize from '../src/config/database.js';

async function test() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB Connected.');

    const [columnsOT] = await sequelize.query("SHOW COLUMNS FROM OrderTracking;");
    console.log('\n--- OrderTracking Columns ---');
    console.log(columnsOT);

    const [columnsP] = await sequelize.query("SHOW COLUMNS FROM products;");
    console.log('\n--- Products Columns ---');
    console.log(columnsP);

    const [productsCount] = await sequelize.query("SELECT COUNT(*) as count FROM products;");
    console.log('\n--- Total Products Count ---');
    console.log(productsCount);

    const [boostedCount] = await sequelize.query("SELECT COUNT(*) as count FROM products WHERE isBoosted = 1;");
    console.log('--- Boosted Products Count ---');
    console.log(boostedCount);

    const [nonBoostedCount] = await sequelize.query("SELECT COUNT(*) as count FROM products WHERE isBoosted = 0;");
    console.log('--- Non-Boosted Products Count ---');
    console.log(nonBoostedCount);

    const [nullBoostedCount] = await sequelize.query("SELECT COUNT(*) as count FROM products WHERE isBoosted IS NULL;");
    console.log('--- Null isBoosted Products Count ---');
    console.log(nullBoostedCount);

  } catch (err) {
    console.error('❌ DB Error:', err);
  } finally {
    process.exit(0);
  }
}

test();
