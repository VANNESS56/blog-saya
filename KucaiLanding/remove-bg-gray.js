const fs = require('fs');
const files = [
  'src/components/sections/WhyChooseUs.tsx',
  'src/components/sections/Statistics.tsx',
  'src/components/sections/Reviews.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Only replace the very first occurrence of bg-gray-50, which in all these files corresponds to the outer <section>
  content = content.replace('bg-gray-50', '');
  fs.writeFileSync(f, content);
  console.log('Updated ' + f);
});
