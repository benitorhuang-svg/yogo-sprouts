import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

// 1. LINE Login
router.post('/line', AuthController.lineLogin);

export default router;
