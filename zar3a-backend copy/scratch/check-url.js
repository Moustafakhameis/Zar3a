import sequelize from '../src/config/database.js';

async function run() {
  try {
    const [results] = await sequelize.query('SELECT id, title, imageUrl FROM Products LIMIT 5');
    console.log(results);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
