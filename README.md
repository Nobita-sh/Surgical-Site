# Surgicals.PK - Full-Stack Medical & Surgical Equipment Platform

A modern, high-fidelity full-stack replica of **Surgicals.PK** featuring certified surgical instruments, diagnostic ultrasound imaging, hospital ICU furniture, mobility rehabilitation equipment, aesthetic cosmetology devices, multi-step checkout with digital invoice generator, enterprise hospital inventory management portal, and RFC 6238 Two-Factor Authentication (TOTP/MFA).

---

## 🌐 Portal Navigation Links

| Portal / Interface | URL Path | Access Level | Description |
| :--- | :--- | :---: | :--- |
| **Storefront Home** | [`http://localhost:3000/`](http://localhost:3000/) | Public | 60/40 Hero showcase, circular category hub, promo banners, 5-column catalog grid, cart drawer. |
| **Equipment Catalog** | [`http://localhost:3000/shop`](http://localhost:3000/shop) | Public | Searchable medical devices catalog with category filtering and price sorting. |
| **Account Sign In** | [`http://localhost:3000/login`](http://localhost:3000/login) | Public | Sign-in portal supporting standard authentication and 2-step TOTP/MFA challenge. |
| **Account Registration** | [`http://localhost:3000/register`](http://localhost:3000/register) | Public | Customer & clinic account creation with instant password hashing. |
| **Doctor & Client Profile** | [`http://localhost:3000/profile`](http://localhost:3000/profile) | Customer / Doctor | View order history, manage clinic details, and configure **Security & 2FA**. |
| **Admin Operations Dashboard** | [`http://localhost:3000/admin`](http://localhost:3000/admin) | Admin / Staff | Executive KPI counters, revenue charts, equipment CRUD, order pipeline board, and staff directory. |
| **Live Courier Tracker** | [`http://localhost:3000/track-order`](http://localhost:3000/track-order) | Public | Real-time consignment tracking across Daewoo Fastex, TCS, and Leopards. |
| **Shopping Cart & Drawer** | [`http://localhost:3000/cart`](http://localhost:3000/cart) | Public | Slide-out cart with coupon promo calculator (`SURGICAL10`, `HOSPITAL20`). |
| **Multi-Step Checkout** | [`http://localhost:3000/checkout`](http://localhost:3000/checkout) | Public | COD, Direct Bank Wire, and Card payments with digital printable invoice. |

---

## 👥 User Accounts & Credentials Directory

Below is the complete directory of pre-configured accounts for testing customer purchasing, staff fulfillment, and root admin operations:

### 1. Executive & Root Administrators
Full access to `/admin` including user management, inventory CRUD, financial analytics, and order status overrides.

| Name | Email | Password | Role | Permissions | Clinic / Center |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **MR_xyz Executive Admin** | `m` | `e7.` | `admin` | `All Permissions` | Surgicals.PK Executive HQ, Lahore |
| **Admin Procurement Desk** | `admin@surgicals.pk` | `adminpassword` | `admin` | `["orders", "products", "support", "delivery"]` | Surgicals.PK Operations, Lahore |

---

### 2. Department Staff Accounts
Granular access to specific admin tabs based on assigned functional permissions (`orders`, `products`, `support`, `delivery`).

| Name | Email | Password | Role | Permissions | Status |
| :--- | :--- | :--- | :---: | :--- | :---: |
| **Tariq Orders Officer** | `ops_1788335528123@surgicals.pk` | `password123` | `staff` | `orders`, `support` | <span style="color:green">Active</span> |
| **Regular Staff** | `regstaff_1788335780363@surgicals.pk` | `password123` | `staff` | `orders` | <span style="color:green">Active</span> |
| **Legit Staff Member** | `legit_1788335782521@surgicals.pk` | `password123` | `staff` | `orders` | <span style="color:green">Active</span> |
| **Aslam Delivery Rider** | `rider_cod_1788335964793@surgicals.pk` | `password123` | `staff` | `delivery` | <span style="color:green">Active</span> |
| **Bilal Courier Rider** | `rider_1788335531303@surgicals.pk` | `password123` | `staff` | `delivery` | <span style="color:red">Inactive</span> |
| **Hamza Courier** | `courier_1788334988864@surgicals.pk` | `password123` | `staff` | `delivery` | <span style="color:red">Inactive</span> |

---

### 3. Verified Physicians & Customers
Access to customer features: order placement, WhatsApp specialist quotation, order history tracking, clinic profile management, and **Two-Factor Authentication (2FA)** setup.

| Name | Email | Password | Role | Clinic / Center | City |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **Dr. Muhammad Tariq** | `doctor@surgicals.pk` | `password123` | `doctor` | National Hospital Lahore | Lahore |
| **Dr. Ayesha Tariq** | `doctor_1788334063517@hospital.pk` | `password123` | `customer` | General Medical Practice | Lahore |
| **Dr. Test Physician** | `dr_test_1788238383756@surgicals.pk` | `password123` | `doctor` | Clinical Consultant | Islamabad |

---

## 🔐 Multi-Factor Authentication (MFA / 2FA)

The platform includes an enterprise **RFC 6238 Time-based One-Time Password (TOTP)** engine with pure vector SVG QR code generation:

1. **Setup Process**:
   - Sign into your account (e.g. `doctor@surgicals.pk`).
   - Navigate to [`/profile`](http://localhost:3000/profile) $\rightarrow$ **Security & 2FA** tab.
   - Click **"Set Up Two-Factor (2FA)"**.
   - Scan the rendered QR code with **Google Authenticator**, **Microsoft Authenticator**, **Authy**, **Apple Passwords**, or **1Password** (or copy the 32-character manual secret key).
   - Enter the 6-digit code shown in the app to activate.
2. **Emergency Recovery Codes**:
   - Upon activation, you receive **8 single-use backup recovery codes** (`XXXX-XXXX`).
   - Download them as a `.txt` file or copy them to your clipboard.
3. **Login Challenge**:
   - When 2FA is active, signing in on [`/login`](http://localhost:3000/login) prompts for the 6-digit authenticator code or one of the backup recovery codes.

---

## 🛡️ Staff Permission Matrix

Staff accounts can be granted granular permissions from the Admin Portal:

| Permission Key | Permitted Actions |
| :--- | :--- |
| `orders` | View incoming hospital orders, inspect customer delivery addresses, update order status (*Pending $\rightarrow$ Processing $\rightarrow$ Shipped $\rightarrow$ Delivered*). |
| `products` | Create medical equipment, edit pricing, adjust inventory stock levels, upload clinical photos. |
| `support` | Add internal clinical support notes, view customer telephone contact records. |
| `delivery` | Access courier dispatch records, assign riders, and update tracking numbers. |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database & Environment
Create a `.env` file (copied from `.env.example`):
```env
DATABASE_URL=postgresql://neondb_owner:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_64_character_hex_key_here
```
> *Note: If `DATABASE_URL` is omitted or disconnected, the application automatically runs using its persistent local JSON store (`data/store.json`) with zero downtime.*

### 3. Run Database Migration (Optional)
```bash
node scripts/migrate.js
```

### 4. Start the Application
```bash
# Start backend server & frontend together:
npm run dev

# Or start the standalone production server:
npm start
```

Visit [`http://localhost:3000`](http://localhost:3000) in your browser.
