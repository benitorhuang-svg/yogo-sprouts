import * as functions from 'firebase-functions';

export async function sendLineNotify(message: string): Promise<void> {
  const token = functions.config().line?.notify_token || process.env.LINE_NOTIFY_TOKEN;
  if (!token) {
    console.log('[LINE Notify] Token is not configured. Logged notification:\n', message);
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
      console.error('[LINE Notify] API returned error status:', response.status);
    } else {
      console.log('[LINE Notify] Successfully notified merchant.');
    }
  } catch (err) {
    console.error('[LINE Notify] Failed to post to LINE Notify API:', err);
  }
}
