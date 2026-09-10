/**
 * Database Migration & Seeding Runner for Neon PostgreSQL
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

async function runMigration() {
  console.log('[Migrate] Connecting to Neon PostgreSQL...');
  
  if (!process.env.DATABASE_URL) {
    console.error('[Error] DATABASE_URL not found in .env');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const client = await pool.connect();
    console.log('[Migrate] Successfully connected to Neon PostgreSQL.');

    // 1. Read and run schema.sql
    const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');
    console.log('[Migrate] Executing schema.sql tables creation...');
    await client.query(schemaSql);
    console.log('[Migrate] Database tables created/verified (categories, products, orders, users).');

    // 2. Check if categories exist
    const catCheck = await client.query('SELECT COUNT(*) FROM categories');
    const catCount = parseInt(catCheck.rows[0].count, 10);
    console.log(`[Migrate] Current categories in database: ${catCount}`);

    // Load initial store seed data
    const Store = require('../server/data/store');
    const storeCategories = await Store.getCategories();
    const storeProducts = await Store.getProducts();

    if (catCount === 0) {
      console.log(`[Migrate] Seeding ${storeCategories.length} categories into Neon...`);
      for (const cat of storeCategories) {
        await client.query(
          `INSERT INTO categories (id, name, slug, image, item_count)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO NOTHING`,
          [cat.id, cat.name, cat.slug, cat.image || '', 0]
        );
      }
      console.log('[Migrate] Categories seeded successfully.');
    }

    // 3. Check if products exist
    const prodCheck = await client.query('SELECT COUNT(*) FROM products');
    const prodCount = parseInt(prodCheck.rows[0].count, 10);
    console.log(`[Migrate] Current products in database: ${prodCount}`);

    if (prodCount === 0) {
      console.log(`[Migrate] Seeding ${storeProducts.length} initial products into Neon...`);
      for (const prod of storeProducts) {
        await client.query(
          `INSERT INTO products (id, name, slug, category_id, category_name, price, original_price, on_sale, stock, sku, image, description, specifications, certifications)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT (id) DO NOTHING`,
          [
            prod.id,
            prod.name,
            prod.slug,
            prod.categoryId,
            prod.categoryName || 'General Equipment',
            prod.price,
            prod.originalPrice || null,
            prod.onSale || false,
            prod.stock || 10,
            prod.sku || 'SKU-' + Math.floor(100 + Math.random() * 900),
            prod.image,
            prod.description || prod.shortDescription || '',
            JSON.stringify(prod.specifications || {}),
            JSON.stringify(prod.certifications || ["ISO 13485 Medical Grade"])
          ]
        );
      }
      console.log('[Migrate] Products seeded successfully.');
    }

    // 4. Verification queries
    const finalCats = await client.query('SELECT COUNT(*) FROM categories');
    const finalProds = await client.query('SELECT COUNT(*) FROM products');
    console.log(`\n[Migrate] Verification Complete:`);
    console.log(`- Categories in Neon DB: ${finalCats.rows[0].count}`);
    console.log(`- Products in Neon DB: ${finalProds.rows[0].count}`);

    client.release();
    await pool.end();
    console.log('\n[Migrate] Database is 100% migrated, seeded, and ready for production!\n');
    process.exit(0);
  } catch (err) {
    console.error('[Error] Migration failed:', err);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
