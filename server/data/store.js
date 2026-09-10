const fs = require('fs');
const path = require('path');
const db = require('../../db');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed helper
const catImg = (label) => `https://placehold.co/200x200/f8f6f6/333333?text=${encodeURIComponent(label)}`;
const prodImg = (label) => `https://placehold.co/400x400/fafafa/000000?text=${encodeURIComponent(label)}`;

const INITIAL_CATEGORIES = [
  { id: 'anti-embolism', name: 'Anti Embolism Stocking', slug: 'anti-embolism-stocking', image: catImg('Stockings') },
  { id: 'autoclave-sterilizer', name: 'Autoclave & Sterilizer', slug: 'autoclave-sterilizer', image: catImg('Sterilizer') },
  { id: 'blood-pressure-monitors', name: 'Blood Pressure Monitors', slug: 'blood-pressure-monitors', image: catImg('BP Monitor') },
  { id: 'cervical-collar', name: 'Cervical Collar', slug: 'cervical-collar', image: catImg('Collar') },
  { id: 'commode-chair', name: 'Commode Chair', slug: 'commode-chair', image: catImg('Commode') },
  { id: 'diagnostic-accessories', name: 'Diagnostic Accessories', slug: 'diagnostic-accessories', image: catImg('Diagnostic') },
  { id: 'disposable-items', name: 'Disposable Items', slug: 'disposable-items', image: catImg('Disposable') },
  { id: 'doctor-kits', name: 'Doctor Kits', slug: 'doctor-kits', image: catImg('Doctor Kit') },
  { id: 'ecg-machine', name: 'ECG Machine', slug: 'ecg-machine', image: catImg('ECG Machine') },
  { id: 'electro-medical', name: 'Electro Medical Equipment', slug: 'electro-medical', image: catImg('Electro Medical') },
  { id: 'emergency-relief', name: 'Emergency Relief', slug: 'emergency-relief', image: catImg('Emergency') },
  { id: 'ent-equipment', name: 'ENT Equipment', slug: 'ent-equipment', image: catImg('ENT Equipment') },
  { id: 'glucometer', name: 'Glucometer', slug: 'glucometer', image: catImg('Glucometer') },
  { id: 'gynae-instruments', name: 'Gynae Instruments', slug: 'gynae-instruments', image: catImg('Gynae') },
  { id: 'hospital-furniture', name: 'Hospital Furniture', slug: 'hospital-furniture', image: catImg('Furniture') },
  { id: 'knee-support', name: 'Knee Support', slug: 'knee-support', image: catImg('Knee Support') }
];

const INITIAL_PRODUCTS = [
  {
    id: 'SPK-1001',
    name: 'Ultrasonic Therapy Machine for Physiotherapy',
    slug: 'ultrasonic-therapy-machine-physiotherapy',
    categoryId: 'electro-medical',
    categoryName: 'Electro Medical',
    price: 44500,
    originalPrice: 46000,
    onSale: true,
    stock: 14,
    sku: 'PHY-ULT-01',
    rating: 4.9,
    reviewCount: 42,
    featured: true,
    bestSeller: true,
    image: '/assets/products/ultrasonic-therapy.png',
    shortDescription: 'Professional clinical ultrasonic physiotherapy unit for deep muscle recovery and joint pain relief.',
    description: 'Concentrated deep-penetrating ultrasonic waves (1MHz / 3MHz) with built-in digital timer and probe transducer.',
    specifications: { "Frequency": "1.0 MHz", "Max Power": "15 Watts", "Power Supply": "AC 220V / 50Hz" },
    certifications: ["ISO 13485 Medical Grade", "CE Certified"]
  },
  {
    id: 'SPK-1002',
    name: 'Digital Ultrasonic Diagnostic Imaging System DP-10',
    slug: 'digital-ultrasonic-diagnostic-imaging-system-dp-10',
    categoryId: 'diagnostic-accessories',
    categoryName: 'Diagnostic Accessories',
    price: 570000,
    originalPrice: 575000,
    onSale: true,
    stock: 4,
    sku: 'IMG-DP10-02',
    rating: 5.0,
    reviewCount: 18,
    featured: true,
    bestSeller: true,
    image: '/assets/products/dp10-ultrasound.png',
    shortDescription: 'Mindray DP-10 digital B/W ultrasound system with high-resolution LED monitor.',
    description: 'Equipped with a 12.1-inch tiltable LED screen, full digital beam-forming technology, and dual transducer ports.',
    specifications: { "Display": "12.1-inch LED", "Weight": "5.5 kg", "Storage": "500 GB HDD" },
    certifications: ["FDA Approved", "CE 0123", "ISO 13485"]
  },
  {
    id: 'SPK-1003',
    name: 'Electric Wheel Chair for Heavy Duty X-Large',
    slug: 'electric-wheel-chair-heavy-duty-x-large',
    categoryId: 'commode-chair',
    categoryName: 'Rehabilitation & Mobility',
    price: 195000,
    originalPrice: 200000,
    onSale: true,
    stock: 8,
    sku: 'RBL-WCH-XL03',
    rating: 4.8,
    reviewCount: 29,
    featured: true,
    bestSeller: true,
    image: '/assets/products/wheelchair.png',
    shortDescription: 'Motorized heavy-duty power wheelchair with 360-degree intelligent joystick and electromagnetic brakes.',
    description: 'Reinforced aerospace-grade aluminum alloy frame with wide padded seat, flip-up armrests, and 24V lithium battery.',
    specifications: { "Motor": "Dual 250W Brushless", "Range": "~25 km", "Capacity": "150 kg" },
    certifications: ["CE Certified", "ISO 7176"]
  },
  {
    id: 'SPK-1004',
    name: 'Standard Commode Wheelchair Chrome Plated',
    slug: 'standard-commode-wheelchair-chrome-plated',
    categoryId: 'commode-chair',
    categoryName: 'Commode Chair',
    price: 18500,
    originalPrice: 19500,
    onSale: true,
    stock: 22,
    sku: 'CMD-WCH-04',
    rating: 4.7,
    reviewCount: 35,
    featured: false,
    bestSeller: true,
    image: '/assets/products/commode-chair.png',
    shortDescription: 'Multi-functional patient commode chair with integrated waste bucket and heavy-duty wheels.',
    description: 'Chrome plated steel structure, water-resistant vinyl seat cushion, removable toilet pan, and foot brakes.',
    specifications: { "Material": "Chrome Steel", "Weight Capacity": "120 kg" },
    certifications: ["ISO 9001"]
  },
  {
    id: 'SPK-1005',
    name: 'Digital Upper Arm Blood Pressure Monitor M2 Basic',
    slug: 'digital-upper-arm-blood-pressure-monitor-m2-basic',
    categoryId: 'blood-pressure-monitors',
    categoryName: 'Blood Pressure Monitors',
    price: 8900,
    originalPrice: 9500,
    onSale: true,
    stock: 45,
    sku: 'BPM-M2-05',
    rating: 4.9,
    reviewCount: 88,
    featured: true,
    bestSeller: true,
    image: '/assets/products/bp-monitor.png',
    shortDescription: 'Automatic digital arm blood pressure monitor with Intellisense technology and hypertension indicator.',
    description: 'Clinically validated accurate oscillometric measurement with comfortable wide cuff (22-32 cm) and memory recall.',
    specifications: { "Measurement": "Oscillometric", "Accuracy": "Pressure ±3 mmHg" },
    certifications: ["CE Certified", "AAMI Clinically Validated"]
  },
  {
    id: 'SPK-1006',
    name: 'Hospital ICU Patient Monitor 6-Parameter Vital Signs',
    slug: 'hospital-icu-patient-monitor-6-parameter-vital-signs',
    categoryId: 'electro-medical',
    categoryName: 'Electro Medical Equipment',
    price: 145000,
    originalPrice: 155000,
    onSale: true,
    stock: 6,
    sku: 'MON-ICU-06',
    rating: 5.0,
    reviewCount: 12,
    featured: true,
    bestSeller: false,
    image: '/assets/products/icu-monitor.png',
    shortDescription: 'Multi-parameter bedside vital signs monitor for ECG, NIBP, SpO2, Resp, Temp, and Pulse.',
    description: '12.1-inch color TFT display with multi-lead ECG waveform review, visual and audible multi-level alarms, and rechargeable lithium battery.',
    specifications: { "Parameters": "ECG, SpO2, NIBP, RESP, 2-TEMP, PR", "Display": "12.1 inch TFT" },
    certifications: ["CE Certified", "ISO 13485 Medical"]
  }
];

