---
title: Firebase 後端 API 規劃
code: DEV-backend-api
sdlc: 開發實作 (Development)
status: planned
owner: backend-firebase-architect
related: [PRD-business-rules, BIZ-order-lifecycle, OPS-deployment]
---

# 🟡 DEV — Firebase 後端 API 規劃

Phase 2 採用 Firebase Cloud Functions + Firestore，取代 LocalStorage 前端模擬。

---

## 1. Firestore Schema

### `products` 集合 — `/products/{productId}`

```json
{
  "id": 1,
  "category": "kit",
  "name": "芽菜種植入門套組",
  "price": 600,
  "cold": false,
  "emoji": "🌱",
  "img": "img/products/kit-starter.png",
  "stock": 15,
  "spec": "精美手提禮盒/組",
  "features": ["內含：雙層培植箱 x2", "7天即可採收"]
}
```

### `orders` 集合 — `/orders/{orderId}`

```json
{
  "cust_name": "Benito",
  "cust_phone": "0912345678",
  "cust_contact": "benito_line",
  "cust_address": "台北市...",
  "total_price": 1350,
  "shipping_fee": null,
  "status": "pending",
  "tracking_number": null,
  "created_at": "...",
  "confirmed_at": null,
  "shipped_at": null,
  "items": [{ "product_id": 1, "name": "...", "qty": 2, "price": 600 }]
}
```

---

## 2. API 規格

### GET `/api/products`

回傳所有商品（200 OK，JSON 陣列，按 `id` 升序）。

### POST `/api/checkout`

**請求體**：

```json
{
  "customer": { "name": "", "phone": "", "contact": "", "address": "" },
  "cart": { "1": 2, "3": 1 },
  "couponCode": "YOGO2026",
  "preferred_delivery_date": "2026-06-01",
  "user_uid": "firebase_auth_uid"
}
```

**Firestore Transaction 流程**：

1. `BEGIN` → 鎖定商品文件
2. 校驗庫存充足性
3. 扣減 `stock`
4. 計算優惠碼折扣
5. 寫入 `orders` (綁定 `user_uid`, status: `"pending"`)
6. `COMMIT` → 觸發 LINE Notify（見 [BIZ-order-lifecycle](./BIZ-order-lifecycle.md)）

**回應**：

- `200`: `{ "success": true, "message": "結帳成功！", "orderId": "#ORD-20260515-001" }`
- `400`: `{ "success": false, "error": "庫存不足..." }`

### POST `/auth/line`

**用途**：處理 LINE Login 的 OAuth 回調，交換存取權杖並簽發 Firebase Custom Token。

**請求體**：

```json
{
  "code": "line_authorization_code",
  "redirectUri": "https://yogo-sprouts-app.web.app/"
}
```

**回應**：

- `200`: `{ "customToken": "firebase_custom_token" }`

---

## 3. 安全規則 (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if false; // 僅限後端操作庫存
    }
    match /coupons/{couponId} {
      allow read: if true;
      allow write: if false;
    }
    match /orders/{orderId} {
      allow create, update, delete: if false; // 強制經由 /checkout API
      allow read: if request.auth != null && resource.data.user_uid == request.auth.uid;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

前端禁止直連寫入，所有變更必須經由 Cloud Functions 特權帳號。

---

## 4. 依賴套件 (Phase 2)

```json
{
  "dependencies": {
    "express": "^4.19.2",
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^5.0.0"
  },
  "devDependencies": { "@types/express": "^4.17.21" }
}
```
