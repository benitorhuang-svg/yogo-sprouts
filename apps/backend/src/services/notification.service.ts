import { LineService } from '../line/service';
import { logger } from '../utils/logger';

/**
 * 遷移至 LINE Messaging API
 * @param message 訊息內容
 * @param to 接收者的 LINE User ID (預設為管理員)
 */
export async function sendLineMessage(message: string, to?: string): Promise<void> {
  const adminUserId = to || process.env.LINE_ADMIN_USER_ID;

  if (!adminUserId) {
    logger.warn(
      { message },
      '[LINE Message] Admin User ID is missing. Message logged but not sent.'
    );
    return;
  }

  try {
    await LineService.pushMessage(adminUserId, message);
    logger.info('[LINE Message] Successfully sent push message via LineService.');
  } catch (err) {
    logger.error({ err }, '[LINE Message] Failed to send push message');
  }
}
