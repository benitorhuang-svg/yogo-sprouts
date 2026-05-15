import * as functions from 'firebase-functions';
import { logger } from '../utils/logger';

/**
 * 遷移至 LINE Messaging API (替代已停止服務的 LINE Notify)
 * @param message 訊息內容
 * @param to 接收者的 LINE User ID (預設為管理員)
 */
export async function sendLineMessage(message: string, to?: string): Promise<void> {
  const config = functions.config().line || {};
  const channelAccessToken = config.channel_access_token || process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const adminUserId = to || config.admin_user_id || process.env.LINE_ADMIN_USER_ID;

  if (!channelAccessToken || !adminUserId) {
    logger.info(
      { message },
      '[LINE Message] Channel Access Token or Admin User ID is missing. Logged message.'
    );
    return;
  }

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${channelAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: adminUserId,
        messages: [
          {
            type: 'text',
            text: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      logger.error({ status: response.status, errorData }, '[LINE Message] API returned error');
    } else {
      logger.info('[LINE Message] Successfully sent push message via Messaging API.');
    }
  } catch (err) {
    logger.error({ err }, '[LINE Message] Failed to post to LINE Messaging API');
  }
}
