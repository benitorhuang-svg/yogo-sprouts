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

/**
 * 👮 Admin Middleware
 * 嚴格限制僅限 admin@yogo.tw 存取
 */
export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user || !user.uid) {
    return res.status(401).json({ success: false, error: '未偵測到登入狀態，請先登入' });
  }

  try {
    const adminUser = await admin.auth().getUser(user.uid);
    console.log(`[Admin Access Check] UID: ${user.uid}, Email: ${adminUser.email}`);

    if (adminUser.email === 'admin@yogo.tw') {
      return next();
    }
    return res
      .status(403)
      .json({ success: false, error: `權限不足 (${adminUser.email})，僅限管理員存取` });
  } catch (err: any) {
    console.error('Admin Verify Error:', err);
    return res.status(500).json({ success: false, error: `管理員身份驗證失敗: ${err.message}` });
  }
};
