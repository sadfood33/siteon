// src/pages/AdminPage.tsx
import { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useProducts } from '../context/ProductContext';
import { useDelivery } from '../context/DeliveryContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Product } from '../data/products';
import { ProductFormModal } from '../components/admin/ProductFormModal';
import { CategoryFormModal } from '../components/admin/CategoryFormModal';
import { Plus, Edit, Trash2, Package, Search, Truck, Settings, ShoppingBag, Layers, Mail, Shield, Bell, RefreshCw, CheckCircle, User, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCategories } from '../context/CategoryContext';
import { Category, EmailSettings } from '../types/db';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// 🔧 TYPE DEFINITIONS
// ============================================

type AdminTab = 'products' | 'categories' | 'delivery' | 'email';

// ============================================
// 📄 MAIN COMPONENT
// ============================================

export const AdminPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { settings, updateSettings } = useDelivery();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  // Delivery settings form
  const [deliveryForm, setDeliveryForm] = useState({
    freeDeliveryThreshold: settings.freeDeliveryThreshold,
    deliveryFee: settings.deliveryFee,
    estimatedTime: settings.estimatedTime,
    isDeliveryEnabled: settings.isDeliveryEnabled
  });

  // Email settings form
  const [emailForm, setEmailForm] = useState<EmailSettings | null>(null);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'email' && !emailForm) {
      loadEmailSettings();
    }
  }, [activeTab]);

  const loadEmailSettings = async () => {
    setIsEmailLoading(true);
    try {
      const data = await api.admin.getEmailSettings();
      setEmailForm(data);
    } catch (error) {
      showToast('Ошибка загрузки настроек почты', 'error');
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleEmailSettingsSave = async () => {
    if (!emailForm) return;
    try {
      await api.admin.saveEmailSettings(emailForm);
      showToast('Настройки почты сохранены', 'success');
    } catch (error) {
      showToast('Ошибка сохранения настроек', 'error');
    }
  };

  // ============================================
  // 🔐 ADMIN PROTECTION
  // ============================================

  if (!user || user.role !== 'admin') {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center flex-col gap-4 text-center p-8">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <Package size={48} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-red-500">Доступ запрещен</h1>
          <p className="text-gray-400 max-w-md">У вас нет прав для просмотра этой страницы. Войдите как администратор.</p>
          <Link to="/" className="mt-4 px-6 py-3 bg-[#00ff00] text-black font-bold rounded-xl hover:bg-[#00cc00] transition-colors">
            Вернуться на главную
          </Link>
        </div>
      </MainLayout>
    );
  }

  // ============================================
  // 📝 HANDLERS
  // ============================================

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      deleteProduct(id);
      showToast('Товар удален', 'success');
    }
  };

  // В AdminPage.tsx замените handleSave на:

