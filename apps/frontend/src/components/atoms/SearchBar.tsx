import React, { FC } from 'react';
import { useAppContext } from '@/context/AppContext';

/**
 * 🔍 SearchBar Component
 * 處理全域商品搜尋與快速清空功能
 */
export const SearchBar: FC = () => {
  const { searchQuery, setSearchQuery } = useAppContext();

  return (
    <div className="search-container">
      <span className="search-icon-wrapper">
        <svg className="search-icon-svg" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      </span>
      <input
        type="text"
        placeholder=" 搜尋商品名稱、規格或描述..."
        className="search-input"
        autoComplete="off"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button
          className="search-clear-btn"
          aria-label="清空搜尋"
          onClick={() => setSearchQuery('')}
        >
          ✕
        </button>
      )}
    </div>
  );
};
