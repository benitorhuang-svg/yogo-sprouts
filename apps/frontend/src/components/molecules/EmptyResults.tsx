import { FC } from 'react';

interface EmptyResultsProps {
  searchQuery: string;
  isFavorites: boolean;
}

export const EmptyResults: FC<EmptyResultsProps> = ({ searchQuery, isFavorites }) => {
  return (
    <div className="empty-results">
      <div className="empty-icon">🌱</div>
      <h3>{isFavorites ? '尚未收藏任何商品' : '找不到相關商品'}</h3>
      <p>
        {isFavorites
          ? '快去逛逛商城，點擊愛心收藏喜歡的商品吧！'
          : `搜尋「${searchQuery}」沒有結果，請嘗試其他關鍵字。`}
      </p>
    </div>
  );
};
