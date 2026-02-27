import { useState, useEffect } from 'react';
import { Category } from '../../types/db';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryFormModalProps {
  category?: Category;
  onClose: () => void;
  onSubmit: (categoryData: Omit<Category, 'id'> | Category) => void;
}

export const CategoryFormModal = ({ category, onClose, onSubmit }: CategoryFormModalProps) => {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    icon: '🍽️'
  });

  useEffect(() => {
    if (category) {
      setFormData(category);
    }
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.slug) {
      onSubmit(formData as Category);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-800"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold text-white">
              {category ? 'Редактировать категорию' : 'Добавить категорию'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Название</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Напр. Напитки"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-[#00ff00] focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Slug (для URL)</label>
              <input
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="напр. drinks"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-[#00ff00] focus:outline-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Иконка (Emoji)</label>
              <input
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-[#00ff00] focus:outline-none"
                required
              />
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-600 rounded-xl text-white hover:bg-gray-800 transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#00ff00] text-black font-bold rounded-xl hover:bg-[#00cc00] transition-colors"
              >
                Сохранить
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
