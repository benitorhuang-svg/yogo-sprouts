---
title: 業務規則與系統常數
code: PRD-business-rules
sdlc: 需求定義 (Product Requirements)
status: implemented
owner: product-operations + frontend-engineer
related: [DEV-frontend-modules, DEV-backend-api, BIZ-order-lifecycle]
---

# 🟢 PRD — 業務規則與系統常數

集中管理所有散落在程式碼中的業務魔術數字與行為規則。營運策略調整時，查閱本文件即可定位修改位置。

---

## 1. 配送與運費規則

### 溫層分類

| 溫層 | `cold` 值 | 適用分類 | 標籤 |
| :--- | :--- | :--- | :--- |
| 常溫 | `false` | kit, parts, seeds, peanut | 📦 常溫商品 |
| 冷藏 | `true` | fresh, drinks | ❄️ 冷藏運送 |

### 免運門檻

| 溫層 | 門檻 | 程式碼位置 |
| :--- | :--- | :--- |
| 冷藏 | **$2,000** | `src/checkoutModal.ts` |
| 常溫 | **$800** | `src/checkoutModal.ts` |

> ⚠️ 冷藏與常溫**各自獨立計算**，不可合併。

---

## 2. 庫存與商品狀態

| 條件 | 前端行為 | 位置 |
| :--- | :--- | :--- |
| `stock === 0` | 灰階遮罩 + 禁用按鈕 + 「已售完」 | `src/shop.ts` |
| `stock > 0 && stock <= 5` | 商品卡片右上角顯示紅色/黃色低庫存警告標籤 | `src/shop.ts` |
| `stock > 5` | 正常顯示，可加入購物車 | `src/shop.ts` |

### 庫存與提醒常數

| 常數名稱 | 值 | 說明 |
| :--- | :--- | :--- |
| **低庫存門檻 (LOW_STOCK_THRESHOLD)** | **5** | 低於或等於此庫存量時，卡片顯示警告並觸發急迫感提醒 |

### 數量限制

| 場景 | 最小值 | 說明 |
| :--- | :--- | :--- |
| 商品卡片 `−` | `0` | 不可負數 |
| Detail Modal | `1` | 彈窗內預設 1 |
| 結帳 Step 1 | `0` | 歸零則移除品項 |

### 庫存持久化

| Phase | 方式 |
| :--- | :--- |
| Phase 1 (當前) | `localStorage('yogo_products_stock')` |
| Phase 2 (規劃) | Firestore `products/{id}.stock` |

---

## 3. 管理員入口

| 參數 | 值 | 位置 |
| :--- | :--- | :--- |
| 觸發區域 | Header `.logo` | `src/admin.ts` |
| 點擊次數 | **5 次** | `src/admin.ts` |
| 時間視窗 | **2,000 ms** | `src/admin.ts` |

---

## 4. 結帳流程

### 表單驗證 (Step 2)

| 欄位 | 驗證 |
| :--- | :--- |
| 收件人姓名 | `required`, `minLength: 2` |
| 聯絡電話 | `required`, `^09\d{8}$` |
| LINE ID / Email | `required` |
| 收件地址 | `required`, `minLength: 8` |

### 防重複提交 (Step 3)

| 規則 | 實作 |
| :--- | :--- |
| 按鈕鎖定 | `disabled = true` |
| API 限流 (Phase 2) | 同一 IP 10 分鐘 ≤ 5 筆 |

### 成功後重置 (Step 4)

清空購物車 → 卡片數量歸零 → 關閉 Modal → `scrollTo({ top: 0, behavior: 'smooth' })`

---

## 5. UI 動畫時間

| 動畫 | 時長 |
| :--- | :--- |
| 卡片懸停浮起 | `300ms` |
| 商品圖放大 | `400ms` |
| 購物車金額彈跳 | `300ms` |
| Toast 消失 | `2,500ms` |

---

## 6. 訂單狀態 (詳見 [BIZ-order-lifecycle](./BIZ-order-lifecycle.md))

| 狀態 | 說明 |
| :--- | :--- |
| `pending` | 待確認 |
| `confirmed` | 已確認接單 |
| `quoted` | 已報價運費 |
| `paid` | 已付款 |
| `preparing` | 備貨中 |
| `shipped` | 已出貨 |
| `delivered` | 已送達 |
| `cancelled` | 已取消 |
