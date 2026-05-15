import { Request, Response } from 'express';
import { DialogueService } from './dialogue';
import { logger } from '../utils/logger';

export class LineController {
  /**
   * 接收 LINE Webhook 並分發處理
   */
  static async webhook(req: Request, res: Response) {
    const events = req.body.events;
    if (!events || !Array.isArray(events)) return res.status(200).send('OK');

    for (const event of events) {
      try {
        if (event.type === 'message' && event.message.type === 'text') {
          await DialogueService.handleTextMessage(event.replyToken, event.message.text);
        }
      } catch (err) {
        logger.error({ err }, '[LineController] Webhook error');
      }
    }
    return res.status(200).send('OK');
  }
}