const handleSave = async (productData: Product | Omit<Product, 'id'>) => {
  try {
    console.log('💾 AdminPage: Saving product', productData);
    
    if ('id' in productData) {
      await updateProduct(productData as Product);
      console.log('✏️ Product updated:', (productData as Product).id);
    } else {
      await addProduct(productData as Omit<Product, 'id'>);
      console.log('➕ Product added');
    }
    
    // Продукты автоматически перезагрузятся через context
    setIsModalOpen(false);
    setEditingProduct(undefined);
  } catch (error) {
    console.error('❌ Error saving product:', error);
    // Ошибка уже обработана в context
  }
};
  const handleCategorySave = (categoryData: Category | Omit<Category, 'id'>) => {
    if ('id' in categoryData) {
      updateCategory(categoryData);
    } else {
      addCategory(categoryData);
    }
    setIsCategoryModalOpen(false);
    setEditingCategory(undefined);
  };

  const handleCategoryDelete = (id: string) => {
    const categoryName = categories.find(c => c.id === id)?.name;
    const hasProducts = products.some(p => p.category === categoryName);
    
    if (hasProducts) {
      showToast('Нельзя удалить категорию, в которой есть товары', 'error');
      return;
    }

    if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      deleteCategory(id);
    }
  };

  const handleDeliverySettingsSave = () => {
    updateSettings(deliveryForm);
    showToast('Настройки доставки сохранены', 'success');
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ============================================
  // 📄 RENDER
  // ============================================

  return (
    <MainLayout
      showBreadcrumbs
      breadcrumbs={[{ label: 'Админ-панель' }]}
      title="Панель управления"
    >
      <div className="p-4 md:p-6 lg:p-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-[#00ff00] text-black'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <ShoppingBag size={20} />
            Товары
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'categories'
                ? 'bg-[#00ff00] text-black'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Layers size={20} />
            Категории
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'delivery'
                ? 'bg-[#00ff00] text-black'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Truck size={20} />
            Доставка
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'email'
                ? 'bg-[#00ff00] text-black'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            <Mail size={20} />
            Почта
          </button>
        </div>

        {/* ============================================ */}
        {/* PRODUCTS TAB */}
        {/* ============================================ */}
        {activeTab === 'products' && (
          <>
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-[#00ff00] outline-none transition-colors"
                />
              </div>
              <button
                onClick={() => {
                  setEditingProduct(undefined);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-[#00ff00] text-black font-bold rounded-xl hover:bg-[#00cc00] transition-colors whitespace-nowrap"
              >
                <Plus size={20} />
                Добавить товар
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
                <p className="text-gray-500 text-sm">Всего товаров</p>
                <p className="text-2xl font-bold text-white">{products.length}</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
                <p className="text-gray-500 text-sm">Категорий</p>
                <p className="text-2xl font-bold text-white">{new Set(products.map(p => p.category)).size}</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
                <p className="text-gray-500 text-sm">Мин. цена</p>
                <p className="text-2xl font-bold text-[#00ff00]">{products.length > 0 ? Math.min(...products.map(p => p.price)) : 0} ₽</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800">
                <p className="text-gray-500 text-sm">Макс. цена</p>
                <p className="text-2xl font-bold text-orange-500">{products.length > 0 ? Math.max(...products.map(p => p.price)) : 0} ₽</p>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-900 border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                      <th className="p-4">ID</th>
                      <th className="p-4">Фото</th>
                      <th className="p-4">Название</th>
                      <th className="p-4 hidden md:table-cell">Категория</th>
                      <th className="p-4">Цена</th>
                      <th className="p-4 text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="p-4 text-gray-500 font-mono">#{product.id}</td>
                        <td className="p-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        </td>
                        <td className="p-4">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500 md:hidden">{product.category}</p>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-bold text-gray-300 border border-gray-700">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-[#00ff00]">{product.price} ₽</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                              title="Редактировать"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                              title="Удалить"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Package size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Товары не найдены</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ============================================ */}
        {/* CATEGORIES TAB */}
        {/* ============================================ */}
        {activeTab === 'categories' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Управление категориями</h2>
              <button
                onClick={() => {
                  setEditingCategory(undefined);
                  setIsCategoryModalOpen(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-[#00ff00] text-black font-bold rounded-xl hover:bg-[#00cc00] transition-colors"
              >
                <Plus size={20} />
                Добавить категорию
              </button>
            </div>

            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-900 border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                      <th className="p-4">Иконка</th>
                      <th className="p-4">Название</th>
                      <th className="p-4">Slug</th>
                      <th className="p-4 text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="p-4 text-2xl">{cat.icon}</td>
                        <td className="p-4 font-medium">{cat.name}</td>
                        <td className="p-4 text-gray-400 font-mono text-sm">{cat.slug}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingCategory(cat);
                                setIsCategoryModalOpen(true);
                              }}
                              className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleCategoryDelete(cat.id)}
                              className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ============================================ */}
        {/* DELIVERY TAB */}
        {/* ============================================ */}
        {activeTab === 'delivery' && (
          <div className="max-w-2xl">
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#00ff00]/10 rounded-xl flex items-center justify-center">
                  <Settings size={24} className="text-[#00ff00]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Настройки доставки</h2>
                  <p className="text-sm text-gray-400">Управление условиями доставки</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Enable/Disable Delivery */}
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                  <div>
                    <p className="font-medium text-white">Доставка включена</p>
                    <p className="text-sm text-gray-400">Показывать опцию доставки клиентам</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deliveryForm.isDeliveryEnabled}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, isDeliveryEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#00ff00]"></div>
                  </label>
                </div>

                {/* Delivery Fee */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Стоимость доставки (₽)
                  </label>
                  <input
                    type="number"
                    value={deliveryForm.deliveryFee}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryFee: Number(e.target.value) })}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00ff00] transition-colors"
                    min="0"
                    step="10"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Стоимость доставки для заказов ниже порога бесплатной доставки
                  </p>
                </div>

                {/* Free Delivery Threshold */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Порог бесплатной доставки (₽)
                  </label>
                  <input
                    type="number"
                    value={deliveryForm.freeDeliveryThreshold}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, freeDeliveryThreshold: Number(e.target.value) })}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00ff00] transition-colors"
                    min="0"
                    step="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    При заказе на эту сумму и выше доставка будет бесплатной
                  </p>
                </div>

                {/* Estimated Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Примерное время доставки
                  </label>
                  <input
                    type="text"
                    value={deliveryForm.estimatedTime}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, estimatedTime: e.target.value })}
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00ff00] transition-colors"
                    placeholder="30-45 мин"
                  />
                </div>

                {/* Current Settings Preview */}
                <div className="p-4 bg-gradient-to-r from-[#00ff00]/10 to-transparent rounded-xl border border-[#00ff00]/20">
                  <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <Truck size={18} className="text-[#00ff00]" />
                    Текущие условия
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between text-gray-300">
                      <span>Заказ менее {deliveryForm.freeDeliveryThreshold} ₽:</span>
                      <span className="font-bold text-orange-400">+{deliveryForm.deliveryFee} ₽</span>
                    </li>
                    <li className="flex justify-between text-gray-300">
                      <span>Заказ от {deliveryForm.freeDeliveryThreshold} ₽:</span>
                      <span className="font-bold text-[#00ff00]">Бесплатно</span>
                    </li>
                    <li className="flex justify-between text-gray-300">
                      <span>Время доставки:</span>
                      <span className="font-bold text-white">{deliveryForm.estimatedTime}</span>
                    </li>
                  </ul>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleDeliverySettingsSave}
                  className="w-full bg-[#00ff00] text-black font-bold py-4 rounded-xl hover:bg-[#00cc00] transition-colors"
                >
                  Сохранить настройки
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* EMAIL TAB */}
        {/* ============================================ */}
        {activeTab === 'email' && (
          <div className="max-w-4xl">
            {isEmailLoading && !emailForm ? (
              <div className="py-20 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-[#00ff00] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Загрузка настроек...</p>
              </div>
            ) : emailForm ? (
              <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <Mail size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Настройка почтовых уведомлений</h2>
                    <p className="text-sm text-gray-400">SMTP и правила отправки писем</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* SMTP Settings */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Shield size={20} className="text-gray-400" />
                      Настройки сервера (SMTP)
                    </h3>
                  
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">SMTP Сервер</label>
                        <input
                          type="text"
                          value={emailForm.smtpHost}
                          onChange={(e) => setEmailForm({ ...emailForm, smtpHost: e.target.value })}
                          className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00ff00] transition-colors"
                          placeholder="smtp.yandex.ru"
                        />
                      </div>
                    
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Порт</label>
                          <input
                            type="number"
                            value={emailForm.smtpPort}
                            onChange={(e) => setEmailForm({ ...emailForm, smtpPort: Number(e.target.value) })}
                            className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00ff00] transition-colors"
                          />
                        </div>
                        <div className="flex items-end pb-3">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={emailForm.useSSL}
                              onChange={(e) => setEmailForm({ ...emailForm, useSSL: e.target.checked })}
                              className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-[#00ff00] focus:ring-[#00ff00]/50"
                            />
                            <span className="text-sm text-gray-400 flex items-center gap-1">
                              <Shield size={14} /> SSL/TLS
                            </span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Пользователь (Login)</label>
                        <input
                          type="text"
                          value={emailForm.smtpUser}
                          onChange={(e) => setEmailForm({ ...emailForm, smtpUser: e.target.value })}
                          className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00ff00] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Пароль / Токен</label>
                        <input
                          type="password"
                          value={emailForm.smtpPass}
                          onChange={(e) => setEmailForm({ ...emailForm, smtpPass: e.target.value })}
                          className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00ff00] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notification Rules */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Bell size={20} className="text-gray-400" />
                      Правила отправки
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Почта для приема заявок</label>
                        <input
                          type="email"
                          value={emailForm.adminEmail}
                          onChange={(e) => setEmailForm({ ...emailForm, adminEmail: e.target.value })}
                          className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00ff00] transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1">Сюда будут приходить уведомления о новых заказах</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Имя отправителя</label>
                        <input
                          type="text"
                          value={emailForm.senderName}
                          onChange={(e) => setEmailForm({ ...emailForm, senderName: e.target.value })}
                          className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00ff00] transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1">Будет отображаться в письме у покупателя</p>
                      </div>

                      <div className="pt-4 space-y-3">
                        <label className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                          <span className="text-sm text-gray-300">Уведомлять о новых заказах</span>
                          <input
                            type="checkbox"
                            checked={emailForm.notificationOnNewOrder}
                            onChange={(e) => setEmailForm({ ...emailForm, notificationOnNewOrder: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-[#00ff00] focus:ring-[#00ff00]/50"
                          />
                        </label>
                      
                        <label className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                          <span className="text-sm text-gray-300">Отправлять письмо покупателю</span>
                          <input
                            type="checkbox"
                            checked={emailForm.welcomeEmailEnabled}
                            onChange={(e) => setEmailForm({ ...emailForm, welcomeEmailEnabled: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-[#00ff00] focus:ring-[#00ff00]/50"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mt-12 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                  <div className="flex gap-4">
                    <div className="p-2 bg-yellow-500/10 rounded-lg flex-shrink-0">
                      <Shield className="text-yellow-500" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-yellow-500 mb-1">Режим симуляции</h4>
                      <p className="text-sm text-gray-400">
                        В данной версии сайта отправка писем симулируется в консоль браузера. 
                        Настройки SMTP сохраняются локально, но реальное соединение не устанавливается.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleEmailSettingsSave}
                    className="w-full md:w-auto px-12 py-4 bg-[#00ff00] text-black font-bold rounded-xl hover:bg-[#00cc00] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Сохранить настройки почты
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Modals */}
      {isModalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
        />
      )}

      {isCategoryModalOpen && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => setIsCategoryModalOpen(false)}
          onSubmit={handleCategorySave}
        />
      )}
    </MainLayout>
  );
};