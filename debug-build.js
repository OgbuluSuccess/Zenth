const fs = require('fs');
const path = require('path');

// Define paths
const buildDir = path.join(__dirname, 'build');
const indexPath = path.join(buildDir, 'index.html');

// Read the index.html file
if (fs.existsSync(indexPath)) {
  const content = fs.readFileSync(indexPath, 'utf8');
  
  // Add a script to capture and log errors
  const debugScript = `
  <script>
    // Capture and log all JavaScript errors
    window.addEventListener('error', function(event) {
      console.error('JavaScript Error:', event.error);
      
      // Create a visible error message on the page
      const errorDiv = document.createElement('div');
      errorDiv.style.position = 'fixed';
      errorDiv.style.top = '0';
      errorDiv.style.left = '0';
      errorDiv.style.right = '0';
      errorDiv.style.padding = '20px';
      errorDiv.style.backgroundColor = 'red';
      errorDiv.style.color = 'white';
      errorDiv.style.zIndex = '9999';
      errorDiv.style.fontFamily = 'monospace';
      errorDiv.style.whiteSpace = 'pre-wrap';
      errorDiv.textContent = 'JavaScript Error: ' + (event.error ? event.error.toString() : event.message);
      document.body.appendChild(errorDiv);
      
      return false;
    });
    
    // Log when the DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
      console.log('DOM fully loaded');
      
      // Check if React has mounted anything
      setTimeout(function() {
        const rootElement = document.getElementById('root');
        console.log('Root element content:', rootElement ? rootElement.innerHTML : 'Not found');
        
        if (rootElement && !rootElement.hasChildNodes()) {
          console.error('React did not render anything in the root element');
          
          // Create a visible message
          const messageDiv = document.createElement('div');
          messageDiv.style.padding = '20px';
          messageDiv.style.margin = '20px';
          messageDiv.style.backgroundColor = '#f8f9fa';
          messageDiv.style.border = '1px solid #ddd';
          messageDiv.style.borderRadius = '5px';
          messageDiv.innerHTML = '<h2>Debugging Information</h2><p>React application failed to render. Check the console for errors.</p>';
          rootElement.appendChild(messageDiv);
        }
      }, 1000);
    });
  </script>
  `;
  
  // Insert the debug script right before the closing </body> tag
  const modifiedContent = content.replace('</body>', `${debugScript}\n</body>`);
  
  // Write the modified file
  fs.writeFileSync(indexPath, modifiedContent);
  console.log('Added debugging script to index.html');
  
  // Also create a simple test HTML file in the build directory
  const testHtmlPath = path.join(buildDir, 'test.html');
  const testHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Build Test Page</title>
    <style>
      body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
      img { max-width: 100%; border: 1px solid #ddd; margin: 10px 0; }
      .success { color: green; }
      .error { color: red; }
    </style>
  </head>
  <body>
    <h1>Build Test Page</h1>
    <p>This page tests if your build directory is working correctly.</p>
    
    <h2>Static Files Test</h2>
    <div id="js-test">Testing JavaScript...</div>
    <div id="css-test">Testing CSS...</div>
    
    <h2>Image Test</h2>
    <div>
      <h3>Logo</h3>
      <img src="/img/core-img/logo.png" alt="Logo" onerror="this.parentNode.innerHTML += '<p class=\'error\'>Failed to load logo</p>'" onload="this.parentNode.innerHTML += '<p class=\'success\'>Logo loaded successfully</p>'">
    </div>
    
    <script>
      // Test if JavaScript is working
      document.getElementById('js-test').innerHTML = '<p class="success">JavaScript is working!</p>';
      
      // Test if CSS from main bundle is loading
      const cssLoaded = Array.from(document.styleSheets).some(sheet => {
        try {
          return sheet.href && sheet.href.includes('main');
        } catch (e) {
          return false;
        }
      });
      
      document.getElementById('css-test').innerHTML = cssLoaded ? 
        '<p class="success">CSS is loading!</p>' : 
        '<p class="error">CSS is not loading properly</p>';
      
      // Log environment info
      console.log('Window location:', window.location.href);
      console.log('Document readyState:', document.readyState);
    </script>
  </body>
  </html>
  `;
  
  fs.writeFileSync(testHtmlPath, testHtml);
  console.log('Created test.html in build directory');
  
} else {
  console.error('index.html not found in build directory');
}
