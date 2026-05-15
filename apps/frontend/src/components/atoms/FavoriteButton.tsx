import React, { FC } from 'react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

/**
 * ❤️ FavoriteButton Component
 * 商品卡片右上角的收藏切換按鈕
 */
export const FavoriteButton: FC<FavoriteButtonProps> = ({ isFavorite, onToggle }) => {
  return (
    <button className="favorite-toggle-btn" aria-label="收藏商品" onClick={onToggle}>
      {isFavorite ? '❤️' : '🤍'}
    </button>
  );
};
