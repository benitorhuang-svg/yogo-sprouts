import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

/**
 * 👑 AdminController
 * 負責後台管理系統的核心邏輯
 */
export class AdminController {
  /**
   * 👥 列出所有會員資料
   */
  static async listUsers(req: Request, res: Response) {
    try {
      const db = admin.firestore();
      // 先嘗試簡單查詢，避免 Index 尚未建立導致的 500 錯誤
      const snapshot = await db.collection('users').limit(100).get();
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // 在記憶體中排序 (作為無索引時的備案)
      const sortedUsers = users.sort((a: any, b: any) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });

      return res.status(200).json({ success: true, data: sortedUsers });
    } catch (err: any) {
      console.error('Admin listUsers Error:', err);
      return res.status(500).json({ success: false, error: `獲取會員失敗: ${err.message}` });
    }
  }

  /**
   * 📦 列出所有商品 (包含後台專用欄位)
   */
  static async listProducts(req: Request, res: Response) {
    try {
      const db = admin.firestore();
      const snapshot = await db.collection('products').get();
      const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json({ success: true, data: products });
    } catch (err: any) {
      console.error('Admin listProducts Error:', err);
      return res.status(500).json({ success: false, error: `獲取商品失敗: ${err.message}` });
    }
  }

  /**
   * 📝 更新商品資訊 (庫存、價格等)
   */
  static async updateProduct(req: Request, res: Response) {
    try {
      const db = admin.firestore();
      const { id } = req.params;
      const updateData = req.body;

      await db.collection('products').doc(id).update(updateData);
      return res.status(200).json({ success: true, message: `商品 ${id} 更新成功` });
    } catch (err: any) {
      console.error('Admin updateProduct Error:', err);
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
