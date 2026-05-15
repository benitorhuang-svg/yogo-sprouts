import React, { FC } from 'react';

interface MembershipTiersProps {
  onBack: () => void;
}

/**
 * 🏆 MembershipTiers Component
 * 顯示會員晉升等級說明
 */
export const MembershipTiers: FC<MembershipTiersProps> = ({ onBack }) => {
  return (
    <div className="auth-modal-content">
      <div className="profile-header" style={{ marginBottom: 15 }}>
        <h2>🏆 YoGo 芽農晉升藍圖</h2>
        <p className="auth-subtitle">累積紅利點數解鎖專屬 VIP 綠色禮遇</p>
      </div>

      <div className="tiers-container">
        <div className="tier-card">
          <div className="tier-header">🌱 綠手指新手</div>
          <ul className="tier-perks">
            <li>• 永久免年費</li>
            <li>• 消費每 $100 贈 1 點</li>
          </ul>
        </div>
        <div className="tier-card">
          <div className="tier-header">🌿 綠意大使</div>
          <ul className="tier-perks">
            <li>• 年度消費滿 $3,000</li>
            <li>• 點數兩倍送 + 免運券</li>
          </ul>
        </div>
        <div className="tier-card current">
          <div className="tier-header vip">👑 VIP 芽苗大師</div>
          <ul className="tier-perks">
            <li>• 年度消費滿 $8,000</li>
            <li>• 全館享 9 折 + 生日大禮包</li>
          </ul>
        </div>
      </div>

      <button className="quick-btn" onClick={onBack} style={{ marginTop: 20 }}>
        返回會員中心
      </button>
    </div>
  );
};
