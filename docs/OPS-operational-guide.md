---
title: 營運維護指南
code: OPS-operational-guide
sdlc: 部署維運 (Operations)
status: implemented
owner: product-operations
related: [PRD-product-catalog, BIZ-order-lifecycle]
---

# 🔴 OPS — 營運維護指南

專為非技術人員設計。教導如何修改商品、管理庫存、查看訂單。

---

## 1. 修改商品資料

所有商品定義在 [src/data.ts](file:///c:/Users/benit/Desktop/YoGo/src/data.ts)：

```typescript
{
  id: 1,              // ⚠️ 嚴禁修改 ID
  name: '芽菜種植入門套組',  // 商品名稱
  price: 600,         // 售價
  stock: 15,          // 庫存
  spec: '精美手提禮盒/組',  // 規格
  features: [...]     // 特色介紹
}
```

### 設定商品「售完」

將 `stock` 改為 `0`：

```typescript
stock: 0,  // 前台自動加載售完遮罩
```

### 修改免運門檻

在 [src/checkoutModal.ts](file:///c:/Users/benit/Desktop/YoGo/src/checkoutModal.ts) 中搜尋並修改：

- 冷藏：`2000`
- 常溫：`800`

---

## 2. Firebase Console 訂單管理 (Phase 2)

1. 開啟 [Firebase Console](https://console.firebase.google.com/)
2. 選擇專案 → **Firestore Database**
3. 進入 `orders` 集合查看每筆預購單

### 訂單欄位說明

- `cust_name` / `cust_phone` / `cust_address`：收件人資訊
- `cust_contact`：LINE ID 或 Email
- `items`：展開可看購買明細
- `status`：訂單狀態（參見 [BIZ-order-lifecycle](./BIZ-order-lifecycle.md)）

### 導出訂單

- Firebase Console → JSON 導出
- 或透過 BigQuery 匯出 CSV/Excel
