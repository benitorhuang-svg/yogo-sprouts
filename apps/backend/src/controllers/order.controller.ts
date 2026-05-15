import { Request, Response } from 'express';
import { OrderService } from '../services/order.service';
import { checkoutSchema } from '../api/schemas';

/**
 * 🎮 OrderController (指揮官)
 */
export class OrderController {
  static async checkout(req: Request, res: Response) {
    // 1. Zod 驗證
    const validation = checkoutSchema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({ success: false, error: '資料驗證失敗', details: validation.error.format() });
    }

    // 2. 獲取 Token 驗證後的使用者 UID (由 Middleware 注入)
    const verifiedUid = (req as any).user?.uid || null;
    const { user_uid: clientUid } = validation.data;

    // 身分安全性檢查 (防止 Spoofing)
    if (clientUid && clientUid !== verifiedUid) {
      return res.status(403).json({ success: false, error: '權限異常：帳號身分不符' });
    }

    try {
      const result = await OrderService.processCheckout(validation.data, verifiedUid);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
