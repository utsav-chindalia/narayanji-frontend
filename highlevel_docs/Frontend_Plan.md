
1. Connect with supabase
- create supabase client to be used
- create .env.local file to store the supabase url and key

2. Login
- Signin into supabase using phone number and otp
- Save the jwt token to be used for future requests
- - Authorization: Bearer <jwt_token>
- Do a post call 
- POST http://localhost:3000/api/check-vendor
- Response 
{
  "allowed": true
}
- Login finally


3. Page - /catalog 
- Show the catalog page 
GET http://localhost:3000/api/catalog
Example - 
Response: [
    {
      "sku": "SKU1",
      "name": "GAJAK GUD",
      "category": "GAJAK",
      "unitType": "PER KG",
      "imageUrl": null,
      "pricePerKg": 480,
      "gstPercent": 5
    },
    {
      "sku": "SKU2",
      "name": "TILSAKRI GAJAK",
      "category": "GAJAK",
      "unitType": "PER KG",
      "imageUrl": null,
      "pricePerKg": 480,
      "gstPercent": 5
    },
    {
      "sku": "SKU3",
      "name": "GAJAK CHINI",
      "category": "GAJAK",
      "unitType": "PER KG",
      "imageUrl": null,
      "pricePerKg": 480,
      "gstPercent": 5
    },
    {
      "sku": "SKU4",
      "name": "SON GUD GAJAK",
      "category": "GAJAK",
      "unitType": "PER KG",
      "imageUrl": null,
      "pricePerKg": 520,
      "gstPercent": 5
    },
    {
      "sku": "SKU5",
      "name": "SON CHINI GAJAK",
      "category": "GAJAK",
      "unitType": "PER KG",
      "imageUrl": null,
      "pricePerKg": 520,
      "gstPercent": 5
    },
    {
      "sku": "SKU6",
      "name": "GUD KAJU GAJAK",
      "category": "GAJAK",
      "unitType": "PER KG",
      "imageUrl": null,
      "pricePerKg": 520,
      "gstPercent": 5
    },
    {
      "sku": "SKU7",
      "name": "CHINI KAJU GAJAK",
      "category": "GAJAK",
      "unitType": "PER KG",
      "imageUrl": null,
      "pricePerKg": 520,
      "gstPercent": 5
    },
    {
      "sku": "SKU8",
      "name": "CHOCLATE KAJU GAJAK",
      "category": "GAJAK",
      "unitType": "PER KG",
      "imageUrl": null,
      "pricePerKg": 540,
      "gstPercent": 5
    },
    {
      "sku": "SKU9",
      "name": "MANGO KAJU GAJAK",
      "category": "GAJAK",
      "unitType": "PER KG",
      "imageUrl": null,
      "pricePerKg": 540,
      "gstPercent": 5
    },
    {
      "sku": "SKU10",
      "name": "SON ROLL GUD GAJAK",
      "category": "GAJAK",
      "unitType": "PER KG",
      "imageUrl": null,
      "pricePerKg": 520,
      "gstPercent": 5
    },
    {
      "sku": "SKU11",
      "name": "SON ROLL CHINI GAJAK",
      "category": "GAJAK",
      "unitType": "PER KG",
      "imageUrl": null,
      "pricePerKg": 520,
      "gstPercent": 5
    },
    {
      "sku": "SKU12",
      "name": "DRYFRUIT ROLL GAJAK",
      "category": "GAJAK",
      "unitType": "PER KG",
      "imageUrl": null,
      "pricePerKg": 560,
      "gstPercent": 5
    },
    {
      "sku": "SKU13",
      "name": "CHOCLATE ROLL GAJAK",
      "category": "GAJAK",
      "unitType": "PER KG",
      "imageUrl": null,
      "pricePerKg": 540,
      "gstPercent": 5
    },
]
- Pagination use GET http://localhost:3000/api/catalog?page=2&pageSize=2





   