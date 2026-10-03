import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { getStoredWishlist, saveStoredWishlist } from '../utils/storage';
import { useAuth } from './AuthContext';
import { 
  apiGetWishlist, 
  apiAddToWishlist, 
  apiRemoveFromWishlist, 
  apiSyncWishlist, 
  apiClearWishlist 
} from '../services/api';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { currentUser } = useAuth();
  const [wishlistItems, setWishlistItems] = useState(() => getStoredWishlist());
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const initialSyncDoneRef = useRef(false);

  // Compute active user identifier for database record
  const currentUserId = useMemo(() => {
    return currentUser?.retailerId || currentUser?.id || currentUser?.email || 'guest';
  }, [currentUser]);

  // Sync with Database when User logs in or App mounts
  useEffect(() => {
    let isMounted = true;

    async function syncWithDatabase() {
      try {
        const localItems = getStoredWishlist();
        // Fetch from database
        const dbItems = await apiGetWishlist(currentUserId);

        if (!isMounted) return;

        if (Array.isArray(dbItems) && dbItems.length > 0) {
          // Merge local and db items avoiding duplicates
          const mergedMap = new Map();
          dbItems.forEach(item => {
            const key = item.id || item.productId;
            if (key) mergedMap.set(key, item);
          });
          localItems.forEach(item => {
            const key = item.id || item.productId;
            if (key && !mergedMap.has(key)) mergedMap.set(key, item);
          });

          const merged = Array.from(mergedMap.values());
          setWishlistItems(merged);
          saveStoredWishlist(merged);

          // Push merged back to DB to ensure parity
          if (localItems.length > 0) {
            apiSyncWishlist(currentUserId, merged).catch(() => {});
          }
        } else if (localItems.length > 0) {
          // If DB has no items yet, upload local items to database
          apiSyncWishlist(currentUserId, localItems).catch(() => {});
        }
      } catch (err) {
        console.warn('Wishlist DB sync note:', err.message);
      }
    }

    syncWithDatabase();

    return () => {
      isMounted = false;
    };
  }, [currentUserId]);

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

    // Persist to database in background
    apiAddToWishlist(currentUserId, newItem).catch(err => {
      console.warn('Failed to persist wishlist item to database:', err.message);
    });

    return true;
  };

  const removeFromWishlist = (productId) => {
    if (!productId) return;
    const updated = wishlistItems.filter(item => item.id !== productId && item.productId !== productId);
    setWishlistItems(updated);
    saveStoredWishlist(updated);

    // Delete from database in background
    apiRemoveFromWishlist(currentUserId, productId).catch(err => {
      console.warn('Failed to delete wishlist item from database:', err.message);
    });
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

    // Clear database in background
    apiClearWishlist(currentUserId).catch(() => {});
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
