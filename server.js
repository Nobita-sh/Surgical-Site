/**
 * Standalone Express.js Backend Server for Surgicals.PK Platform
 * Integrates with Neon Serverless PostgreSQL & Persistent JSON Fallback
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const db = require('./db');

// Route Modules
const authRoutes = require('./server/routes/authRoutes');
const productRoutes = require('./server/routes/productRoutes');
const categoryRoutes = require('./server/routes/categoryRoutes');
const orderRoutes = require('./server/routes/orderRoutes');
const auditRoutes = require('./server/routes/auditRoutes');
const settingsRoutes = require('./server/routes/settingsRoutes');
const brandRoutes = require('./server/routes/brandRoutes');
const cmsRoutes = require('./server/routes/cmsRoutes');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

// Global Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Request Logger (Development)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});

// Serve Static Frontend Assets (Production & Static Builds)
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    server: 'Surgicals.PK Full-Stack Engine',
    database: db.isDbConnected() ? 'Neon PostgreSQL (Connected)' : 'Local Persistent Engine (Active)',
    timestamp: new Date().toISOString()
  });
});

// Mount Modular REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/cms', cmsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Single Page Application (SPA) Fallback
app.get('*', (req, res) => {
  const distIndex = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(distIndex)) {
    return res.sendFile(distIndex);
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Express Server (Standalone Local / Node Server)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\nSurgicals.PK Full-Stack Platform running at: http://localhost:${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Database: ${db.isDbConnected() ? 'Neon PostgreSQL' : 'Local Persistent Engine'}`);
    console.log(`API Ready: /api/products, /api/categories, /api/orders, /api/auth\n`);
  });
}


module.exports = app;
