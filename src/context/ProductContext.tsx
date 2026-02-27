// src/context/ProductContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '../data/products';
import { useToast } from './ToastContext';
import { api } from '../services/api';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  refreshProducts: () => Promise<void>;
  getProductById: (id: number) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // Загрузка товаров из API
  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { products: fetchedProducts } = await api.products.getAll({ limit: 1000 });
      setProducts(fetchedProducts);
      console.log('📦 Loaded products from API:', fetchedProducts.length);
    } catch (error) {
      console.error('Failed to load products:', error);
      showToast('Ошибка загрузки товаров', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const addProduct = useCallback(async (productData: Omit<Product, 'id'>) => {
    try {
      await api.products.create(productData);
      showToast('Товар успешно добавлен', 'success');
      await loadProducts(); // Перезагружаем список
    } catch (error) {
      console.error('Error adding product:', error);
      showToast('Ошибка добавления товара', 'error');
      throw error;
    }
  }, [loadProducts, showToast]);

  const updateProduct = useCallback(async (updatedProduct: Product) => {
    try {
      await api.products.update(updatedProduct.id, updatedProduct);
      showToast('Товар обновлён', 'success');
      await loadProducts(); // Перезагружаем список
    } catch (error) {
      console.error('Error updating product:', error);
      showToast('Ошибка обновления товара', 'error');
      throw error;
    }
  }, [loadProducts, showToast]);

  const deleteProduct = useCallback(async (id: number) => {
    try {
      await api.products.delete(id);
      showToast('Товар удалён', 'info');
      await loadProducts(); // Перезагружаем список
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Ошибка удаления товара', 'error');
      throw error;
    }
  }, [loadProducts, showToast]);

  const refreshProducts = useCallback(async () => {
    await loadProducts();
  }, [loadProducts]);

  const getProductById = useCallback((id: number): Product | undefined => {
    return products.find(p => p.id === id);
  }, [products]);

  const getProductsByCategory = useCallback((category: string): Product[] => {
    return products.filter(p => p.category === category);
  }, [products]);

  const searchProducts = useCallback((query: string): Product[] => {
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
  }, [products]);

  return (
    <ProductContext.Provider value={{ 
      products, 
      isLoading,
      addProduct, 
      updateProduct, 
      deleteProduct,
      refreshProducts,
      getProductById,
      getProductsByCategory,
      searchProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};