**Sprints** 

# **7-Day Sprint Plan for MVP Delivery**

## **Sprint 1: Project scaffolding & auth bootstrapping**

### **Backend \+ DevOps (Utsav)**

- [ ]  **Set up repo structure**  
- [ ]  **Initialize backend (Node.js) workspace**  
- [ ]  **Setup supabase project \+ phone auth**  
- [ ]  **Create initial Supabase DB schema: vendors, users, products**  
- [ ]  **Setup supabase token validation middleware**  
- [ ]  **Deploy backend project to Vercel**  
- [ ]  **Setup .env scaffolding and CI pipeline (GitHub Actions)**

### **Frontend (Micky)**

- [ ]  **Scaffold frontend with Loveable (React \+ Tailwind)**  
- [ ]  **Integrate supabase SDK**  
- [ ]  **Build OTP-based login component with phone number input**  
- [ ]  **Implement auth state provider using supabase**  
- [ ]  **Setup routing: /login, /catalog, /orders, /cart, /tracking**

---

## **Sprint 2: Core catalog & vendor auth**

### **Backend (Utsav)**

- [ ]  **Build /auth/login endpoint to sync vendor to Supabase on supabase login**  
- [ ]  **Seed products table with 5–10 test SKUs**  
- [ ]  **Build /catalog API: return SKUs with vendor-specific pricing**  
- [ ]  **Add mock /pricing logic per vendor (3 tiers)**

### **Frontend (Micky)**

- [ ]  **Create vendor dashboard layout (basic navbar, sections)**  
- [ ]  **Build catalog page with Loveable cards for SKUs**  
- [ ]  **Integrate /catalog API with auth headers**  
- [ ]  **Show product name, box size, pricing, photo**  
- [ ]  **Create “Add to Cart” UI (state only for now)**

---

## **Sprint 3: Cart → order review flow**

### **Backend (Utsav)**

- [ ]  **Create cart and orders tables in Supabase**  
- [ ]  **Build POST /cart → save new order with status: pending\_review**  
- [ ]  **Build GET /orders/:vendorId → list all orders for vendor**  
- [ ]  **Build PUT /orders/:id/review → admin can edit approved quantity**

### **Frontend (Micky)**

- [ ]  **Build Cart page with selected items**  
- [ ]  **Connect Cart submission to /cart API**  
- [ ]  **Build Orders page for vendors with filter (pending, approved, complete)**  
- [ ]  **Display reviewed quantity & admin notes**

---

## **Sprint 4: Admin and payment integration**

### **Backend (Utsav)**

- [ ]  **Implement Razorpay/PayU stub (mock invoice link for now)**  
- [ ]  **Build /orders/:id/confirm → simulate payment trigger**  
- [ ]  **Setup webhook /webhook/payment → on success, change status to paid**

### **Frontend (Micky)**

- [ ]  **Build Admin login (static creds or route param protection)**  
- [ ]  **Admin: View submitted orders → Edit quantity → Mark as reviewed**  
- [ ]  **Admin: Approve & trigger “Send Payment” (simulate with mock link)**  
- [ ]  **Show vendor banner: “Approved — Complete Payment”**

---

## **Sprint 5: Work order and production workflow**

### **Backend (Utsav)**

- [ ]  **Add work\_orders table to Supabase**  
- [ ]  **Create POST /orders/:id/work-order → triggered on payment success**  
- [ ]  **Build GET /work-orders → grouped by SKU \+ vendor \+ quantity**

### **Frontend (Micky)**

- [ ]  **Vendor: Redirect to success screen after payment**  
- [ ]  **Build basic Warehouse panel UI (table of orders to fulfill)**  
- [ ]  **Implement PDF download link for each work order**  
- [ ]  **(Optional) Print slip with SKU, batch code, vendor name**

---

## **Sprint 6: Live tracking \+ status updates**

### **Backend (Utsav)**

- [ ]  **Add PATCH /orders/:id/status → update: in\_production, packaged, ready\_to\_ship**  
- [ ]  **Build GET /orders/:id/status → for vendor to poll**  
- [ ]  **Add notifications table to log changes**

### **Frontend (Micky)**

- [ ]  **Vendor: Add live tracking UI (3-step progress bar)**  
- [ ]  **Show dynamic status based on API polling**  
- [ ]  **Warehouse: Mark order status per stage (buttons or dropdown)**  
- [ ]  **Add toast/banner on vendor dashboard for each status update**

---

## **Sprint 7: Polish, QA, and demo readiness**

### **Backend (Utsav)**

- [ ]  **Implement RLS (Row-Level Security) policies in Supabase**  
- [ ]  **Add logging \+ error handling for all endpoints**  
- [ ]  **Write simple unit tests for 2–3 core APIs**  
- [ ]  **Seed dummy data (vendors, orders, etc.)**

### **Frontend (Micky)**

- [ ]  **Final polish on UI: empty states, loading spinners**  
- [ ]  **Toasts for all major actions: cart submitted, payment done, etc.**  
- [ ]  **QA flow: OTP login → catalog → cart → approval → payment → tracking**  
- [ ]  **Prepare screens and flows for demo**

**API Contract:**  
