# 🌱 YoGo 有夠菜 — 專案開發待辦清單 v1.0 (修正版)

> **說明**：本清單依據 2026-05-15 實際代碼庫 (React Monorepo) 檢查結果重編。
> 所有項目皆已依據 SDLC 規格完成實作並遷移至 React 架構。

---

## 🟢 Phase 0 — 基礎建設 (React 遷移與環境)

- [v] TypeScript 嚴格模式編譯與 Turborepo 管理
- [v] 一鍵啟動本機開發環境 (`npm run dev`)
- [v] 響應式商品網格渲染 (`apps/frontend/src/components/ProductList.tsx`)
- [v] **[已遷移]** 商品詳細資訊多圖輪播彈窗 (`ProductDetailModal.tsx`)
- [v] **[已重構]** 購物車與底部控制列 (`CartBar.tsx`)
- [v] **[已實作]** 多步驟漸進式結帳表單 (`CheckoutModal.tsx`, 4-Step 邏輯)
- [ ] **[待實作]** 分類導覽 ScrollSpy 滾動追蹤 (目前為狀態過濾模式)
- [v] **[已實作]** 管理員 Logo 密碼鎖隱藏入口 (Logo 5連點觸發)
- [v] **[已實作]** Toast 輕量化提示系統 (`showToast` 整合)
- [v] 全站商品與品牌配圖整合
- [v] 品牌關於我們 (About) 頁面
- [v] 導入完整 14 份 SDLC 架構與需求規格書庫 (`docs/`)

---

## 🔴 Phase A — 高優先優化 (搜尋與急迫感)

- [v] **A1. 商品即時搜尋與關鍵字過濾** (`SearchBar.tsx`)
- [v] **A2. 低庫存急迫提醒** (`ProductCard.tsx` 庫存 <= 5 提示)
- [v] **A3. 種子商品獨立圖片** (已整合至 `shared` 資料與 `public/img`)
- [v] **A4. LINE 一鍵分享商品** (已整合至 `ProductDetailModal.tsx`)

---

## 🔵 Phase 1 — Firebase 雲端託管與上線部署

- [v] Firebase 專案初始化與 CLI 配置
- [v] 部署組態 (`firebase.json`, `firestore.rules`)
- [v] 本機模擬器與 Hosting 部署流程

---

## 🟡 Phase 2 — Firebase 後端資料庫與 API

- [v] **2A. Firestore 資料治理** (商品種子導入、`AppContext` 非同步獲取)
- [v] **2B. Cloud Functions API** (GET `/api/products`, POST `/api/checkout` 交易機制)
- [v] **2C. 訂單自動通知系統** (LINE Notify 店家通知、Firestore 狀態變更 Trigger)

---

## 🟠 Phase B — 中優先優化 (用戶體驗)

- [v] **B1. 收藏 / 願望清單** (`localStorage` 持久化與過濾)
- [v] **B2. 優惠碼折扣系統** (已整合至 `CheckoutModal.tsx` Step 1)
- [v] **B3. 指定希望配送日期** (已整合至 `CheckoutModal.tsx` Step 2)
- [v] **B4. PWA 漸進式 Web 應用** (`vite-plugin-pwa` 整合)
- [v] **B5. 深色模式** (`Header.tsx` 切換按鈕與 `data-theme` 覆寫)

---

## 🟢 Phase C — 低優先優化 (極致打磨)

- [ ] **C1. Firebase Analytics 事件追蹤** (尚未部署電子商務行為日誌)
- [v] **C2. SEO 結構化資料優化** (`index.html` JSON-LD 與 Meta Tags)
- [v] **C3. ARIA 無障礙標籤增強** (Modal 角色、`aria-label` 與 `alt` 補全)
- [v] **C4. 模擬線上安全支付** (結帳成功後流程引導)

---

## 🚀 專案狀態總結

已全面將原有 SDLC 規格中的核心業務邏輯（結帳、詳情、優惠、配送、通知）落實於 React 架構中。目前僅餘 **ScrollSpy** 與 **Analytics** 為低優先待辦項。

---

_YoGo Sprout Workshop — 精緻生活，自給自足_
