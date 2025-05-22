const fs = require('fs');
const path = require('path');

// List of admin files that need fixing
const adminFiles = [
  path.join(__dirname, 'src', 'pages', 'admin', 'AdminDashboardNew.js'),
  path.join(__dirname, 'src', 'pages', 'admin', 'InvestmentPlansManager.js'),
  path.join(__dirname, 'src', 'pages', 'admin', 'UserManagement.js')
];

// Fix each file
adminFiles.forEach(filePath => {
  // Read the file content
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${path.basename(filePath)}:`, err);
      return;
    }

    // Fix the import path
    let fixedContent = data.replace(
      /import config from '\.\.\/config';/g, 
      "import config from '../../config';"
    );
    
    // Write the fixed content back to the file
    fs.writeFile(filePath, fixedContent, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file ${path.basename(filePath)}:`, err);
        return;
      }
      console.log(`Successfully fixed import in ${path.basename(filePath)}`);
    });
  });
});
