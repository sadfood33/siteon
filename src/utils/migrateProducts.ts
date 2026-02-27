// src/utils/migrateProducts.ts
import { products as initialProducts } from '../data/products';

interface MigrationResult {
  success: boolean;
  message: string;
  productsCount: number;
  errors: string[];
}

/**
 * Миграция и валидация данных о товарах в localStorage
 */
export const migrateProducts = (): MigrationResult => {
  const errors: string[] = [];
  
  try {
    console.log('🔧 Starting products migration...');
    
    const saved = localStorage.getItem('products');
    
    if (!saved) {
      // Если нет сохранённых данных, инициализировать начальными
      localStorage.setItem('products', JSON.stringify(initialProducts));
      console.log('✅ Products initialized with default data:', initialProducts.length);
      return {
        success: true,
        message: 'Products initialized with default data',
        productsCount: initialProducts.length,
        errors: []
      };
    }

    let parsed: any[];
    
    try {
      parsed = JSON.parse(saved);
    } catch (parseError) {
      console.error('❌ Failed to parse saved products:', parseError);
      errors.push('Failed to parse saved products');
      localStorage.setItem('products', JSON.stringify(initialProducts));
      return {
        success: false,
        message: 'Invalid JSON, reset to default',
        productsCount: initialProducts.length,
        errors
      };
    }
    
    if (!Array.isArray(parsed)) {
      console.warn('⚠️ Saved products is not an array');
      errors.push('Saved products is not an array');
      localStorage.setItem('products', JSON.stringify(initialProducts));
      return {
        success: false,
        message: 'Invalid data type, reset to default',
        productsCount: initialProducts.length,
        errors
      };
    }

    if (parsed.length === 0) {
      console.warn('⚠️ Saved products array is empty');
      errors.push('Saved products array is empty');
      localStorage.setItem('products', JSON.stringify(initialProducts));
      return {
        success: false,
        message: 'Empty array, reset to default',
        productsCount: initialProducts.length,
        errors
      };
    }

    // Проверка целостности данных
    const validProducts = parsed.filter((p: any, index: number) => {
      const hasId = p.id !== undefined && p.id !== null;
      const hasName = p.name && typeof p.name === 'string' && p.name.trim() !== '';
      const hasPrice = p.price !== undefined && p.price !== null && typeof p.price === 'number';
      const hasCategory = p.category && typeof p.category === 'string' && p.category.trim() !== '';
      
      if (!hasId) {
        console.warn(`⚠️ Product at index ${index} missing ID`);
        errors.push(`Product at index ${index} missing ID`);
      }
      if (!hasName) {
        console.warn(`⚠️ Product at index ${index} missing name`);
        errors.push(`Product at index ${index} missing name`);
      }
      if (!hasPrice) {
        console.warn(`⚠️ Product at index ${index} missing price`);
        errors.push(`Product at index ${index} missing price`);
      }
      if (!hasCategory) {
        console.warn(`⚠️ Product at index ${index} missing category`);
        errors.push(`Product at index ${index} missing category`);
      }
      
      return hasId && hasName && hasPrice && hasCategory;
    });

    if (validProducts.length !== parsed.length) {
      console.warn(`⚠️ ${parsed.length - validProducts.length} invalid products removed`);
      errors.push(`${parsed.length - validProducts.length} invalid products removed`);
      localStorage.setItem('products', JSON.stringify(validProducts));
    }

    // Проверка на дубликаты ID
    const uniqueIds = new Set(validProducts.map((p: any) => p.id));
    if (uniqueIds.size !== validProducts.length) {
      console.warn('⚠️ Duplicate product IDs detected');
      errors.push('Duplicate product IDs detected');
      
      // Удаление дубликатов
      const seen = new Set();
      const deduplicated = validProducts.filter((p: any) => {
        if (seen.has(p.id)) {
          return false;
        }
        seen.add(p.id);
        return true;
      });
      
      localStorage.setItem('products', JSON.stringify(deduplicated));
      console.log('✅ Deduplicated products:', deduplicated.length);
    }

    console.log(`✅ Migration complete. Valid products: ${validProducts.length}`);
    
    return {
      success: true,
      message: 'Migration complete',
      productsCount: validProducts.length,
      errors
    };
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    errors.push(error instanceof Error ? error.message : 'Unknown error');
    localStorage.setItem('products', JSON.stringify(initialProducts));
    
    return {
      success: false,
      message: 'Migration failed, reset to default',
      productsCount: initialProducts.length,
      errors
    };
  }
};

/**
 * Очистка всех данных о товарах
 */
export const clearProducts = (): void => {
  localStorage.removeItem('products');
  console.log('🗑️ Products cleared from localStorage');
};

/**
 * Экспорт данных о товарах
 */
export const exportProducts = (): string => {
  const saved = localStorage.getItem('products');
  if (!saved) {
    return JSON.stringify(initialProducts, null, 2);
  }
  return saved;
};

/**
 * Импорт данных о товарах
 */
export const importProducts = (jsonData: string): MigrationResult => {
  try {
    const parsed = JSON.parse(jsonData);
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid data format: expected array');
    }
    localStorage.setItem('products', JSON.stringify(parsed));
    window.dispatchEvent(new Event('products-updated'));
    return migrateProducts();
  } catch (error) {
    console.error('❌ Import error:', error);
    return {
      success: false,
      message: 'Import failed',
      productsCount: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
};