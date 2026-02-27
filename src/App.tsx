// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ProductProvider } from './context/ProductContext';
import { CategoryProvider } from './context/CategoryContext';
import { DeliveryProvider } from './context/DeliveryContext';
import { PWAProvider } from './context/PWAContext';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { AdminPage } from './pages/AdminPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ScrollToHash } from './components/ScrollToHash';
import { PrivateRoute } from './components/PrivateRoute';
import { InstallPWA } from './components/InstallPWA';
import { ProductSync } from './components/ProductSync';

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <ToastProvider>
        <PWAProvider>
          <AuthProvider>
            <FavoritesProvider>
              <ProductProvider>
                {/* Компонент синхронизации товаров */}
                <ProductSync />
                <CategoryProvider>
                  <DeliveryProvider>
                    <CartProvider>
                      <div className="min-h-screen bg-[#0a0a0a] text-white">
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/catalog" element={<CatalogPage />} />
                          <Route path="/auth" element={<AuthPage />} />
                          
                          <Route 
                            path="/admin" 
                            element={
                              <PrivateRoute adminOnly>
                                <AdminPage />
                              </PrivateRoute>
                            } 
                          />
                          
                          <Route 
                            path="/profile" 
                            element={
                              <PrivateRoute>
                                <ProfilePage />
                              </PrivateRoute>
                            } 
                          />
                        </Routes>
                        <AuthModal />
                        <CartDrawer />
                        <CheckoutModal />
                        <InstallPWA />
                      </div>
                    </CartProvider>
                  </DeliveryProvider>
                </CategoryProvider>
              </ProductProvider>
            </FavoritesProvider>
          </AuthProvider>
        </PWAProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export { App };