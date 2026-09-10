/**
 * Surgicals.PK Production Seed Catalog & Master Data (ES Module)
 * Uses placeholder images since surgicals.pk CDN URLs are no longer accessible
 */

// Helper to generate clean placeholder images
const catImg = (label) => `https://placehold.co/200x200/f8f6f6/333333?text=${encodeURIComponent(label)}`;
const prodImg = (label) => `https://placehold.co/400x400/f8f6f6/333333?text=${encodeURIComponent(label)}`;

export const SEED_CATEGORIES = [
  {
    id: 'anti-embolism',
    name: 'Anti Embolism Stocking',
    slug: 'anti-embolism-stocking',
    image: catImg('Stockings')
  },
  {
    id: 'autoclave-sterilizer',
    name: 'Autoclave & Sterilizer',
    slug: 'autoclave-sterilizer',
    image: catImg('Sterilizer')
  },
  {
    id: 'blood-pressure-monitors',
    name: 'Blood Pressure Monitors',
    slug: 'blood-pressure-monitors',
    image: catImg('BP Monitor')
  },
  {
    id: 'cervical-collar',
    name: 'Cervical Collar',
    slug: 'cervical-collar',
    image: catImg('Collar')
  },
  {
    id: 'commode-chair',
    name: 'Commode Chair',
    slug: 'commode-chair',
    image: catImg('Commode')
  },
  {
    id: 'diagnostic-accessories',
    name: 'Diagnostic Accessories',
    slug: 'diagnostic-accessories',
    image: catImg('Diagnostic')
  },
  {
    id: 'disposable-items',
    name: 'Disposable Items',
    slug: 'disposable-items',
    image: catImg('Disposable')
  },
  {
    id: 'doctor-kits',
    name: 'Doctor Kits',
    slug: 'doctor-kits',
    image: catImg('Doctor Kit')
  },
  {
    id: 'ecg-machine',
    name: 'ECG Machine',
    slug: 'ecg-machine',
    image: catImg('ECG')
  },
  {
    id: 'electric-suction-unit',
    name: 'Electric Suction Unit',
    slug: 'electric-suction-unit',
    image: catImg('Suction')
  },
  {
    id: 'glucometer',
    name: 'Glucometer',
    slug: 'glucometer',
    image: catImg('Glucometer')
  },
  {
    id: 'hearing-aids',
    name: 'Hearing Aids',
    slug: 'hearing-aids',
    image: catImg('Hearing Aid')
  },
  {
    id: 'hospital-beds',
    name: 'Hospital Beds',
    slug: 'hospital-beds',
    image: catImg('Hospital Bed')
  },
  {
    id: 'hospital-furniture',
    name: 'Hospital Furniture',
    slug: 'hospital-furniture',
    image: catImg('Furniture')
  },
  {
    id: 'hot-cold-therapy',
    name: 'Hot & Cold Therapy',
    slug: 'hot-cold-therapy',
    image: catImg('Therapy')
  },
  {
    id: 'knee-support',
    name: 'Knee Support',
    slug: 'knee-support',
    image: catImg('Knee Support')
  }
];

export const BRAND_LOGOS = [
  { name: 'OMRON', image: '/assets/brands/omron.svg', slug: 'omron' },
  { name: 'beurer Germany', image: '/assets/brands/beurer.svg', slug: 'beurer' },
  { name: 'CERTEZA Medical', image: '/assets/brands/certeza.svg', slug: 'certeza' },
  { name: 'Besmed Healthcare', image: '/assets/brands/besmed.svg', slug: 'besmed' },
  { name: 'OppO Medical', image: '/assets/brands/oppo.svg', slug: 'oppo' },
  { name: 'TANITA Japan', image: '/assets/brands/tanita.svg', slug: 'tanita' },
  { name: 'CITIZEN Systems', image: '/assets/brands/citizen.svg', slug: 'citizen' },
  { name: 'Mindray Medical', image: '/assets/brands/mindray.svg', slug: 'mindray' },
  { name: 'believia', image: '/assets/brands/believia.svg', slug: 'believia' },
  { name: 'MSD Healthcare', image: '/assets/brands/msd.svg', slug: 'msd' }
];

