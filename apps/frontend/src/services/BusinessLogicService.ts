/**
 * 💹 BusinessLogicService
 * 集中管理全站業務規則 (Clean Code: Centralized Constants & Rules)
 */
export const BUSINESS_RULES = {
  // 運費規則
  SHIPPING: {
    COLD_FREE_THRESHOLD: 2000, // 冷藏滿 2000 免運
    NORMAL_FREE_THRESHOLD: 800, // 常溫滿 800 免運
    DEFAULT_COLD_FEE: 160, // 預設冷藏運費
    DEFAULT_NORMAL_FEE: 80, // 預設常溫運費
  },

  // 點數規則
  POINTS: {
    EARN_RATE: 0.01, // 每 $100 賺 1 點
  },

  // 會員等級規則
  TIERS: {
    AMBASSADOR: 3000, // 綠意大使門檻
    MASTER: 8000, // 芽苗大師門檻
  },
};

export class BusinessLogicService {
  /**
   * 計算特定溫層是否符合免運
   */
  static isFreeShipping(subtotal: number, type: 'cold' | 'normal'): boolean {
    const threshold =
      type === 'cold'
        ? BUSINESS_RULES.SHIPPING.COLD_FREE_THRESHOLD
        : BUSINESS_RULES.SHIPPING.NORMAL_FREE_THRESHOLD;
    return subtotal >= threshold;
  }

  /**
   * 根據消費額預估可獲得點數
   */
  static calculatePoints(amount: number): number {
    return Math.floor(amount * BUSINESS_RULES.POINTS.EARN_RATE);
  }
}
