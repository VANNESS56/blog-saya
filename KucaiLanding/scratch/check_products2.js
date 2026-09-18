const https = require('https');

https.get('https://kucaidl.com/api/products', (res) => {
  let data = '';
  console.log('Status Code:', res.statusCode);
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log('Response:', data.substring(0, 500)));
}).on('error', (err) => {
  console.error('Error:', err.message);
});
