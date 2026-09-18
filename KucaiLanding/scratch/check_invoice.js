const https = require('https');

https.get('https://www.kucaidl.com/api/order/INV-ZiFfPFv4rMluOU-d', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log('Response:', data));
}).on('error', (err) => {
  console.error('Error:', err.message);
});
