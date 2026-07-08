const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));

// Handle direct navigation to pages without .html extension
app.get('*', (req, res, next) => {
  if (!path.extname(req.path) && req.path !== '/') {
    const filePath = path.join(__dirname, req.path + '.html');
    res.sendFile(filePath, (err) => {
      if (err) {
        // Fall back to index.html if file doesn't exist
        res.sendFile(path.join(__dirname, 'index.html'));
      }
    });
  } else {
    next();
  }
});

// Explicit fallbacks for index or route failures
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
