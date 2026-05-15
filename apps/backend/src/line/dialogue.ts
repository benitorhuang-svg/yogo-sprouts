import { LineService } from './service';

export class DialogueService {
  /**
   * 🤖 對話邏輯控制中心
   * 您可以在此新增或修改關鍵字回覆
   */
  static async handleTextMessage(replyToken: string, userText: string) {
    const text = userText.trim();
    let replyText = '';

    if (text === '嗨' || text.toLowerCase() === 'hello') {
      replyText = '您好！我是 YoGo 芽菜助手 🌱。\n\n輸入「官網」可取得連結\n輸入「地址」可查詢店址';
    } else if (text.includes('官網') || text.includes('下單')) {
      replyText = 'YoGo 有夠菜 官方網站：\nhttps://yogo-sprouts-app.web.app/\n\n新鮮芽菜現採直送！';
    } else if (text.includes('地址') || text.includes('在哪')) {
      replyText = '📍 店址：台北市某某區某某路 123 號\n🕘 營業時間：09:00 - 18:00';
    } else {
      replyText = `收到訊息「${userText}」了！小助手正努力學習中...`;
    }

    await LineService.replyMessage(replyToken, replyText);
  }
}
