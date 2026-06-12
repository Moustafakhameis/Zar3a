import 'dotenv/config';
import { sequelize, Notification } from '../src/models/index.js';

const check = async () => {
  try {
    const notifications = await Notification.findAll({
      where: { type: 'CHAT_MESSAGE' },
      attributes: ['id', 'userId', 'title', 'message', 'createdBy']
    });
    console.log(notifications.map(n => n.toJSON()));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
check();
