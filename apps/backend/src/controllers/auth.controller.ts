import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

/**
 * 🎮 AuthController (指揮官)
 * 負責解析請求參數並轉交給 Service，最後格式化回應
 */
export class AuthController {
  static async lineLogin(req: Request, res: Response) {
    try {
      const { code, redirectUri } = req.body;
      if (!code || !redirectUri) {
        return res.status(400).json({ success: false, error: '缺少必要參數' });
      }

      const result = await AuthService.verifyLineLogin(code, redirectUri);
      return res.status(200).json(result);
    } catch (err: any) {
      console.error('AuthController Error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}
