import sequelize from '../src/config/database.js';

async function run() {
  try {
    const [users] = await sequelize.query('SELECT id, role FROM Users');
    console.log(users);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
