API Contracts for Distribution Management System (MVP)
All requests are authenticated using supabase JWT tokens via Authorization: Bearer <token> header unless otherwise mentioned.

POST /auth/session
Sync vendor session post-supabase OTP login
Headers:
Authorization: Bearer <supabase_token>
Response:
{
  "success": true,
  "user": {
    "id": "vendor_123",
    "name": "ABC Distributors",
    "phone": "+91XXXXXXXXXX",
    "pricingTier": "TIER_2"
  }
}



Post  /api/check-vendor
Request:
{
  "phone": "+919876543210"
}

Response:
{
  "allowed": true / false 
}

Purpose: To check if a vendor's phone number is allowed before triggering OTP login.



GET /catalog
Fetch product catalog with vendor-specific pricing
Headers:
Authorization: Bearer <supabase_token>
Response:
[
  {
    "sku": "GZK-001",
    "name": "Til Sakri Gajak",
    "category": "GAJAK",
    "unitType": "PER_KG",
    "imageUrl": "https://cdn.com/gajak1.png",
    "pricePerKg": 320,
    "gstPercent": 0.05
  }
]


POST /cart
Submit cart for admin review
Headers:
Authorization: Bearer <supabase_token>
Request:
{
  "items": [
    { "sku": "GZK-001", "quantityKg": 100 },
    { "sku": "GZK-002", "quantityKg": 150 }
  ]
}

Response:
{
  "success": true,
  "orderId": "ORD-987654"
}






PATCH http://localhost:3000/api/cart/ORD-1747765403319
Update cart (replace items in an existing order)
{
  "items": [
    { "sku": "SKU1", "quantity_kg": 3 }
  ]
}



GET /orders
List all the orders details, option to filter based on status, search and pagination.

Response:
[
  {
    "id": "ORD-XXXX",
    "vendorId": "XXXXXXXXX",
    "status": "approved"
  }
]

GET /orders/:orderId/items
List all the items for the given orderId
[
  {
    "sku": "SKU",
    "quantity_kg": 3,
    "product_name": "",
    "pricing_tier": "",
    "price_per_kg": "", 
    "gst": "",
    "product_category": ""
  }
]

PUT /orders/:orderId/review
Admin updates approved quantities after reviewing order
Request:
{
  "items": [
    { "sku": "GZK-001", "approvedQuantityKg": 80 },
    { "sku": "GZK-002", "approvedQuantityKg": 150 }
  ]
}

Response:
{
  "success": true,
  "message": "Order reviewed successfully"
}


POST /orders/:orderId/confirm
Trigger Razorpay payment link for vendor
Response:
{
  "success": true,
  "paymentUrl": "https://razorpay.com/pay/order_abc123"
}


POST /webhook/payment
Razorpay webhook to confirm payment
Request:
{
  "order_id": "order_abc123",
  "status": "paid"
}

Response:
{ "received": true }


GET /work-orders
Get generated work orders for warehouse team
Response:
[
  {
    "workOrderId": "WO-101",
    "vendor": "ABC Distributors",
    "sku": "GZK-001",
    "quantityKg": 80,
    "batchCode": "BCH-2025-001",
    "status": "pending"
  }
]


PATCH /orders/:orderId/status
Warehouse/admin updates production stage
Request:
{
  "status": "in_production"
}

Response:
{ "success": true }


GET /orders/:orderId/status
Vendor views live order status
Response:
{
  "status": "packaged",
  "lastUpdated": "2025-05-17T10:45:00Z"
}


GET /orders
Vendor views all their past/current orders
Response:
[
  {
    "orderId": "ORD-1234",
    "status": "packaged",
    "totalWeight": 230,
    "createdAt": "2025-05-14T12:00:00Z"
  }
]


GET /orders/:orderId/payment
Returns the payment link and the total payment value to vendor
Response:
[
  {
    payment_url: "https://rzp.io/rzp/Jdi0JBU",
    payment_tota: ""
  }
]


Swagger API: https://docs.google.com/document/d/1T36H2ZuD9Qo23WUO-u9CFKoCWeDXQpIZeAjPssQrL3M/edit?tab=t.9pgkl0r8rwdt 



