import { FC } from 'react';

const AnnouncementBar: FC = () => {
  return (
    <div className="announcement-bar">
      <div className="marquee">
        <span>❄️ 冷藏運送：單筆滿 $2,000 享免運優惠！</span>
        <span>📦 常溫商品：單筆滿 $800 享免運優惠！</span>
        <span>❄️ 冷藏運送：單筆滿 $2,000 享免運優惠！</span>
        <span>📦 常溫商品：單筆滿 $800 享免運優惠！</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
