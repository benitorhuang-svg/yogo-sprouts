import { FC } from 'react';
import { useAppContext } from '@/context/AppContext';
import { audioManager } from '@/audioManager';
import SearchBar from '@/components/SearchBar';

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
          <button
            key={cat.id}
            id={cat.id === 'favorites' ? 'favorites-tab-btn' : undefined}
            className={`tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => handleSelect(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="category-search-wrapper">
        <SearchBar />
      </div>
    </div>
  );
};

export default CategoryTabs;
