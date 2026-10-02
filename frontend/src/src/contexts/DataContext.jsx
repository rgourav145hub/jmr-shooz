import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  apiGetBrands, 
  apiGetProducts, 
  apiGetBanners, 
  apiGetQueries,
  apiGetCompanySettings
} from '../services/api';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [queries, setQueries] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const refreshBrands = useCallback(async () => {
    const data = await apiGetBrands();
    setBrands(data);
  }, []);

  const refreshProducts = useCallback(async () => {
    const data = await apiGetProducts();
    setProducts(data);
  }, []);

  const refreshBanners = useCallback(async () => {
    const data = await apiGetBanners();
    setBanners(data);
  }, []);

  const refreshQueries = useCallback(async () => {
    const data = await apiGetQueries();
    setQueries(data);
  }, []);

  const refreshSettings = useCallback(async () => {
    const data = await apiGetCompanySettings();
    setSettings(data);
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      refreshBrands(),
      refreshProducts(),
      refreshBanners(),
      refreshQueries(),
      refreshSettings()
    ]);
    setLoading(false);
  }, [refreshBrands, refreshProducts, refreshBanners, refreshQueries, refreshSettings]);

  useEffect(() => {
    refreshAll();

    const handleBrands = () => refreshBrands();
    const handleProducts = () => refreshProducts();
    const handleBanners = () => refreshBanners();
    const handleQueries = () => refreshQueries();
    const handleSettings = () => refreshSettings();

    window.addEventListener('jmr_brands_updated', handleBrands);
    window.addEventListener('jmr_products_updated', handleProducts);
    window.addEventListener('jmr_banners_updated', handleBanners);
    window.addEventListener('jmr_queries_updated', handleQueries);
    window.addEventListener('jmr_settings_updated', handleSettings);
    window.addEventListener('jmr_company_settings_updated', handleSettings);

    return () => {
      window.removeEventListener('jmr_brands_updated', handleBrands);
      window.removeEventListener('jmr_products_updated', handleProducts);
      window.removeEventListener('jmr_banners_updated', handleBanners);
      window.removeEventListener('jmr_queries_updated', handleQueries);
      window.removeEventListener('jmr_settings_updated', handleSettings);
      window.removeEventListener('jmr_company_settings_updated', handleSettings);
    };
  }, [refreshAll, refreshBrands, refreshProducts, refreshBanners, refreshQueries, refreshSettings]);

  const value = {
    brands,
    products,
    banners,
    queries,
    settings,
    refreshBrands,
    refreshProducts,
    refreshBanners,
    refreshQueries,
    refreshSettings,
    refreshAll,
    loading
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
