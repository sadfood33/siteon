import { useState, useMemo, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { TopBar } from '../components/catalog/TopBar';
import { ProductGrid } from '../components/catalog/ProductGrid';
import { useProducts } from '../context/ProductContext';
import { useFavorites } from '../context/FavoritesContext';
import { useSearchParams } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showPromo, setShowPromo] = useState(searchParams.get('promo') === 'true');
  const [showFavorites, setShowFavorites] = useState(searchParams.get('favorites') === 'true');
  const { products } = useProducts();
  const { favorites } = useFavorites();

  // Update state when URL params change
  useEffect(() => {
    const favParam = searchParams.get('favorites') === 'true';
    const promoParam = searchParams.get('promo') === 'true';
    const categoryParam = searchParams.get('category') || '';
    
    setShowFavorites(favParam);
    setShowPromo(promoParam);
    setFilter(categoryParam);
  }, [searchParams]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    const params: Record<string, string> = {};
    if (newFilter) params.category = newFilter;
    if (showPromo) params.promo = 'true';
    if (showFavorites) params.favorites = 'true';
    setSearchParams(params);
  };

  const handlePromoChange = (value: boolean) => {
    setShowPromo(value);
    const params: Record<string, string> = {};
    if (filter) params.category = filter;
    if (value) params.promo = 'true';
    if (showFavorites) params.favorites = 'true';
    setSearchParams(params);
  };

  const handleFavoritesChange = (value: boolean) => {
    setShowFavorites(value);
    const params: Record<string, string> = {};
    if (filter) params.category = filter;
    if (showPromo) params.promo = 'true';
    if (value) params.favorites = 'true';
    setSearchParams(params);
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      // Search filter
      const matchesSearch = search === '' ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());

      // Category filter
      const matchesFilter = filter === '' ||
        product.category === filter ||
        product.tags?.includes(filter);

      // Price filter
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

      // Promo filter
      const matchesPromo = !showPromo || product.badge === 'Акция';

      // Favorites filter
      const matchesFavorites = !showFavorites || favorites.includes(product.id);

      return matchesSearch && matchesFilter && matchesPrice && matchesPromo && matchesFavorites;
    });

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'popular':
      default:
        result = [...result].sort((a, b) => (b.badge === 'Хит' ? 1 : 0) - (a.badge === 'Хит' ? 1 : 0));
        break;
    }

    return result;
  }, [products, search, filter, priceRange, showPromo, showFavorites, sortBy, favorites]);

  return (
    <MainLayout
      showBreadcrumbs
      breadcrumbs={[
        { label: showFavorites ? 'Избранное' : 'Каталог' }
      ]}
      title={showFavorites ? 'Избранное' : 'Каталог блюд'}
    >
      <div className="p-4 md:p-6 lg:p-8">
        {/* Favorites Toggle Banner */}
        {favorites.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => handleFavoritesChange(!showFavorites)}
              className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 rounded-xl border transition-all ${
                showFavorites
                  ? 'bg-pink-500/20 border-pink-500/50 text-pink-400'
                  : 'bg-[#1a1a1a] border-gray-800 text-gray-400 hover:border-pink-500/30 hover:text-pink-400'
              }`}
            >
              <Heart size={18} className={showFavorites ? 'fill-pink-400' : ''} />
              <span className="text-xs sm:text-base font-medium">
                {showFavorites ? 'В избранном' : 'Избранное'}
              </span>
              <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
                showFavorites ? 'bg-pink-500 text-white' : 'bg-gray-700 text-gray-300'
              }`}>
                {favorites.length}
              </span>
            </button>
          </div>
        )}

        <TopBar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={handleFilterChange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          showPromo={showPromo}
          setShowPromo={handlePromoChange}
        />

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Найдено: <span className="text-white font-medium">{filteredProducts.length}</span> товаров
            {showFavorites && <span className="text-pink-400 ml-2">в избранном</span>}
          </p>
          {showFavorites && filteredProducts.length === 0 && (
            <button
              onClick={() => handleFavoritesChange(false)}
              className="text-sm text-[#00ff00] hover:underline"
            >
              Показать все товары
            </button>
          )}
        </div>

        <ProductGrid products={filteredProducts} />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 bg-[#050505] mt-8">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2024 S.A.D. food. Все права защищены.</p>
          <div className="flex gap-6 text-gray-500">
             📞 8-920-620-26-26 | 📍 г. Кольчугино, ул. 3-го Интернационала, д. 85
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
