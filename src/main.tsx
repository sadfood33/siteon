// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { migrateProducts } from './utils/migrateProducts';

// ============================================
// 🚀 APPLICATION INITIALIZATION
// ============================================

console.log('🚀 S.A.D. FOOD Application Starting...');
console.log('📅 Build Time:', new Date().toLocaleString('ru-RU'));
console.log('🌐 URL:', window.location.href);
console.log('📱 User Agent:', navigator.userAgent);

// ============================================
// 🗄️ DATABASE MIGRATION
// ============================================

console.log('🔧 Running products migration...');
const migrationResult = migrateProducts();

if (migrationResult.success) {
  console.log('✅ Migration successful:', migrationResult.message);
  console.log('📦 Products count:', migrationResult.productsCount);
  
  if (migrationResult.errors.length > 0) {
    console.warn('⚠️ Migration warnings:', migrationResult.errors);
  }
} else {
  console.error('❌ Migration failed:', migrationResult.message);
  console.error('📋 Errors:', migrationResult.errors);
}

// ============================================
// 🎨 REACT RENDER
// ============================================

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Root element not found. Make sure there is a div with id="root" in your HTML.');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

console.log('✅ React app rendered successfully');

// ============================================
// 📲 SERVICE WORKER REGISTRATION
// ============================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ SW registered:', registration.scope);
        
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 New content available, please refresh');
              }
            });
          }
        });
      })
      .catch((err) => {
        console.log('❌ SW registration failed:', err);
      });
  });
} else {
  console.warn('⚠️ Service workers not supported in this browser');
}

// ============================================
// 📊 PERFORMANCE MONITORING
// ============================================

if ('PerformanceObserver' in window) {
  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log('⚡ Performance:', entry.name, entry.startTime, 'ms');
      });
    });
    
    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
  } catch (error) {
    console.warn('⚠️ Performance monitoring not available:', error);
  }
}

// ============================================
// 🛡️ ERROR HANDLING
// ============================================

window.addEventListener('error', (event) => {
  console.error('💥 Global error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('💥 Unhandled promise rejection:', event.reason);
});

console.log('🎉 Application initialization complete');