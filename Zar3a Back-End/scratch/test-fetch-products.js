import axios from 'axios';

const BASE_URL = 'http://localhost:5002';

async function run() {
  try {
    const res = await axios.get(`${BASE_URL}/marketplace/crop-products`);
    const products = res.data;
    console.log('Fetched products count:', products.length);
    const boosted = products.filter(p => p.isBoosted);
    console.log('Boosted products in response:', boosted.map(p => ({
      id: p.id,
      title: p.title,
      isBoosted: p.isBoosted,
      boostExpiryDate: p.boostExpiryDate
    })));
  } catch (err) {
    console.error('Error fetching products:', err.message);
  }
}

run();
