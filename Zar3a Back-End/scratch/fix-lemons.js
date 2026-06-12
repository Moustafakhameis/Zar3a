import https from 'https';
import sequelize from '../src/config/database.js';

async function run() {
  try {
    // Valid lemon image
    const validUrl = 'https://images.unsplash.com/photo-1590502593747-42a996133562?q=80&w=800&auto=format&fit=crop';
    
    // Check if validUrl is good
    const isGood = await new Promise((resolve) => {
      https.get(validUrl, (res) => {
        resolve(res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302);
      }).on('error', () => resolve(false));
    });

    if (isGood) {
      await sequelize.query(`UPDATE Products SET imageUrl = '${validUrl}' WHERE id IN (42, 43)`);
      console.log('Successfully updated lemon images!');
    } else {
      console.log('The alternative lemon image is also broken.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
