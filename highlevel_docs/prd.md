# **PRD: Distribution Management System for Narayan Ji Gajak**

## **1\. product overview**

### **1.1 document title and version**

* PRD: Distribution Management System for Narayan Ji Gajak  
* Version: 1.0

### **1.2 product summary**

This project aims to create a customizable Distribution Management System (DMS) for Narayan Ji Gajak to streamline its operations with over 300 B2B vendors across India. The system will handle order management, dynamic pricing, payment workflows, warehouse coordination, and real-time tracking.

The tool will replace manual processes like bank statement checks and offline order reviews, reducing human error and delays. It will also allow vendors to self-serve via a mobile/web app, manage their orders, receive notifications, and track order statuses in real-time.

## **2\. goals**

### **2.1 business goals**

* Automate B2B order intake and approval workflows  
* Reduce manual workload on operations team  
* Improve vendor satisfaction with transparency and tracking  
* Enable scalable and modular system to resell to other businesses  
* Optimize warehouse operations with synced work orders

### **2.2 user goals**

* Place large-volume orders with ease  
* See customized pricing per vendor type  
* Get payment link and receive live order tracking  
* Know exact production and dispatch timelines  
* Avoid delays through automated confirmation and notifications

### **2.3 non-goals**

* No integration with third-party logistics for delivery tracking  
* No retail (B2C) order interface  
* No credit-based payment workflows for MVP (except future bulk party toggles)

## **3\. user personas**

### **3.1 key user types**

* Vendor  
* Admin (Internal operations team)  
* Warehouse Staff

### **3.2 basic persona details**

* Vendor: B2B distributors across India who place bulk gajak orders periodically  
* Admin: Narayan Ji’s internal team that reviews orders, manages payments and confirms dispatches  
* Warehouse Staff: Operations staff who fulfill work orders and coordinate packing and dispatch

### **3.3 role-based access**

* Vendor: Can log in, view catalog with vendor-specific pricing, place orders, make payments, and track status  
* Admin: Can manage vendors, view/edit orders, approve or reject quantities, send payment links, and push work orders  
* Warehouse Staff: Get production slips via mail / whatsapp

**4\. Functional requirements**

* Vendor login system (Priority: High)  
  * OTP-based login using vendor code  
  * Session timeout and re-authentication every 24 hours  
* Product catalog & pricing engine (Priority: High)  
  * Unified product menu visible to all vendors  
  * Dynamic per-vendor pricing (Excel-based import)  
  * Show product image, weight  
* Cart and order placement (Priority: High)  
  * Vendors can add products to cart in kg/box form  
  * Submit order without immediate payment  
  * Order stored for admin review  
* Order review & edit (Priority: High)  
  * Admin reviews and edits quantity per SKU  
  * Notification sent to vendor with revised order  
* Payment integration (Priority: High)  
  * Razorpay or PayU integration for B2B payments  
  * Trigger work order only post successful payment  
* Auto-generated work orders (Priority: High)  
  * Printable work orders sent to warehouse after payment  
  * Includes SKU, vendor name, batch code, quantity  
* Order tracking (Priority: Medium)  
  * Vendor sees live status: "In Production", "Packaged", "Out for Delivery"  
  * Status changes triggered by Admin/Warehouse  
* Notifications & reminders (Priority: Medium)  
  * Order submission, approval, payment reminder  
  * Status change alerts to vendors  
* Role-based access control (Priority: High)  
  * Separate dashboards for vendor, admin, and warehouse  
  * Restrict features by user role  
* Dynamic pricing manager (Priority: Medium)  
  * Excel upload of per-vendor pricing logic  
  * Updatable through admin panel

## **5\. user experience**

### **5.1 entry points & first-time user flow**

* Vendor logs in with OTP using vendor code  
* First-time vendors are automatically assigned pricing tier  
* Shown a catalog with prices applicable to them

### **5.2 core experience**

* Login: Vendors log in using OTP and vendor code  
  * Ensures only authorized vendors access system  
* Browse products: View full catalog with custom pricing  
  * Photos, weights, and packaging units shown  
* Add to cart: Vendor adds desired quantities to cart  
  * UI replicates B2B-style ordering (e.g., 10kg, 50kg)  
* Submit for review: Vendor submits cart without payment  
  * Order enters review queue  
* Admin review: Internal team reviews and adjusts quantity  
  * Admin approves and sends revised order  
* Payment: Vendor receives payment link and completes it  
  * Confirmation triggers downstream flow  
* Work order: Work order auto-generated and sent to warehouse via email  
  * Used by staff to fulfill production  
* Live tracking: Vendor sees 3-stage status after payment  
  * In Production → Packaged → Ready for Dispatch

### **5.3 advanced features & edge cases**

* Vendor tries to place order without pricing assigned  
* Payment fails or times out  
* Warehouse team receives duplicate or partial work order  
* Delay in admin review \>1 day triggers escalation  
* Vendors in 80-tier pricing need custom discounts

### **5.4 UI/UX highlights**

