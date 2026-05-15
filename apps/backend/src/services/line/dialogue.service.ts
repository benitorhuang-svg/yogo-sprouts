import { LineService } from './line.service';

export class DialogueService {
  /**
   * 處理進來的文字訊息並決定回覆內容
   */
  static async handleTextMessage(replyToken: string, userText: string) {
    let replyText = '';

    // --- 對話邏輯實作區 ---
    const text = userText.trim();

    if (text === '嗨' || text.toLowerCase() === 'hello' || text.toLowerCase() === 'hi') {
      replyText =
        '您好！我是 YoGo 芽菜助手 🌱。請問今天想了解什麼呢？\n\n輸入「官網」可取得連結\n輸入「地址」可查詢店址';
    } else if (text.includes('官網') || text.includes('下單')) {
      replyText =
        'YoGo 有夠菜 官方網站：\nhttps://yogo-sprouts-app.web.app/\n\n現在下單還有新鮮芽菜現採直送喔！';
    } else if (text.includes('地址') || text.includes('在哪')) {
      replyText =
        '📍 YoGo 芽菜工坊店址：\n台北市某某區某某路 123 號\n\n營業時間：週一至週五 09:00 - 18:00';
    } else {
      replyText = `收到您的訊息「${userText}」了！\n\n目前小助手還在學習中，若有緊急訂單問題，請留下聯絡電話，我們會儘速請專人回覆您。🙏`;
    }
    // ----------------------

    await LineService.replyMessage(replyToken, replyText);
  }
}
