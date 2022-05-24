const path = require('path');
const fs = require('fs');

const filePath = path.join('01-read-file', 'text.txt');
const stream = fs.createReadStream(filePath, 'utf-8');

let data = '';

stream.on('data', chunk => data += chunk);
stream.on('end', () => console.log(data));
stream.on('error', error => console.log('Error', error.message));