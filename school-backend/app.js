const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const apiRoutes = require('./routes/index.routes');
const errorMiddleware = require('./middlewares/error.middleware');
const env = require('./config/env');

const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false // Allows loading uploaded images directly on frontend
}));

// CORS Configuration
app.use(cors({
  origin: '*', // For local dev, allows all origins. Can restrict to http://localhost:4200 in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers & Compressors
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files Statically
app.use('/uploads', express.static(path.join(__dirname, env.uploadDir)));

// Retroactive Fallback for misrouted uploads (e.g. images uploaded as attachments)
app.use('/uploads/:folder/:filename', (req, res, next) => {
  const { folder, filename } = req.params;
  const uploadDir = path.join(__dirname, env.uploadDir);
  const alternativeFolders = ['attachments', 'images', 'resumes'].filter(f => f !== folder);

  for (const alt of alternativeFolders) {
    const altFilePath = path.join(uploadDir, alt, filename);
    if (fs.existsSync(altFilePath)) {
      return res.sendFile(altFilePath);
    }
  }
  next();
});

// Health Check API
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// API Routes prefix mapping
app.use('/api', apiRoutes);

// Fallback for Page Not Found (404)
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found: [${req.method}] ${req.originalUrl}` });
});

// Centralized Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
