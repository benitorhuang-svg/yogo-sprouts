import { logger } from '../utils/logger';

export class LineService {
  /**
   * 傳送回覆訊息 (Reply)
   */
  static async replyMessage(replyToken: string, text: string) {
    return this.callLineApi('https://api.line.me/v2/bot/message/reply', {
      replyToken,
      messages: [{ type: 'text', text }],
    });
  }

  /**
   * 傳送推播訊息 (Push)
   */
  static async pushMessage(to: string, text: string) {
    return this.callLineApi('https://api.line.me/v2/bot/message/push', {
      to,
      messages: [{ type: 'text', text }],
    });
  }

  private static async callLineApi(url: string, body: any) {
    const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${channelAccessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error({ error }, '[LineService] API Error');
      throw new Error(`LINE API error: ${JSON.stringify(error)}`);
    }
    return response.json();
  }
}
