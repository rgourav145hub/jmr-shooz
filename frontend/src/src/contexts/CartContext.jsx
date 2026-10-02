import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getStoredCart, saveStoredCart } from '../utils/storage';
import { getProductMrp } from '../utils/pricing';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => getStoredCart());
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleCartSync = () => {
      setCartItems(getStoredCart());
    };
    window.addEventListener('jmr_cart_updated', handleCartSync);
    window.addEventListener('storage', handleCartSync);
    return () => {
      window.removeEventListener('jmr_cart_updated', handleCartSync);
      window.removeEventListener('storage', handleCartSync);
    };
  }, []);

  // Rule: Only MRP displayed, calculated strictly by MRP
  const parseWholesalePrice = (product) => {
    return getProductMrp(product);
  };

  const addToCart = (product, setsCount = 1, options = {}) => {
    const sets = Math.max(1, parseInt(setsCount, 10) || 1);
    const ratePerPair = getProductMrp(product);
    const pairsPerSet = parseInt(product.pairsPerSet, 10) || 12;
    const ratePerSet = pairsPerSet * ratePerPair;
    const selectedColor = options.color || product.selectedColor || (Array.isArray(product.colors) && product.colors.length > 0 ? product.colors[0] : (product.color || 'Classic Black / Assorted'));
    const itemSpecification = (options.specification || options.notes || product.specification || '').trim();

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => 
        (item.productId === product.id || item.id === product.id) &&
        (item.color === selectedColor || item.selectedColor === selectedColor)
      );
      let updated;
      if (existingIndex > -1) {
        updated = [...prev];
        const newSets = updated[existingIndex].quantity + sets;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newSets,
          sets: newSets,
          pairsPerSet,
          ratePerPair,
          ratePerSet,
          totalPairs: newSets * pairsPerSet,
          subtotal: newSets * ratePerSet,
          color: selectedColor,
          selectedColor,
          specification: itemSpecification || updated[existingIndex].specification || ''
        };
      } else {
        const cartItemId = `${product.id}-${selectedColor.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        const newItem = {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          brandName: product.brandName || 'Brand Footwear',
          sku: product.sku || `JMR-${product.id}`,
          image: product.image,
          color: selectedColor,
          selectedColor: selectedColor,
          specification: itemSpecification,
          pairsPerSet,
          sizeCurve: product.sizeCurve || `UK 6-10 (Standard ${pairsPerSet} Pairs Curve)`,
          ratePerPair,
          ratePerSet,
          wholesaleRate: ratePerPair,
          mrp: ratePerPair,
          retailPrice: `₹${ratePerPair}`,
          quantity: sets,
          sets,
          totalPairs: sets * pairsPerSet,
          subtotal: sets * ratePerSet,
          category: product.category || 'Footwear',
          moq: `1 Set (${pairsPerSet} Pairs)`,
          selectedSize: options.size || product.sizeRange || `Set of ${pairsPerSet} Pairs`
        };
        updated = [newItem, ...prev];
      }
      saveStoredCart(updated);
      return updated;
    });
  };

  const updateItemSpecification = (cartItemId, newSpecification) => {
    setCartItems(prev => {
      const updated = prev.map(item => {
        if (item.id === cartItemId || item.productId === cartItemId) {
          return { ...item, specification: newSpecification };
        }
        return item;
      });
      saveStoredCart(updated);
      return updated;
    });
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    setCartItems(prev => {
      let updated;
      if (qty <= 0) {
        updated = prev.filter(item => item.id !== cartItemId && item.productId !== cartItemId);
      } else {
        updated = prev.map(item => {
          if (item.id === cartItemId || item.productId === cartItemId) {
            const pPerSet = item.pairsPerSet || 12;
            const rPerPair = item.ratePerPair || item.wholesaleRate || 750;
            const rPerSet = item.ratePerSet || (pPerSet * rPerPair);
            return { 
              ...item, 
              quantity: qty,
              sets: qty,
              pairsPerSet: pPerSet,
              ratePerPair: rPerPair,
              ratePerSet: rPerSet,
              totalPairs: qty * pPerSet,
              subtotal: qty * rPerSet
            };
          }
          return item;
        });
      }
      saveStoredCart(updated);
      return updated;
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.id !== cartItemId && item.productId !== cartItemId);
      saveStoredCart(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    saveStoredCart([]);
  };

  const totalSets = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [cartItems]);

  const totalPairs = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const pPerSet = item.pairsPerSet || 12;
      return acc + ((item.quantity || 1) * pPerSet);
    }, 0);
  }, [cartItems]);

  const totalAmount = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const pPerSet = item.pairsPerSet || 12;
      const rPerPair = item.ratePerPair || item.wholesaleRate || 0;
      const rPerSet = item.ratePerSet || (pPerSet * rPerPair);
      return acc + ((item.quantity || 1) * rPerSet);
    }, 0);
  }, [cartItems]);

  const totalItems = totalSets; // backwards compatibility

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    updateItemSpecification,
    removeFromCart,
    clearCart,
    totalItems,
    totalSets,
    totalPairs,
    totalAmount,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
