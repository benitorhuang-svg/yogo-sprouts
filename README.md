# YoGo 有夠菜 - 芽菜工坊 🌱

> 一款兼具極致視覺美學、流暢微互動體驗與企業級雲端架構的芽菜與種植套組線上購物平台。本專案採用 **Vite + React (TypeScript/TSX)** 架構，並整合 **Firebase Auth** 與 **Firestore** 實現雲端權威身分驗證與交易級商品庫存防護。

---

## ✨ 核心架構與技術特點

### 🎨 1. 模組化與原子化 CSS 設計系統 (Atomic & Modular CSS)

針對複雜的樣式架構，我們將原本長達 2000 多行的樣式表解構並歸納於 `apps/frontend/src/styles/`：

- **`variables.css`**：全域 CSS 變數（色票、字體、間距設定）與 Dark Mode 樣式設定。
- **`reset.css`**：全域 Reset 與 Base 基礎標籤樣式。
- **`utilities.css`**：原子化公用類別庫（如 `.u-flex`, `.u-mt-1`, `.u-text-center` 等）。
- **`header.css`**：頂部導航列、跑馬燈公告欄 (Announcement Bar) 與搜尋列 (Search Bar) 樣式。
- **`product.css`**：商品列表、分類切換 (Category Tabs)、商品卡片、庫存狀態與購物車底列 (Cart Bar) 樣式。
- **`modal.css`**：彈跳視窗引擎與各式模態框（商品詳情、多步驟結帳、會員登入/個人資訊 modal、Toast 提醒等）。
- **`about.css`**：關於品牌頁面的專屬版面配置與樣式。
- **總入口 `style.css`**：乾淨俐落的 `@import` 進入點，無縫銜接 Vite 編譯管道。

### 🛡️ 2. 雙重身分驗證與雲端授權 (Firebase Auth + Firestore)

- **OAuth 快速登入**：支援 Google 原生彈窗授權 (`signInWithPopup`) 及 LINE 快速驗證。
- **密碼核對與智慧註冊**：支援帳號密碼登入 (`signInWithEmailAndPassword`)，若偵測為新用戶自動無縫轉入註冊流程 (`createUserWithEmailAndPassword`)。
- **雲端權威覆寫**：登入及頁面重載時，自動向 Firestore 的 `users` 集合進行校驗，取得真實會員等級 (`👑 VIP 芽苗大師` 等) 與累積紅利點數，杜絕前端 localStorage 偽造。

### 📦 3. 電商級存貨防護與結帳驗證 (Stock Safeguards)

- **加入購物車即時攔截 (`addToCart`)**：每次點擊加入購物車時，非同步連線 Firestore 查詢最新剩餘數量，一旦超出即時庫存，立即跳出警告阻擋。
- **結帳雙重驗證 (`clearCart`)**：送出訂單前執行最終存貨快照比對，確認未被他人買空才正式寫入 `orders` 集合並精準扣減 `stock`，確保交易一致性。

### 🎵 4. 品牌聲音識別與沈浸式微互動 (Sonic Identity)

- 內建 `audioManager.ts` 模組，提供清脆的加入購物車音效、結帳成功音效與品牌環境背景音樂 (BGM)，大幅提升使用者互動留存率。

### 🔌 5. 離線容錯與降級防護 (Offline & Dev Fallback)

- 底層資料存取全面具備 `try...catch` 降級防護，即使在離線狀態或未配置正式 Firebase API Key 的開發環境下，系統會平滑切換為本機安全模擬模式，確保網頁永遠不崩潰。

---

## 📁 專案資料夾結構

本專案採用 Workspace / Monorepo 架構組織：

```text
YoGo/
├── apps/
│   ├── frontend/              # 🌐 前端 React 應用程式 (Vite + TSX)
│   │   ├── src/
│   │   │   ├── components/    # 模組化 React 元件 (AuthModal, ProductCard 等)
│   │   │   ├── context/       # 全域狀態管理 (AppContext 整合 Firebase)
│   │   │   ├── styles/        # 原子化與模組化 CSS 樣式庫
│   │   │   ├── audioManager.ts# 音效與背景音樂管理員
│   │   │   └── firebaseClient.ts # Firebase App, Auth 與 Firestore 初始化
│   │   └── public/            # 靜態資源、圖片與音效資產
│   └── backend/               # ⚙️ 後端微服務 API (若適用)
│
├── packages/
│   └── shared/                # 📦 前後端共用型別定義與初始商品數據 (Product, Category)
│
├── docs/                      # 📄 系統規格與架構設計文件庫
├── package.json               # 📦 Monorepo 根目錄配置
└── README.md                  # 📖 本說明文件
```

---

## 🚀 快速開始 (Local Development)

### 1. 安裝所有依賴項

請在專案根目錄下，開啟終端機執行：

```powershell
npm install
```

### 2. 啟動一鍵開發模式

執行以下指令，系統會啟動 Vite 模組熱重載 (HMR) 開發伺服器：

```powershell
npm run dev
```

> [!TIP]
> 伺服器啟動後，當您修改程式碼並存檔，網頁就會即時編譯生效。

### 3. 編譯生產代碼

執行單次生產環境打包構建：

```powershell
npm run build
```

---

## ☁️ 雲端部署指南 (Cloud Deployment)

### 推薦方案：Firebase Hosting (極速、內建 SSL 與 CDN)

本專案與 Firebase 生態系完美契合，可透過 CLI 一鍵部署：

1. **安裝 Firebase CLI**：
   ```powershell
   npm install -g firebase-tools
   ```
2. **初始化專案**：

   ```powershell
   firebase login
   firebase init hosting
   ```

   - _選擇您對應的 Firebase 專案 ID_。
   - \*詢問 public directory 時輸入：**`apps/frontend/dist`\***。
   - \*詢問單頁應用程式 (Single-page app) 選擇 **`Yes`\***。

3. **編譯並部署上線**：
   ```powershell
   npm run build
   firebase deploy
   ```
