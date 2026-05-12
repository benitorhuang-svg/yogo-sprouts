# YoGo 有夠菜 - 芽菜工坊 🌱

> 一款高質感、企業級的芽菜與種植套組線上電商平台。本專案已全面採用 **TypeScript (TS) 嚴格型別編譯管道**，並針對雲端部署（如 Google Cloud Platform, GCP）優化了資料夾結構。

---

## 📁 專案資料夾結構

本專案經過嚴格優化，將**開發原始碼/配置**與**生產環境靜態網頁資產**進行完美分離，結構如下：

```text
YoGo/
├── public/                    # 🌐 生產環境網頁資產 (GCP 部署此資料夾即可)
│   ├── index.html             #   - 首頁 (掛載明細彈窗、多步結帳、吸頂滾動)
│   ├── about.html             #   - 關於我們 (雙欄理念牆)
│   ├── css/
│   │   └── style.css          #   - 現代毛玻璃擬態與動態細節樣式
│   ├── js/
│   │   └── app.js             #   - TSC 編譯輸出之生產用 JS (請勿手動修改)
│   └── img/                   #   - 完整本地化商品與品牌高解析度資源庫
│       ├── brand/             #     * 品牌 Logo、背景橫幅等
│       └── products/          #     * 精緻芽菜與套組實照
│
├── src/                       # 🛠️ 開發原始碼
│   └── app.ts                 #   - 強型別電商邏輯原始碼 (所有的開發在此進行)
│
├── docs/                      # 📄 SDLC 模組化規格文件庫 (詳見 docs/README.md)
│   ├── PRD-*.md               #   - 🟢 需求定義：商品目錄、業務規則
│   ├── DES-*.md               #   - 🔵 系統設計：視覺規範、技術架構
│   ├── DEV-*.md               #   - 🟡 開發實作：前端模組、後端 API、上手指南
│   ├── TST-*.md               #   - 🟣 測試驗證：QA 發版清單
│   ├── OPS-*.md               #   - 🔴 部署維運：Firebase 部署、營運指南
│   └── BIZ-*.md               #   - 🟠 業務流程：訂單生命週期、LINE 通知
│
├── .scratch/                  # 🧪 臨時測試與抓取腳本 (已加入 Git 忽略)
├── .gitignore                 # 🔒 Git 忽略配置
├── package.json               # 📦 Node.js 專案與腳本設定
├── tsconfig.json              # ⚙️ TypeScript 編譯設定
└── README.md                  # 📖 本說明文件
```

---

## 🚀 快速開始 (Local Development)

本專案支援一鍵啟動開發環境，雙工併發編譯與無快取伺服器：

### 1. 安裝開發依賴項
請在專案根目錄下，開啟終端機執行：
```powershell
npm install
```

### 2. 啟動一鍵開發模式 (推薦)
執行以下指令，系統會自動**啟動 TS 存檔自動編譯**並在 `http://localhost:8080` 開啟**無快取開發伺服器**：
```powershell
npm run dev
```
> [!TIP]
> 開啟後，當您修改 `src/app.ts` 並存檔，網頁就會即時編譯生效。重新整理網頁（F5）即可查看最新狀態！

### 3. 單次編譯生產代碼
若您希望手動執行單次 TS 編譯，請執行：
```powershell
npm run build
```

---

## ☁️ GCP 雲端部署指南 (GCP Cloud Deployment)

優化後的 `public/` 資料夾設計是為了與雲端託管服務（Cloud Hosting）完美對接。以下是主流 GCP 部署方案：

### 方案 A：使用 Firebase Hosting (最快速、經濟、具 CDN 加速)
這是靜態電商網站的**首選推薦**，每年費用極低且自帶 SSL 憑證。

1. **安裝 Firebase CLI**：
   ```powershell
   npm install -g firebase-tools
   ```
2. **初始化專案**：
   ```powershell
   firebase login
   firebase init hosting
   ```
   *   *詢問 "What do you want to use as your public directory?" 時，輸入：**`public`*** (本專案的核心資產路徑)。
   *   *詢問 "Configure as a single-page app?" 選擇 **`No`***。
3. **極速部署上線**：
   ```powershell
   npm run build
   firebase deploy
   ```

---

### 方案 B：使用 Google Cloud Storage (GCS) 靜態網站託管
極致省錢的方案，適合單純的靜態網頁。

1. **建立一個公開的 Bucket** 並啟用靜態網站託管：
   ```powershell
   gsutil mb gs://yogo-sprouts-shop
   gsutil web set -m index.html -e about.html gs://yogo-sprouts-shop
   ```
2. **將 `public/` 內的所有檔案上傳**：
   ```powershell
   gsutil -m cp -r public/* gs://yogo-sprouts-shop/
   ```
3. **將所有檔案設為公開讀取**：
   ```powershell
   gsutil iam ch allUsers:objectViewer gs://yogo-sprouts-shop
   ```

---

### 方案 C：使用 GCP Cloud Run (微服務/容器化部署)
適合未來需要擴展後端 Node.js / Python API 的複合式架構。

本專案可直接在根目錄編寫一配置如下的 `Dockerfile`：
```dockerfile
FROM nginx:alpine
COPY public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
透過 GCP Artifact Registry 構建並部署至 Cloud Run 即可實現超高併發容器化託管！
