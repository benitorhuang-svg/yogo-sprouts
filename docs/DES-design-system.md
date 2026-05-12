---
title: 視覺設計規範
code: DES-design-system
sdlc: 系統設計 (System Design)
status: implemented
owner: designer-developer
related: [DEV-frontend-modules, DES-architecture]
---

# 🔵 DES — 視覺設計規範 (Design System)

定義全站的色彩系統、排版、毛玻璃擬態、微交互動畫與 RWD 響應式佈局。

---

## 1. 色彩系統

```css
:root {
  --primary: #2d6a4f;       /* 深森林綠 — 主色 */
  --primary-light: #40916c; /* 嫩芽綠 — 次要強調 */
  --primary-hover: #1b4332; /* 深綠懸停 */
  --accent: #f39c12;        /* 花生金黃 — CTA 按鈕 */
  --accent-hover: #d35400;  /* 橘紅懸停 */
  --info-blue: #3498db;     /* 冷藏藍 */
  --bg-main: #f8f9fa;       /* 淺灰底色 */
  --card-bg: #ffffff;       /* 純白卡片 */
  --text-dark: #2d3748;     /* 深炭灰 */
  --text-muted: #718096;    /* 煙燻灰 */
  --glass-bg: rgba(255, 255, 255, 0.75);
  --glass-border: rgba(255, 255, 255, 0.4);
}
```

## 2. 排版

```css
body {
  font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
  line-height: 1.6;
}
```

## 3. Glassmorphism 毛玻璃

```css
.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}
```

套用元件：`.category-tabs.sticky`、`.cart-bar`、`.modal-wrapper`

## 4. 微交互動畫

- **卡片浮動**：hover `translateY(-6px)` + 陰影加深 (`300ms`)
- **商品圖放大**：hover `scale(1.05)` (`400ms`)
- **金額彈跳**：`pop-bounce` keyframe (`300ms`)
- **售完遮罩**：`grayscale(0.5)` + `opacity: 0.75` + `pointer-events: none`

## 5. RWD 斷點

| 裝置 | 斷點 | 商品欄數 |
| :--- | :--- | :--- |
| 手機 | 預設 | 1 欄 |
| 平板 | `≥ 768px` | 2~3 欄 |
| 桌機 | `≥ 1024px` | 3~4 欄 (max-width: 1200px) |

所有觸控元件最小面積 **44×44px**。手機端分類 Tabs 支援橫向滑動 (`overflow-x: auto`)。
