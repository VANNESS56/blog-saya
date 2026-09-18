const fs = require('fs');
const files = [
  'src/components/sections/Hero.tsx',
  'src/components/sections/Services.tsx',
  'src/components/sections/TransactionFlow.tsx',
  'src/components/sections/RateCard.tsx',
  'src/components/sections/FAQ.tsx',
  'src/components/sections/CTA.tsx',
  'src/components/layout/Footer.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Only replace the very first occurrence of bg-white, which in all these files corresponds to the outer <section> or <footer> tag
  content = content.replace('bg-white', '');
  fs.writeFileSync(f, content);
  console.log('Updated ' + f);
});
