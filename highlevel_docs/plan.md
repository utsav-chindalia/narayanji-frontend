# **Narayan Ji Gajak Distribution System \- Development Plan**

## **Overview**

This is a comprehensive development roadmap for building a customizable Distribution Management System for Narayan Ji Gajak. The system supports 300–350 B2B vendors with vendor-specific pricing, order review workflows, prepayment-based ordering, automated work orders, and live production tracking.

---

## **1\. Project Setup**

*  Initialize different repo structure  
  * Setup frontend/backend workspaces  
*  Setup GitHub repository  
  * Configure branching strategy (e.g., main/dev)  
*  Setup environment variable templates  
  * .env.local.example files for frontend and backend  
*  Configure Supabase project  
  * Setup initial database, schemas, and policies  
*  Setup supabase project for OTP authentication  
  * Enable phone auth  
  * Configure usage limits and domain whitelist  
*  Create Vercel projects for frontend and backend  
*  Configure Prettier \+ ESLint \+ Husky  
  * Enforce consistent code standards  
*  Setup CI pipeline (GitHub Actions)  
  * Lint, test, and preview deploys per PR

---

## **2\. Backend Foundation (Node.js \+ Supabase)**

*  Define database schema in Supabase  
  * Tables: vendors, products, orders, order\_items, pricing\_tiers, work\_orders, users, notifications  
*  Write initial Supabase migration scripts  
*  Setup Supabase Row-Level Security (RLS)  
  * Ensure vendors can access only their records  
*  Setup supabase JWT verification in backend  
  * Middleware to validate supabase-authenticated requests  
*  Setup basic Express server with routing structure  
  * Use express-generator or custom structure  
*  Create reusable error handler and response format

---

## **3\. Feature-specific Backend**

*  Vendor Authentication APIs  
  * Verify supabase token and issue session  
  * Sync user profile to Supabase users table  
*  Product Catalog API  
  * GET /catalog → Returns product list with vendor-specific pricing  
  * GET /catalog/:sku → Returns product details  
*  Cart and Order APIs  
  * POST /cart → Save cart for review (no payment)  
  * GET /orders/:vendorId → List past orders  
  * PUT /orders/:id/review → Admin updates approved quantity  
  * POST /orders/:id/confirm → Generates payment link (Razorpay API placeholder)  
*  Payment Webhook Integration  
  * /webhook/payment → Razorpay webhook listener  
  * On success → update order status, generate work order  
*  Work Order APIs  
  * POST /orders/:id/work-order → Auto-generate work order for warehouse  
  * GET /work-orders → Warehouse view with PDF export  
*  Status & Tracking APIs  
  * PATCH /orders/:id/status → Admin/Warehouse updates production status  
  * GET /orders/:id/status → Vendor polls status  
*  Vendor Pricing Import  
  * POST /pricing/import → Upload Excel (CSV/JSON) file and assign pricing per vendor  
*  Notification System  
  * POST /notify → Send notification (email/SMS placeholder)  
  * Log each event to notifications table

---

## **4\. Frontend Foundation (React)**

*  Setup React app with Vite (via Loveable)  
*  Configure TailwindCSS (pre-integrated with Loveable)  
*  Configure React Router DOM  
*  Setup global state with Zustand or Redux Toolkit  
*  Setup supabase Auth for OTP login  
  * Integrate with supabase UI / custom component  
*  Protect routes using session state  
*  Setup Axios instance with token interceptor

---

## **5\. Feature-specific Frontend**

*  Login & Onboarding  
  * OTP-based phone login via supabase  
  * Sync profile after successful auth  
*  Vendor Dashboard  
  * Vendor greeting, status summaries, current orders  
*  Product Catalog Page  
  * Grid/list view with SKU, packaging, photo, custom price  
  * Add to cart feature with quantity input  
*  Cart Page  
  * Editable cart view with subtotal  
  * Submit for review → lock cart  
*  Order Review & Notifications  
  * Show order as “Under Review”  
  * Alert user via banner or toast when reviewed  
*  Payment Page  
  * Link to Razorpay embedded checkout  
  * Success/failure callback integration  
*  Order Tracking View  
  * Live order status (In Production, Packaged, Out for Delivery)  
  * Progress bar or step-indicator UI  
*  Admin Panel  
  * Login (hardcoded or protected for MVP)  
  * View all submitted orders  
  * Edit line-item quantities, send approval  
*  Work Order View (Warehouse)  
  * Download printable slips per SKU with signature  
  * Batch print capability

---

## **6\. Integration**

*  Connect frontend to backend APIs  
  * Catalog, cart, order status, notifications  
*  Handle authentication state securely  
  * Pass supabase token → backend session → authorize via middleware  
*  Test payment workflow end-to-end  
  * Cart → Review → Payment → Work order  
*  Sync warehouse status updates → vendor tracking UI

---

## **7\. Testing**

*  Unit tests  
  * Backend: API endpoints, utility functions  
  * Frontend: Component rendering and logic  
*  Integration tests  
  * Auth flows, cart submission, payment trigger  
*  End-to-end testing  
  * Use Cypress or Playwright  
  * Test full user journey from login to order tracking  
*  Performance testing  
  * Large SKU cart behavior, order throughput  
*  Security testing  
  * Auth bypass, vendor data leakage, API abuse

---

## **8\. Documentation**

*  API documentation (OpenAPI/Swagger)  
  * Authenticated and public routes  
*  System architecture diagram  
  * supabase → Node.js → Supabase  
*  Dev onboarding guide  
  * How to run frontend/backend locally  
*  Admin \+ warehouse user manual  
  * How to use order management UI

---

## **9\. Deployment**

*  Vercel deploy setup for frontend  
*  Vercel backend function deploy (Node.js API routes)  
*  Setup staging environment  
  * Separate Supabase instance or schema  
*  Setup monitoring tools  
  * Vercel analytics, Supabase logs, UptimeRobot  
*  Configure environment secrets  
  * supabase API keys, Razorpay keys, Supabase URL/token

---

## **10\. Maintenance**

*  Define bug report process  
  * GitHub Issues template  
*  Schedule dependency updates  
  * Use Renovate or Dependabot  
*  Backup Supabase DB  
  * Weekly automated export  
*  Add health check endpoint  
  * Used for uptime monitoring  
*  Monitor supabase usage quota  
  * SMS rate limits, auth activity
