import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { validateConfig } from './services/config.service';

// Initialize Firebase Admin SDK before importing routes
admin.initializeApp();

// Validate environment configuration
validateConfig();

import { app } from './api';
import { onOrderStatusChange } from './triggers/order.trigger';

// Export HTTP Cloud Function 'api'
export const api = functions.https.onRequest(app);

// Export Firestore Trigger
export { onOrderStatusChange };
