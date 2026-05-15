import express from 'express';
import cors from 'cors';
import * as admin from 'firebase-admin';
import routes from '../routes';

const app = express();

// 1. 全域中介軟體
app.use(cors({ origin: true }));
app.use(express.json());

// 2. 路徑正規化 (處理 Hosting Rewrite 與 Function 直接呼叫的差異)
app.use((req, res, next) => {
  if (req.url.startsWith('/api/')) {
    req.url = req.url.replace(/^\/api/, '');
  }
  next();
});

// 3. 載入模組化路由
app.use('/', routes);

// 4. 原有的輔助路由 (暫留，可後續進一步拆分)
import { forceSeed } from '../data/seeder';

app.post('/seed', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== (process.env.ADMIN_API_KEY || 'yogo-secret-admin-key-2026')) {
    return res.status(403).json({ success: false, error: '權限不足 (Unauthorized)' });
  }
  try {
    await forceSeed(admin.firestore());
    return res.status(200).json({ success: true, message: 'Database successfully seeded!' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ... 其他輔助路由可比照辦理

export { app };
