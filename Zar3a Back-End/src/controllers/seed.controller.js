import fs from 'fs';
import path from 'path';
import { sequelize } from '../models/index.js';

export const seedDatabase = async (req, res) => {
  const secret = req.query.secret;
  if (secret !== 'super-secret-seed-key') {
    return res.status(403).send('Forbidden');
  }

  try {
    const sqlFilePath = path.resolve('database_insert_queries.sql');
    if (!fs.existsSync(sqlFilePath)) {
      return res.status(404).send('SQL file not found');
    }

    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    const queries = sqlContent.split(';').filter(q => q.trim().length > 0);

    for (const query of queries) {
      if (query.trim()) {
        try {
          await sequelize.query(query);
        } catch (queryErr) {
          console.error(`Error executing query: ${query.substring(0, 50)}...`, queryErr.message);
        }
      }
    }

    return res.status(200).send('Database seeded successfully');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error seeding database: ' + err.message);
  }
};
