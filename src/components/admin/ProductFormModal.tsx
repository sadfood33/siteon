// src/components/admin/ProductFormModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../../data/products';
import { X, Upload, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategories } from '../../context/CategoryContext';
import { useToast } from '../../context/ToastContext';

interface ProductFormModalProps {
  product?: Product;
  onClose: () => void;
  onSubmit: (productData: Omit<Product, 'id'> | Product) => void;
}

interface FormData {
  name: string;
  description: string;
  price: number | string;
  image: string;
  category: string;
  tags: string[];
  badge?: string;
  weight?: string;
  calories?: number | string;
  proteins?: number | string;
  fats?: number | string;
  carbs?: number | string;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  image?: string;
  category?: string;
}

const BADGE_OPTIONS = [
  { value: '', label: 'Без бейджа', color: 'bg-gray-700' },
  { value: 'Хит', label: '🔥 Хит', color: 'bg-orange-500' },
  { value: 'Акция', label: '💰 Акция', color: 'bg-purple-500' },
  { value: 'Новинка', label: '✨ Новинка', color: 'bg-blue-500' },
  { value: 'Острое', label: '🌶️ Острое', color: 'bg-red-600' },
];

const CATEGORY_ICONS: Record<string, string> = {
  'Пицца': '🍕',
  'Русская печь': '🔥',
  'Роллы': '🍣',
  'Выпечка': '🥐',
  'Горячее': '🍖',
  'Салаты': '🥗',
  'Гарниры': '🍟',
  'Мангал': '🔥',
  'Супы': '🍲',
};

