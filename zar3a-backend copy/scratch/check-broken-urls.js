import https from 'https';
import sequelize from '../src/config/database.js';

async function run() {
  try {
    const [products] = await sequelize.query('SELECT id, imageUrl FROM Products WHERE imageUrl LIKE "http%"');
    let broken = 0;
    
    for (const p of products) {
      await new Promise((resolve) => {
        https.get(p.imageUrl, (res) => {
          if (res.statusCode !== 200 && res.statusCode !== 301 && res.statusCode !== 302) {
            console.log(`ID ${p.id} broken: ${res.statusCode} ${p.imageUrl}`);
            broken++;
          }
          resolve();
        }).on('error', (e) => {
          console.log(`ID ${p.id} error: ${e.message}`);
          broken++;
          resolve();
        });
      });
    }
    console.log(`Total broken: ${broken} out of ${products.length}`);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
