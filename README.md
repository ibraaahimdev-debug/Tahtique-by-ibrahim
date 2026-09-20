# TAGTIQUE — Smart Vehicle Contact Shield

> **Privacy-First Vehicle QR Tag System for Pakistan**  
> Connect with anyone who needs to reach your vehicle (blocked driveway, emergency, parking alert) without ever exposing your private phone number.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Architecture & Tech Stack](#-architecture--tech-stack)
4. [Project Structure](#-project-structure)
5. [Modules & User Journeys](#-modules--user-journeys)
   - [Customer Experience (Modules 1–6)](#1-customer-experience-modules-16)
   - [Admin Portal (Modules 7–12)](#2-admin-portal-modules-712)
6. [Pricing & Dynamic Order Calculation](#-pricing--dynamic-order-calculation)
7. [Design System & Styling](#-design-system--styling)
8. [Getting Started & Development](#-getting-started--development)
9. [Contact & Business Information](#-contact--business-information)

---

## 🌟 Project Overview

**TAGTIQUE** is a full-stack e-commerce and vehicle privacy management platform built specifically for the Pakistani market. Vehicle owners place a weather-proof QR sticker on their windshield. When someone scans the QR code, they can initiate an encrypted call or SMS relay to the car owner through a proxy without viewing or saving the owner's private phone number.

### Why Tagtique?
- **100% Phone Number Masking**: Zero exposure of mobile numbers on car dashboards.
- **Local Payment Integration**: Native support for **JazzCash**, **EasyPaisa**, **Bank Transfer**, and **Cash on Delivery (COD)**.
- **All Prices in PKR**: Transparent, one-time charges with no hidden recurring subscriptions.
- **Dual Portal**: Integrated Customer Storefront + comprehensive Admin Backoffice.

---

## ✨ Key Features

- **Interactive 3D Hero Showcase**: Interactive 3D glass QR tag with tactile extrusion, tilt physics, and live simulation.
- **Seamless Single-Page Navigation**: Cross-view navigation between Home, Order Customization, Tracking, and Support without full-page reloads.
- **Multi-Step Order Wizard**:
  - Step 1: Package & Material selection (Matte Vinyl, Reflective Night-Glo, Metallic Brushed Chrome).
  - Step 2: License plate & vehicle registration with live preview.
  - Step 3: Doorstep delivery address across Pakistan.
  - Step 4: Final verification with dynamic pricing synchronization.
- **Dynamic Price Synchronization**: Live PKR price calculation that dynamically adjusts base prices, material upgrades, and volume tiers in real time.
- **Real-Time Order Tracking**: 4-stage tracking timeline (Order Received → Details Confirmed → Printing & UV Curing → Shipped with Courier).
- **Admin Control Center**:
  - Revenue & order volume KPI analytics.
  - Order status pipelines and fulfillment workflows.
  - QR Code batch generation and cryptographic token binding.
  - Package pricing and platform settings configuration.

---

## 🛠 Architecture & Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) | Component architecture with Hooks and React 19 features |
| **Language** | [TypeScript 5/6](https://www.typescriptlang.org/) | Strict type-safety across all entities, state, and props |
| **Bundler & Server** | [Vite 8](https://vite.dev/) | Lightning-fast HMR and optimized production bundling |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first styling with custom pastels and responsive grid |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent, lightweight iconography |
| **QR Engine** | `qrcode` & `qrcode.react` | High-precision vector and canvas QR generation |
| **Typography** | Plus Jakarta Sans | Modern geometric typography |

---

## 📁 Project Structure

```text
TAG EWWW/
├── public/                 # Static assets & icons
├── src/
│   ├── assets/             # Brand graphics & images
│   ├── components/         # Reusable UI & presentation components
│   │   ├── common/         # Buttons, Cards, Navbar, Footer
│   │   ├── landing/        # HeroSection, Hero3DQR, HowItWorks, PricingSection, FAQSection
│   │   └── qr/             # Glass QR tag components & previewers
│   ├── data/               # Mock databases & initial state
│   │   ├── mockData.ts     # Pricing packages, FAQ list, steps
│   │   ├── orderData.ts    # Order state, materials, calculateOrderPricing engine
│   │   └── trackingData.ts # Simulated tracking orders database
│   ├── modules/            # Domain-specific page views
│   │   ├── admin/          # Admin Portal & backoffice tabs
│   │   ├── checkout/       # Checkout flow & payment options
│   │   ├── confirmation/   # Post-purchase celebratory view & receipt
│   │   ├── contact/        # Contact Support & inquiry form
│   │   ├── landing/        # Main customer marketing storefront
│   │   ├── order/          # 4-Step Tag customization wizard
│   │   └── tracking/       # Live order lookup & status tracker
│   ├── types/              # TypeScript definitions (orders, tracking, admin)
│   ├── utils/              # Helper utilities & formatters
│   ├── App.tsx             # Root application controller & portal routing
│   ├── index.css           # Global typography, pastels, and body styles
│   └── main.tsx            # Application entry point
├── package.json            # Scripts & project dependencies
├── tailwind.config.js      # Custom theme colors, shadows, and animations
└── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Modules & User Journeys

### 1. Customer Experience (Modules 1–6)

#### Module 1: Landing Page (`src/modules/landing/LandingPage.tsx`)
- **Hero Section**: Showcases the 3D tactile QR tag with instant "Order your tag" CTA.
- **How Tagtique Works**: 4-step walkthrough demonstrating ordering, setup, print, and application.
- **Pricing Packages**:
  - Single Tag (PKR 1,499)
  - Pack of 2 (PKR 2,499 - Most Popular)
  - Family 4-Pack (PKR 4,499)
- **FAQs**: Accordion answering driver privacy, setup, rain/weather durability, and scanner compatibility.

#### Module 2: Order Customization Wizard (`src/modules/order/OrderCustomisePage.tsx`)
- **Step 1 - Product & Material**: Choose package count and material (Matte Outdoor Vinyl, High-Intensity Reflective, or Brushed Metallic).
- **Step 2 - Vehicle Setup**: Enter license plate numbers and driver contact for privacy relay assignment.
- **Step 3 - Delivery Details**: Street address, city (Lahore, Karachi, Islamabad, Rawalpindi, etc.), and phone number.
- **Step 4 - Order Confirmation**: Review breakdown with floating `LiveSummaryPanel`.

#### Module 3: Checkout Page (`src/modules/checkout/CheckoutPage.tsx`)
- Supported payment methods:
  - **EasyPaisa** (Instant mobile wallet)
  - **JazzCash** (Instant mobile wallet)
  - **Bank Transfer** (Direct IBAN transfer)
  - **Cash on Delivery** (Pay when package arrives)
- Billing address selector and live order total calculator.

#### Module 4: Order Confirmation (`src/modules/confirmation/OrderConfirmationPage.tsx`)
- Displays unique tracking code (e.g., `TGT-000482`).
- Printable tax invoice and receipt.
- Direct jump to real-time order tracking.

#### Module 5: Order Tracking (`src/modules/tracking/OrderTrackingPage.tsx`)
- Tracking lookup by Order ID or phone number.
- Visual timeline with active status badges.
- Courier partner details (FedEx Priority Express / Leopard / TCS).

#### Module 6: Customer Support (`src/modules/contact/ContactSupportPage.tsx`)
- Inquiry submission form for business partnerships, order questions, and technical help.
- Direct contact details (email, phone, address).
- Instant FAQ jump points.

---

### 2. Admin Portal (Modules 7–12)

Accessed via the **Login / Admin** button in the Navbar or Footer:
- **Dashboard Overview**: Metrics on total orders, gross revenue (PKR), active QR tags, and pending shipments.
- **Orders Management**: Filter, search, inspect individual order details, update stages, and assign tracking numbers.
- **QR Code Management**: Pre-generate batches of encrypted QR codes, track activation rates, and export vectors.
- **Portal Settings**:
  - General Settings (Business information, contact channels).
  - Package Management (Adjust PKR pricing, discount percentages).
  - User Access & Roles (Admin, Dispatcher, Support Agent).

---

## 💰 Pricing & Dynamic Order Calculation

All calculations are centralized in `src/data/orderData.ts` via `calculateOrderPricing`:

```typescript
export function calculateOrderPricing(
  packageId: string,
  materialId: string,
  quantity: number
): {
  basePrice: number;
  materialUpgradeCost: number;
  grandTotal: number;
  basePackageName: string;
  materialName: string;
}
```

- When the customer upgrades materials or increases quantities, all panels (`LiveSummaryPanel`, `CheckoutPage`, `OrderConfirmationPage`) update automatically without price desynchronization.

---

## 🎨 Design System & Styling

The application adheres to a curated **Pastel Modern** aesthetic:

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| **Soft Lavender-Blue** | `#D6E0F5` | Primary button gradient start, glow accents |
| **Lilac Accent** | `#EAD9EC` | Primary button gradient middle, badges, borders |
| **Dusty Rose** | `#F3D6DE` | Primary button gradient end, subtle ambient accents |
| **Deep Eggplant / Plum** | `#5C3264` | Primary brand text, active states, icons |
| **Deep Slate Body** | `#1A1A1A` | High-contrast headline and text color |
| **Soft Background Base** | `#F7EBEF` | Ambient atmospheric gradient background base |

---

## 💻 Getting Started & Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone or navigate to the project directory
cd "TAG EWWW"

# Install project dependencies
npm install
```

### Running Locally
```bash
# Start Vite development server with Hot Module Replacement (HMR)
npm run dev
```
Open your browser and navigate to `http://localhost:5173/`.

### Building for Production
```bash
# Type-check and bundle production assets
npm run build

# Preview production build locally
npm run preview
```

---

## 📞 Contact & Business Information

- **Company**: TAGTIQUE Smart QR Shield (Ata IT Solutions)
- **Email**: [ataitsolutions09@gmail.com](mailto:ataitsolutions09@gmail.com)
- **Phone / WhatsApp**: [0329-2082080](tel:03292082080)
- **Office Address**: Office No. 11, Blue Bell Tower, 208 Chak Road, Pakistan

#   q r - p r o d u c t - a t a  
 #   q r - p r o d u c t - a t a  
 # Tahtique-by-ibrahim 
