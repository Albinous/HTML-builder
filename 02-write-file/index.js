const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });

const filePath = path.join(__dirname, 'text.txt');
const writable = fs.createWriteStream(filePath);

output.write('Привет! Введи текст и я добавлю его в новый файл!');

rl.on('line', (input) => {
  // console.log(`Received: ${input}`);
  if (input.trim() === 'exit'){
    rl.close();
  } else {
    writable.write(`${input}\n`);
  }

});

rl.on('close', () => {
  process.exit();
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', code => {
  if (code === 0) {
    console.log('До скорой встречи!');
  } else {
    console.log(`Ошибка в ${code}`);
  }
});
