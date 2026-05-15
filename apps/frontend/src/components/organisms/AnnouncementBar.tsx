import { FC } from 'react';
import { BUSINESS_RULES } from '@/services/BusinessLogicService';

/**
 * 📣 AnnouncementBar (Organism / Atomic Structure)
 * 自動根據業務規則顯示公告文字
 */
const AnnouncementBar: FC = () => {
  const { COLD_FREE_THRESHOLD, NORMAL_FREE_THRESHOLD } = BUSINESS_RULES.SHIPPING;

  const messages = [
    `❄️ 冷藏運送：單筆滿 $${COLD_FREE_THRESHOLD.toLocaleString()} 享免運優惠！`,
    `📦 常溫商品：單筆滿 $${NORMAL_FREE_THRESHOLD.toLocaleString()} 享免運優惠！`,
  ];

  return (
    <div className="announcement-bar">
      <div className="marquee">
        {/* 重複兩次以實現無縫跑馬燈 */}
        {[...messages, ...messages].map((msg, i) => (
          <span key={i}>{msg}</span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
