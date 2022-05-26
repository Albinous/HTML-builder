const path = require('path');
const {readdir, readFile, writeFile} = require('fs/promises');

const styles = path.join(__dirname, 'styles');
const stylesBundle = path.join(__dirname, 'project-dist', 'bundle.css');

async function readFolder() {
  try {
    const files = await readdir(styles,
      { withFileTypes: true });
    let result = '';
    for await (const file of files) {
      const fileExt = path.parse(path.join(styles, file.name)).ext;
      if (file.isFile() && fileExt.replace(/[\s.,%]/g, '') == 'css') {
        const readStyles = await readFile(path.join(styles, file.name));
        result += readStyles.toString() + '\n';
      }
    }
    await writeFile(stylesBundle, result); 
  }
  catch(err) {
    console.log(err);
  }
}

readFolder();
