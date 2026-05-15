# 🌱 YoGo 有夠菜 — 專案開發待辦清單 (TODO)

> 依據 `docs/` SDLC 規格文件庫整編，已全面完成所有階段的實作與優化！
> 所有項目皆已通過驗證並標記為 `[v]`。

---

## 🟢 Phase 0 — 基礎建設（開發環境與靜態原型）

- [v] TypeScript 嚴格模式編譯與管理 (`tsconfig.json`)
- [v] 一鍵啟動本機開發環境 (`npm run dev` = tsc -w + http-server)
- [v] 響應式商品網格渲染與過濾 UI (`src/shop.ts`)
- [v] 購物車與底部浮動控制列 (`src/cart.ts`)
- [v] 商品詳細資訊多圖輪播彈窗 (`src/detailModal.ts`)
- [v] 多步驟漸進式結帳表單彈窗 (`src/checkoutModal.ts`)
- [v] 分類導覽與 ScrollSpy 滾動追蹤 (`src/scrollSpy.ts`)
- [v] 管理員 Logo 密碼鎖隱藏入口 (`src/admin.ts`)
- [v] Toast 輕量化提示系統 (`src/toast.ts`)
- [v] 全站 13 張商品與品牌配圖（AI 生成優化）
- [v] 品牌 關於我們 (About) 頁面實作 (`public/about.html`)
- [v] 導入完整 14 份 SDLC 架構與需求規格書庫 (`docs/`)

---

## 🔴 Phase A — 高優先優化（直接提升轉換率）

- [v] **A1. 商品即時搜尋與關鍵字過濾**
  - [v] 新增 `src/search.ts` 搜尋過濾模組
  - [v] 在分類 Tabs 上方新增高雅帶 🔍 圖示的搜尋框
  - [v] 監聽 `input` 事件，對商品陣列進行即時過濾與無延遲卡片隱藏
  - [v] 支援一鍵清除搜尋並恢復完整列表
- [v] **A2. 低庫存急迫提醒**
  - [v] 在 `src/shop.ts` 卡片渲染中新增條件式低庫存狀態標籤
  - [v] 觸發門檻：當商品庫存小於等於 5 件時自動提示 `🔥 僅剩 {stock} 件`
  - [v] 新增 CSS 呼吸燈動效，打造 FOMO 急迫感
- [v] **A3. 種子商品獨立圖片**
  - [v] 解決各種子共用同一張圖片的問題，使用 AI 繪製五大類別包裝圖片
  - [v] 更新 `docs/PRD-product-catalog.md` 商品目錄與圖片映射表
  - [v] 更新 `src/data.ts` 與資料庫中的商品 `img` 圖片路徑
- [v] **A4. LINE 一鍵分享商品**
  - [v] 在 Detail Modal 右上角引入綠色 LINE 分享按鈕
  - [v] 整合 LINE URL Scheme 完成一鍵快速分享商品資訊及當前網站 URL

---

## 🔵 Phase 1 — Firebase 雲端託管與上線部署

- [v] **Firebase 專案初始化**
  - [v] 全域安裝並配置 `firebase-tools` CLI
  - [v] 執行 `firebase login` 完成 Google 帳號授權
  - [v] 執行 `firebase init` 完成 Hosting + Firestore + Functions 組態設定
  - [v] 設置靜態資源發布路徑為 `public` 目錄
- [v] **部署組態編寫**
  - [v] 編寫 `firebase.json`（設置單頁應用路由重定向、快取規則與 API Proxy）
  - [v] 編寫 `firestore.rules` 安全規則（限制 orders/coupons 僅限後端存取，products 僅限公開讀取）
  - [v] 編寫並優化 `firestore.indexes.json` 索引定義
- [v] **本機模擬與部署上線**
  - [v] 使用 `firebase emulators:start` 本機模擬 Firestore、Hosting 與 Cloud Functions
  - [v] 執行 `npm run build && firebase deploy` 完成首次正式上線與 `.web.app` 連線驗證

---

## 🟡 Phase 2 — Firebase 後端資料庫與 API

### 2A. Firestore 資料治理

- [v] **商品資料庫雲端化**
  - [v] 編寫 Cloud Functions 種子腳本，自動將 33 款精選商品導入 Firestore `products` 集合
  - [v] 重構前端 `src/data.ts` 改為非同步調用 `/api/products` 獲取最新資料
  - [v] 移除 localStorage 舊有庫存模擬，改為後端資料庫一致性控制
- [v] **訂單資料模型設計**
  - [v] 設計 Firestore `orders` 集合 Schema（含 status、shipping_fee、tracking_number 等欄位）
  - [v] 實作嚴格的訂單流水編號規範：`#ORD-YYYYMMDD-NNN`（如：`#ORD-20260512-001`）

### 2B. Cloud Functions API 實作

- [v] **GET `/api/products`**
  - [v] 建立 Express API 路由獲取全部 Firestore 商品資料，並依 ID 排序
- [v] **POST `/api/checkout`**
  - [v] 實作 Firestore Transaction（交易機制），在高併發下安全檢查並扣減商品庫存，並原子性寫入新訂單
  - [v] 實作詳盡的錯誤狀態回傳（庫存不足 400，伺服器異常 500）
  - [v] 整合 `express-rate-limit` 防止暴力下單（單一 IP 限制 10 分鐘內最多 5 次）

### 2C. 訂單自動通知系統

- [v] **LINE Notify 店家即時通知**
  - [v] 申請並取得 LINE Notify 權杖
  - [v] 設置 Firebase 執行期組態參數 `line.notify_token`
  - [v] 實作 `sendLineNotify()` 函數，在結帳成功時，將訂單明細即時推送至店家手機
