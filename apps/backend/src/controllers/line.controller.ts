import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { DialogueService } from '../services/line/dialogue.service';

export class LineController {
  static async webhook(req: Request, res: Response) {
    const events = req.body.events;

    if (!events || !Array.isArray(events)) {
      return res.status(200).send('OK');
    }

    for (const event of events) {
      try {
        if (event.type === 'message' && event.message.type === 'text') {
          const replyToken = event.replyToken;
          const userText = event.message.text;

          logger.info(
            { userText, userId: event.source.userId },
            '[LINE Webhook] Processing dialogue'
          );

          // 將對話邏輯交給 DialogueService
          await DialogueService.handleTextMessage(replyToken, userText);
        }
      } catch (err) {
        logger.error({ err, event }, '[LINE Webhook] Event processing error');
      }
    }

    return res.status(200).send('OK');
  }
}
