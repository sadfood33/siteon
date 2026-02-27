import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useProducts } from '../context/ProductContext';
import { api } from '../services/api';
import { Order } from '../types/db';
import {
  User, Package, MapPin, Settings, LogOut, XCircle,
  Heart, Utensils, Star, Trash2, Plus, Eye, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';

type Tab = 'orders' | 'addresses' | 'settings' | 'favorites';

export const ProfilePage = () => {
  const { user, logout, updateProfile } = useAuth();
  const { showToast } = useToast();
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Address Form State
  const [newAddress, setNewAddress] = useState({ title: '', city: '', street: '', house: '' });
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });

  // Get favorite products
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || '', phone: user.phone || '' });
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await api.user.getOrders(user.id);
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
    } catch (error) {
      // Error handled in context
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await api.user.addAddress(user.id, newAddress);
      showToast('Адрес добавлен', 'success');
      setIsAddingAddress(false);
      setNewAddress({ title: '', city: '', street: '', house: '' });
      await updateProfile({});
    } catch (error) {
      showToast('Ошибка добавления адреса', 'error');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return 'text-green-500 bg-green-500/10';
      case 'cancelled': return 'text-red-500 bg-red-500/10';
      case 'processing': return 'text-yellow-500 bg-yellow-500/10';
      case 'cooking': return 'text-orange-500 bg-orange-500/10';
      case 'delivering': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return 'Доставлен';
      case 'cancelled': return 'Отменен';
      case 'processing': return 'В обработке';
      case 'cooking': return 'Готовится';
      case 'delivering': return 'В пути';
      default: return status;
    }
  };

  if (!user) {
    navigate('/');
    return null;
  }

  const tabs = [
    { id: 'orders' as Tab, label: 'Заказы', icon: Package, count: orders.length },
    { id: 'favorites' as Tab, label: 'Избранное', icon: Heart, count: favorites.length },
    { id: 'addresses' as Tab, label: 'Адреса', icon: MapPin, count: user.addresses?.length || 0 },
    { id: 'settings' as Tab, label: 'Настройки', icon: Settings },
  ];

  return (
    <MainLayout
      showBreadcrumbs
      breadcrumbs={[{ label: 'Личный кабинет' }]}
    >
      <div className="p-4 md:p-6 lg:p-8">
        {/* User Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#1a1a1a] to-[#222] rounded-3xl p-6 md:p-8 border border-gray-800 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00ff00] to-green-700 rounded-2xl flex items-center justify-center text-3xl font-bold text-black shadow-lg shadow-green-500/20">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">{user.name || 'Пользователь'}</h1>
                <p className="text-gray-400">{user.email}</p>
                {user.role === 'admin' && (
                  <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full">
                    <Star size={12} />
                    Администратор
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/catalog"
                className="flex items-center gap-2 px-5 py-3 bg-[#00ff00] text-black font-bold rounded-xl hover:bg-[#00cc00] transition-all hover:scale-105"
              >
                <Utensils size={18} />
                Перейти в каталог
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 transition-all hover:scale-105"
                >
                  <Settings size={18} />
                  Админ-панель
                </Link>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-black/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#00ff00]">{orders.length}</div>
              <div className="text-gray-500 text-sm">Заказов</div>
            </div>
            <div className="bg-black/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-pink-500">{favorites.length}</div>
              <div className="text-gray-500 text-sm">В избранном</div>
            </div>
            <div className="bg-black/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{user.addresses?.length || 0}</div>
              <div className="text-gray-500 text-sm">Адресов</div>
            </div>
            <div className="bg-black/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-500">
                {orders.reduce((sum, o) => sum + o.total, 0)} ₽
              </div>
              <div className="text-gray-500 text-sm">Всего потрачено</div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                  ? 'bg-[#00ff00] text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id ? 'bg-black/20 text-black' : 'bg-gray-700 text-gray-300'
                  }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {isLoading ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="animate-spin w-8 h-8 border-2 border-[#00ff00] border-t-transparent rounded-full mx-auto mb-4"></div>
                  Загрузка...
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 bg-[#1a1a1a] rounded-3xl border border-gray-800">
                  <Package size={64} className="mx-auto text-gray-700 mb-4" />
                  <p className="text-gray-400 text-lg mb-6">У вас пока нет заказов</p>
                  <Link
                    to="/catalog"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff00] text-black font-bold rounded-xl hover:bg-[#00cc00] transition-colors"
                  >
                    <Utensils size={18} />
                    Перейти в каталог
                  </Link>
                </div>
              ) : (
                orders.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors"
                  >
                    <div className="p-6 border-b border-gray-800 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono font-bold text-lg">#{order.id}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">{order.total} ₽</p>
                        <p className="text-sm text-gray-500">{order.items.length} товаров</p>
                      </div>
                    </div>
                    <div className="p-6 bg-[#121212]">
                      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex-shrink-0 w-24">
                            <div className="aspect-square rounded-xl bg-gray-800 mb-2 overflow-hidden">
                              {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                            </div>
                            <p className="text-xs text-gray-400 truncate">{item.name}</p>
                            <p className="text-xs text-white font-bold">x{item.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {favoriteProducts.length === 0 ? (
                <div className="text-center py-16 bg-[#1a1a1a] rounded-3xl border border-gray-800">
                  <Heart size={64} className="mx-auto text-gray-700 mb-4" />
                  <p className="text-gray-400 text-lg mb-6">В избранном пока ничего нет</p>
                  <Link
                    to="/catalog"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff00] text-black font-bold rounded-xl hover:bg-[#00cc00] transition-colors"
                  >
                    <Utensils size={18} />
                    Перейти в каталог
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden group hover:border-gray-700 transition-all"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <button
                          onClick={() => toggleFavorite(product.id)}
                          className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-[#00ff00]">{product.price} ₽</span>
                          <div className="flex gap-2">
                            <Link
                              to={`/catalog?search=${encodeURIComponent(product.name)}`}
                              className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                              <Eye size={18} />
                            </Link>
                            <button
                              onClick={() => {
                                addToCart(product);
                              }}
                              className="p-2 bg-[#00ff00] text-black rounded-lg hover:bg-[#00cc00] transition-colors"
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <motion.div
              key="addresses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Мои адреса</h2>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className={`px-4 py-2 font-bold rounded-xl transition-colors ${isAddingAddress
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-[#00ff00] text-black hover:bg-[#00cc00]'
                    }`}
                >
                  {isAddingAddress ? 'Отмена' : 'Добавить адрес'}
                </button>
              </div>

              <AnimatePresence>
                {isAddingAddress && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleAddAddress}
                    className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 mb-8 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        placeholder="Название (напр. Дом)"
                        value={newAddress.title}
                        onChange={e => setNewAddress({ ...newAddress, title: e.target.value })}
                        className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:border-[#00ff00] outline-none transition-colors"
                        required
                      />
                      <input
                        placeholder="Город"
                        value={newAddress.city}
                        onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:border-[#00ff00] outline-none transition-colors"
                        required
                      />
                      <input
                        placeholder="Улица"
                        value={newAddress.street}
                        onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:border-[#00ff00] outline-none transition-colors"
                        required
                      />
                      <input
                        placeholder="Дом/Квартира"
                        value={newAddress.house}
                        onChange={e => setNewAddress({ ...newAddress, house: e.target.value })}
                        className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-white focus:border-[#00ff00] outline-none transition-colors"
                        required
                      />
                    </div>
                    <button type="submit" className="w-full py-4 bg-[#00ff00] text-black font-bold rounded-xl hover:bg-[#00cc00] transition-colors">
                      Сохранить адрес
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {(!user.addresses || user.addresses.length === 0) && !isAddingAddress ? (
                <div className="text-center py-16 bg-[#1a1a1a] rounded-3xl border border-gray-800">
                  <MapPin size={64} className="mx-auto text-gray-700 mb-4" />
                  <p className="text-gray-400 text-lg mb-6">Нет сохраненных адресов</p>
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff00] text-black font-bold rounded-xl hover:bg-[#00cc00] transition-colors"
                  >
                    <Plus size={18} />
                    Добавить адрес
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses?.map((addr, idx) => (
                    <motion.div
                      key={addr.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 relative group hover:border-gray-700 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#00ff00]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MapPin className="text-[#00ff00]" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{addr.title}</h3>
                          <p className="text-gray-400">{addr.city}, {addr.street}, {addr.house}</p>
                        </div>
                        <button
                          onClick={async () => {
                            await api.user.removeAddress(user.id, addr.id);
                            showToast('Адрес удален', 'info');
                            await updateProfile({});
                          }}
                          className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-2xl font-bold mb-6">Настройки профиля</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <form onSubmit={handleUpdateProfile} className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800">
                  <h3 className="text-xl font-bold mb-6">Личные данные</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-gray-400 text-sm font-medium">Ваше имя</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#00ff00] outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-400 text-sm font-medium">Телефон</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">📞</span>
                        <input
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          placeholder="+7 (999) 000-00-00"
                          className="w-full bg-gray-800 border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white focus:border-[#00ff00] outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-gray-400 text-sm font-medium">Email</label>
                      <input
                        value={user.email}
                        disabled
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl py-4 px-4 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-600">Email изменить нельзя</p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#00ff00] text-black font-bold rounded-xl hover:bg-[#00cc00] transition-colors"
                    >
                      Сохранить изменения
                    </button>
                  </div>
                </form>

                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
                    <h3 className="text-xl font-bold mb-4">Быстрые действия</h3>
                    <div className="space-y-3">
                      <Link
                        to="/catalog"
                        className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                      >
                        <div className="w-10 h-10 bg-[#00ff00]/10 rounded-lg flex items-center justify-center">
                          <Utensils size={20} className="text-[#00ff00]" />
                        </div>
                        <div>
                          <p className="font-medium">Каталог товаров</p>
                          <p className="text-sm text-gray-500">Выбрать блюда для заказа</p>
                        </div>
                        <ChevronRight size={20} className="ml-auto text-gray-500" />
                      </Link>
                      <Link
                        to="/#delivery"
                        className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                      >
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                          <Package size={20} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">Информация о доставке</p>
                          <p className="text-sm text-gray-500">Условия и сроки доставки</p>
                        </div>
                        <ChevronRight size={20} className="ml-auto text-gray-500" />
                      </Link>
                    </div>
                  </div>

                  {/* Logout */}
                  <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/20">
                    <h3 className="text-xl font-bold mb-2 text-red-400">Выход из аккаунта</h3>
                    <p className="text-gray-500 mb-4">Вы можете выйти из своего аккаунта. Данные корзины сохранятся.</p>
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500/20 transition-colors"
                    >
                      <LogOut size={18} />
                      Выйти из аккаунта
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};
