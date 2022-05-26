const fsP = require('fs/promises');
// const fs = require('fs');
const path = require('path');

const buildFolder = path.join(__dirname, 'project-dist');

const styles = path.join(__dirname, 'styles');
const stylesBundle = path.join(__dirname, 'project-dist', 'styles.css');

const assets = path.join(__dirname, 'assets');
const assetsCopy = path.join(__dirname, 'project-dist', 'assets');

const components = path.join(__dirname, 'components');
const templatesFile = path.join(__dirname, 'template.html');
const htmlCopy = path.join(__dirname, 'project-dist', 'index.html');

const createFolder = async(folder) => {
  try {
    await fsP.mkdir(folder, { recursive:true });
  } catch(err) {
    console.log(err);
  }
};

async function readStyles() {
  try {
    const files = await fsP.readdir(styles,
      { withFileTypes: true });
    let result = '';
    for await (const file of files) {
      const fileExt = path.parse(path.join(styles, file.name)).ext;
      if (file.isFile() && fileExt.replace(/[\s.,%]/g, '') == 'css') {
        const readStyles = await fsP.readFile(path.join(styles, file.name));
        result += readStyles.toString() + '\n';
      }
    }
    await fsP.writeFile(stylesBundle, result); 
  }
  catch(err) {
    console.log(err);
  }
}

const copyAssets = () => {
  const copyFiles = async (filesOriginal, filesCopy) => {
    try {
      await fsP.copyFile(filesOriginal, filesCopy);
    }
    catch(err) {
      console.log(err);
    }
  };
  
  const readFolder = async (original, copy) => {
    try {
      const files = await fsP.readdir(original,
        { withFileTypes: true });
      for await (const file of files) {
        const filesToCopy = path.join(original, file.name);
        const filesCopied = path.join(copy, file.name);
        if (file.isFile()) {
          copyFiles(filesToCopy, filesCopied);
        } else if (file.isDirectory()) {
          await fsP.mkdir(filesCopied);
          readFolder(filesToCopy, filesCopied);
        }
      }
    }
    catch(err) {
      console.log(err);
    }
  };
  
  const copy = async () => {
    await fsP.rm(assetsCopy, { recursive: true, force: true });
    createFolder(assetsCopy);
    readFolder(assets, assetsCopy);
  };
  
  copy();
};

const readComponents = async() => {
  try {
    await fsP.writeFile(htmlCopy, '');
    let templatesFileRead = await fsP.readFile(templatesFile, 'utf-8');
    const componentsFiles = await fsP.readdir(components, { withFileTypes: true });
    const tempTags = templatesFileRead.match(/{{(.+?)}}/g).map((s) => s.replace(/[{}]/g, ''));

    for await (const file of componentsFiles) {
      const fileExt = path.parse(path.join(components, file.name)).ext;
      const filePath = path.join(components, file.name);
      const fileName = path.parse(filePath).name;
      if (file.isFile() && fileExt.replace(/[\s.,%]/g, '') == 'html' && tempTags.includes(fileName)) {
        const componentsFilesContent = await fsP.readFile(filePath, 'utf-8');
        templatesFileRead = templatesFileRead.replace(`{{${fileName}}}`, componentsFilesContent);
      }
    }

    fsP.appendFile(htmlCopy, templatesFileRead);
  } catch(err) {
    console.log(err);
  }
};

const build = async() => {
  await fsP.rm(buildFolder, { recursive: true, force: true });
  createFolder(buildFolder);
  readStyles();
  copyAssets();
  readComponents();
};

build();