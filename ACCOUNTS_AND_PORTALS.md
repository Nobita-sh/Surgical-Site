# Surgicals.PK — Portal Links & User Accounts Directory

A quick reference guide for all portal URLs, user account credentials, roles, permissions, and security settings.

---

## 🌐 Portal Navigation Links

| Portal | URL Path | Access Level | Description |
| :--- | :--- | :---: | :--- |
| **Storefront** | [`http://localhost:3000/`](http://localhost:3000/) | Public | Customer home page, category hub, product grid, cart drawer. |
| **Equipment Catalog** | [`http://localhost:3000/shop`](http://localhost:3000/shop) | Public | Browse and search surgical tools and hospital equipment. |
| **Sign In** | [`http://localhost:3000/login`](http://localhost:3000/login) | Public | Sign-in portal with standard authentication and 2FA TOTP challenge. |
| **Registration** | [`http://localhost:3000/register`](http://localhost:3000/register) | Public | Create a new customer/clinic account. |
| **Customer / Doctor Profile** | [`http://localhost:3000/profile`](http://localhost:3000/profile) | Customer / Doctor | Order history, personal/clinic details, and **Security & 2FA**. |
| **Admin Operations Portal** | [`http://localhost:3000/admin`](http://localhost:3000/admin) | Admin / Staff | Financial KPIs, inventory CRUD, order board, staff manager. |
| **Courier Tracking** | [`http://localhost:3000/track-order`](http://localhost:3000/track-order) | Public | Live courier shipment tracking. |
| **Shopping Cart** | [`http://localhost:3000/cart`](http://localhost:3000/cart) | Public | Cart review with coupon codes (`SURGICAL10`, `HOSPITAL20`). |
| **Checkout** | [`http://localhost:3000/checkout`](http://localhost:3000/checkout) | Public | Multi-step checkout with COD and digital invoice. |

---

## 🔑 User Accounts & Credentials

### 1. Admin Accounts (Full Access)

| Account Name | Email | Password | Role | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **MR_xyz Executive Admin** | `mr_xyz@surigical.com` | `e7te8t4X.` | `admin` | Root executive account with all platform privileges. |
| **Admin Procurement Desk** | `admin@surgicals.pk` | `adminpassword` | `admin` | Operations desk admin managing stock, orders, and staff. |

---

### 2. Staff Accounts (Role-Based Permissions)

Staff accounts have access to the Admin Portal (`/admin`) restricted to their granted permission modules:

| Staff Member | Email | Password | Granted Permissions | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Tariq Orders Officer** | `ops_1788335528123@surgicals.pk` | `password123` | `orders`, `support` | Active |
| **Regular Staff** | `regstaff_1788335780363@surgicals.pk` | `password123` | `orders` | Active |
| **Legit Staff Member** | `legit_1788335782521@surgicals.pk` | `password123` | `orders` | Active |
| **Aslam Delivery Rider** | `rider_cod_1788335964793@surgicals.pk` | `password123` | `delivery` | Active |
| **Bilal Courier Rider** | `rider_1788335531303@surgicals.pk` | `password123` | `delivery` | Inactive |
| **Hamza Courier** | `courier_1788334988864@surgicals.pk` | `password123` | `delivery` | Inactive |

---

### 3. Doctor & Customer Accounts

| Account Name | Email | Password | Role | Features / Notes |
| :--- | :--- | :--- | :---: | :--- |
| **Dr. Muhammad Tariq** | `doctor@surgicals.pk` | `password123` | `doctor` | Verified clinical practitioner in Lahore. |
| **Dr. Ayesha Tariq** | `doctor_1788334063517@hospital.pk` | `password123` | `customer` | Verified clinic customer in Lahore. |
| **Dr. Test Physician** | `dr_test_1788238383756@surgicals.pk` | `password123` | `doctor` | Clinical consultant in Islamabad. |

---

## 🔐 Multi-Factor Authentication (TOTP / 2FA)

- **How to Activate**:
  1. Log in to [`/login`](http://localhost:3000/login).
  2. Visit [`/profile`](http://localhost:3000/profile) and select the **Security & 2FA** tab.
  3. Click **"Set Up Two-Factor (2FA)"**.
  4. Scan the rendered QR code in Google Authenticator, Microsoft Authenticator, or Authy.
  5. Enter the 6-digit confirmation code.
- **Recovery Codes**:
  - 8 single-use emergency backup codes (`XXXX-XXXX`) are generated upon setup.
  - Can be downloaded as a `.txt` file or copied to the clipboard.