export const SEED_PRODUCTS = [
  {
    id: 'SPK-1001',
    name: 'ICU Patient Monitor Multi-Parameter High Precision Display',
    slug: 'icu-patient-monitor',
    price: 145000,
    originalPrice: 165000,
    rating: 4.9,
    reviewsCount: 38,
    categoryName: 'Electro Medical',
    categoryId: 'electro-medical',
    image: '/assets/products/icu-monitor.png',
    inStock: true,
    featured: true,
    onSale: true,
    isNew: true,
    sku: 'SPK-ELM-001',
    description: 'Advanced ICU multi-parameter vital signs monitor with 12.1-inch high resolution color TFT display. Includes ECG, SpO2, NIBP, Respiration, and Temperature modules with 72-hour trend review and alarm recall.',
    specifications: {
      'Display': '12.1-inch High-Resolution Color TFT',
      'Parameters': 'ECG, SpO2, NIBP, RESP, 2-TEMP, PR',
      'Waveforms': 'Up to 8 waveforms simultaneously',
      'Battery Backup': '4+ Hours Rechargeable Li-ion',
      'Certifications': 'CE, ISO 13485, Drug Regulatory Authority Approved',
      'Warranty': '2 Years Official Warranty'
    }
  },
  {
    id: 'SPK-1002',
    name: 'Digital Ultrasonic Diagnostic Imaging System DP-10',
    slug: 'digital-ultrasonic-diagnostic-imaging-system-dp-10',
    categoryId: 'diagnostic-accessories',
    categoryName: 'Diagnostic Accessories',
    price: 385000,
    originalPrice: 420000,
    onSale: true,
    stock: 4,
    sku: 'IMG-DP10-02',
    rating: 5.0,
    reviewCount: 18,
    featured: true,
    bestSeller: true,
    image: '/assets/products/dp10-ultrasound.png',
    shortDescription: 'Mindray DP-10 digital B/W ultrasound system with high-resolution LED monitor, dual transducer connectors, and advanced imaging technology.',
    description: 'The DP-10 is a legendary diagnostic ultrasound scanner offering crystal-clear image quality and lightweight mobility. Equipped with a 12.1-inch tiltable LED screen, full digital beam-forming technology, IP (Image Processing) preset keys, 8-segment TGC adjustment, and rapid boot-up time within 20 seconds.',
    specifications: {
      "Display": "12.1-inch High-Definition LED (30-degree tilt)",
      "Probes Supported": "Convex, Linear, Transvaginal, Micro-convex",
      "Storage Capacity": "500 GB Internal Hard Drive (USB Export)",
      "Weight": "5.5 kg (Ultra-portable with handle)",
      "Warranty": "1 Year Official Service Warranty"
    },
    certifications: ["FDA Approved", "CE 0123", "ISO 9001 / ISO 13485"]
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
    shortDescription: 'Motorized heavy-duty power wheelchair with 360-degree intelligent joystick, electromagnetic brakes, and long-range lithium battery.',
    description: 'Designed for optimal patient freedom, comfort, and safety. Reinforced aerospace-grade aluminum-alloy frame with wide padded seat, flip-up armrests, swing-away footplates, anti-tip rear wheels, and dual 250W high-torque brushless motors capable of climbing 12-degree inclines.',
    specifications: {
      "Motor Power": "Dual 250W Brushless Motors",
      "Battery": "24V 20Ah Lithium Battery (Range: ~25 km)",
      "Weight Capacity": "Up to 150 kg (Heavy Duty XL)",
      "Braking System": "Electromagnetic Auto-Stop Brakes",
      "Frame Material": "Lightweight Foldable Aircraft Aluminum"
    },
    certifications: ["ISO 7176 Wheelchair Standard", "CE Certified"]
  },
  {
    id: 'SPK-1004',
    name: 'Commode Chair Folding with Wheels & Removable Bucket',
    slug: 'commode-chair-folding-with-wheels',
    categoryId: 'commode-chair',
    categoryName: 'Rehabilitation & Mobility',
    price: 18500,
    originalPrice: 21000,
    onSale: true,
    stock: 15,
    sku: 'RBL-CMD-004',
    rating: 4.8,
    reviewCount: 34,
    featured: true,
    bestSeller: true,
    image: '/assets/products/commode-chair.png',
    shortDescription: 'Multi-purpose mobile commode chair with locking castor wheels, padded waterproof seat, and easy-slide waste bucket.',
    description: 'Heavy-duty chrome-plated steel frame designed for elderly and post-op patient care. Can be wheeled directly over standard household toilets or used bedside with splash-proof pail.',
    specifications: {
      "Frame": "Chrome-Plated Anti-Rust Steel",
      "Seat Height": "Adjustable 48cm to 56cm",
      "Weight Capacity": "120 kg",
      "Wheels": "4 Swivel Castors with Dual Rear Brakes"
    },
    certifications: ["CE Certified", "ISO 9001"]
  },
  {
    id: 'SPK-1005',
    name: 'Digital Blood Pressure Monitor Automatic Upper Arm',
    slug: 'digital-bp-monitor-upper-arm',
    price: 6800,
    originalPrice: 8500,
    rating: 4.8,
    reviewsCount: 124,
    categoryName: 'Diagnostic Accessories',
    categoryId: 'diagnostic-accessories',
    image: '/assets/products/bp-monitor.png',
    inStock: true,
    featured: true,
    onSale: true,
    isNew: false,
    sku: 'SPK-DGN-002',
    description: 'Hospital-grade digital upper arm blood pressure monitor featuring IntelliSense technology for gentle, accurate inflation. Detects irregular heartbeats and body movement during measurement.',
    specifications: {
      'Measurement Method': 'Oscillometric Method',
      'Cuff Circumference': '22 cm to 42 cm (Wide Range Cuff)',
      'Memory Capacity': '2 Users x 100 Readings with Date & Time',
      'Power Source': '4x AA Batteries + Type-C USB Adapter',
      'Accuracy': 'Pressure: ±3 mmHg, Pulse: ±5% of reading',
      'Warranty': '3 Years Replacement Warranty'
    }
  },
  {
    id: 'SPK-1006',
    name: 'Ultrasonic Therapy 1 & 3 MHz Dual Frequency Physiotherapy Device',
    slug: 'ultrasonic-therapy-dual-frequency',
    price: 78000,
    originalPrice: 89000,
    rating: 4.7,
    reviewsCount: 42,
    categoryName: 'Hot & Cold Therapy',
    categoryId: 'hot-cold-therapy',
    image: '/assets/products/ultrasonic-therapy.png',
    shortDescription: 'Professional clinical ultrasonic physiotherapy unit for deep muscle recovery, joint pain relief, and soft tissue rehabilitation.',
    description: 'The Ultrasonic Therapy Machine delivers concentrated deep-penetrating ultrasonic waves (1MHz / 3MHz) directly into targeted muscle tissue, stimulating cellular repair, reducing inflammation, and relieving chronic pain. Built-in digital timer, adjustable intensity levels, ergonomic probe transducer, and auto-overheat safety protection.',
    specifications: {
      "Frequency": "1.0 MHz ± 10%",
      "Max Power Output": "15 Watts (Continuous & Pulsed)",
      "Timer Range": "1 to 30 Minutes Digital Display",
      "Power Supply": "AC 220V / 50Hz",
      "Standard Accessories": "Ultrasound Probe, Power Cable, Contact Gel Tube"
    },
    certifications: ["ISO 13485 Medical Grade", "CE Certified"]
  },
  {
    id: 'SPK-1007',
    name: 'ANKLE SPLINT 5912',
    slug: 'ankle-splint-5912',
    categoryId: 'foot-and-ankle-braces',
    categoryName: 'Body Belts & Braces',
    price: 4870,
    originalPrice: null,
    onSale: false,
    stock: 22,
    sku: 'BRC-ANK-5912',
    rating: 4.8,
    reviewCount: 16,
    featured: false,
    bestSeller: true,
    image: '/assets/products/ankle-splint.png',
    shortDescription: 'Rigid medial-lateral anatomical ankle stabilizer with contoured shell pads and adjustable hook-and-loop compression straps.',
    description: 'Designed for acute ankle sprains, post-operative ligament recovery, and chronic ankle instability. Provides firm structural support while fitting comfortably inside athletic shoes.',
    specifications: {
      "Size": "Universal (Left & Right Foot Compatible)",
      "Shell Material": "High-Impact Semi-Rigid Anatomical Polymer",
      "Padding": "Shock-Absorbing Memory Foam Lining"
    },
    certifications: ["ISO 13485 Orthopedic Standard"]
  },
  {
    id: 'SPK-1008',
    name: 'CAST BOOT 5917',
    slug: 'cast-boot-5917',
    categoryId: 'foot-and-ankle-braces',
    categoryName: 'Body Belts & Braces',
    price: 3180,
    originalPrice: null,
    onSale: false,
    stock: 35,
    sku: 'BRC-CST-5917',
    rating: 4.7,
    reviewCount: 19,
    featured: false,
    bestSeller: true,
    variantLabel: 'Size',
    variants: ['Small (S)', 'Medium (M)', 'Large (L)', 'Extra Large (XL)'],
    image: '/assets/products/cast-boot.png',
    shortDescription: 'Rocker sole post-op cast shoe for fractured foot protection, plaster cast walking, and metatarsal trauma recovery.',
    description: 'Features a non-skid rocker bottom sole that promotes natural gait while protecting plaster or fiberglass casts from wear, dirt, and moisture. Breathable canvas upper with adjustable velcro fasteners.',
    specifications: {
      "Sizes Available": "Small, Medium, Large, Extra Large",
      "Sole": "Shock-Absorbing Non-Slip EVA Rocker Bottom",
      "Closure": "Dual Quick-Release Hook-and-Loop Straps"
    },
    certifications: ["CE Orthopedic Grade"]
  },
  {
    id: 'SPK-1009',
    name: 'Sitz Bath Tub for Fissure With Pressure Pump for Toilet Seat White (04)',
    slug: 'sitz-bath-tub-fissure-with-pressure-pump',
    categoryId: 'disposable-items',
    categoryName: 'Post-Op Care & Wellness',
    price: 4400,
    originalPrice: 4800,
    onSale: true,
    stock: 50,
    sku: 'WEL-SITZ-04',
    rating: 4.9,
    reviewCount: 52,
    featured: false,
    bestSeller: true,
    image: '/assets/products/sitz-bath-tub.png',
    shortDescription: 'Ergonomic toilet-fit sitz bath tub with manual water flusher pressure pump, anti-overflow drainage holes, and collapsible design.',
    description: 'Essential post-partum, hemorrhoid, and post-fissure soothing therapeutic basin. Fits securely onto all standard Pakistani and international commode toilet seats. Includes hand flusher bulb for gentle water massage.',
    specifications: {
      "Material": "Medical-Grade Non-Toxic PP & TPR Material",
      "Compatibility": "Universal Fit for Oval & Round Toilet Seats",
      "Features": "Anti-Overflow Drainage Slots, Hanging Storage Hook"
    },
    certifications: ["FDA Grade Material", "BPA Free"]
  },
  {
    id: 'SPK-1010',
    name: 'LAB COAT: DR COAT WHITE MALE / FEMALE',
    slug: 'lab-coat-dr-coat-white-male-female',
    categoryId: 'disposable-items',
    categoryName: 'Apparel & Uniforms',
    price: 1000,
    originalPrice: null,
    priceRange: 'Rs 1,000 – Rs 1,200',
    onSale: false,
    stock: 120,
    sku: 'APP-COAT-01',
    rating: 4.8,
    reviewCount: 64,
    featured: false,
    bestSeller: true,
    variantLabel: 'Size',
    variants: ['Small (S)', 'Medium (M)', 'Large (L)', 'XL', 'XXL'],
    image: '/assets/products/lab-coat.png',
    shortDescription: 'Premium poly-cotton blend professional doctor lab coat with multiple pockets and side vent slits.',
    description: 'Tailored for doctors, medical students, surgeons, and laboratory staff. Breathable, durable, stain-resistant, and machine-washable. Available in standard unisex sizing with embroidered pocket options.',
    specifications: {
      "Fabric": "65% Polyester / 35% Cotton Heavy-Duty Blend",
      "Pockets": "1 Chest Pocket + 2 Lower Deep Instrument Pockets",
      "Sizes Available": "S, M, L, XL, XXL",
      "Cut": "Full Length with Back Slit & Button Closure"
    },
    certifications: ["ISO 9001 Textile Standard"]
  }
];
