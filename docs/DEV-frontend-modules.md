---
title: 前端核心功能模組
code: DEV-frontend-modules
sdlc: 開發實作 (Development)
status: implemented
owner: frontend-engineer
related: [PRD-product-catalog, PRD-business-rules, DES-design-system, DES-architecture]
---

# 🟡 DEV — 前端核心功能模組

定義四大交互模組與輔助模組的實作規格、DOM 事件監聽及業務邏輯。

---

## 1. 商品詳情彈窗 (Detail Modal)

- **原始碼**：[src/detailModal.ts](file:///c:/Users/benit/Desktop/YoGo/src/detailModal.ts)
- **掛載點**：`#product-detail-modal`
- **觸發**：點擊商品卡片（非加減按鈕）

### 介面元素
- **多圖輪播**：主圖 + 左右箭頭 + 底部縮圖列
- **規格標籤**：動態顯示 `spec`、溫層標籤（冷藏藍/常溫綠）
- **特色清單**：遍歷 `features[]` 渲染 Checkmark 列表
- **物流提示**：「🚚 配送運費依溫層與材積裝箱，未達免運由專人報價」
- **數量控制**：初始 1，最低 1，「加入購物籃」後累加至購物車 + Toast 通知

---

## 2. 多階段結帳表單 (Checkout 4-Step)

- **原始碼**：[src/checkoutModal.ts](file:///c:/Users/benit/Desktop/YoGo/src/checkoutModal.ts)
- **掛載點**：`#checkout-modal`
- **觸發**：底部「確認結帳」按鈕

| 階段 | 內容 |
|------|------|
| **Step 1** | 列出品項明細（可調整數量）、冷藏/常溫分開計算免運門檻、顯示合計 |
| **Step 2** | 必填表單：姓名、電話、LINE/Email、地址（前端驗證） |
| **Step 3** | 防呆確認，按鈕 `disabled` 防重複，觸發 API |
| **Step 4** | ✅ 成功通知，「完成並返回首頁」清空購物車 + 回頂 |

### 免運判定邏輯（詳見 [PRD-business-rules](./PRD-business-rules.md)）
- 冷藏小計 ≥ $2,000 → `✅ 已達冷藏免運`
- 常溫小計 ≥ $800 → `✅ 已達常溫免運`
- 兩者**獨立計算**

---

## 3. 吸頂滾動偵測導覽 (ScrollSpy)

- **原始碼**：[src/scrollSpy.ts](file:///c:/Users/benit/Desktop/YoGo/src/scrollSpy.ts)

1. **吸頂**：`.category-tabs` 加 `.sticky` class
2. **ScrollSpy**：`requestAnimationFrame` 節流監聽 → 高亮對應按鈕 + 自動橫向滾動
3. **平滑跳轉**：`scrollTo({ top, behavior: 'smooth' })`，扣除 header 高度 ~120px

---

## 4. 管理員隱藏入口 (Admin Trigger)

- **原始碼**：[src/admin.ts](file:///c:/Users/benit/Desktop/YoGo/src/admin.ts)
- **觸發**：Header Logo 2 秒內連點 5 次
- **行為**：彈出密碼框（Phase 2 對接 Firebase Auth）

---

## 5. 輔助模組

| 模組 | 檔案 | 職責 |
|------|------|------|
| 商品渲染 | `src/shop.ts` | 渲染卡片、事件委派、售完遮罩 |
| 購物車 | `src/cart.ts` | CartState 管理、底部 Bar 更新 |
| 吐司通知 | `src/toast.ts` | 2.5 秒後自動淡出移除 |
| 資料層 | `src/data.ts` | 商品主檔、localStorage 持久化 |
| 入口 | `src/app.ts` | DOMContentLoaded 初始化串接 |
