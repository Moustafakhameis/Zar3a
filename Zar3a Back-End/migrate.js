import sequelize from './src/config/database.js';

async function migrate() {
  try {
    await sequelize.query("ALTER TABLE Users ADD COLUMN subscriptionTier ENUM('FREE', 'STARTER', 'GROWTH', 'PRO') DEFAULT 'FREE' NOT NULL;");
    console.log("Added subscriptionTier");
  } catch(e) { console.log(e.message); }

  try {
    await sequelize.query("ALTER TABLE Users ADD COLUMN subscriptionExpiresAt DATETIME NULL;");
    console.log("Added subscriptionExpiresAt");
  } catch(e) { console.log(e.message); }

  try {
    await sequelize.query("ALTER TABLE Users ADD COLUMN pendingRole ENUM('FARMER', 'SUPPLIER', 'AGRO_EXPERT') NULL;");
    console.log("Added pendingRole");
  } catch(e) { console.log(e.message); }

  try {
    await sequelize.query("ALTER TABLE Users ADD COLUMN cv VARCHAR(255) NULL;");
    console.log("Added cv");
  } catch(e) { console.log(e.message); }

  process.exit();
}

migrate();
