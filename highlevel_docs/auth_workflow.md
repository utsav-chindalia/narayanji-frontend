AUTH Workflow

Frontend (React / Flutter)
   |
   |-- 1. User inputs phone number
   |
   |-- 2. API Call to `/api/check-vendor`
   |       - Backend checks Supabase/Postgres for vendor phone
   |       - If allowed → respond OK
   |
   |-- 3. If allowed → Call Supabase Auth (OTP Login)
   |       - supabase.auth.signInWithOtp({ phone: '...' })
   |
   |-- 4. User enters OTP → Supabase validates, gives JWT
   |
   |-- 5. API Call to `/api/place-order`
   |       - Authorization: Bearer <JWT>
   |
   |-- 6. Backend verifies JWT token (Supabase SDK)
   |       - Gets user ID or phone number
   |       - Performs secure CRUD using Supabase client