* B2B catalog UI optimized for bulk selection (kg/box)  
* Color-coded status indicators for tracking  
* Minimalistic, responsive dashboard per role  
* Email \+ in-app notifications for vendors

## **6\. narrative**

Amit is a vendor based in Indore who regularly buys 500–800 kg of gajak during peak wedding season. He’s tired of calling the office, getting half-baked WhatsApp confirmations, and wondering when his order will ship. With the new distribution platform, Amit logs in, sees his price, places an order, and gets notified as his order moves into production, packaging, and dispatch. It gives him peace of mind—and gives the Narayan Ji team breathing room.

## **7\. success metrics**

### **7.1 user-centric metrics**

* Time from login to order placement \< 5 minutes  
* 95% of vendors using the platform without WhatsApp fallback  
* 90% vendor satisfaction on feedback surveys

### **7.2 business metrics**

* 80% reduction in manual order processing time  
* \<10% order errors or delivery delays  
* 50% increase in order volume handled per month

### **7.3 technical metrics**

* 99.9% uptime  
* Payment webhook latency \< 2 seconds  
* Work order auto-sync failure rate \< 1%

## **8\. technical considerations**

### **8.1 integration points**

* Razorpay or PayU for payments  
* SMS/OTP service for vendor login  
* Existing ERP (if API available) for inventory sync  
* Email service for notifications

### **8.2 data storage & privacy**

* Securely store vendor credentials, orders, pricing slabs  
* Audit trail for each step in the workflow  
* GDPR-compliant storage practices

### **8.3 scalability & performance**

* Handle up to 1000 concurrent vendors  
* Order volume up to 100,000 kg/month  
* Scalable database for SKU expansion

### **8.4 potential challenges**

* Syncing with slow or offline warehouse units  
* Vendor onboarding and data import from Excel  
* Managing pricing exceptions or tier overrides  
* API unavailability from third-party ERP

## **9\. milestones & sequencing**

### **9.1 project estimate**

* Large: 6–8 weeks

### **9.2 team size & composition**

* Medium Team: 3–5 people  
  * 1 product manager, 2 developers, 1 designer, 1 QA engineer

### **9.3 suggested phases**

* Phase 1: Vendor login, catalog display, cart, admin review flow (3 weeks)  
  * OTP login, cart module, admin dashboard for order editing  
* Phase 2: Payment \+ work order sync \+ live tracking (2 weeks)  
  * Razorpay integration, warehouse printable slips, status updates  
* Phase 3: Pricing tiers, notifications, minor UX polish (2 weeks)  
  * Excel import, pricing engine, alert system

## **10\. User stories**

### **10.1 vendor login via OTP**

* ID: US-001  
* Description: As a vendor, I want to log in securely using OTP so that I can access my dashboard.  
* Acceptance criteria:  
  * OTP is sent to registered mobile number  
  * OTP expires after 10 minutes  
  * Vendor is redirected to their dashboard post-login

### **10.2 view personalized product catalog**

* ID: US-002  
* Description: As a vendor, I want to view a product catalog with my pricing so that I can decide what to order.  
* Acceptance criteria:  
  * Catalog displays products with image, weight, and packaging  
  * Pricing reflects vendor-specific rates

### **10.3 add items to cart and submit order**

* ID: US-003  
* Description: As a vendor, I want to add items to my cart and submit the order for review.  
* Acceptance criteria:  
  * Items can be added in kg/box format  
  * Submission does not require payment

### **10.4 admin reviews and edits order**

* ID: US-004  
* Description: As an admin, I want to review and edit orders so that I can manage stock allocation.  
* Acceptance criteria:  
  * Admin can see all submitted orders  
  * Can edit quantity per SKU  
  * Can approve or reject line items

### **10.5 send payment link and confirm order**

* ID: US-005  
* Description: As an admin, I want to send payment links so that vendors can complete the purchase.  
* Acceptance criteria:  
  * Payment link is generated per order  
  * Once paid, order is confirmed automatically

### **10.6 generate warehouse work order**

* ID: US-006  
* Description: As a system, I want to auto-generate a work order for warehouse when payment is successful.  
* Acceptance criteria:  
  * Work order includes SKU, vendor name, batch code, and quantity  
  * PDF is printable and includes signature area

### **10.7 live tracking of order status**

* ID: US-007  
* Description: As a vendor, I want to track my order after payment so that I know when to expect delivery.  
* Acceptance criteria:  
  * Status moves through 3 phases  
  * Time estimates are shown per stage

### **10.8 manage vendor pricing via excel import**

* ID: US-008  
* Description: As an admin, I want to upload pricing via Excel so that each vendor sees the correct rate.  
* Acceptance criteria:  
  * Excel import maps vendor ID to price tier  
  * Pricing updates reflect on next login

### **10.9 notify vendors at key stages**

* ID: US-009  
* Description: As a system, I want to notify vendors when order is approved, rejected, or completed.  
* Acceptance criteria:  
  * Email/SMS sent at each stage  
  * Vendor can see notification history in dashboard

