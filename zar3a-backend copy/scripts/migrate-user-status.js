import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const dbUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/zar3a_db';

const sequelize = new Sequelize(dbUrl, {
  dialect: 'mysql',
  logging: console.log,
});

async function migrate() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Successfully connected.');

    // Check if status column already exists
    const [results] = await sequelize.query(`SHOW COLUMNS FROM Users LIKE 'status';`);
    if (results.length === 0) {
      console.log('Adding status column to Users...');
      await sequelize.query(`
        ALTER TABLE Users 
        ADD COLUMN status ENUM('pending', 'pending_sensor', 'pending_second_approval', 'approved') 
        DEFAULT 'pending';
      `);
      console.log('✅ Added status column.');
    } else {
      console.log('status column already exists.');
    }

    // Migrate existing users
    console.log('Migrating existing users to appropriate status...');
    const [users] = await sequelize.query('SELECT id, role, isApproved FROM Users');
    
    for (const u of users) {
      let targetStatus = 'pending';
      if (u.isApproved) {
        if (u.role === 'FARMER') {
          // Check if farmer has a sensor ID
          const [profiles] = await sequelize.query(`SELECT sensorId FROM FarmerProfiles WHERE userId = ${u.id}`);
          if (profiles.length > 0 && profiles[0].sensorId) {
            targetStatus = 'approved';
          } else {
            targetStatus = 'pending_sensor';
          }
        } else {
          targetStatus = 'approved';
        }
      } else {
        targetStatus = 'pending';
      }
      
      await sequelize.query(`UPDATE Users SET status = '${targetStatus}' WHERE id = ${u.id}`);
      console.log(`User ID ${u.id} (${u.role}) updated to status: ${targetStatus}`);
    }

    console.log('✅ Migration of user status complete.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

migrate();
