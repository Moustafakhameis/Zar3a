import fs from 'fs';
import path from 'path';
import { sequelize, Product } from '../src/models/index.js';

async function main() {
  try {
    const productCount = await Product.count();
    if (productCount > 5) {
      console.log('Database already seeded. Skipping.');
      process.exit(0);
    }

    console.log('Seeding database from database_insert_queries.sql...');
    const sqlFilePath = path.resolve('database_insert_queries.sql');
    if (!fs.existsSync(sqlFilePath)) {
      console.error('SQL file not found at', sqlFilePath);
      process.exit(1);
    }

    let sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    // Fix broken exports
    sqlContent = sqlContent.replace(/\[object Object\]/g, "'{}'");
    sqlContent = sqlContent.replace(/, ,/g, ", NULL,");
    
    // Sometimes there's also ", ,"
    sqlContent = sqlContent.replace(/,  ,/g, ", NULL,");

    // We can't just split by ';' because strings might contain ';'
    // But for a simple dump, it's usually fine if we split by ';\r\n' or ';\n'
    // Actually, each query in this dump starts with 'INSERT INTO'
    // So we can extract them using regex or split by 'INSERT INTO'
    const statements = sqlContent.split('INSERT INTO');
    
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    
    for (let i = 1; i < statements.length; i++) {
      let stmt = 'INSERT INTO' + statements[i];
      // remove trailing characters like \r\n
      stmt = stmt.trim();
      if (stmt.endsWith(';')) {
        stmt = stmt.slice(0, -1);
      }
      
      try {
        await sequelize.query(stmt);
      } catch (err) {
        // Ignore duplicate entry errors, log others
        if (err.name !== 'SequelizeUniqueConstraintError' && !err.message.includes('Duplicate entry')) {
          console.error('Failed to execute query:', stmt.substring(0, 100), '... ERROR:', err.message);
        }
      }
    }
    
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error during seeding:', err);
    process.exit(1);
  }
}

main();
