import { useState } from 'react';
import { Search, ChevronDown, X, Flame, Tag, TrendingUp } from 'lucide-react';
import { useCategories } from '../../context/CategoryContext';
import { motion, AnimatePresence } from 'framer-motion';

interface TopBarProps {
  search: string;
  setSearch: (s: string) => void;
  filter: string;
  setFilter: (f: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  priceRange: [number, number];
  setPriceRange: (r: [number, number]) => void;
  showPromo: boolean;
  setShowPromo: (s: boolean) => void;
}

const sortOptions = [
  { value: 'popular', label: 'По популярности', icon: TrendingUp },
  { value: 'price-asc', label: 'Сначала дешевле', icon: Tag },
  { value: 'price-desc', label: 'Сначала дороже', icon: Tag },
];

export const TopBar = ({ 
  search, 
  setSearch, 
  filter, 
  setFilter,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  showPromo,
  setShowPromo
}: TopBarProps) => {
  const { categories } = useCategories();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  const activeFiltersCount = [
    filter !== '',
    showPromo,
    priceRange[0] > 0 || priceRange[1] < 1000
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setFilter('');
    setShowPromo(false);
    setPriceRange([0, 1000]);
    setSearch('');
  };

  return (
    <div className="sticky top-[64px] lg:top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-md pt-2 sm:pt-4 pb-4 mb-4 sm:mb-6 border-b border-gray-800 -mx-4 sm:mx-0 px-4 sm:px-0">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Найти блюдо..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl py-3 pl-12 pr-10 text-white placeholder-gray-500 focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00]/50 focus:outline-none transition-all"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-xl text-white hover:border-gray-600 transition-all min-w-[180px] justify-between"
          >
            <span className="text-gray-400 text-sm">
              {sortOptions.find(o => o.value === sortBy)?.label || 'Сортировка'}
            </span>
            <ChevronDown size={18} className={`text-gray-500 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isSortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 w-full bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-xl overflow-hidden z-30"
              >
                {sortOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        sortBy === option.value 
                          ? 'bg-[#00ff00]/10 text-[#00ff00]' 
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-sm">{option.label}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Range */}
        <div className="relative">
          <button
            onClick={() => setIsPriceOpen(!isPriceOpen)}
            className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition-all min-w-[140px] justify-between ${
              priceRange[0] > 0 || priceRange[1] < 1000
                ? 'bg-[#00ff00]/10 border-[#00ff00]/50 text-[#00ff00]'
                : 'bg-[#1a1a1a] border-gray-800 text-white hover:border-gray-600'
            }`}
          >
            <span className="text-sm">
              {priceRange[0] > 0 || priceRange[1] < 1000 
                ? `${priceRange[0]}–${priceRange[1]} ₽` 
                : 'Цена'}
            </span>
            <ChevronDown size={18} className={`transition-transform ${isPriceOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isPriceOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 w-64 bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-xl p-4 z-30"
              >
                <p className="text-sm text-gray-400 mb-3">Диапазон цен</p>
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    placeholder="От"
                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#00ff00] focus:outline-none"
                  />
                  <span className="text-gray-500">–</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    placeholder="До"
                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-[#00ff00] focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  {[[0, 300], [300, 500], [500, 1000]].map(([min, max]) => (
                    <button
                      key={`${min}-${max}`}
                      onClick={() => setPriceRange([min, max])}
                      className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${
                        priceRange[0] === min && priceRange[1] === max
                          ? 'bg-[#00ff00] text-black border-[#00ff00]'
                          : 'border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {min}–{max}₽
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setPriceRange([0, 1000]);
                    setIsPriceOpen(false);
                  }}
                  className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Сбросить
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Categories Row */}
      <div className="relative">
        <div className="flex items-center gap-2 overflow-x-auto md:flex-wrap pb-2 scrollbar-hide mask-gradient-right">
          {/* Promo Toggle */}
          <button
            onClick={() => {
              setShowPromo(!showPromo);
              if (!showPromo) setFilter(''); // Clear category filter when enabling promos to see all promo items
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border whitespace-nowrap transition-all flex-shrink-0 ${
              showPromo
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-transparent shadow-lg shadow-orange-500/25'
                : 'bg-[#1a1a1a] border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'
            }`}
          >
            <Flame size={16} />
            <span className="text-sm font-medium">Акция</span>
          </button>

          <div className="w-px h-6 bg-gray-800 mx-1 flex-shrink-0" />

          {/* Category Pills */}
          {[{ id: 'all', name: 'Все', icon: '🍽️' }, ...categories].map((cat) => {
            const isActive = (filter === cat.name) || (filter === '' && cat.name === 'Все');
            const emoji = cat.icon;
            
            return (
              <motion.button
                key={cat.id}
                onClick={() => setFilter(cat.name === 'Все' ? '' : cat.name)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border whitespace-nowrap transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-[#00ff00] text-black border-[#00ff00] font-semibold shadow-lg shadow-[#00ff00]/25'
                    : 'bg-[#1a1a1a] border-gray-800 text-gray-300 hover:text-white hover:border-gray-600 hover:bg-[#252525]'
                }`}
              >
                <span className="text-base">{emoji}</span>
                <span className="text-sm">{cat.name}</span>
              </motion.button>
            );
          })}
        </div>
        {/* Gradient Fade for Mobile */}
        <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none md:hidden" />
      </div>

      {/* Active Filters Summary */}
      <AnimatePresence>
        {(activeFiltersCount > 0 || search) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-800/50"
          >
            <span className="text-xs text-gray-500">Активные фильтры:</span>
            <div className="flex items-center gap-2 flex-wrap">
              {filter && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#00ff00]/10 text-[#00ff00] rounded-lg text-xs">
                  {categories.find(c => c.name === filter)?.icon || '🍽️'} {filter}
                  <button onClick={() => setFilter('')} className="ml-1 hover:text-white">
                    <X size={12} />
                  </button>
                </span>
              )}
              {showPromo && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/10 text-orange-400 rounded-lg text-xs">
                  <Flame size={12} /> Акция
                  <button onClick={() => setShowPromo(false)} className="ml-1 hover:text-white">
                    <X size={12} />
                  </button>
                </span>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-xs">
                  {priceRange[0]}–{priceRange[1]} ₽
                  <button onClick={() => setPriceRange([0, 1000])} className="ml-1 hover:text-white">
                    <X size={12} />
                  </button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-xs">
                  «{search}»
                  <button onClick={() => setSearch('')} className="ml-1 hover:text-white">
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
            <button
              onClick={clearAllFilters}
              className="ml-auto text-xs text-gray-500 hover:text-[#00ff00] transition-colors"
            >
              Сбросить все
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
