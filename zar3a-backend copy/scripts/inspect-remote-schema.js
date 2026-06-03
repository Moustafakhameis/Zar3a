import { Sequelize } from 'sequelize';

const remoteUrl = 'mysql://root:YWvPNPxfowhyJXGTCFyoMpjjuXIudpRG@zephyr.proxy.rlwy.net:35402/railway';

(async () => {
  const remoteDb = new Sequelize(remoteUrl, { dialect: 'mysql', logging: false });
  try {
    await remoteDb.authenticate();
    console.log('✅ Connected to remote database');

    const tables = ['Users', 'FarmerProfiles'];
    for (const table of tables) {
      console.log(`\n--- SCHEMA FOR ${table} ---`);
      const [columns] = await remoteDb.query(`DESCRIBE \`${table}\``);
      columns.forEach(col => {
        console.log(`${col.Field}: ${col.Type} | Null: ${col.Null} | Key: ${col.Key} | Default: ${col.Default} | Extra: ${col.Extra}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await remoteDb.close();
  }
})();
