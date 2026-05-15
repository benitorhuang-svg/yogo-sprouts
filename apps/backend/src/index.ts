import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { validateConfig } from './services/config.service';

// Load environment variables from the project root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

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
