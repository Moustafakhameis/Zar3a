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
    console.log('✅ Logged in successfully. Token length:', token.length);

    console.log('\n2. Attempting to create sensor product via API...');
    const productRes = await axios.post(`${BASE_URL}/marketplace/sensor-products`, {
      title: 'API Test Sensor ' + Date.now(),
      description: 'API test description',
      category: 'sensors',
      price: 1500,
      unit: 'unit',
      region: 'Cairo',
      productSource: 'manual'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ API call succeeded! Created product:', productRes.data);

  } catch (err) {
    console.error('❌ API call failed:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

runTest();
