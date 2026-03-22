const http = require('http');

// Test 1: Health Check
console.log('🧪 Testing Auth Routes...\n');

console.log('1️⃣ Testing /health endpoint...');
http.get('http://localhost:5000/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('✅ Health endpoint works:', JSON.parse(data).status);
  });
}).on('error', err => console.error('❌ Health check failed:', err.message));

// Test 2: POST /api/auth/register
setTimeout(() => {
  console.log('\n2️⃣ Testing POST /api/auth/register...');
  
  const postData = JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'Test123!',
    confirmPassword: 'Test123!'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('✅ Register endpoint response:', response.message);
        console.log('   Status:', response.success ? '✅ Success' : '❌ Failed');
      } catch (e) {
        console.error('❌ Invalid JSON response:', data);
      }
    });
  });

  req.on('error', err => console.error('❌ Register request failed:', err.message));
  req.write(postData);
  req.end();
}, 500);

// Test 3: GET /api/auth/me (should fail without token)
setTimeout(() => {
  console.log('\n3️⃣ Testing GET /api/auth/me (without token)...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('✅ /me endpoint response:', response.message);
        console.log('   Expected failure (no token):', response.success === false ? '✅' : '❌');
      } catch (e) {
        console.error('❌ Invalid JSON response:', data);
      }
    });
  });

  req.on('error', err => console.error('❌ /me request failed:', err.message));
  req.end();
}, 1000);

// Summary
setTimeout(() => {
  console.log('\n\n✨ Auth Routes Configuration Complete!');
  console.log('Next steps:');
  console.log('  1. Update your .env file with: JWT_SECRET, GOOGLE_CLIENT_ID, EMAIL_USER, EMAIL_PASS');
  console.log('  2. Connect frontend Login/SignUp forms to these endpoints');
  console.log('  3. Test email verification flow');
}, 2000);
