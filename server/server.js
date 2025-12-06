const path = require('path');
const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

// Load environment variables only in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });
}

// Connect to MongoDB
connectDB();

// Routes
const transactions = require('./routes/transactions');

const app = express();

// Body parser
app.use(express.json());

// Logging middleware in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API routes
app.use('/api/v1/transactions', transactions);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) =>
    res.sendFile(path.join(clientBuildPath, 'index.html'))
  );
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack.red);
  res.status(500).json({ success: false, error: 'Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
