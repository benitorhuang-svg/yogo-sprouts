import * as functions from 'firebase-functions';
import { logger } from '../utils/logger';

export async function sendLineNotify(message: string): Promise<void> {
  const token = functions.config().line?.notify_token || process.env.LINE_NOTIFY_TOKEN;
  if (!token) {
    logger.info({ message }, '[LINE Notify] Token is not configured. Logged notification.');
    return;
  }
  try {
    const response = await fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `message=${encodeURIComponent(message)}`,
    });
    if (!response.ok) {
      logger.error({ status: response.status }, '[LINE Notify] API returned error status');
    } else {
      logger.info('[LINE Notify] Successfully notified merchant.');
    }
  } catch (err) {
    logger.error({ err }, '[LINE Notify] Failed to post to LINE Notify API');
  }
}
