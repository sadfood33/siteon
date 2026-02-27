// src/context/CategoryContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Category } from '../types/db';
import { useToast } from './ToastContext';
import { api } from '../services/api';

interface CategoryContextType {
  categories: Category[];
  isLoading: boolean;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Пицца', slug: 'pizza', icon: '🍕' },
  { id: '2', name: 'Русская печь', slug: 'russian_oven', icon: '🔥' },
  { id: '3', name: 'Роллы', slug: 'rolls', icon: '🍣' },
  { id: '4', name: 'Выпечка', slug: 'bakery', icon: '🥐' },
  { id: '5', name: 'Горячее', slug: 'hot', icon: '🍖' },
  { id: '6', name: 'Салаты', slug: 'salads', icon: '🥗' },
  { id: '7', name: 'Гарниры', slug: 'sides', icon: '🍟' },
  { id: '8', name: 'Мангал', slug: 'mangal', icon: '🔥' },
  { id: '9', name: 'Супы', slug: 'soups', icon: '🍲' },
];

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedCategories = await api.categories.getAll();
      
      if (fetchedCategories && fetchedCategories.length > 0) {
        setCategories(fetchedCategories);
        console.log('📂 Loaded categories from API:', fetchedCategories.length);
      } else {
        // Если категорий нет в БД, используем дефолтные
        setCategories(defaultCategories);
        console.log('📂 Using default categories');
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategories(defaultCategories);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const addCategory = useCallback(async (categoryData: Omit<Category, 'id'>) => {
    try {
      await api.categories.create(categoryData);
      showToast('Категория добавлена', 'success');
      await loadCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      showToast('Ошибка добавления категории', 'error');
      throw error;
    }
  }, [loadCategories, showToast]);

  const updateCategory = useCallback(async (updatedCategory: Category) => {
    try {
      await api.categories.update(updatedCategory.id, updatedCategory);
      showToast('Категория обновлена', 'success');
      await loadCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      showToast('Ошибка обновления категории', 'error');
      throw error;
    }
  }, [loadCategories, showToast]);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      await api.categories.delete(id);
      showToast('Категория удалена', 'info');
      await loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast('Ошибка удаления категории', 'error');
      throw error;
    }
  }, [loadCategories, showToast]);

  const refreshCategories = useCallback(async () => {
    await loadCategories();
  }, [loadCategories]);

  return (
    <CategoryContext.Provider value={{ 
      categories, 
      isLoading,
      addCategory, 
      updateCategory, 
      deleteCategory,
      refreshCategories
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error('useCategories must be used within a CategoryProvider');
  return context;
};