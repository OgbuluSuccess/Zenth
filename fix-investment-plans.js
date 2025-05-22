const fs = require('fs');
const path = require('path');

// Path to the file that needs fixing
const filePath = path.join(__dirname, 'src', 'pages', 'admin', 'InvestmentPlansManager.js');

// Read the file content
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Fix the syntax errors in the file
  let fixedContent = data;
  
  // Fix the template literals with mismatched quotes
  fixedContent = fixedContent.replace(/`\${config\.apiUrl}\/investment-plans'/g, '`${config.apiUrl}/investment-plans`');
  
  // Write the fixed content back to the file
  fs.writeFile(filePath, fixedContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Successfully fixed InvestmentPlansManager.js');
  });
});
