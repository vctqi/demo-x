const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./config/db');
const apiRoutes = require('./controllers/apiController');
const errorHandler = require('./middleware/errorHandler');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app in production
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// API routes
app.use('/api', apiRoutes);

// For any other request, send the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
});

// Error handling middleware
app.use(errorHandler);

// Initialize database
initDb()
  .then(() => {
    console.log('Database initialized successfully');
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

module.exports = app; // For testing