import { FC } from 'react';
import { useAppContext } from '@/context/AppContext';
import { audioManager } from '@/audioManager';

// Atomic Components
import { TabItem } from '../atoms/TabItem';
import { SearchBar } from '../atoms/SearchBar';

/**
 * 🏛️ CategoryTabs (Switcher / 指揮官)
 * 負責分類選單的導覽切換與搜尋列的佈局組合
 */
const CategoryTabs: FC = () => {
  const { categories, selectedCategory, setSelectedCategory } = useAppContext();

  const handleSelect = (id: string) => {
    audioManager.playCategorySwitch();
    setSelectedCategory(id);
  };

  return (
    <div className="category-tabs-container">
      <div className="category-tabs">
        {categories.map((cat) => (
          <TabItem
            key={cat.id}
            id={cat.id}
            label={cat.label}
            isActive={selectedCategory === cat.id}
            onClick={handleSelect}
          />
        ))}
      </div>
      <div className="category-search-wrapper">
        <SearchBar />
      </div>
    </div>
  );
};

export default CategoryTabs;
