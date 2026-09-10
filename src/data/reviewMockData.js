/**
 * Surgicals.PK Review & Preview Mock Dataset
 * Powers full offline and static Vercel preview capabilities for all portals:
 * - Admin Operations Portal (/admin)
 * - Customer & Doctor Profile (/profile)
 * - Sign In (/login) and Multi-Factor Authentication
 */

export const REVIEW_USERS = [
  {
    id: 'USR-ROOT',
    name: 'MR_xyz Executive Admin',
    email: 'mr_xyz@surigical.com',
    password: 'e7te8t4X.',
    role: 'admin',
    permissions: ['all', 'orders', 'products', 'support', 'delivery'],
    hospitalClinicName: 'Surgicals.PK Executive HQ',
    city: 'Lahore',
    phone: '0300-9998877',
    status: 'active'
  },
  {
    id: 'USR-1002',
    name: 'Admin Procurement Desk',
    email: 'admin@surgicals.pk',
    password: 'adminpassword',
    role: 'admin',
    permissions: ['orders', 'products', 'support', 'delivery'],
    hospitalClinicName: 'Surgicals.PK Operations',
    city: 'Lahore',
    phone: '0300-1122334',
    status: 'active'
  },
  {
    id: 'USR-3001',
    name: 'Tariq Orders Officer',
    email: 'ops_1788335528123@surgicals.pk',
    password: 'password123',
    role: 'staff',
    permissions: ['orders', 'support'],
    status: 'active',
    phone: '0311-2233445'
  },
  {
    id: 'USR-3002',
    name: 'Regular Staff',
    email: 'regstaff_1788335780363@surgicals.pk',
    password: 'password123',
    role: 'staff',
    permissions: ['orders'],
    status: 'active',
    phone: '0321-4455667'
  },
  {
    id: 'USR-3003',
    name: 'Legit Staff Member',
    email: 'legit_1788335782521@surgicals.pk',
    password: 'password123',
    role: 'staff',
    permissions: ['orders'],
    status: 'active',
    phone: '0333-7788990'
  },
  {
    id: 'USR-4503',
    name: 'Aslam Delivery Rider',
    email: 'rider_cod_1788335964793@surgicals.pk',
    password: 'password123',
    role: 'staff',
    permissions: ['delivery'],
    status: 'active',
    phone: '0345-5566778'
  },
  {
    id: 'USR-1001',
    name: 'Dr. Muhammad Tariq',
    email: 'doctor@surgicals.pk',
    password: 'password123',
    role: 'doctor',
    hospitalClinicName: 'National Hospital Lahore',
    city: 'Lahore',
    phone: '0300-1234567',
    status: 'active'
  },
  {
    id: 'USR-1003',
    name: 'Dr. Ayesha Tariq',
    email: 'doctor_1788334063517@hospital.pk',
    password: 'password123',
    role: 'customer',
    hospitalClinicName: 'General Medical Practice',
    city: 'Lahore',
    phone: '0322-8899001',
    status: 'active'
  },
  {
    id: 'USR-1004',
    name: 'Dr. Test Physician',
    email: 'dr_test_1788238383756@surgicals.pk',
    password: 'password123',
    role: 'doctor',
    hospitalClinicName: 'Clinical Consultant',
    city: 'Islamabad',
    phone: '0334-1122445',
    status: 'active'
  }
];

