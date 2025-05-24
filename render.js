const express = require('express');
const path = require('path');
const app = express();

// Import your server configuration
require('./server/server');

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Render deployment server running on port ${PORT}`);
});
