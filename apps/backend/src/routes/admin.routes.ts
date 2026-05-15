import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { verifyAuthToken, verifyAdmin } from '../middlewares/auth.middleware';

const router = Router();

// 所有 Admin 路由都必須經過身份驗證與管理員權限檢查
router.use(verifyAuthToken, verifyAdmin);

// 1. 會員管理
router.get('/users', AdminController.listUsers);

// 2. 商品管理
router.get('/products', AdminController.listProducts);
router.patch('/products/:id', AdminController.updateProduct);

export default router;
