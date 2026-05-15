---
title: 商品目錄與資料模型
code: PRD-product-catalog
sdlc: 需求定義 (Product Requirements)
status: implemented
owner: product-operations
related: [DEV-frontend-modules, DEV-backend-api, OPS-operational-guide]
---

# 🟢 PRD — 商品目錄與資料模型

本文件定義 **YoGo 有夠菜** 電商平台中所有的商品分類、TypeScript 資料型別、商品主檔資料及影像資產路徑。

---

## 1. TypeScript 資料模型

定義於 [src/types.ts](file:///c:/Users/benit/Desktop/YoGo/src/types.ts)：

```typescript
export interface Category {
  id: string; // 分類代碼 (kit, parts, seeds, fresh, peanut, drinks)
  label: string; // 顯示名稱
}

export interface Product {
  id: number;
  category: string;
  name: string;
  price: number; // 新台幣
  cold: boolean; // true=冷藏, false=常溫
  emoji: string;
  img?: string; // 本地商品圖路徑
  stock: number; // 庫存（0 時自動顯示售完）
  spec: string; // 規格
  features: string[]; // 特色介紹
  detailImgs?: string[]; // 詳情輪播圖
}

export interface CartState {
  [productId: number]: number;
}
```

---

## 2. 商品分類

| 分類 ID  | 名稱     | 溫層    | 說明                   |
| :------- | :------- | :------ | :--------------------- |
| `kit`    | 種植套組 | 📦 常溫 | 入門種植包、遮光盒組合 |
| `parts`  | 零配件   | 📦 常溫 | 噴壺、耗材配件         |
| `seeds`  | 種子零售 | 📦 常溫 | 高發芽率夾鏈袋裝種子   |
| `fresh`  | 新鮮芽菜 | ❄️ 冷藏 | 溫室每日晨採盒裝芽菜   |
| `peanut` | 好事花生 | 📦 常溫 | 花生芽加工品           |
| `drinks` | 即飲系列 | ❄️ 冷藏 | 花生芽咖啡飲           |

---

## 3. 完整商品主檔 (33 項)

商品資料宣告於 [src/data.ts](file:///c:/Users/benit/Desktop/YoGo/src/data.ts)。

### 🌱 種植套組 (`kit`) — 常溫

| ID  | 名稱             | 售價 | 規格              | 庫存 |
| --- | ---------------- | ---- | ----------------- | ---- |
| 1   | 芽菜種植入門套組 | $600 | 精美手提禮盒/組   | 15   |
| 2   | 種植盒 5 件套    | $150 | 雙層遮光培植箱 x5 | 40   |

### 🔧 零配件 (`parts`) — 常溫

| ID  | 名稱     | 售價 | 規格                  | 庫存 |
| --- | -------- | ---- | --------------------- | ---- |
| 3   | 小噴霧瓶 | $10  | PET壓嘴噴霧瓶 (100ml) | 120  |

### 🌾 種子零售 (`seeds`) — 常溫

| ID  | 名稱             | 售價 | 規格  | 庫存     |
| --- | ---------------- | ---- | ----- | -------- |
| 4   | 紫高麗菜種子     | $25  | 50g   | 50       |
| 5   | 羽衣甘藍種子     | $25  | 50g   | 0 (售完) |
| 6   | 青花椰菜種子     | $20  | 50g   | 65       |
| 7   | 黑芥藍菜種子     | $20  | 50g   | 35       |
| 8   | 蘿蔔嬰種子       | $20  | 50g   | 80       |
| 9   | 蕎麥種子         | $10  | 80g   | 100      |
| 10  | 小麥草種子       | $10  | 100g  | 150      |
| 11  | 黑芝麻種子       | $10  | 50g   | 20       |
| 12  | 苜蓿芽種子       | $10  | 50g   | 90       |
| 13  | 油綠豆種子（小） | $10  | 100g  | 200      |
| 14  | 油綠豆種子（大） | $200 | 2.5kg | 15       |
| 15  | 花生種子（小）   | $60  | 200g  | 30       |
| 16  | 花生種子（大）   | $350 | 1.5kg | 10       |
| 17  | 黑豆種子（小）   | $20  | 150g  | 45       |
| 18  | 黑豆種子（大）   | $200 | 2.5kg | 12       |
| 19  | 黃豆種子（小）   | $20  | 150g  | 55       |
| 20  | 黃豆種子（大）   | $200 | 2.5kg | 15       |

### 🥬 新鮮芽菜 (`fresh`) — 冷藏

| ID  | 名稱             | 售價 | 規格 | 庫存     |
| --- | ---------------- | ---- | ---- | -------- |
| 21  | 白玉花生芽（大） | $180 | 300g | 12       |
| 22  | 白玉花生芽（小） | $120 | 180g | 25       |
| 23  | 紫高麗菜芽       | $60  | 100g | 30       |
| 24  | 青花椰菜芽       | $60  | 100g | 28       |
| 25  | 羽衣甘藍芽       | $60  | 100g | 15       |
| 26  | 蘿蔔嬰           | $50  | 120g | 0 (售完) |
| 27  | 苜蓿芽           | $35  | 150g | 50       |
| 28  | 黑豆芽           | $40  | 200g | 35       |

### 🥜 好事花生 (`peanut`) — 常溫

| ID  | 名稱           | 售價 | 規格    | 庫存 |
| --- | -------------- | ---- | ------- | ---- |
| 29  | 乾燥花生芽粉   | $390 | 150g    | 20   |
| 30  | 花生芽洛神飲包 | $390 | 12入/袋 | 18   |
| 31  | 乾燥花生芽     | $390 | 100g    | 25   |
| 32  | 花生芽咖啡包   | $80  | 5入/盒  | 50   |

### ☕ 即飲系列 (`drinks`) — 冷藏

| ID  | 名稱         | 售價 | 規格  | 庫存 |
| --- | ------------ | ---- | ----- | ---- |
| 33  | 花生芽咖啡飲 | $60  | 350ml | 45   |

---

## 4. 影像資產路徑映射

### 品牌圖 (`img/brand/` + `img/about/`)

| 檔案                     | 用途                |
| ------------------------ | ------------------- |
| `brand/logo.png`         | 全站 Header Logo    |
| `brand/about-banner.png` | About 頁面 Banner   |
| `about/greenhouse.png`   | 理念卡片 — 科技溫室 |
| `about/harvest.png`      | 理念卡片 — 採收特寫 |

### 商品圖 (`img/products/`)

| 檔案                    | 適用商品 ID                                             |
| ----------------------- | ------------------------------------------------------- |
| `kit-starter.png`       | 1                                                       |
| `kit-box5.png`          | 2                                                       |
| `parts-spray.png`       | 3                                                       |
| `seeds-cruciferous.png` | 4, 5, 6, 7 (十字花科：紫高麗、羽衣甘藍、青花椰、黑芥藍) |
| `seeds-radish.png`      | 8 (蘿蔔嬰)                                              |
| `seeds-cereal.png`      | 9, 10 (穀類：蕎麥、小麥草)                              |
| `seeds-special.png`     | 11, 12, 15, 16 (特殊：黑芝麻、苜蓿、花生)               |
| `seeds-legume.png`      | 13, 14, 17, 18, 19, 20 (豆類：綠豆、黑豆、黃豆)         |
| `fresh-peanut.png`      | 21, 22                                                  |
| `fresh-cabbage.png`     | 23                                                      |
| `fresh-broccoli.png`    | 24                                                      |
| `fresh-sprouts.png`     | 25~28 (共用)                                            |
| `peanut-products.png`   | 29~33 (共用)                                            |
