# PREMIUM BOOST Feature Documentation

## Overview
The PREMIUM BOOST feature allows admin to promote specific products to the top of the marketplace. Boosted products from **Crop Market** and **Agri Shop** will always appear at the top of their respective marketplaces, giving them maximum visibility.

## Database Columns
Two new columns have been added to the `Products` table:

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `isBoosted` | BOOLEAN | false | Whether the product is currently boosted |
| `boostExpiryDate` | DATETIME | NULL | Expiry date for the boost (NULL = permanent) |

## How It Works

### 1. Marketplace Sorting Logic
Products are sorted using this SQL logic:
```sql
ORDER BY 
  CASE WHEN isBoosted = 1 AND (boostExpiryDate IS NULL OR boostExpiryDate > NOW()) 
    THEN 0 
    ELSE 1 
  END ASC,
  createdAt DESC
```

**Result**: Active boosted products appear first (CASE = 0), followed by regular products (CASE = 1).

### 2. Boosted Products by Marketplace

#### CROP MARKET (Farmers selling produce)
Currently boosted products:
- Egyptian Lemon (Hamad) - ID: 19
- Egyptian Lemon – Wholesale Tonne - ID: 20
- Egyptian Mango (Alphonso) - ID: 25
- Mango – Wholesale Tonne - ID: 26
- Fresh Strawberry (Festival) - ID: 29
- Egyptian Grapes (Red Globe) - ID: 36

#### AGRI SHOP (AGRI_MARKET - Suppliers selling tools & inputs)
Currently boosted products:
- NPK 20-20-20 Compound Fertilizer - ID: 38
- Potassium Sulfate (SOP) - ID: 42
- Drip Irrigation Starter Kit - ID: 51
- Forged Steel Hoe - ID: 48
- Hybrid Tomato Seeds - ID: 53
- Hybrid Cucumber Seeds - ID: 55

## API Endpoints

### 1. Get All Boosted Products
```http
GET /admin/products/boosted
Authorization: Bearer <admin_token>
```

**Response**:
```json
{
  "total": 12,
  "products": [
    {
      "id": 19,
      "title": "Egyptian Lemon (Hamad)",
      "marketplaceType": "CROP_MARKET",
      "isBoosted": true,
      "boostExpiryDate": null,
      "User": {
        "id": 6,
        "fullName": "Ahmed Mansour",
        "role": "FARMER"
      }
    }
  ]
}
```

### 2. Boost a Product
```http
POST /admin/products/:productId/boost
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "boostExpiryDate": "2026-12-31"  // Optional. If omitted, boost is permanent
}
```

**Response**:
```json
{
  "message": "Product boosted successfully",
  "product": {
    "id": 19,
    "title": "Egyptian Lemon (Hamad)",
    "marketplaceType": "CROP_MARKET",
    "isBoosted": true,
    "boostExpiryDate": null
  }
}
```

**Example with expiry date**:
```bash
curl -X POST http://localhost:3000/admin/products/19/boost \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"boostExpiryDate": "2026-12-31"}'
```

### 3. Remove Boost from a Product
```http
DELETE /admin/products/:productId/boost
Authorization: Bearer <admin_token>
```

**Response**:
```json
{
  "message": "Product boost removed successfully",
  "product": {
    "id": 19,
    "title": "Egyptian Lemon (Hamad)",
    "isBoosted": false
  }
}
```

## Setup Instructions

### Step 1: Run Migration
```bash
node migrate-premium-boost.js
```
This adds the `isBoosted` column to the products table.

### Step 2: Seed Boosted Products
```bash
node seed-premium-boost.js
```
This marks 12 premium products as boosted (6 from Crop Market, 6 from Agri Shop).

### Step 3: Verify
```bash
curl -X GET http://localhost:3000/admin/products/boosted \
  -H "Authorization: Bearer <admin_token>"
```

## Frontend Integration

### Display Boosted Products
The marketplace already sorts boosted products first. When fetching products:

```javascript
// Frontend code
GET /marketplace/products/crop-market
// Returns products with boosted items first

GET /marketplace/products/agri-shop
// Returns products with boosted items first
```

### Show Premium Badge
Add a visual indicator on boosted products:
```jsx
{product.isBoosted && (
  <span className="premium-badge">⭐ PREMIUM BOOST</span>
)}
```

## Business Logic

| Scenario | Behavior |
|----------|----------|
| Product with `isBoosted=true` and `boostExpiryDate=null` | Permanently boosted, always at top |
| Product with `isBoosted=true` and future `boostExpiryDate` | Boosted until expiry date, then auto-drops |
| Product with `isBoosted=true` and past `boostExpiryDate` | Treated as expired, drops in sorting |
| Product with `isBoosted=false` | Regular sorting by `createdAt` DESC |

## Marketplace URLs

- **Crop Market**: `/marketplace/products/crop-market`
- **Agri Shop**: `/marketplace/products/agri-shop`
- **Sensor Market**: `/marketplace/products/sensor-market`

---

## Files Modified/Created

### Created:
- `migrate-premium-boost.js` - Migration to add columns
- `seed-premium-boost.js` - Seed script for initial boosted products

### Modified:
- `src/controllers/admin.controller.js` - Added `boostProduct()`, `removeBoost()`, `getBoostedProducts()`
- `src/routes/admin.routes.js` - Added routes for boost management

### Existing (no changes needed):
- `src/models/Product.js` - Already has `isBoosted` and `boostExpiryDate` fields
- `src/controllers/marketplace.controller.js` - Already implements sorting logic
- Database schema - Sequelize model handles column definitions

---

## Testing Checklist

- [ ] Run migration: `node migrate-premium-boost.js`
- [ ] Seed products: `node seed-premium-boost.js`
- [ ] Get boosted products: `GET /admin/products/boosted`
- [ ] View crop market: Products with IDs 19, 20, 25, 26, 29, 36 appear first
- [ ] View agri shop: Products with IDs 38, 42, 51, 48, 53, 55 appear first
- [ ] Boost a new product: `POST /admin/products/:id/boost`
- [ ] Remove boost: `DELETE /admin/products/:id/boost`
- [ ] Check auto-expiry: Set `boostExpiryDate` to past date and verify product drops

---

**Last Updated**: June 10, 2026
**Status**: Ready for Production ✅
