export const CATEGORIES = [
    { id: 'kit', label: '種植套組' },
    { id: 'parts', label: '零配件' },
    { id: 'seeds', label: '種子零售' },
    { id: 'fresh', label: '新鮮芽菜' },
    { id: 'peanut', label: '好事花生' },
    { id: 'drinks', label: '即飲系列' },
];
export const INITIAL_PRODUCTS = [
    // 種植套組
    { id: 1, category: 'kit', name: '芽菜種植入門套組', price: 600, cold: false, emoji: '🌱', img: 'img/products/kit-starter.png', stock: 15, spec: '精美手提禮盒/組', features: ['內含：雙層遮光培植箱 x2、小噴霧瓶 x1、精選種子包 x3 (青花椰/紫高麗/苜蓿)', '在家輕鬆種植，7天即可採收新鮮有機芽菜', '附帶精美彩色圖解說明書，大人小孩都能輕鬆上手'] },
    { id: 2, category: 'kit', name: '種植盒 5 件套', price: 150, cold: false, emoji: '📦', img: 'img/products/kit-box5.png', stock: 40, spec: '雙層遮光培植箱 x5', features: ['雙層網格設計，排水良好，防止爛根與黴菌滋生', '遮光蓋緊密貼合，提供發芽所需的完美黑暗環境', '食品級優質塑料，無毒無味，重複使用超環保'] },
    // 零配件
    { id: 3, category: 'parts', name: '小噴霧瓶', price: 10, cold: false, emoji: '💧', img: 'img/products/parts-spray.png', stock: 120, spec: 'PET壓嘴噴霧瓶 (100ml)', features: ['超細微霧噴頭，出水均勻細緻，不傷嬌嫩幼芽', '輕巧瓶身，好握易壓，適合每日澆灌保濕', '嚴選環保材質，無毒耐用'] },
    // 種子零售
    { id: 4, category: 'seeds', name: '紫高麗菜種子', price: 25, cold: false, emoji: '🌿', img: 'img/products/seeds-cruciferous.png', stock: 50, spec: '嚴選夾鏈袋裝 (50g)', features: ['發芽率高達95%以上，無藥劑處理安心種子', '富含花青素與維生素A、C、K，色澤艷麗誘人', '口感爽脆，非常適合點綴沙拉、三明治'] },
    { id: 5, category: 'seeds', name: '羽衣甘藍種子', price: 25, cold: false, emoji: '🌿', img: 'img/products/seeds-cruciferous.png', stock: 0, spec: '嚴選夾鏈袋裝 (50g)', features: ['超級食物之王，富含膳食婚維與高抗氧化成分', '微甜帶有溫和甘藍香氣，嫩葉生食極佳', '本批次熱銷已空，正積極由產地補貨中'] }, // Sold out demo
    { id: 6, category: 'seeds', name: '青花椰菜種子', price: 20, cold: false, emoji: '🥦', img: 'img/products/seeds-cruciferous.png', stock: 65, spec: '嚴選夾鏈袋裝 (50g)', features: ['超人氣健康首選！富含蘿蔔硫素 (Sulforaphane)', '生命力極強，7天即可收成超高營養微型青花椰菜', '口感細嫩微甜，深受全家人喜愛'] },
    { id: 7, category: 'seeds', name: '黑芥藍菜種子', price: 20, cold: false, emoji: '🌿', img: 'img/products/seeds-cruciferous.png', stock: 35, spec: '嚴選夾鏈袋裝 (50g)', features: ['傳統保健良藥，味道獨特微辛、爽脆可口', '富含胡蘿蔔素、葉黃素與鈣質，營養高價值', '溫室水耕栽培之熱門推薦種子'] },
    { id: 8, category: 'seeds', name: '蘿蔔嬰種子', price: 20, cold: false, emoji: '🌱', img: 'img/products/seeds-radish.png', stock: 80, spec: '嚴選夾鏈袋裝 (50g)', features: ['帶有些微蘿蔔香辛辛辣感，生食提味極佳', '幫助消化，富含維生素C與澱粉酶', '播種後 5-6 天即可迅速採收'] },
    { id: 9, category: 'seeds', name: '蕎麥種子', price: 10, cold: false, emoji: '🌾', img: 'img/products/seeds-cereal.png', stock: 100, spec: '嚴選夾鏈袋裝 (80g)', features: ['穀類之王，含有蘆丁 (Rutin) 及人體必需胺基酸', '蕎麥幼苗口感清爽、清新微甜，適合生食或榨汁', '種植極易，適合初學者與兒童綠意體驗'] },
    { id: 10, category: 'seeds', name: '小麥草種子', price: 10, cold: false, emoji: '🌾', img: 'img/products/seeds-cereal.png', stock: 150, spec: '嚴選夾鏈袋裝 (100g)', features: ['小麥草貓草通用！富含葉綠素、活性酵素與多種礦物質', '適合榨取小麥草汁生飲，亦為愛貓的最愛貓草', '極易爆盆，兩週內可採收兩輪'] },
    { id: 11, category: 'seeds', name: '黑芝麻種子', price: 10, cold: false, emoji: '⚫', img: 'img/products/seeds-special.png', stock: 20, spec: '嚴選夾鏈袋裝 (50g)', features: ['富含芝麻素、不飽和脂肪酸與維生素E', '黑芝麻芽口感微甘、越嚼越香，非常獨特', '可用於自製有機精力湯、沙拉拌料'] },
    { id: 12, category: 'seeds', name: '苜蓿芽種子', price: 10, cold: false, emoji: '🌱', img: 'img/products/seeds-special.png', stock: 90, spec: '嚴選夾鏈袋裝 (50g)', features: ['經典芽菜之王！熱量極低、纖維極高', '質地細嫩多汁，富含優質植物性蛋白、葉綠素', '手卷、春捲、生菜沙拉必備的百搭聖品'] },
    { id: 13, category: 'seeds', name: '油綠豆種子（小）', price: 10, cold: false, emoji: '🫘', img: 'img/products/seeds-legume.png', stock: 200, spec: '嚴選夾鏈袋裝 (100g)', features: ['精選發芽綠豆，保證出芽率，無化學催大劑', '自種豆芽菜最安心，爽脆鮮甜、不漂白、不加根部生長劑', '生長極速，遮光4-5天即可採收'] },
    { id: 14, category: 'seeds', name: '油綠豆種子（大）', price: 200, cold: false, emoji: '🫘', img: 'img/products/seeds-legume.png', stock: 15, spec: '量販家庭裝 (2.5kg)', features: ['家庭長期耕作或教學團體量販特惠裝', '高品質油綠豆，出芽飽滿，保存期限長', '超高性價比，綠色天然生活的實惠選擇'] },
    { id: 15, category: 'seeds', name: '花生種子（小）', price: 60, cold: false, emoji: '🥜', img: 'img/products/seeds-special.png', stock: 30, spec: '發芽用花生仁 (200g)', features: ['嚴選台灣本土大粒花生，精選飽滿無破損花生仁', '發芽率極佳，富含高量人體所需白藜蘆醇 (Resveratrol)', '適合自製高端白玉花生芽'] },
    { id: 16, category: 'seeds', name: '花生種子（大）', price: 350, cold: false, emoji: '🥜', img: 'img/products/seeds-special.png', stock: 10, spec: '量販花生仁裝 (1.5kg)', features: ['花生芽玩家首選大容量包裝，特惠特價中', '全程低溫冷藏保存以維持種子發芽活性', '適合垂直農業愛好者或中大型培育'] },
    { id: 17, category: 'seeds', name: '黑豆種子（小）', price: 20, cold: false, emoji: '🫘', img: 'img/products/seeds-legume.png', stock: 45, spec: '青仁黑豆仁 (150g)', features: ['精選青仁黑豆，富含花青素與維生素E', '黑豆芽粗壯爽口，口感甜美，膳食纖維豐富', '適合涼拌、炒肉絲或搭配味噌湯'] },
    { id: 18, category: 'seeds', name: '黑豆種子（大）', price: 200, cold: false, emoji: '🫘', img: 'img/products/seeds-legume.png', stock: 12, spec: '量販家庭裝 (2.5kg)', features: ['優質青仁黑豆量販大包裝，實惠保鮮', '發芽率優良，非常適合長期自種健康豆芽', '家庭常備高蛋白植物營養來源'] },
    { id: 19, category: 'seeds', name: '黃豆種子（小）', price: 20, cold: false, emoji: '🫘', img: 'img/products/seeds-legume.png', stock: 55, spec: '非基因改造黃豆 (150g)', features: ['非基改優質黃豆仁，豆香濃育，出芽率高', '自製黃豆芽營養價值比黃豆本身更高，好吸收', '豆瓣爽脆，豆柄清甜，富含大豆異黃酮'] },
    { id: 20, category: 'seeds', name: '黃豆種子（大）', price: 200, cold: false, emoji: '🫘', img: 'img/products/seeds-legume.png', stock: 15, spec: '量販非基改黃豆 (2.5kg)', features: ['大包裝分量十足，滿足全家自種黃豆芽或榨豆漿的需求', '嚴格檢驗無基改，出芽活性優越', '乾燥通風避光保存可達一年'] },
    // 新鮮芽菜
    { id: 21, category: 'fresh', name: '白玉花生芽（大）', price: 180, cold: true, emoji: '🥜', img: 'img/products/fresh-peanut.png', stock: 12, spec: '家庭特大分享盒 (300g)', features: ['超人氣招牌！白皙、粗壯肥碩、形似白玉的花生芽', '無添加生長激素與化學漂白劑，手工細心洗滌採收', '富含白藜蘆醇（約為紅葡萄酒的數十倍），口感甘甜爽脆'] },
    { id: 22, category: 'fresh', name: '白玉花生芽（小）', price: 120, cold: true, emoji: '🥜', img: 'img/products/fresh-peanut.png', stock: 25, spec: '輕量精緻盒 (180g)', features: ['適合1-2人單餐享用的精緻白玉花生芽盒', '保留花生芽完整的根鬚，豆仁飽滿多汁', '推薦清炒、煮湯或搭配沙拉，極致清爽'] },
    { id: 23, category: 'fresh', name: '紫高麗菜芽', price: 60, cold: true, emoji: '🌿', img: 'img/products/fresh-cabbage.png', stock: 30, spec: '活力保鮮盒 (100g)', features: ['高科技自動自控溫室每日現採，紫紅色莖部極為吸睛', '富含高抗氧化能力與維生素，色澤艷麗，沙拉首選', '細緻脆嫩，帶有淡淡高麗菜甘甜'] },
    { id: 24, category: 'fresh', name: '青花椰菜芽', price: 60, cold: true, emoji: '🥦', img: 'img/products/fresh-broccoli.png', stock: 28, spec: '活力保鮮盒 (100g)', features: ['健康養生界明星！幼苗期含豐富微量元素與蘿蔔硫素', '精細無菌水耕栽培，每日晨光採收，冷藏極速保鮮配送', '滋味細嫩，直接生食或搭配壽司手卷最佳'] },
    { id: 25, category: 'fresh', name: '羽衣甘藍芽', price: 60, cold: true, emoji: '🌿', img: 'img/products/fresh-sprouts.png', stock: 15, spec: '活力保鮮盒 (100g)', features: ['微型羽衣甘藍，葉片細緻多汁，無成熟甘藍的草腥味', '極高營養密度，提供天然抗氧化及排毒營養', '搭配輕食、水果榨汁或拌沙拉極佳'] },
    { id: 26, category: 'fresh', name: '蘿蔔嬰', price: 50, cold: true, emoji: '🌱', img: 'img/products/fresh-sprouts.png', stock: 0, spec: '活力保鮮盒 (120g)', features: ['每日清晨手工鮮採，微辣爽口，帶有蘿蔔特有辛香', '適合日式壽司、肉類配菜，具極佳解膩提味效果', '本季供不應求，目前庫存售完，下批3日後採收'] }, // Sold out demo
    { id: 27, category: 'fresh', name: '苜蓿芽', price: 35, cold: true, emoji: '🌱', img: 'img/products/fresh-sprouts.png', stock: 50, spec: '經濟保鮮盒 (150g)', features: ['最經典的百搭生菜！富含葉綠素與高纖維，低熱量無負擔', '質地細柔，水分充足，口感滑嫩', '適合苜蓿芽手卷、三名治與精力湯'] },
    { id: 28, category: 'fresh', name: '黑豆芽', price: 40, cold: true, emoji: '🫘', img: 'img/products/fresh-sprouts.png', stock: 35, spec: '活力保鮮盒 (200g)', features: ['傳統古法培育，富含優質大豆蛋白、花青素與酵素', '豆仁清香、豆柄爽脆多汁，適合各式家常快炒與湯品', '新鮮無根栽培，洗淨即可烹調'] },
    // 好事花生
    { id: 29, category: 'peanut', name: '乾燥花生芽粉', price: 390, cold: false, emoji: '🥜', img: 'img/products/peanut-products.png', stock: 20, spec: '高雅密封罐 (150g)', features: ['嚴選新鮮白玉花生芽低溫乾燥研磨而成，保留活性營養', '高含量白藜蘆醇與膳食纖維，適合全家每日沖泡飲用', '淡淡花生清香，可添加於牛奶、豆漿、精力湯或燕麥中'] },
    { id: 30, category: 'peanut', name: '花生芽洛神飲包', price: 390, cold: false, emoji: '🌺', img: 'img/products/peanut-products.png', stock: 18, spec: '精美茶包組 (12入/袋)', features: ['花生芽乾與在地安心洛神花瓣完美比例調配', '茶湯成寶石紅，口感酸甜回甘，具抗氧化與代謝保養功效', '三角立體茶包設計，冷泡熱沖皆宜，辦公室必備養生茶'] },
    { id: 31, category: 'peanut', name: '乾燥花生芽', price: 390, cold: false, emoji: '🥜', img: 'img/products/peanut-products.png', stock: 25, spec: '保鮮夾鏈袋 (100g)', features: ['將新鮮肥碩的花生芽以獨家低溫烘焙技術製成乾片', '適合泡茶養生，或於燉湯（排骨湯、雞湯）時加入增添甘甜', '全素食可用，營養保鮮，存放極為方便'] },
    { id: 32, category: 'peanut', name: '花生芽咖啡包', price: 80, cold: false, emoji: '☕', img: 'img/products/peanut-products.png', stock: 50, spec: '精品濾掛式 (5入/盒)', features: ['特選高品質阿拉比卡豆，融合低溫花生芽活性成分', '溫和順口，降低傳統咖啡的刺激感，咖啡香與麥香交融', '濾掛包設計，隨時隨地享受一杯高質感的新概念健康咖啡'] },
    // 即飲系列
    { id: 33, category: 'drinks', name: '花生芽咖啡飲', price: 60, cold: true, emoji: '☕', img: 'img/products/peanut-products.png', stock: 45, spec: '外帶瓶裝 (350ml)', features: ['每日清晨現磨萃取阿拉比卡咖啡，加入特熬花生芽精華', '微甜冰涼，口感滑順，兼具提神與營養補充', '無人工防腐劑，開封後請盡速飲用並保持低溫冷藏'] },
];
export let PRODUCTS = [];
export async function loadProductsState() {
    try {
        const res = await fetch('/api/products');
        if (res.ok) {
            PRODUCTS = await res.json();
            return;
        }
    }
    catch (e) {
        console.error('Failed to fetch products from API, falling back to local memory.', e);
    }
    PRODUCTS = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
}
export function saveProductsState() {
    // No-op in Phase 2 backend-driven stock management
}
