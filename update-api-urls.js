const fs = require('fs');
const path = require('path');

// Function to recursively find all JavaScript files in a directory
function findJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
      fileList = findJsFiles(filePath, fileList);
    } else if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.jsx'))) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Function to replace hardcoded API URLs in a file
function updateApiUrls(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Replace direct axios calls to localhost:5000/api
    const hardcodedApiRegex = /axios\.(get|post|put|delete|patch)\(['"]http:\/\/localhost:5000\/api/g;
    content = content.replace(hardcodedApiRegex, 'axios.$1(`${config.apiUrl}');

    // Replace template literals with hardcoded localhost:5000/api
    const templateLiteralRegex = /`http:\/\/localhost:5000\/api/g;
    content = content.replace(templateLiteralRegex, '`${config.apiUrl}');

    // Replace string literals with hardcoded localhost:5000/api
    const stringLiteralRegex = /'http:\/\/localhost:5000\/api/g;
    content = content.replace(stringLiteralRegex, "'${config.apiUrl}")

    // Replace double-quoted string literals
    const doubleQuotedRegex = /"http:\/\/localhost:5000\/api/g;
    content = content.replace(doubleQuotedRegex, "`${config.apiUrl}")

    // Check if we need to add the config import
    if (content !== originalContent && !content.includes("import config from '../config'") && !content.includes("import config from './config'")) {
      // Add import statement at the top of the file, after other imports
      const importRegex = /(import\s+.*\s+from\s+['"](.*)['"];?\n)/;
      const importMatch = content.match(importRegex);
      
      if (importMatch) {
        const lastImport = content.lastIndexOf(importMatch[0]) + importMatch[0].length;
        content = content.slice(0, lastImport) + "import config from '../config';\n" + content.slice(lastImport);
      } else {
        // If no imports found, add at the top
        content = "import config from '../config';\n" + content;
      }
    }

    // Only write if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated API URLs in ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
    return false;
  }
}

// Main function
function main() {
  const srcDir = path.join(__dirname, 'src');
  const jsFiles = findJsFiles(srcDir);
  
  let updatedCount = 0;
  
  jsFiles.forEach(file => {
    const updated = updateApiUrls(file);
    if (updated) updatedCount++;
  });
  
  console.log(`\nCompleted! Updated ${updatedCount} files.`);
}

// Run the script
main();
