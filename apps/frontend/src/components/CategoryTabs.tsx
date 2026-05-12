import { FC } from 'react';
import { useAppContext } from '../context/AppContext';

const CategoryTabs: FC = () => {
  const { categories, selectedCategory, setSelectedCategory } = useAppContext();

  return (
    <div className="category-tabs">
      <button
        className={`tab-btn ${selectedCategory === 'all' ? 'active' : ''}`}
        onClick={() => setSelectedCategory('all')}
      >
        全部
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
          onClick={() => setSelectedCategory(cat.id)}
        >
          {cat.label}
        </button>
      ))}
      <button
        className={`tab-btn ${selectedCategory === 'favorites' ? 'active' : ''}`}
        id="favorites-tab-btn"
        onClick={() => setSelectedCategory('favorites')}
      >
        ❤️ 我的收藏
      </button>
    </div>
  );
};

export default CategoryTabs;
