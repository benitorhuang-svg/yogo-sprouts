import { Router } from 'express';
import { LineController } from './controller';

const router = Router();

/**
 * LINE 專屬路由設定
 * Webhook URL: https://<your-domain>/api/line/webhook
 */
router.post('/webhook', LineController.webhook);

// 供偵錯用的測試路徑
router.get('/webhook', (_req, res) => {
  res.status(200).send('YoGo LINE Module is Ready! 🌱');
});

export default router;
