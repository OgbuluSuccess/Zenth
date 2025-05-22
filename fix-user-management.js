const fs = require('fs');
const path = require('path');

// Path to the file that needs fixing
const filePath = path.join(__dirname, 'src', 'pages', 'admin', 'UserManagement.js');

// Read the file content
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Fix the syntax errors in the file
  let fixedContent = data;
  
  // Fix the template literals with mismatched quotes
  fixedContent = fixedContent.replace(/`\${config\.apiUrl}\/users\/admin\/all'/g, '`${config.apiUrl}/users/admin/all`');
  fixedContent = fixedContent.replace(/`\${config\.apiUrl}\/users\/admin\/create'/g, '`${config.apiUrl}/users/admin/create`');
  
  // Write the fixed content back to the file
  fs.writeFile(filePath, fixedContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Successfully fixed UserManagement.js');
  });
});
