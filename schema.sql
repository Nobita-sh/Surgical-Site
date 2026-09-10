-- Schema for E-Site (Surgicals.PK) on Neon PostgreSQL

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(50),
  image VARCHAR(255),
  item_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category_id VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
  category_name VARCHAR(100),
  price NUMERIC(12, 2) NOT NULL,
  original_price NUMERIC(12, 2),
  on_sale BOOLEAN DEFAULT false,
  stock INT DEFAULT 10,
  sku VARCHAR(50),
  rating NUMERIC(3, 2) DEFAULT 5.00,
  review_count INT DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  best_seller BOOLEAN DEFAULT false,
  image VARCHAR(255) NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  short_description TEXT,
  description TEXT,
  specifications JSONB DEFAULT '{}'::jsonb,
  certifications JSONB DEFAULT '["ISO 13485", "CE Certified"]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(100),
  delivery_address TEXT NOT NULL,
  city VARCHAR(50) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'Pending',
  order_status VARCHAR(50) DEFAULT 'Pending', -- Pending, Processing, Shipped, Delivered, Cancelled
  subtotal NUMERIC(12, 2) NOT NULL,
  shipping_fee NUMERIC(12, 2) DEFAULT 0,
  discount NUMERIC(12, 2) DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL,
  items JSONB NOT NULL,
  notes TEXT,
  courier_name VARCHAR(100),
  tracking_number VARCHAR(100),
  assigned_courier_id VARCHAR(50),
  assigned_courier_name VARCHAR(100),
  support_notes JSONB DEFAULT '[]'::jsonb,
  delivery_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(20) DEFAULT 'customer', -- customer, admin, staff
  permissions JSONB DEFAULT '[]'::jsonb, -- ['orders', 'products', 'support', 'delivery']
  status VARCHAR(20) DEFAULT 'active', -- active, inactive
  password_hash VARCHAR(255),
  hospital_clinic_name VARCHAR(150),
  city VARCHAR(50),
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret VARCHAR(255),
  two_factor_recovery_codes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ensure columns exist if table was already created earlier
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_recovery_codes JSONB DEFAULT '[]'::jsonb;

