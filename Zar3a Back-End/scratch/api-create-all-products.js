import axios from 'axios';

const BASE_URL = 'http://localhost:5002';

async function runTest() {
  try {
    console.log('1. Attempting login...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@gmail.com',
      password: 'admin123'
    });

    const token = loginRes.data.accessToken;
    console.log('✅ Logged in successfully.');

    console.log('\n2. Creating Crop Market Product via API...');
    try {
      const res = await axios.post(`${BASE_URL}/marketplace/crop-products`, {
        title: 'Crop Test Product ' + Date.now(),
        description: 'Crop test description',
        category: 'produce',
        price: 50,
        unit: 'kg',
        region: 'Cairo',
        productSource: 'manual'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Crop Product created:', res.data.id);
    } catch (err) {
      console.error('❌ Crop Product failed:', err.response?.status, err.response?.data || err.message);
    }

    console.log('\n3. Creating Agri Shop Product via API...');
    try {
      const res = await axios.post(`${BASE_URL}/marketplace/agri-products`, {
        title: 'Agri Test Product ' + Date.now(),
        description: 'Agri test description',
        category: 'seeds',
        price: 250,
        unit: 'unit',
        region: 'Giza',
        productSource: 'manual'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Agri Product created:', res.data.id);
    } catch (err) {
      console.error('❌ Agri Product failed:', err.response?.status, err.response?.data || err.message);
    }

  } catch (err) {
    console.error('❌ API call failed:', err);
  }
}

runTest();
