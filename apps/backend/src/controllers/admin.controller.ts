import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

/**
 * 👑 AdminController
 * 負責後台管理系統的核心邏輯
 */
export class AdminController {
  private static db = admin.firestore();

  /**
   * 👥 列出所有會員資料
   */
  static async listUsers(req: Request, res: Response) {
    try {
      const snapshot = await this.db.collection('users').orderBy('createdAt', 'desc').get();
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json({ success: true, data: users });
    } catch (err: any) {
      console.error('Admin listUsers Error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * 📦 列出所有商品 (包含後台專用欄位)
   */
  static async listProducts(req: Request, res: Response) {
    try {
      const snapshot = await this.db.collection('products').get();
      const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json({ success: true, data: products });
    } catch (err: any) {
      console.error('Admin listProducts Error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * 📝 更新商品資訊 (庫存、價格等)
   */
  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      await this.db.collection('products').doc(id).update(updateData);
      return res.status(200).json({ success: true, message: `商品 ${id} 更新成功` });
    } catch (err: any) {
      console.error('Admin updateProduct Error:', err);
      return res.status(400).json({ success: false, error: err.message });
    }
  }
}
