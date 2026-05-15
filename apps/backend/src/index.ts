import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { validateConfig } from './services/config.service';

// Load environment variables.
// 優先讀取目前路徑以及上一層路徑（支援 lib/ 下的執行環境）
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
if (!process.env.LINE_CHANNEL_ACCESS_TOKEN) {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
}

// Initialize Firebase Admin SDK before importing routes
admin.initializeApp();

// Validate environment configuration
validateConfig();

import { app } from './api';
import { onOrderStatusChange, onOrderCreated } from './triggers/order.trigger';

// Export HTTP Cloud Function 'api'
export const api = functions.https.onRequest(app);

// Export Firestore Triggers
export { onOrderStatusChange, onOrderCreated };
