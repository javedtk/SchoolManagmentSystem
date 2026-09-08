const fs = require('fs');
const code = fs.readFileSync('services/result.service.js', 'utf8');
console.log('--- result.service.js ---');
console.log(code);
