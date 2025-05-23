const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build');

// Check if build directory exists
if (!fs.existsSync(buildDir)) {
  console.error('Build directory does not exist!');
  process.exit(1);
}

// Check for index.html
const indexPath = path.join(buildDir, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('index.html does not exist in build directory!');
} else {
  console.log('✓ index.html exists');
  
  // Read index.html content
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  console.log('\nindex.html content preview:');
  console.log(indexContent.substring(0, 500) + '...');
}

// Check for JS and CSS files
const staticDir = path.join(buildDir, 'static');
if (!fs.existsSync(staticDir)) {
  console.error('static directory does not exist in build directory!');
} else {
  console.log('\n✓ static directory exists');
  
  // Check for JS files
  const jsDir = path.join(staticDir, 'js');
  if (fs.existsSync(jsDir)) {
    const jsFiles = fs.readdirSync(jsDir);
    console.log(`\nFound ${jsFiles.length} JS files:`);
    jsFiles.forEach(file => console.log(`- ${file}`));
  } else {
    console.error('No JS files found!');
  }
  
  // Check for CSS files
  const cssDir = path.join(staticDir, 'css');
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir);
    console.log(`\nFound ${cssFiles.length} CSS files:`);
    cssFiles.forEach(file => console.log(`- ${file}`));
  } else {
    console.error('No CSS files found!');
  }
}

// Check for asset files
const assetsDir = path.join(buildDir, 'assets');
if (!fs.existsSync(assetsDir)) {
  console.log('\nNo assets directory found in build!');
} else {
  const assetFiles = fs.readdirSync(assetsDir);
  console.log(`\nFound ${assetFiles.length} files in assets directory:`);
  assetFiles.slice(0, 10).forEach(file => console.log(`- ${file}`));
  if (assetFiles.length > 10) {
    console.log(`... and ${assetFiles.length - 10} more files`);
  }
}
