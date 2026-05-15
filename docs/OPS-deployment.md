---
title: Firebase 雲端部署
code: OPS-deployment
sdlc: 部署維運 (Operations)
status: planned
owner: devops-engineer
related: [DEV-backend-api, DES-architecture]
---

# 🔴 OPS — Firebase 雲端部署

Firebase CLI 初始化、設定檔配置、本地模擬測試與一鍵部署。

---

## 1. 安裝與初始化

```powershell
npm install -g firebase-tools
firebase login
firebase init   # 勾選 Firestore + Functions + Hosting
```

Hosting 設定：public directory → `public`、SPA → `No`

## 2. firebase.json

```json
{
  "firestore": { "rules": "firestore.rules", "indexes": "firestore.indexes.json" },
  "functions": { "predeploy": ["npm --prefix \"$RESOURCE_DIR\" run build"] },
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "/api/**", "function": "checkout" }],
    "headers": [
      {
        "source": "**",
        "headers": [{ "key": "Cross-Origin-Opener-Policy", "value": "same-origin-allow-popups" }]
      },
      {
        "source": "/**/*.@(jpg|jpeg|gif|png|webp)",
        "headers": [{ "key": "Cache-Control", "value": "max-age=604800, public" }]
      }
    ]
  }
}
```

## 3. 本地模擬器

```powershell
firebase emulators:start
```

- 後台：`http://localhost:4000`
- 前端：`http://localhost:5000`

## 4. 生產部署

```powershell
npm run build
firebase deploy
```

快速指令：

- `firebase deploy --only hosting`（僅前端）
- `firebase deploy --only functions`（僅 API）
- `firebase deploy --only firestore:rules`（僅安全規則）

## 5. IAM 權限設定 (必要)

為了確保第三方登入 (Google, LINE) 的回調與自訂 Token 簽發順利運作，必須在 Google Cloud Console 或透過 gcloud 指令設定以下權限：

1. **允許公開呼叫 API (解決 403 錯誤)**：
   賦予 `api` 函式 `allUsers` 角色 `roles/cloudfunctions.invoker`。
2. **允許簽發 Firebase Token (解決 500 錯誤)**：
   賦予專案的 App Engine 預設服務帳戶 (`project-id@appspot.gserviceaccount.com`) 角色 `roles/iam.serviceAccountTokenCreator`。
