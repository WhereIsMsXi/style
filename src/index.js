const path = require('path');
const { 
  clearFolder,
  gzipNormalFiles, 
  gzipMixinFiles
} = require('./utils')

const distPath = path.join(__dirname, '../dist');

async function dealNormalFiles() {
  try {
    const inputDir = './src/styles';
    const outputFile = path.join(__dirname, '../dist/index.scss');
    const startFile = 'normalize.scss';
    await gzipNormalFiles(inputDir, outputFile, startFile);
  } catch (err) {
    console.error('Error in dealNormalFiles:', err);
  }
}
async function dealMixinsFiles() {
  try {
    const inputDir = './src/mixin';
    const outputFile = path.join(__dirname, '../dist/mixin.scss');
    const startFile = '';
    await gzipMixinFiles(inputDir, outputFile, startFile);
  } catch (err) {
    console.error('Error in dealNormalFiles:', err);
  }
}


clearFolder(distPath)
  .then(async () => {
    await dealNormalFiles();
    await dealMixinsFiles();
  })
  .catch(err => console.error('Error recreating dist folder:', err));

