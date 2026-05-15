---
title: 前端核心功能模組 (React 版)
code: DEV-frontend-modules
sdlc: 開發實作 (Development)
status: implemented
owner: frontend-engineer
related: [PRD-product-catalog, PRD-business-rules, DES-design-system, DES-architecture]
---

# 🟡 DEV — 前端核心功能模組 (React 版)

定義四大交互模組與輔助模組在 React (Turborepo) 架構下的實作規格與業務邏輯。

---

## 1. 商品詳情彈窗 (Product Detail Modal)

- **組件**：`apps/frontend/src/components/ProductDetailModal.tsx`
- **狀態管理**：`AppContext.selectedProduct`
- **觸發**：點擊 `ProductCard.tsx`（非加減按鈕區域）

### 介面元素

- **多圖輪播**：支援主圖與 `detailImgs` 輪播，具備左右切換與縮圖導覽。
- **LINE 一鍵分享**：整合 LINE URL Scheme，分享商品名稱、規格與當前網址。
- **規格與特色**：動態渲染溫層標籤（冷藏/常溫）及 `features[]` 列表。
- **數量控制**：獨立 Qty Selector，點擊「加入購物車」後觸發 Toast 通知。

---

## 2. 多階段結帳表單 (Checkout 4-Step)

- **組件**：`apps/frontend/src/components/CheckoutModal.tsx`
- **狀態管理**：`AppContext.isCheckoutOpen`
- **觸發**：底部 `CartBar.tsx` 的「確認結帳」按鈕

| 階段       | 內容                                                                        |
| ---------- | --------------------------------------------------------------------------- |
| **Step 1** | **購物清單**：列出品項明細，支援優惠碼 (Coupon) 輸入與即時折抵計算。        |
| **Step 2** | **配送資訊**：填寫姓名、電話、地址，並包含**希望配送日期選擇器** (Min+2d)。 |
| **Step 3** | **防呆確認**：顯示最終彙整資訊，確認後送出訂單。                            |
| **Step 4** | **✅ 成功通知**：顯示訂單編號、實付金額，並引導至金流模擬或首頁。           |

---

## 3. 分類導覽與搜尋 (Category & Search)

- **組件**：`CategoryTabs.tsx`, `SearchBar.tsx`
- **邏輯**：
  1. **即時搜尋**：監聽 `searchQuery` 狀態，同步過濾商品名稱、規格與特色內容。
  2. **分類過濾**：點擊 Tabs 切換 `selectedCategory`，支援「全部」與「我的收藏」。
  3. **ScrollSpy**：(待優化) 目前採用 React 狀態驅動的列表重繪。

---

## 4. 管理員隱藏入口 (Admin Trigger)

- **組件**：`Header.tsx`
- **觸發**：Header Logo 2 秒內連點 5 次。
- **行為**：觸發密碼輸入框 (`yogo2026`)，驗證成功後導向後端管理介面。

---

## 5. 全域輔助系統 (Global Utilities)

| 模組     | 實作位置               | 職責                                                 |
| -------- | ---------------------- | ---------------------------------------------------- |
| 狀態中心 | `AppContext.tsx`       | 管理購物車、會員、彈窗、搜尋及優惠邏輯。             |
| 吐司通知 | `AppContext.showToast` | 2.5 秒自動消失的動態通知組件。                       |
| 音效管理 | `audioManager.ts`      | 處理加入購物車、切換分類及操作成功之音效。           |
| 資料層   | `packages/shared`      | 定義商品主檔 (INITIAL_PRODUCTS) 與 TypeScript 介面。 |

---

_YoGo Sprout Workshop — 現代化架構，極致體驗_
