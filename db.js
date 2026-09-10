const { Pool } = require('pg');
require('dotenv').config();

let pool = null;
let isConnected = false;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  pool.connect()
    .then(client => {
      console.log('✅ Connected successfully to Neon PostgreSQL database.');
      isConnected = true;
      client.release();
    })
    .catch(err => {
      console.warn('[DB] Neon Database connection notice:', err.message);
      console.log('[DB] Running with persistent Local Store fallback.');
      isConnected = false;
    });
} else {
  console.log('ℹ️ No DATABASE_URL found. Running with local persistent data engine.');
}

async function query(text, params) {
  if (!pool) {
    return null;
  }
  try {
    const res = await pool.query(text, params);
    isConnected = true;
    return res;
  } catch (err) {
    console.error('Database query error:', err.message);
    return null;
  }
}

async function getClient() {
  if (!pool) return null;
  try {
    return await pool.connect();
  } catch (err) {
    console.error('Database client checkout error:', err.message);
    return null;
  }
}

module.exports = {
  query,
  getClient,
  isDbConnected: () => isConnected,
  getPool: () => pool
};