const INITIAL_USERS = [
  {
    id: 'USR-1001',
    name: 'Dr. Muhammad Tariq',
    email: 'doctor@surgicals.pk',
    phone: '0300-1234567',
    password: 'password123',
    role: 'doctor',
    hospitalClinicName: 'National Hospital Lahore',
    city: 'Lahore',
    createdAt: new Date().toISOString()
  },
  {
    id: 'USR-1002',
    name: 'Admin Procurement Desk',
    email: 'admin@surgicals.pk',
    phone: '0303-7333378',
    password: 'adminpassword',
    role: 'admin',
    hospitalClinicName: 'Surgicals.PK Operations',
    city: 'Lahore',
    createdAt: new Date().toISOString()
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-98421',
    customerName: 'Dr. Muhammad Tariq',
    customerPhone: '0300-1234567',
    customerEmail: 'doctor@surgicals.pk',
    deliveryAddress: 'Suite 402, Doctors Medical Chambers, Jail Road',
    city: 'Lahore',
    paymentMethod: 'cod',
    paymentStatus: 'Pending',
    orderStatus: 'Dispatched via Daewoo Fastex',
    trackingNumber: 'DW-7829104',
    courierName: 'Daewoo Fastex',
    subtotal: 44500,
    shippingFee: 0,
    total: 44500,
    items: [
      {
        id: 'SPK-1001',
        name: 'Ultrasonic Therapy Machine for Physiotherapy',
        price: 44500,
        quantity: 1,
        image: prodImg('Ultrasound Therapy')
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

const INITIAL_BRANDS = [
  { id: 'b1', name: 'Omron Healthcare', country: 'Japan', status: 'Authorized Partner', logo: '/assets/brands/omron.svg', active: true },
  { id: 'b2', name: 'Beurer Medical', country: 'Germany', status: 'Official Distributor', logo: '/assets/brands/beurer.svg', active: true },
  { id: 'b3', name: 'Certeza Medical', country: 'Germany', status: 'Authorized Partner', logo: '/assets/brands/certeza.svg', active: true },
  { id: 'b4', name: 'OppO Orthopedics', country: 'USA', status: 'Direct Importer', logo: '/assets/brands/oppo.svg', active: true },
  { id: 'b5', name: 'Tanita Corporation', country: 'Japan', status: 'Official Distributor', logo: '/assets/brands/tanita.svg', active: true },
  { id: 'b6', name: 'Mindray Biomedical', country: 'Global', status: 'Clinical Partner', logo: '/assets/brands/mindray.svg', active: true },
  { id: 'b7', name: 'Citizen Systems', country: 'Japan', status: 'Authorized Partner', logo: '/assets/brands/citizen.svg', active: true },
  { id: 'b8', name: 'Besmed Health', country: 'Taiwan', status: 'Authorized Partner', logo: '/assets/brands/besmed.svg', active: true },
  { id: 'b9', name: 'Believia Diagnostics', country: 'UK', status: 'Official Distributor', logo: '/assets/brands/believia.svg', active: true }
];

const INITIAL_HOMEPAGE_SECTIONS = [
  {
    id: 'hero',
    name: 'Hero Showcase Banner',
    active: true,
    desc: 'Main promotional hero banner with headline, subtext, and call-to-action buttons',
    content: {
      tagline: 'Online Surgical Equipment store in Pakistan',
      title: 'Boost Your Health with Surgicals.pk',
      subtext: 'Shop hospital-grade surgical items, medical furniture, diagnostic devices, and mobility aids with 100% genuine warranty & nationwide delivery.',
      primaryBtnText: 'SHOP NOW',
      primaryBtnLink: '/shop',
      whatsappBtnText: 'ORDER ON WHATSAPP',
      whatsappNumber: '923037333378'
    }
  },
  {
    id: 'categories',
    name: 'Most Selling Categories Hub',
    active: true,
    desc: 'Interactive category slider with real equipment photography',
    content: {
      title: 'MOST SELLING CATEGORIES',
      subtitle: 'Browse certified hospital and clinical equipment'
    }
  },
  {
    id: 'belts',
    name: 'Unisex Body Belts & Rehabilitation',
    active: true,
    desc: 'Orthopedic braces and rehabilitation support showcase',
    content: {
      title: 'UNISEX BODY BELT & BRACES',
      viewAllText: 'View All',
      viewAllLink: '/category/knee-support'
    }
  },
  {
    id: 'promo-3col',
    name: '3-Column Promotional Banners',
    active: true,
    desc: 'Feature cards highlighting Wheelchairs, Commode Chairs, and Walkers',
    content: {
      card1Title: 'Wheel Chair',
      card1Link: '/category/commode-chair',
      card1Image: '/assets/banners/wheelchair.png',
      card2Title: 'Commode-Chairs',
      card2Link: '/category/commode-chair',
      card2Image: '/assets/banners/commode-chair.png',
      card3Title: 'Walkers',
      card3Link: '/category/commode-chair',
      card3Image: '/assets/banners/walker.png'
    }
  },
  {
    id: 'promo-split',
    name: '2-Column Split Promotional Banners',
    active: true,
    desc: 'Special items on sale and latest medical equipment split cards',
    content: {
      splitLeftTitle: 'Items on Sale',
      splitLeftDiscount: 'Up to 25% Off',
      splitLeftLink: '/shop',
      splitRightTitle: 'Latest Medical Equipment',
      splitRightDiscount: 'New Arrivals',
      splitRightLink: '/shop'
    }
  },
  {
    id: 'brands',
    name: 'Official Brand Partners',
    active: true,
    desc: 'Swipeable brand logo showcase (Omron, Beurer, Certeza, Tanita)',
    content: {
      title: 'OFFICIAL MEDICAL BRAND PARTNERS'
    }
  },
  {
    id: 'best-sellers',
    name: 'Best Selling Products Grid',
    active: true,
    desc: '5-column product catalog showcase with quick cart triggers',
    content: {
      title: 'BEST SELLING PRODUCTS',
      subtitle: 'Top demanded clinical tools and home healthcare items',
      itemLimit: 10
    }
  },
  {
    id: 'story',
    name: 'Medical Authority & Brand Story',
    active: true,
    desc: 'Narrative SEO story detailing Surgicals.pk clinical authority and reliability',
    content: {
      heading: 'Leading Surgical & Medical Equipment Supplier in Pakistan',
      paragraph1: 'Welcome to Surgicals.pk. We are the proud supplier of physiotherapy machines and related instruments to clinics, hospitals, and home users across Pakistan. Whether you are looking for equipment like body massagers and heating pads, or a professional looking to upgrade your facility with advanced exercise machines, we have got you covered.',
      paragraph2: 'Now you can save on the best physiotherapy machines for clinical and home use. Scroll our verified catalog of modern physical therapy modalities engineered to assist rapid patient rehabilitation and recovery.',
      paragraph3: 'We are envisioned to remain Pakistan\'s most trusted medical supply partner with DRAP compliance, genuine manufacturer warranties, and dedicated biomedical after-sales support.'
    }
  }
];

const INITIAL_PROMOS = {
  announcementText: 'Free Express Delivery on orders above Rs 5,000 across Lahore & Nationwide Dispatch via TCS / Daewoo Fastex',
  vouchers: [
    { code: 'SURGICAL10', discount: '10% OFF', type: 'Percentage', minOrder: 3000, status: 'Active' },
    { code: 'HOSPITAL15', discount: '15% OFF', type: 'Institutional', minOrder: 50000, status: 'Active' },
    { code: 'FIRSTAID', discount: 'Rs 500 OFF', type: 'Fixed', minOrder: 2500, status: 'Active' }
  ]
};

const INITIAL_POLICY_DATA = {
  privacy: {
    title: 'Privacy Policy',
    effectiveDate: 'January 1, 2025',
    supportEmail: 'privacy@surgicals.pk',
    dpoOfficer: 'Compliance & Clinical Records Officer',
    retentionYears: '7 Years (DRAP Clinical Standard)'
  },
  terms: {
    title: 'Terms & Conditions',
    effectiveDate: 'January 1, 2025',
    jurisdiction: 'Lahore, Punjab, Pakistan',
    advancePaymentThreshold: 'Rs. 50,000 (Machinery & Ultrasound Units)',
    warrantyPeriod: '1 to 3 Years Official Manufacturer Warranty'
  },
  returns: {
    title: 'Return, Refund & Warranty Policy',
    guaranteeDays: '7 Days Inspection Period',
    claimsHelpline: '+92 300 0000000',
    payoutMethods: 'Direct IBAN Bank Transfer, EasyPaisa, JazzCash',
    pickupCourier: 'TCS Express / Leopards Courier'
  }
};

const INITIAL_HEADER_FOOTER = {
  header: {
    storeName: 'Surgicals.pk',
    logoText: 'surgicals.pk',
    logoIcon: '✚',
    topBarPhone: '0303-7333378',
    announcementText: 'Free Shipping on Orders Above Rs. 5,000 across Pakistan!'
  },
  footer: {
    platformTitle: "PAKISTAN'S LARGEST HEALTHCARE PLATFORM",
    stat1Number: '1M+',
    stat1Label: 'Satisfied Buyers',
    stat2Number: '2M+',
    stat2Label: 'Orders Delivered',
    stat3Number: '100%',
    stat3Label: 'Moneyback Guarantee',
    value1Title: 'Reliable',
    value1Desc: 'All products displayed are verified and of high quality with 100% satisfaction.',
    value2Title: 'Secure',
    value2Desc: 'SSL 128-bit encryption and Payment Card Industry Data Security Standard compliant.',
    value3Title: 'Affordable',
    value3Desc: 'Find affordable surgical items, save up to 60% on health products.',
    phone: '0303 7333378',
    facebookUrl: 'https://www.facebook.com/Surgicalspk-105652255520730',
    linkedinUrl: 'https://www.linkedin.com/in/surgicals-pk-384448250/',
    instagramUrl: 'https://www.instagram.com/surgicals_pk/',
    copyrightText: '© 2007-2025 Surgicals.pk . Market By Hukumat Networks'
  },
  seo: {
    metaTitle: 'Surgicals.PK - Hospital & Medical Equipment Pakistan',
    metaDescription: 'Shop verified hospital-grade surgical items, medical furniture, diagnostic devices, and mobility aids with 100% genuine warranty & nationwide delivery.',
    metaKeywords: 'surgical equipment pakistan, medical instruments lahore, hospital furniture, physiotherapy machines'
  },
  categoryDefaults: {
    tagline: 'High grade medical and surgical supplies certified for clinical use across Pakistan.'
  }
};

const INITIAL_SETTINGS = {
  storeName: 'Surgicals.pk',
  contactEmail: 'support@surgicals.pk',
  contactPhone: '0303-7333378',
  shippingFlatRate: 250,
  freeShippingThreshold: 5000,
  currency: 'PKR',
  taxRate: 0,
  fbrNtn: '8192041-3',
  bankName: 'Meezan Bank Limited',
  accountTitle: 'Surgicals PK Healthcare Supplies',
  accountNumber: 'PK36MEZN0001020105829102',
  maintenanceMode: false
};

// Initialize or load JSON file
function loadStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, 'utf8');
      const parsed = JSON.parse(data);
      let changed = false;
      if (!parsed.brands) { parsed.brands = INITIAL_BRANDS; changed = true; }
      if (!parsed.homepageSections) { parsed.homepageSections = INITIAL_HOMEPAGE_SECTIONS; changed = true; }
      if (!parsed.promos) { parsed.promos = INITIAL_PROMOS; changed = true; }
      if (!parsed.policyData) { parsed.policyData = INITIAL_POLICY_DATA; changed = true; }
      if (!parsed.settings || Object.keys(parsed.settings).length === 0) { parsed.settings = INITIAL_SETTINGS; changed = true; }
      if (!parsed.headerFooterData) { parsed.headerFooterData = INITIAL_HEADER_FOOTER; changed = true; }
      if (changed) saveStore(parsed);
      return parsed;
    }
  } catch (err) {
    console.error('Error reading store.json, re-initializing:', err.message);
  }

  const initial = {
    categories: INITIAL_CATEGORIES,
    products: INITIAL_PRODUCTS,
    users: INITIAL_USERS,
    orders: INITIAL_ORDERS,
    brands: INITIAL_BRANDS,
    homepageSections: INITIAL_HOMEPAGE_SECTIONS,
    promos: INITIAL_PROMOS,
    policyData: INITIAL_POLICY_DATA,
    auditLogs: [],
    settings: {
      storeName: 'Surgicals.PK',
      contactEmail: 'info@surgicals.pk',
      contactPhone: '0303-7333378',
      shippingFlatRate: 250,
      freeShippingThreshold: 10000,
      currency: 'PKR',
      taxRate: 17,
      maintenanceMode: false
    }
  };
  saveStore(initial);
  return initial;
}

