const path = require('path');
const fs = require('fs');
const {readdir} = require('fs/promises');

const folderPath = path.join(__dirname, 'secret-folder');

async function readFolder() {
  try {
    const files = await readdir(folderPath,
      { withFileTypes: true });
    for await (const file of files) {
      if (file.isFile()) {
        fs.stat(`${folderPath}/${file.name}`, (stats) => {
          const fileSize = stats.size;
          const fileName = path.parse(`${folderPath}/${file.name}`).name;
          const fileExt = path.parse(`${folderPath}/${file.name}`).ext;
          console.log(`${fileName} - ${fileExt.replace(/[\s.,%]/g, '')} - ${fileSize}`);
        });
      }
    }
  }
  catch(err) {
    console.log(err);
  }
}

console.log(readFolder());