import { Router } from 'express';
import authRoutes from './auth.routes';
import { OrderController } from '../controllers/order.controller';
import { verifyAuthToken } from '../middlewares/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

// 流量限制器
const checkoutLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { success: false, error: '點擊過於頻繁！請 10 分鐘後再試。' },
  standardHeaders: true,
  legacyHeaders: false,
});

// 模組化路由
router.use('/auth', authRoutes);

// 核心業務路由
router.post('/checkout', checkoutLimiter, verifyAuthToken, OrderController.checkout);

export default router;
