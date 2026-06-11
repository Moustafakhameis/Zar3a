import 'dotenv/config';
import { sequelize, User } from '../src/models/index.js';

const check = async () => {
  try {
    const users = await User.findAll({ attributes: ['id', 'email', 'fullName', 'role'] });
    console.log(users.map(u => u.toJSON()));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
check();
