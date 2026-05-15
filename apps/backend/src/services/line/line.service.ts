import { logger } from '../../utils/logger';

export class LineService {
  /**
   * 回覆訊息 (Reply)
   */
  static async replyMessage(replyToken: string, text: string) {
    return this.callLineApi('https://api.line.me/v2/bot/message/reply', {
      replyToken: replyToken,
      messages: [{ type: 'text', text: text }],
    });
  }

  /**
   * 主動推播訊息 (Push)
   */
  static async pushMessage(to: string, text: string) {
    return this.callLineApi('https://api.line.me/v2/bot/message/push', {
      to: to,
      messages: [{ type: 'text', text: text }],
    });
  }

  private static async callLineApi(url: string, body: any) {
    const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    if (!channelAccessToken) {
      throw new Error('LINE_CHANNEL_ACCESS_TOKEN is missing');
    }

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
      logger.error({ error, url }, '[LineService] API Error');
      throw new Error(`LINE API error: ${JSON.stringify(error)}`);
    }
    return response.json();
  }
}
