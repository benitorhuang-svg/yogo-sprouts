import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

/**
 * 🛡️ Auth Middleware (守門員)
 * 負責驗證 Firebase ID Token 並將 uid 注入 Request
 */
export const verifyAuthToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      // 將驗證後的 UID 注入自訂屬性
      (req as any).user = { uid: decodedToken.uid };
    } catch {
      return res.status(401).json({ success: false, error: '無效的登入憑證 (Invalid Token)' });
    }
  }

  return next();
};
