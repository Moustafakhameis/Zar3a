import { User } from "./src/models/index.js";

(async () => {
  try {
    const admin = await User.findOne({ where: { role: 'ADMIN' } });
    if (!admin) {
      console.log('No admin user found');
      process.exit(1);
    }

    await User.update(
      { email: 'admin@zar3a.com' },
      { where: { id: admin.id } }
    );

    console.log(`✅ Admin email updated back to admin@zar3a.com`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