function saveStore(store) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write store.json:', err.message);
  }
}

// Pre-initialize store file on startup
loadStore();

// Data Access Layer Object
const Store = {
  // Categories
  async getCategories() {
    if (db.isDbConnected()) {
      const res = await db.query('SELECT * FROM categories ORDER BY name ASC');
      if (res && res.rows.length > 0) return res.rows;
    }
    const store = loadStore();
    return store.categories || [];
  },

  async createCategory(data) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = data.id || slug;
    const category = {
      id,
      name: data.name,
      slug,
      image: data.image || catImg(data.name),
      description: data.description || ''
    };

    if (db.isDbConnected()) {
      await db.query(
        `INSERT INTO categories (id, name, slug, image) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING`,
        [category.id, category.name, category.slug, category.image]
      );
    }

    const store = loadStore();
    store.categories = [...(store.categories || []), category];
    saveStore(store);
    return category;
  },

  async deleteCategory(id) {
    const store = loadStore();
    const beforeCount = (store.categories || []).length;
    store.categories = (store.categories || []).filter(c => c.id !== id);
    saveStore(store);

    if (db.isDbConnected()) {
      await db.query('DELETE FROM categories WHERE id = $1', [id]);
    }

    return store.categories.length < beforeCount;
  },

  // Products
  async getProducts(filter = {}) {
    if (db.isDbConnected()) {
      let queryText = 'SELECT * FROM products';
      const params = [];
      if (filter.categoryId && filter.categoryId !== 'all') {
        params.push(filter.categoryId);
        queryText += ` WHERE category_id = $${params.length}`;
      }
      queryText += ' ORDER BY created_at DESC';
      const res = await db.query(queryText, params);
      if (res && res.rows.length > 0) return res.rows;
    }
    const store = loadStore();
    let products = store.products || [];
    if (filter.categoryId && filter.categoryId !== 'all') {
      products = products.filter(p => p.categoryId === filter.categoryId);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q) || (p.shortDescription && p.shortDescription.toLowerCase().includes(q)));
    }
    return products;
  },

  async getProductByIdOrSlug(idOrSlug) {
    if (db.isDbConnected()) {
      const res = await db.query('SELECT * FROM products WHERE id = $1 OR slug = $1 LIMIT 1', [idOrSlug]);
      if (res && res.rows.length > 0) return res.rows[0];
    }
    const store = loadStore();
    return (store.products || []).find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
  },

  async createProduct(data) {
    const id = data.id || 'SPK-' + Math.floor(1000 + Math.random() * 9000);
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const product = {
      id,
      slug,
      name: data.name,
      categoryId: data.categoryId || 'diagnostic-accessories',
      categoryName: data.categoryName || 'General Equipment',
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
      onSale: !!data.originalPrice && Number(data.originalPrice) > Number(data.price),
      stock: Number(data.stock) || 10,
      sku: data.sku || 'SKU-' + Math.floor(100 + Math.random() * 900),
      image: data.image || prodImg(data.name),
      shortDescription: data.shortDescription || data.description?.slice(0, 120) || '',
      description: data.description || '',
      specifications: data.specifications || {},
      certifications: data.certifications || ["ISO 13485 Medical Grade"],
      rating: 5.0,
      reviewCount: 1,
      featured: !!data.featured,
      bestSeller: !!data.bestSeller,
      createdAt: new Date().toISOString()
    };

    if (db.isDbConnected()) {
      await db.query(
        `INSERT INTO products (id, name, slug, category_id, category_name, price, original_price, stock, sku, image, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [product.id, product.name, product.slug, product.categoryId, product.categoryName, product.price, product.originalPrice, product.stock, product.sku, product.image, product.description]
      );
    }

    const store = loadStore();
    store.products = [product, ...(store.products || [])];
    saveStore(store);
    return product;
  },

  async updateProduct(id, data) {
    const store = loadStore();
    const idx = (store.products || []).findIndex(p => p.id === id);
    if (idx === -1) return null;

    const updated = { ...store.products[idx], ...data };
    store.products[idx] = updated;
    saveStore(store);

    if (db.isDbConnected()) {
      await db.query(
        `UPDATE products SET name = $1, price = $2, stock = $3 WHERE id = $4`,
        [updated.name, updated.price, updated.stock, id]
      );
    }

    return updated;
  },

  async deleteProduct(id) {
    const store = loadStore();
    const beforeCount = (store.products || []).length;
    store.products = (store.products || []).filter(p => p.id !== id);
    saveStore(store);

    if (db.isDbConnected()) {
      await db.query('DELETE FROM products WHERE id = $1', [id]);
    }

    return store.products.length < beforeCount;
  },

  // Orders
  async getOrders() {
    if (db.isDbConnected()) {
      const res = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
      if (res && res.rows.length > 0) {
        return res.rows.map(row => ({
          id: row.id,
          customerName: row.customer_name || row.customerName,
          customerPhone: row.customer_phone || row.customerPhone,
          customerEmail: row.customer_email || row.customerEmail || '',
          deliveryAddress: row.delivery_address || row.deliveryAddress,
          city: row.city || 'Lahore',
          paymentMethod: row.payment_method || row.paymentMethod || 'cod',
          paymentStatus: row.payment_status || row.paymentStatus || 'Pending',
          orderStatus: row.order_status || row.orderStatus || 'Pending',
          courierName: row.courier_name || row.courierName || 'Daewoo Fastex Express',
          trackingNumber: row.tracking_number || row.trackingNumber || '',
          subtotal: Number(row.subtotal) || 0,
          shippingFee: Number(row.shipping_fee) || 0,
          discount: Number(row.discount) || 0,
          total: Number(row.total) || 0,
          items: typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []),
          notes: row.notes || '',
          assignedCourierId: row.assigned_courier_id || row.assignedCourierId || null,
          assignedCourierName: row.assigned_courier_name || row.assignedCourierName || null,
          supportNotes: typeof row.support_notes === 'string' ? JSON.parse(row.support_notes) : (row.support_notes || []),
          deliveryNotes: row.delivery_notes || row.deliveryNotes || '',
          createdAt: row.created_at || row.createdAt
        }));
      }
    }
    const store = loadStore();
    return (store.orders || []).map(o => ({
      ...o,
      assignedCourierId: o.assignedCourierId || null,
      assignedCourierName: o.assignedCourierName || null,
      supportNotes: o.supportNotes || [],
      deliveryNotes: o.deliveryNotes || ''
    }));
  },

  async getOrderById(idOrPhone) {
    const cleanQuery = String(idOrPhone).trim().toLowerCase();
    if (db.isDbConnected()) {
      const res = await db.query(
        'SELECT * FROM orders WHERE LOWER(id) = $1 OR REPLACE(customer_phone, \'-\', \'\') = $2 LIMIT 1',
        [cleanQuery, cleanQuery.replace(/[^0-9]/g, '')]
      );
      if (res && res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          customerName: row.customer_name || row.customerName,
          customerPhone: row.customer_phone || row.customerPhone,
          customerEmail: row.customer_email || row.customerEmail || '',
          deliveryAddress: row.delivery_address || row.deliveryAddress,
          city: row.city || 'Lahore',
          paymentMethod: row.payment_method || row.paymentMethod || 'cod',
          paymentStatus: row.payment_status || row.paymentStatus || 'Pending',
          orderStatus: row.order_status || row.orderStatus || 'Pending',
          courierName: row.courier_name || row.courierName || 'Daewoo Fastex Express',
          trackingNumber: row.tracking_number || row.trackingNumber || '',
          subtotal: Number(row.subtotal) || 0,
          shippingFee: Number(row.shipping_fee) || 0,
          discount: Number(row.discount) || 0,
          total: Number(row.total) || 0,
          items: typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []),
          notes: row.notes || '',
          assignedCourierId: row.assigned_courier_id || row.assignedCourierId || null,
          assignedCourierName: row.assigned_courier_name || row.assignedCourierName || null,
          supportNotes: typeof row.support_notes === 'string' ? JSON.parse(row.support_notes) : (row.support_notes || []),
          deliveryNotes: row.delivery_notes || row.deliveryNotes || '',
          createdAt: row.created_at || row.createdAt
        };
      }
    }
    const store = loadStore();
    const found = (store.orders || []).find(o => 
      o.id.toLowerCase() === cleanQuery || 
      (o.customerPhone && o.customerPhone.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, ''))
    );
    return found ? {
      ...found,
      assignedCourierId: found.assignedCourierId || null,
      assignedCourierName: found.assignedCourierName || null,
      supportNotes: found.supportNotes || [],
      deliveryNotes: found.deliveryNotes || ''
    } : null;
  },

  async createOrder(data) {
    const id = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    const order = {
      id,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || '',
      deliveryAddress: data.deliveryAddress,
      city: data.city || 'Lahore',
      paymentMethod: data.paymentMethod || 'cod',
      paymentStatus: 'Pending',
      orderStatus: 'Processing Order',
      courierName: 'Daewoo Fastex Express',
      trackingNumber: 'DW-' + Math.floor(1000000 + Math.random() * 9000000),
      subtotal: Number(data.subtotal) || 0,
      shippingFee: Number(data.shippingFee) || 0,
      discount: Number(data.discount) || 0,
      couponCode: data.couponCode || null,
      total: Number(data.total) || 0,
      items: data.items || [],
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };

    // 1. PostgreSQL Atomic Transaction Execution
    if (db.isDbConnected()) {
      const client = await db.getClient();
      if (client) {
        try {
          await client.query('BEGIN');

          // Atomically decrement stock for each item and verify rowCount
          for (const item of order.items) {
            const qty = Number(item.quantity) || 1;
            const updateRes = await client.query(
              'UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1 RETURNING stock',
              [qty, item.id]
            );

            // Refinement 3: Trust atomic UPDATE rowCount === 0 for race condition prevention
            if (!updateRes || updateRes.rowCount === 0) {
              throw new Error(`Insufficient stock for product ${item.name || item.id}.`);
            }
          }

          // Insert order record inside the same transaction
          await client.query(
            `INSERT INTO orders (id, customer_name, customer_phone, customer_email, delivery_address, city, payment_method, subtotal, shipping_fee, discount, total, items, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
            [
              order.id,
              order.customerName,
              order.customerPhone,
              order.customerEmail,
              order.deliveryAddress,
              order.city,
              order.paymentMethod,
              order.subtotal,
              order.shippingFee,
              order.discount,
              order.total,
              JSON.stringify(order.items),
              order.notes
            ]
          );

          await client.query('COMMIT');
        } catch (txErr) {
          await client.query('ROLLBACK');
          client.release();
          throw txErr;
        }
        client.release();
      }
    }

    // 2. Synchronous Local Store Stock Decrement & Fallback
    const store = loadStore();

    // Verify local store stock availability
    for (const item of order.items) {
      const qty = Number(item.quantity) || 1;
      const prod = (store.products || []).find(p => p.id === item.id);
      if (prod && Number(prod.stock) < qty) {
        throw new Error(`Insufficient stock for product ${prod.name || item.id}.`);
      }
    }

    // Decrement stock in local store
    for (const item of order.items) {
      const qty = Number(item.quantity) || 1;
      const prod = (store.products || []).find(p => p.id === item.id);
      if (prod) {
        prod.stock = Math.max(0, Number(prod.stock) - qty);
      }
    }

    store.orders = [order, ...(store.orders || [])];
    saveStore(store);
    return order;
  },

  async updateOrderStatus(id, status) {
    const store = loadStore();
    const idx = (store.orders || []).findIndex(o => o.id === id);
    if (idx === -1) return null;

    store.orders[idx].orderStatus = status;
    saveStore(store);

    if (db.isDbConnected()) {
      await db.query('UPDATE orders SET order_status = $1 WHERE id = $2', [status, id]);
    }

    return store.orders[idx];
  },

  async updateOrder(id, data) {
    const store = loadStore();
    const idx = (store.orders || []).findIndex(o => o.id === id);
    let updated = null;
    if (idx !== -1) {
      store.orders[idx] = { ...store.orders[idx], ...data };
      saveStore(store);
      updated = store.orders[idx];
    }

    if (db.isDbConnected()) {
      const updates = [];
      const values = [];
      let idxCount = 1;

      if (data.orderStatus) {
        updates.push(`order_status = $${idxCount++}`);
        values.push(data.orderStatus);
      }
      if (data.courierName) {
        updates.push(`courier_name = $${idxCount++}`);
        values.push(data.courierName);
      }
      if (data.trackingNumber) {
        updates.push(`tracking_number = $${idxCount++}`);
        values.push(data.trackingNumber);
      }
      if (data.assignedCourierId !== undefined) {
        updates.push(`assigned_courier_id = $${idxCount++}`);
        values.push(data.assignedCourierId);
      }
      if (data.assignedCourierName !== undefined) {
        updates.push(`assigned_courier_name = $${idxCount++}`);
        values.push(data.assignedCourierName);
      }
      if (data.supportNotes !== undefined) {
        updates.push(`support_notes = $${idxCount++}`);
        values.push(JSON.stringify(data.supportNotes));
      }
      if (data.deliveryNotes !== undefined) {
        updates.push(`delivery_notes = $${idxCount++}`);
        values.push(data.deliveryNotes);
      }

      if (updates.length > 0) {
        values.push(id);
        await db.query(`UPDATE orders SET ${updates.join(', ')} WHERE id = $${idxCount}`, values);
      }
    }

    return updated;
  },

  // Users & Staff
  async getUserByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    if (db.isDbConnected()) {
      const res = await db.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [cleanEmail]);
      if (res && res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          password: row.password_hash || row.password,
          password_hash: row.password_hash || row.password,
          role: row.role || 'customer',
          permissions: Array.isArray(row.permissions) ? row.permissions : (typeof row.permissions === 'string' ? JSON.parse(row.permissions) : []),
          status: row.status || 'active',
          hospitalClinicName: row.hospital_clinic_name || '',
          city: row.city || '',
          twoFactorEnabled: !!row.two_factor_enabled,
          twoFactorSecret: row.two_factor_secret || null,
          twoFactorRecoveryCodes: Array.isArray(row.two_factor_recovery_codes)
            ? row.two_factor_recovery_codes
            : (typeof row.two_factor_recovery_codes === 'string' ? JSON.parse(row.two_factor_recovery_codes) : [])
        };
      }
    }
    const store = loadStore();
    const user = (store.users || []).find(u => u.email.toLowerCase() === cleanEmail) || null;
    return user ? {
      ...user,
      permissions: Array.isArray(user.permissions) ? user.permissions : [],
      status: user.status || 'active',
      twoFactorEnabled: !!user.twoFactorEnabled,
      twoFactorSecret: user.twoFactorSecret || null,
      twoFactorRecoveryCodes: Array.isArray(user.twoFactorRecoveryCodes) ? user.twoFactorRecoveryCodes : []
    } : null;
  },

  async getUserById(id) {
    if (db.isDbConnected()) {
      const res = await db.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
      if (res && res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          password_hash: row.password_hash || row.password,
          role: row.role || 'customer',
          permissions: Array.isArray(row.permissions) ? row.permissions : (typeof row.permissions === 'string' ? JSON.parse(row.permissions) : []),
          status: row.status || 'active',
          hospitalClinicName: row.hospital_clinic_name || '',
          city: row.city || '',
          twoFactorEnabled: !!row.two_factor_enabled,
          twoFactorSecret: row.two_factor_secret || null,
          twoFactorRecoveryCodes: Array.isArray(row.two_factor_recovery_codes)
            ? row.two_factor_recovery_codes
            : (typeof row.two_factor_recovery_codes === 'string' ? JSON.parse(row.two_factor_recovery_codes) : [])
        };
      }
    }
    const store = loadStore();
    const user = (store.users || []).find(u => u.id === id) || null;
    return user ? {
      ...user,
      permissions: Array.isArray(user.permissions) ? user.permissions : [],
      status: user.status || 'active',
      twoFactorEnabled: !!user.twoFactorEnabled,
      twoFactorSecret: user.twoFactorSecret || null,
      twoFactorRecoveryCodes: Array.isArray(user.twoFactorRecoveryCodes) ? user.twoFactorRecoveryCodes : []
    } : null;
  },

  async createUser(data) {
    const id = data.id || ('USR-' + Math.floor(1000 + Math.random() * 9000));
    const user = {
      id,
      name: data.name,
      email: data.email.toLowerCase().trim(),
      phone: data.phone || '',
      password: data.password,
      password_hash: data.password_hash || data.password,
      role: data.role || 'customer',
      permissions: Array.isArray(data.permissions) ? data.permissions : [],
      status: data.status || 'active',
      hospitalClinicName: data.hospitalClinicName || '',
      city: data.city || 'Lahore',
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorRecoveryCodes: [],
      createdAt: new Date().toISOString()
    };

    if (db.isDbConnected()) {
      await db.query(
        `INSERT INTO users (id, name, email, phone, password_hash, role, hospital_clinic_name, city, permissions, status, two_factor_enabled, two_factor_secret, two_factor_recovery_codes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [user.id, user.name, user.email, user.phone, user.password_hash, user.role, user.hospitalClinicName, user.city, JSON.stringify(user.permissions), user.status, false, null, '[]']
      );
    }

    const store = loadStore();
    store.users = [...(store.users || []), user];
    saveStore(store);
    return user;
  },

  async updateUser(id, data) {
    const store = loadStore();
    const idx = (store.users || []).findIndex(u => u.id === id);
    let updated = null;
    if (idx !== -1) {
      updated = { ...store.users[idx], ...data };
      store.users[idx] = updated;
      saveStore(store);
    }

    if (db.isDbConnected()) {
      const updates = [];
      const values = [];
      let idxCount = 1;

      if (data.name) { updates.push(`name = $${idxCount++}`); values.push(data.name); }
      if (data.phone) { updates.push(`phone = $${idxCount++}`); values.push(data.phone); }
      if (data.hospitalClinicName !== undefined) { updates.push(`hospital_clinic_name = $${idxCount++}`); values.push(data.hospitalClinicName); }
      if (data.city) { updates.push(`city = $${idxCount++}`); values.push(data.city); }
      if (data.permissions !== undefined) { updates.push(`permissions = $${idxCount++}`); values.push(JSON.stringify(data.permissions)); }
      if (data.status) { updates.push(`status = $${idxCount++}`); values.push(data.status); }
      if (data.password_hash) { updates.push(`password_hash = $${idxCount++}`); values.push(data.password_hash); }
      if (data.twoFactorEnabled !== undefined) { updates.push(`two_factor_enabled = $${idxCount++}`); values.push(Boolean(data.twoFactorEnabled)); }
      if (data.twoFactorSecret !== undefined) { updates.push(`two_factor_secret = $${idxCount++}`); values.push(data.twoFactorSecret); }
      if (data.twoFactorRecoveryCodes !== undefined) { updates.push(`two_factor_recovery_codes = $${idxCount++}`); values.push(JSON.stringify(data.twoFactorRecoveryCodes)); }

      if (updates.length > 0) {
        values.push(id);
        await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = $${idxCount}`, values);
      }
    }

    return updated;
  },

  // Get all users (admin)
  async getUsers() {
    if (db.isDbConnected()) {
      const res = await db.query('SELECT id, name, email, phone, role, permissions, status, hospital_clinic_name, city, created_at FROM users ORDER BY created_at DESC');
      if (res && res.rows.length > 0) {
        return res.rows.map(row => ({
          id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          role: row.role || 'customer',
          permissions: Array.isArray(row.permissions) ? row.permissions : (typeof row.permissions === 'string' ? JSON.parse(row.permissions) : []),
          status: row.status || 'active',
          hospitalClinicName: row.hospital_clinic_name || '',
          city: row.city || 'Lahore',
          createdAt: row.created_at
        }));
      }
    }
    const store = loadStore();
    return (store.users || []).map(u => ({
      ...u,
      permissions: Array.isArray(u.permissions) ? u.permissions : [],
      status: u.status || 'active'
    }));
  },

  async deleteUser(id) {
    const store = loadStore();
    const beforeCount = (store.users || []).length;
    store.users = (store.users || []).filter(u => u.id !== id);
    saveStore(store);

    if (db.isDbConnected()) {
      await db.query('DELETE FROM users WHERE id = $1', [id]);
    }

    return store.users.length < beforeCount;
  },

  // Audit Logs
  async getAuditLogs() {
    const store = loadStore();
    return (store.auditLogs || []).slice(0, 200);
  },

  async addAuditLog(entry) {
    const log = {
      id: 'LOG-' + Date.now(),
      action: entry.action,
      actor: entry.actor || 'System',
      origin: entry.origin || 'API Server',
      status: entry.status || 'SUCCESS',
      details: entry.details || '',
      timestamp: new Date().toISOString()
    };
    const store = loadStore();
    store.auditLogs = [log, ...(store.auditLogs || [])].slice(0, 500);
    saveStore(store);
    return log;
  },

  // Store Settings
  async getSettings() {
    const store = loadStore();
    return store.settings && Object.keys(store.settings).length > 0 ? store.settings : INITIAL_SETTINGS;
  },

  async updateSettings(data) {
    const store = loadStore();
    store.settings = { ...(store.settings || {}), ...data };
    saveStore(store);
    return store.settings;
  },

  // Brands
  async getBrands() {
    const store = loadStore();
    return store.brands || INITIAL_BRANDS;
  },

  async createBrand(data) {
    const brand = {
      id: 'b-' + Date.now(),
      name: data.name,
      country: data.country || 'Global',
      status: data.status || 'Authorized Partner',
      logo: data.logo || '/assets/brands/omron.svg',
      active: true
    };
    const store = loadStore();
    store.brands = [...(store.brands || INITIAL_BRANDS), brand];
    saveStore(store);
    return brand;
  },

  async updateBrand(id, data) {
    const store = loadStore();
    const brands = store.brands || INITIAL_BRANDS;
    const idx = brands.findIndex(b => b.id === id);
    if (idx === -1) return null;
    brands[idx] = { ...brands[idx], ...data };
    store.brands = brands;
    saveStore(store);
    return brands[idx];
  },

  async deleteBrand(id) {
    const store = loadStore();
    const brands = store.brands || INITIAL_BRANDS;
    const before = brands.length;
    store.brands = brands.filter(b => b.id !== id);
    saveStore(store);
    return store.brands.length < before;
  },

  // Homepage Sections
  async getHomepageSections() {
    const store = loadStore();
    return store.homepageSections || INITIAL_HOMEPAGE_SECTIONS;
  },

  async updateHomepageSections(sections) {
    const store = loadStore();
    store.homepageSections = sections;
    saveStore(store);
    return store.homepageSections;
  },

  // Promotional Banners & Vouchers
  async getPromos() {
    const store = loadStore();
    return store.promos || INITIAL_PROMOS;
  },

  async updatePromos(data) {
    const store = loadStore();
    store.promos = { ...(store.promos || INITIAL_PROMOS), ...data };
    saveStore(store);
    return store.promos;
  },

  // Policy Pages Data
  async getPolicyData() {
    const store = loadStore();
    return store.policyData || INITIAL_POLICY_DATA;
  },

  async updatePolicyData(data) {
    const store = loadStore();
    store.policyData = { ...(store.policyData || INITIAL_POLICY_DATA), ...data };
    saveStore(store);
    return store.policyData;
  },

  // Header, Footer & Global Brand Identity
  async getHeaderFooterData() {
    const store = loadStore();
    return store.headerFooterData || INITIAL_HEADER_FOOTER;
  },

  async updateHeaderFooterData(data) {
    const store = loadStore();
    store.headerFooterData = {
      ...(store.headerFooterData || INITIAL_HEADER_FOOTER),
      ...data,
      header: {
        ...((store.headerFooterData && store.headerFooterData.header) || INITIAL_HEADER_FOOTER.header),
        ...(data.header || {})
      },
      footer: {
        ...((store.headerFooterData && store.headerFooterData.footer) || INITIAL_HEADER_FOOTER.footer),
        ...(data.footer || {})
      },
      seo: {
        ...((store.headerFooterData && store.headerFooterData.seo) || INITIAL_HEADER_FOOTER.seo),
        ...(data.seo || {})
      },
      categoryDefaults: {
        ...((store.headerFooterData && store.headerFooterData.categoryDefaults) || INITIAL_HEADER_FOOTER.categoryDefaults),
        ...(data.categoryDefaults || {})
      }
    };
    saveStore(store);
    return store.headerFooterData;
  }
};

module.exports = Store;
