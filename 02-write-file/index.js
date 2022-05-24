const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });

const filePath = path.join(__dirname, 'text.txt');
const readable = fs.createReadStream(filePath, 'utf-8');
const writable = fs.createWriteStream(filePath);

output.write('Привет! Введи текст и я добавлю его в новый файл!');

rl.on('line', (input) => {
  // console.log(`Received: ${input}`);
  if (input.trim() === 'exit'){
    console.log('До скорой встречи!');
    rl.close();
  } else {
    writable.write(`${input}\n`);
  }

});

rl.on('SIGINT', () => {
  console.log('До скорой встречи!');
  rl.close();
});

readable.on('error', error => console.log('Error', error.message));
