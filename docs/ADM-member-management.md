# 👥 會員管理系統 (Member Management System)

本文件說明 YoGo 芽菜工坊的會員管理機制、資料結構以及用於測試與開發的帳號資訊。

## 🛠️ 管理方式

目前會員資料儲存於 **Firebase Firestore (`users` collection)**。管理員可透過以下方式查看：

1. **Firebase Console**: 直接進入後端資料庫進行 CRUD 操作。
2. **管理員介面 (開發中)**: 未來將於 `/admin/members` 提供圖形化管理介面。

## 📊 資料結構 (User Schema)

| 欄位名稱    | 型別          | 說明                                                   |
| :---------- | :------------ | :----------------------------------------------------- |
| `uid`       | string        | Firebase Auth 唯一識別碼                               |
| `name`      | string        | 會員顯示名稱 (結帳預設收件人)                          |
| `email`     | string        | 註冊信箱 (帳號識別)                                    |
| `phone`     | string        | 聯絡電話                                               |
| `address`   | string        | 預設低溫配送地址                                       |
| `tier`      | string        | 會員等級 (🌱 綠手指新手 / 🌿 初級芽農 / 🌳 高階莊園主) |
| `points`    | number        | 累積紅利點數                                           |
| `coupons`   | array[string] | 持有的優惠券代碼清單                                   |
| `createdAt` | string (ISO)  | 帳號建立時間                                           |

## 🧪 測試帳號 (Test Accounts)

以下帳號可用於功能驗證與查看系統資訊：

### 1. 系統管理員 (測試用)

- **帳號**: `admin@yogo.tw`
- **密碼**: `yogo8888`
- **用途**: 查看所有會員權限、測試高等級會員優惠。

### 2. 一般測試會員

- **帳號**: `tester@yogo.tw`
- **密碼**: `test1234`
- **用途**: 測試基本下單、自動填入功能、優惠券領取。

### 3. 訪客模式 (快取測試)

- **帳號**: `guest@yogo.tw`
- **密碼**: (免密碼)
- **用途**: 驗證非登入狀態下的購物體驗。

---

_最後更新日期: 2026-05-15_
