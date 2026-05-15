import { FC } from 'react';
import { useAppContext } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';

const ProductList: FC = () => {
  const { products, categories, selectedCategory, searchQuery, favorites } = useAppContext();

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.spec.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedCategory === 'all') return matchesSearch;
    if (selectedCategory === 'favorites') return matchesSearch && favorites.includes(p.id);
    return matchesSearch && p.category === selectedCategory;
  });

  return (
    <main className="shop-main" id="shop">
      {categories
        .filter(
          (cat) =>
            selectedCategory === 'all' ||
            selectedCategory === cat.id ||
            selectedCategory === 'favorites'
        )
        .map((cat) => {
          const catProducts = filteredProducts.filter((p) => p.category === cat.id);
          if (catProducts.length === 0) return null;

          return (
            <section key={cat.id} className="category-section" id={`section-${cat.id}`}>
              <h3>{cat.label}</h3>
              <div className="product-grid" id={`grid-${cat.id}`}>
                {catProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          );
        })}
    </main>
  );
};

export default ProductList;