export const ProductFormModal = ({ product, onClose, onSubmit }: ProductFormModalProps) => {
  const { categories } = useCategories();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    tags: [],
    badge: undefined,
    weight: undefined,
    calories: undefined,
    proteins: undefined,
    fats: undefined,
    carbs: undefined
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageValid, setImageValid] = useState<boolean | null>(null);

  // Инициализация формы при редактировании
  useEffect(() => {
    if (product) {
      console.log('📝 Editing product:', product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        image: product.image || '',
        category: product.category || '',
        tags: product.tags || [],
        badge: product.badge,
        weight: product.weight,
        calories: product.calories,
        proteins: product.proteins,
        fats: product.fats,
        carbs: product.carbs
      });
      setImagePreview(product.image || '');
    } else {
      console.log('➕ Creating new product');
      // Установка категории по умолчанию
      const defaultCategory = categories[0]?.name || '';
      setFormData(prev => ({
        ...prev,
        category: defaultCategory
      }));
    }
  }, [product, categories]);

  // Проверка изображения
  useEffect(() => {
    if (formData.image) {
      setImageLoading(true);
      setImageValid(null);
      
      const img = new Image();
      img.onload = () => {
        setImageLoading(false);
        setImageValid(true);
        setImagePreview(formData.image);
      };
      img.onerror = () => {
        setImageLoading(false);
        setImageValid(false);
        setImagePreview('');
      };
      img.src = formData.image;
    } else {
      setImagePreview('');
      setImageValid(null);
    }
  }, [formData.image]);

  // Обработчик изменений полей
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: name === 'price' || name === 'calories' 
          ? (value === '' ? '' : Number(value))
          : name === 'proteins' || name === 'fats' || name === 'carbs'
          ? (value === '' ? '' : parseFloat(value))
          : value
      };
      
      // Очистка ошибки при изменении
      if (errors[name as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
      
      return newData;
    });
  }, [errors]);

  // Валидация формы
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Название должно содержать минимум 2 символа';
    }

    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = 'Описание должно содержать минимум 10 символов';
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Цена должна быть больше 0';
    }

    if (!formData.image || !formData.image.trim()) {
      newErrors.image = 'Изображение обязательно';
    } else if (imageValid === false) {
      newErrors.image = 'Не удалось загрузить изображение';
    }

    if (!formData.category) {
      newErrors.category = 'Категория обязательна';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, imageValid]);

  // Обработчик отправки формы
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📤 Submitting product form');
    
    if (!validateForm()) {
      showToast('Исправьте ошибки в форме', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Подготовка данных
      const productData: Omit<Product, 'id'> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        image: formData.image.trim(),
        category: formData.category,
        tags: formData.tags,
        badge: formData.badge || undefined,
        weight: formData.weight || undefined,
        calories: formData.calories ? Number(formData.calories) : undefined,
        proteins: formData.proteins ? parseFloat(String(formData.proteins)) : undefined,
        fats: formData.fats ? parseFloat(String(formData.fats)) : undefined,
        carbs: formData.carbs ? parseFloat(String(formData.carbs)) : undefined,
      };

      console.log('✅ Product data prepared:', productData);

      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 500));

      // Отправка данных
      onSubmit(productData);
      
      showToast(
        product ? 'Товар успешно обновлён' : 'Товар успешно добавлен', 
        'success'
      );
      
      onClose();
    } catch (error) {
      console.error('❌ Error submitting product:', error);
      showToast('Ошибка сохранения товара', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSubmit, onClose, showToast, product]);

  // Обработчик быстрой вставки изображения
  const handleImagePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        showToast('Вставка изображений не поддерживается. Используйте URL.', 'info');
        break;
      }
    }
  }, [showToast]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        {/* Backdrop click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-800 max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-[#1a1a1a] z-10">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {product ? 'Редактировать товар' : 'Добавить товар'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {product ? `ID: ${product.id}` : 'Заполните все обязательные поля'}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <X size={24} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
            
            {/* Основная информация */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-[#00ff00] rounded-full" />
                Основная информация
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Название */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-1">
                    Название <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full bg-gray-800 border rounded-xl p-3 text-white focus:border-[#00ff00] focus:outline-none transition-colors ${
                      errors.name ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Например: Пицца Пепперони"
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Цена */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-1">
                    Цена (₽) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full bg-gray-800 border rounded-xl p-3 text-white focus:border-[#00ff00] focus:outline-none transition-colors ${
                      errors.price ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="0"
                    min="0"
                    step="1"
                    disabled={isSubmitting}
                  />
                  {errors.price && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.price}
                    </p>
                  )}
                </div>
              </div>

              {/* Описание */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-1">
                  Описание <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 border rounded-xl p-3 text-white focus:border-[#00ff00] focus:outline-none transition-colors resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="Опишите состав и особенности блюда..."
                  rows={4}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between text-xs">
                  {errors.description ? (
                    <p className="text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.description}
                    </p>
                  ) : (
                    <span className="text-gray-500" />
                  )}
                  <span className="text-gray-500">
                    {formData.description.length} символов
                  </span>
                </div>
              </div>
            </div>

            {/* Изображение и категория */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-[#00ff00] rounded-full" />
                Изображение и категория
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Категория */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-1">
                    Категория <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full bg-gray-800 border rounded-xl p-3 text-white focus:border-[#00ff00] focus:outline-none transition-colors ${
                      errors.category ? 'border-red-500' : 'border-gray-700'
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {CATEGORY_ICONS[cat.name] || '🍽️'} {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* URL изображения */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-1">
                    URL изображения <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      onPaste={handleImagePaste}
                      className={`w-full bg-gray-800 border rounded-xl p-3 pl-10 text-white focus:border-[#00ff00] focus:outline-none transition-colors ${
                        errors.image ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="https://..."
                      disabled={isSubmitting}
                    />
                    <ImageIcon 
                      size={18} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" 
                    />
                  </div>
                  {errors.image && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.image}
                    </p>
                  )}
                </div>
              </div>

              {/* Предпросмотр изображения */}
              {(imagePreview || imageLoading || imageValid === false) && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Предпросмотр</label>
                  <div className="relative w-full aspect-video bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80">
                        <div className="w-8 h-8 border-2 border-[#00ff00] border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    {imageValid === false ? (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Не удалось загрузить изображение</p>
                        </div>
                      </div>
                    ) : imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                    {imageValid === true && (
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-[#00ff00] text-black text-xs font-bold rounded-lg flex items-center gap-1">
                        <CheckCircle size={12} />
                        OK
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Бейдж товара */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-[#00ff00] rounded-full" />
                Бейдж товара
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {BADGE_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, badge: option.value || undefined }))}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                      formData.badge === option.value
                        ? `${option.color} border-transparent text-white shadow-lg`
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}
                    disabled={isSubmitting}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            /* Пищевая ценность */
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-[#00ff00] rounded-full" />
                Пищевая ценность (опционально)
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Вес */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Вес</label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight || ''}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-[#00ff00] focus:outline-none transition-colors"
                    placeholder="300 г"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Калории */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Ккал</label>
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories || ''}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-[#00ff00] focus:outline-none transition-colors"
                    placeholder="250"
                    min="0"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Белки */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Белки (г)</label>
                  <input
                    type="number"
                    name="proteins"
                    value={formData.proteins || ''}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-[#00ff00] focus:outline-none transition-colors"
                    placeholder="10"
                    min="0"
                    step="0.1"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Жиры */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Жиры (г)</label>
                  <input
                    type="number"
                    name="fats"
                    value={formData.fats || ''}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-[#00ff00] focus:outline-none transition-colors"
                    placeholder="15"
                    min="0"
                    step="0.1"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Углеводы */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Углеводы (г)</label>
                  <input
                    type="number"
                    name="carbs"
                    value={formData.carbs || ''}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white focus:border-[#00ff00] focus:outline-none transition-colors"
                    placeholder="20"
                    min="0"
                    step="0.1"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="pt-6 border-t border-gray-800 flex justify-end gap-4 sticky bottom-0 bg-[#1a1a1a] pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-600 rounded-xl text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#00ff00] text-black font-bold rounded-xl hover:bg-[#00cc00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Сохранение...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>{product ? 'Сохранить изменения' : 'Добавить товар'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};