---
title: 開發者快速上手與故障排除
code: DEV-onboarding
sdlc: 開發實作 (Development)
status: implemented
owner: lead-engineer
related: [DES-architecture]
---

# 🟡 DEV — 開發者快速上手

幫助新進開發者在 5 分鐘內建立本地開發環境，並列出常見問題排除。

---

## 1. 環境需求

| 工具 | 版本 | 用途 |
| :--- | :--- | :--- |
| Node.js | v20+ LTS | npm、http-server、Firebase CLI |
| Git | 最新 | 版本控制 |
| VS Code | 最新 | 推薦 IDE |

推薦 VS Code 套件：TypeScript Nightly、Prettier、Firebase Explorer

## 2. 快速起步

```powershell
git clone <repository-url>
cd YoGo
npm install
npm run dev    # 啟動 TS 監聽 + 本地伺服器 :8080
```

## 3. 常見故障排除

### ❌ PowerShell 報「已停用指令碼執行」
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ❌ 修改 TS 後網頁沒變化
1. 檢查終端機是否有 TypeScript 編譯錯誤（紅字）
2. 瀏覽器 `Ctrl + F5` 強制無快取重整

### ❌ TS 報「找不到模組」
本專案使用 ESNext Module，import 時**必須加 `.js` 後綴**：
```typescript
// ✅ 正確
import { PRODUCTS } from "./data.js";
// 🔴 錯誤
import { PRODUCTS } from "./data";
```

### ❌ Firebase deploy 權限錯誤
```powershell
firebase login          # 重新登入
firebase use --add      # 選取正確的 Project ID
```