export const REVIEW_ORDERS = [
  {
    id: 'ORD-74499',
    customerName: 'Dr. Muhammad Tariq',
    customerEmail: 'doctor@surgicals.pk',
    customerPhone: '0300-1234567',
    shippingAddress: 'National Hospital, DHA Phase 5, Lahore',
    total: 385000,
    status: 'delivered',
    paymentMethod: 'Direct Bank Wire (IBFT)',
    paymentStatus: 'paid',
    createdAt: '2026-03-08T10:14:00Z',
    items: [
      { id: 'SPK-1002', name: 'Digital Ultrasonic Diagnostic Imaging System DP-10', price: 385000, quantity: 1 }
    ],
    courierName: 'Daewoo Fastex Express',
    trackingNumber: 'DW-88492019PK'
  },
  {
    id: 'ORD-51247',
    customerName: 'Dr. Ayesha Tariq',
    customerEmail: 'doctor_1788334063517@hospital.pk',
    customerPhone: '0322-8899001',
    shippingAddress: 'Gulberg III, Main Boulevard, Lahore',
    total: 195000,
    status: 'delivered',
    paymentMethod: 'Cash on Delivery (COD)',
    paymentStatus: 'paid',
    createdAt: '2026-03-07T14:32:00Z',
    items: [
      { id: 'SPK-1003', name: 'Electric Wheel Chair for Heavy Duty X-Large', price: 195000, quantity: 1 }
    ],
    courierName: 'TCS Medical Logistics',
    trackingNumber: 'TCS-90214820PK'
  },
  {
    id: 'ORD-29761',
    customerName: 'Fatima Memorial Hospital',
    customerEmail: 'procurement@fmh.org.pk',
    customerPhone: '042-111-555-666',
    shippingAddress: 'Shadman, Lahore',
    total: 44500,
    status: 'processing',
    paymentMethod: 'Online Card Payment',
    paymentStatus: 'paid',
    createdAt: '2026-03-09T09:20:00Z',
    items: [
      { id: 'SPK-1006', name: 'Ultrasonic Therapy Machine', price: 44500, quantity: 1 }
    ],
    courierName: 'Leopards Courier Service',
    trackingNumber: 'LCS-54910283PK'
  },
  {
    id: 'ORD-98421',
    customerName: 'Dr. Test Physician',
    customerEmail: 'dr_test_1788238383756@surgicals.pk',
    customerPhone: '0334-1122445',
    shippingAddress: 'Blue Area, Medical Complex, Islamabad',
    total: 18500,
    status: 'pending',
    paymentMethod: 'Cash on Delivery (COD)',
    paymentStatus: 'unpaid',
    createdAt: '2026-03-09T18:45:00Z',
    items: [
      { id: 'SPK-1004', name: 'Standard Commode Wheelchair Chrome Plated', price: 18500, quantity: 1 }
    ]
  },
  {
    id: 'ORD-32091',
    customerName: 'Aga Khan Diagnostic Center',
    customerEmail: 'supplies@akuh.edu.pk',
    customerPhone: '021-34930051',
    shippingAddress: 'Stadium Road, Karachi',
    total: 8900,
    status: 'shipped',
    paymentMethod: 'Direct Bank Wire (IBFT)',
    paymentStatus: 'paid',
    createdAt: '2026-03-09T11:05:00Z',
    items: [
      { id: 'SPK-1005', name: 'Digital Upper Arm Blood Pressure Monitor M2 Basic', price: 8900, quantity: 1 }
    ],
    courierName: 'TCS Medical Logistics',
    trackingNumber: 'TCS-11492044PK'
  }
];

export const REVIEW_SETTINGS = {
  storeName: 'Surgicals.PK',
  storeEmail: 'sales@surgicals.pk',
  storePhone: '+92 42 3735 1234',
  whatsappNumber: '+92 300 1234567',
  officeAddress: '12-A Nishtar Road, Near Mayo Hospital, Lahore, Pakistan',
  currencyCode: 'PKR',
  currencySymbol: 'Rs.',
  taxRate: 0,
  shippingFee: 250,
  freeShippingThreshold: 5000,
  metaTitle: 'Surgicals.PK | Medical & Surgical Equipment Pakistan',
  metaDescription: 'Pakistan premier online supplier for surgical instruments, ultrasound machines, ICU monitors, hospital furniture & home healthcare supplies.'
};

export const REVIEW_AUDIT_LOGS = [
  {
    id: 'AUD-001',
    adminEmail: 'admin@surgicals.pk',
    action: 'Order Status Update: ORD-32091 -> Shipped',
    ip: '182.180.75.12',
    timestamp: '2026-03-09T11:15:00Z'
  },
  {
    id: 'AUD-002',
    adminEmail: 'mr_xyz@surigical.com',
    action: 'Inventory Update: Mindray DP-10 Price adjusted to Rs 385,000',
    ip: '39.40.11.89',
    timestamp: '2026-03-09T10:30:00Z'
  },
  {
    id: 'AUD-003',
    adminEmail: 'admin@surgicals.pk',
    action: 'Staff Status Update: Aslam Delivery Rider marked Active',
    ip: '182.180.75.12',
    timestamp: '2026-03-08T16:20:00Z'
  }
];
