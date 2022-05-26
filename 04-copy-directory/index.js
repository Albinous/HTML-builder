
const path = require('path');
const {readdir, mkdir, copyFile, rm} = require('fs/promises');

const folderOriginal = path.join(__dirname, 'files');
const folderCopy = path.join(__dirname, 'files-copy');

const copyFiles = async (filesOriginal, filesCopy) => {
  try {
    await copyFile(filesOriginal, filesCopy);
  }
  catch(err) {
    console.log(err);
  }
};

const readFolder = async (original, copy) => {
  try {
    const files = await readdir(original,
      { withFileTypes: true });
    for await (const file of files) {
      const filesToCopy = path.join(original, file.name);
      const filesCopied = path.join(copy, file.name);
      if (file.isFile()) {
        copyFiles(filesToCopy, filesCopied);
      } else if (file.isDirectory()) {
        await mkdir(filesCopied);
        readFolder(filesToCopy, filesCopied);
      }
    }
  }
  catch(err) {
    console.log(err);
  }
};

const copy = async () => {
  await rm(folderCopy, { recursive: true, force: true });
  await mkdir(folderCopy);
  readFolder(folderOriginal, folderCopy);
};

copy();