# 📝 CHANGELOG

## 📅 2026-05-12 v2.0 — SDLC 架構重整

| 類型 | 變更摘要 |
| :--- | :--- |
| 🏗️ 決策 | 採用 Firebase 全家桶取代 Cloud Run + SQLite |
| 🏗️ 決策 | 資料庫由 SQLite 遷移至 Firestore NoSQL |
| 🏗️ 決策 | 文件編碼從流水號 (01~10) 改為 SDLC 前綴 (PRD/DES/DEV/TST/OPS/BIZ) |
| 新增 | `BIZ-order-lifecycle` — 完整訂單 8 階段狀態機與 LINE Notify 通知系統 |
| 新增 | `PRD-business-rules` — 集中管理業務魔術數字 |
| 新增 | `TST-qa-checklist` — 40+ 項發版驗證清單 |
| 新增 | `DEV-onboarding` — 開發者 5 分鐘快速上手 |
| 新增 | `OPS-operational-guide` — 非技術人員營運指南 |

## 📅 2026-05-12 v2.1 — 全階段功能優化與金流整合

| 類型 | 變更摘要 |
| :--- | :--- |
| ✨ 新增 | **B2. 優惠碼折扣系統** — 實作 Coupon interface、Firestore `coupons` 集合及前/後端安全套用驗證 |
| ✨ 新增 | **B3. 希望配送日期** — 結帳 Step 2 日期選擇器限制 2~14 天並同步至訂單資料庫 |
| 📊 整合 | **C1. Firebase Analytics** — 在首頁載入官方 SDK，並全面部署 e-commerce 核心行為漏斗追蹤事件 |
| ♿ 優化 | **C3. ARIA 無障礙功能** — 補全 Dialog 角色標籤、動作控制按鈕提示 `aria-label` 與商品配圖 `alt` |
| 💳 串接 | **C4. 模擬線上安全支付** — 在 Cloud Functions 建立金流/回調 API 並打造極致精緻的收銀台模擬器 `public/payment.html` |

