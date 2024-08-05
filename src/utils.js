const fs = require('fs').promises;
const path = require('path');
const CleanCSS = require('clean-css');

async function clearFolder(distPath) {
  try {
    const stats = await fs.stat(distPath);
    if (stats.isDirectory()) {
      await fs.rm(distPath, { recursive: true });
    }
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }

  await fs.mkdir(distPath, { recursive: true });
}

async function getContent(inputDir, startFile) {
  let result = '';
  const files = await fs.readdir(inputDir);

  for (const file of files) {
    if (file !== startFile && path.extname(file) === '.scss') {
      const filePath = path.join(inputDir, file);
      const content = await fs.readFile(filePath, 'utf8');
      result += content + '\n';
    }
  }
  return result;
}

async function gzipNormalFiles(inputDir, outputFile, startFile) {
  let content = '';

  try {
    const startFilePath = path.join(inputDir, startFile);
    const startContent = await fs.readFile(startFilePath, 'utf8');
    content += startContent + '\n';
  } catch (err) {
    console.error(`Error reading the start file ${startFile}:`, err);
  }

  try {
    const others = await getContent(inputDir, startFile)
    content += others + '\n'
  } catch (err) {
    console.error(`Error reading the others file ${startFile}:`, err);
  }

  content = new CleanCSS().minify(content);

  await fs.writeFile(outputFile, content.styles, 'utf8');
}

async function gzipMixinFiles(inputDir, outputFile, startFile) {
  try{
    let content = await getContent(inputDir, startFile)
    content += content + '\n'

    content = new CleanCSS().minify(content);
    
    await fs.writeFile(outputFile, content.styles, 'utf8');
  } catch (err) {
    console.error(`Error reading the others file ${startFile}:`, err);
  }
}

exports.clearFolder = clearFolder
exports.gzipNormalFiles = gzipNormalFiles
exports.gzipMixinFiles = gzipMixinFiles