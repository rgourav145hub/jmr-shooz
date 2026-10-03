import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getStoredWishlist, saveStoredWishlist } from '../utils/storage';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => getStoredWishlist());
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    const handleWishlistSync = () => {
      setWishlistItems(getStoredWishlist());
    };
    window.addEventListener('jmr_wishlist_updated', handleWishlistSync);
    window.addEventListener('storage', handleWishlistSync);
    return () => {
      window.removeEventListener('jmr_wishlist_updated', handleWishlistSync);
      window.removeEventListener('storage', handleWishlistSync);
    };
  }, []);

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistItems.some(item => (item.id === productId || item.productId === productId));
  };

  const addToWishlist = (product) => {
    if (!product || !product.id) return;
    if (isInWishlist(product.id)) return;

    const newItem = {
      id: product.id,
      productId: product.id,
      name: product.name,
      brandName: product.brandName,
      brandId: product.brandId,
      category: product.category,
      image: product.image,
      sku: product.sku,
      pairsPerSet: product.pairsPerSet || 12,
      moq: product.moq || '1 Set',
      cartonSize: product.cartonSize || 'Carton Pack',
      suggestedRetailPrice: product.suggestedRetailPrice,
      wholesaleRate: product.wholesaleRate,
      colors: product.colors || [product.color || 'Classic Black'],
      color: product.color || 'Classic Black',
      sizeCurve: product.sizeCurve || product.sizeRange || 'Full Curve',
      tag: product.tag,
      addedAt: new Date().toISOString()
    };

    const updated = [newItem, ...wishlistItems];
    setWishlistItems(updated);
    saveStoredWishlist(updated);
    return true;
  };

  const removeFromWishlist = (productId) => {
    if (!productId) return;
    const updated = wishlistItems.filter(item => item.id !== productId && item.productId !== productId);
    setWishlistItems(updated);
    saveStoredWishlist(updated);
  };

  const toggleWishlist = (product) => {
    if (!product || !product.id) return { added: false };
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      return { added: false, product };
    } else {
      addToWishlist(product);
      return { added: true, product };
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    saveStoredWishlist([]);
  };

  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);

  const totalWishlist = useMemo(() => wishlistItems.length, [wishlistItems]);

  const value = {
    wishlistItems,
    isWishlistOpen,
    openWishlist,
    closeWishlist,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    totalWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