- [v] **Firestore Trigger 顧客多狀態變更通知**
  - [v] 實作 `onOrderStatusChange` 雲端觸發器
  - [v] 當狀態變更為 `confirmed` 時，發送顧客接單確認通知
  - [v] 當狀態變更為 `quoted` 時，發送運費報價與匯款資訊通知
  - [v] 當狀態變更為 `paid` 時，發送已付款及備貨提醒通知
  - [v] 當狀態變更為 `shipped` 時，發送出貨與物流追蹤碼通知
  - [v] 當狀態變更為 `cancelled` 時，發送預購單取消通知

---

## 🟠 Phase B — 中優先優化（提升顧客使用體驗）

- [v] **B1. 收藏 / 願望清單**
  - [v] 商品卡片右上角新增 `🤍` 按鈕，點擊切換為 `❤️` 收藏狀態
  - [v] 串接 `localStorage('yogo_favorites')` 自動儲存用戶的最愛狀態
  - [v] 在 Header 分類 Tabs 中新增「❤️ 我的收藏」入口，可即時過濾並顯示已收藏商品
- [v] **B2. 優惠碼折扣系統**
  - [v] 結帳 Step 1 底部新增高質感「輸入優惠碼」輸入框與「套用」按鈕
  - [v] 實作 Coupon 資料結構介面與前/後端安全驗證邏輯
  - [v] 支援「固定金額折抵」與「比例折扣 (percent off)」兩種類型
  - [v] 完成 Firestore `coupons` 集合建置，儲存 active, expiresAt 等限制欄位並串接 API 驗證
- [v] **B3. 指定希望配送日期**
  - [v] 結帳 Step 2 新增高雅的 `<input type="date">` 日期選擇器
  - [v] 實作嚴格的日期範圍限制：最早為下單日 2 個工作天後，最長不超過 14 天內
  - [v] 將顧客期望配送日同步保存至 Firestore `orders` 集合的 `preferred_delivery_date` 欄位
- [v] **B4. PWA 漸進式 Web 應用**
  - [v] 建立 `public/manifest.json` 完成應用圖示、底色、啟動模式配置
  - [v] 編寫 `public/sw.js` 服務工作線程，採用 Cache-First 策略快取核心 CSS/JS/Image，Network-First 處理 API 請求
  - [v] 在首頁載入時註冊 Service Worker，支援手機用戶將網站「加入主畫面」獲得原生 App 般滑順體驗
- [v] **B5. 深色模式**
  - [v] 在 `public/css/style.css` 中建置 `[data-theme="dark"]` CSS 變數覆寫
  - [v] 實作自動偵測系統 `prefers-color-scheme: dark` 偏好設定
  - [v] 在 Header 頂端加入高感度 🌙/☀️ 切換按鈕，切換結果自動快取至 `localStorage`

---

## 🟢 Phase C — 低優先優化（全功能極致打磨）

- [v] **C1. Firebase Analytics 事件追蹤**
  - [v] 在 `index.html` 中安全引入 Firebase Analytics / App 官方 SDK 載入
  - [v] 新增 `src/analytics.ts` 抽象化事件層，確保本機與線上運作皆能列印日誌或發送統計
  - [v] 完成電子商務核心漏斗事件部署：`view_item`（瀏覽商品詳情）、`add_to_cart`（加入購物車）、`begin_checkout`（開啟結帳彈窗）、`purchase`（結帳完成）
- [v] **C2. SEO 結構化資料優化**
  - [v] 在 `index.html` 的 `<head>` 中注入 Product Schema 結構化資料 (JSON-LD)
  - [v] 編寫並校對 meta description、keywords 以及 Open Graph 社交分享標籤，大幅提升 Google 搜尋曝光率
- [v] **C3. ARIA 無障礙標籤增強**
  - [v] 為商品詳情 Modal 與結帳 Modal 注入 `role="dialog"`, `aria-modal="true"` 及 `aria-labelledby`
  - [v] 所有數量加減按鈕、關閉按鈕與分享按鈕皆配置對應的 `aria-label`（如：「減少數量」、「關閉商品詳情彈窗」）
  - [v] 確保所有 `<img>` 圖片標籤皆擁有高可讀性的 `alt` 替代文字描述
- [v] **C4. 模擬線上安全支付金流串接**
  - [v] 進行 LINE Pay 與 綠界 ECPay 雙向支付技術架構評估
  - [v] 在 Cloud Functions 中實作 `/api/payment/create` 金流創立 API 與 `/api/payment/callback` 異步回報 Webhook
  - [v] 設計並建置高質感的 `public/payment.html` 收銀台金流沙盒模擬器
  - [v] 串接結帳 Step 3：在訂單完成創建後自動透過 API 創立金流交易，引導顧客開啟收銀台完成模擬付款，付款成功後透過 Webhook 自動更新 Firestore 訂單 status 為 `paid`

---

## 🚀 每次部署發布前檢查（QA & CI 驗證）

- [v] 全面測試 `docs/TST-qa-checklist.md` 中涵蓋的所有 40+ 項發版驗證指標，確保 100% 綠燈通過
- [v] 整理並更新 `docs/CHANGELOG.md` 變更日誌，詳細記錄本次大版本之優化歷程
- [v] 於本機執行 `npm run build`，確保 TypeScript 編譯無錯誤、無警告，生成的 JS 結構完整
- [v] 執行 `firebase deploy` 部署至 Hosting、Firestore 安全規則與 Cloud Functions，確保線上正式環境連線流暢

---

_YoGo Sprout Workshop — 精緻生活，自給自足_
