import 'dotenv/config';
import sequelize from '../src/config/database.js';
import { User } from '../src/models/index.js';

async function listUsers() {
  try {
    await sequelize.authenticate();
    const users = await User.findAll({
      attributes: ['id', 'fullName', 'email', 'role', 'isActive', 'isApproved'],
      limit: 10
    });
    console.log(users.map(u => u.toJSON()));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

listUsers();
