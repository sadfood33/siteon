// src/context/DeliveryContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { api } from '../services/api';

export interface DeliverySettings {
  freeDeliveryThreshold: number;
  deliveryFee: number;
  estimatedTime: string;
  isDeliveryEnabled: boolean;
  deliveryZones?: DeliveryZone[];
}

export interface DeliveryZone {
  id: number;
  name: string;
  fee: number;
  estimatedTime: string;
}

interface DeliveryContextType {
  settings: DeliverySettings;
  isLoading: boolean;
  updateSettings: (settings: Partial<DeliverySettings>) => Promise<void>;
  calculateDeliveryFee: (orderTotal: number, zoneId?: number) => number;
  isFreeDelivery: (orderTotal: number) => boolean;
  getAmountForFreeDelivery: (orderTotal: number) => number;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: DeliverySettings = {
  freeDeliveryThreshold: 1000,
  deliveryFee: 200,
  estimatedTime: '30-45 мин',
  isDeliveryEnabled: true,
  deliveryZones: [
    { id: 1, name: 'Центр города', fee: 0, estimatedTime: '20-30 мин' },
    { id: 2, name: 'Спальные районы', fee: 100, estimatedTime: '30-45 мин' },
    { id: 3, name: 'Пригород', fee: 200, estimatedTime: '45-60 мин' },
  ],
};

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export const DeliveryProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<DeliverySettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedSettings = await api.settings.getDelivery();
      setSettings(fetchedSettings);
      console.log('🚚 Loaded delivery settings from API');
    } catch (error) {
      console.error('Failed to load delivery settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSettings = useCallback(async (newSettings: Partial<DeliverySettings>) => {
    try {
      const updated = await api.settings.updateDelivery(newSettings);
      setSettings(updated);
    } catch (error) {
      console.error('Error updating delivery settings:', error);
      throw error;
    }
  }, []);

  const calculateDeliveryFee = useCallback((orderTotal: number, zoneId?: number): number => {
    if (!settings.isDeliveryEnabled) return 0;
    
    if (orderTotal >= settings.freeDeliveryThreshold) {
      return 0;
    }
    
    if (zoneId) {
      const zone = settings.deliveryZones?.find(z => z.id === zoneId);
      if (zone) return zone.fee;
    }
    
    return settings.deliveryFee;
  }, [settings]);

  const isFreeDelivery = useCallback((orderTotal: number): boolean => {
    return orderTotal >= settings.freeDeliveryThreshold;
  }, [settings]);

  const getAmountForFreeDelivery = useCallback((orderTotal: number): number => {
    const remaining = settings.freeDeliveryThreshold - orderTotal;
    return remaining > 0 ? remaining : 0;
  }, [settings]);

  const refreshSettings = useCallback(async () => {
    await loadSettings();
  }, [loadSettings]);

  return (
    <DeliveryContext.Provider value={{ 
      settings, 
      isLoading,
      updateSettings, 
      calculateDeliveryFee, 
      isFreeDelivery,
      getAmountForFreeDelivery,
      refreshSettings
    }}>
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDelivery = () => {
  const context = useContext(DeliveryContext);
  if (!context) throw new Error('useDelivery must be used within a DeliveryProvider');
  return context;
};