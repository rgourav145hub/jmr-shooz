import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  FileText,
  AlertCircle,
  Zap,
  QrCode,
  Copy,
  Check
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { apiPlaceOrder } from '../services/api';
import { addNotification } from '../utils/notifications';
import { openRazorpayCheckout, generateUpiPaymentLink, getUpiQrCodeUrl } from '../utils/razorpay';
import { getBankDetails } from '../utils/storage';

export default function CartDrawer({ onOrderSuccess, openAuthModal }) {
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    updateQuantity, 
    updateItemSpecification,
    removeFromCart, 
    clearCart, 
    totalItems, 
    totalSets,
    totalPairs,
    totalAmount 
  } = useCart();
  
  const { currentUser } = useAuth();
  
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'checkout', 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  // Bank & Payment Gateway settings
  const [bankDetails, setBankDetails] = useState(getBankDetails());
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    companyName: '',
    customerPhone: '',
    customerEmail: '',
    station: '',
    city: '',
    shippingAddress: '',
    paymentMethod: 'Online Payment Gateway (Razorpay - UPI/Cards/NetBanking)',
    notes: '',
    specification: ''
  });

  // Pre-fill user data and fresh bank/gateway details when modal opens or user logs in
  useEffect(() => {
    setBankDetails(getBankDetails());
    if (currentUser) {
      const derivedPartyName = currentUser.companyName || (currentUser.userType === 'admin' ? 'JMR Wholesale Central' : (currentUser.name ? `${currentUser.name} Footwear` : ''));
      const derivedStation = currentUser.city || currentUser.station || '';
      setFormData(prev => ({
        ...prev,
        customerName: currentUser.name || prev.customerName,
        companyName: derivedPartyName || prev.companyName,
        customerPhone: currentUser.phone || prev.customerPhone,
        customerEmail: currentUser.email || prev.customerEmail,
        station: derivedStation || prev.station,
        city: derivedStation || prev.city,
        shippingAddress: currentUser.shippingAddress || currentUser.address || prev.shippingAddress
      }));
    }
  }, [currentUser, isCartOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) closeCart();
    };
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      setCheckoutStep('cart');
      setError('');
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    if (!currentUser) {
      setError('Wholesale Cart ordering is restricted to registered retailers. Please login or register to proceed.');
      if (openAuthModal) {
        closeCart();
        openAuthModal('login', 'retailer');
      }
      return;
    }
    if (cartItems.length === 0) return;
    setError('');
    setCheckoutStep('checkout');
  };

  const handlePlaceOrderSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('Please sign in to place wholesale orders.');
      return;
    }

    const partyName = (formData.companyName || currentUser?.companyName || currentUser?.name || '').trim();
    const station = (formData.station || formData.city || currentUser?.city || '').trim();

    if (!partyName) {
      setError('Please provide your Party / Firm Name.');
      return;
    }

    if (!station) {
      setError('Please provide your Destination Station (City).');
      return;
    }

    if (!formData.customerName.trim() || !formData.customerPhone.trim() || !formData.customerEmail.trim()) {
      setError('Please fill in Contact Person, Phone, and Email.');
      return;
    }

    if (!formData.shippingAddress.trim()) {
      setError('Please provide your Delivery / Transport Address.');
      return;
    }

    setLoading(true);

    try {
      const retailerId = currentUser?.retailerId || currentUser?.id || 'RET-STORE';

      let paymentStatus = 'Pending';
      let paymentId = '';
      let razorpayOrderId = '';

      // 1. Process Online Payment Gateway (Razorpay) if chosen
      if (formData.paymentMethod.includes('Razorpay')) {
        const tempOrderId = `ORD-${Date.now().toString().slice(-6)}`;
        try {
          const rzpResult = await openRazorpayCheckout({
            amount: totalAmount,
            orderId: tempOrderId,
            partyName: partyName,
            customerName: formData.customerName.trim(),
            customerEmail: formData.customerEmail.trim(),
            customerPhone: formData.customerPhone.trim()
          });

          if (rzpResult.dismissed) {
            setLoading(false);
            setError('Payment popup was closed. Please complete the online payment or select another payment option.');
            return;
          }

          if (!rzpResult.success) {
            setLoading(false);
            setError(rzpResult.error || 'Online payment transaction failed. Please try again.');
            return;
          }

          paymentStatus = 'Paid';
          paymentId = rzpResult.paymentId || '';
          razorpayOrderId = rzpResult.orderId || '';
        } catch (gatewayErr) {
          setLoading(false);
          setError(gatewayErr.message || 'Error communicating with Razorpay Payment Gateway.');
          return;
        }
      } else if (formData.paymentMethod.includes('UPI QR')) {
        if (!utrNumber.trim()) {
          setLoading(false);
          setError('Please provide the 12-digit UPI / UTR Transaction ID after scanning the QR code.');
          return;
        }
        paymentStatus = 'Pending Verification';
        paymentId = utrNumber.trim();
      }

      const orderPayload = {
        userId: currentUser?.id || retailerId,
        retailerId: retailerId,
        partyName: partyName,
        companyName: partyName,
        station: station,
        city: station,
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerEmail: formData.customerEmail.trim(),
        shippingAddress: formData.shippingAddress.trim(),
        paymentMethod: formData.paymentMethod,
        paymentStatus,
        paymentId,
        razorpayOrderId,
        utrNumber: utrNumber.trim(),
        notes: formData.notes.trim(),
        specification: (formData.specification || '').trim(),
        items: cartItems.map(item => {
          const pairsPerSet = item.pairsPerSet || 12;
          const ratePerPair = item.ratePerPair || 750;
          const ratePerSet = item.ratePerSet || (pairsPerSet * ratePerPair);
          const sets = item.quantity || 1;
          const linePairs = sets * pairsPerSet;
          const subtotal = sets * ratePerSet;

          return {
            id: item.productId || item.id,
            productId: item.productId || item.id,
            name: item.name,
            brandName: item.brandName || '',
            sku: item.sku || '',
            pairsPerSet,
            sizeCurve: item.sizeCurve || '',
            sets,
            quantity: sets, // Sets count
            totalPairs: linePairs,
            ratePerPair,
            mrpRate: ratePerPair,
            ratePerSet,
            subtotal,
            color: item.color || item.selectedColor || 'Classic Black',
            specification: (item.specification || '').trim(),
            image: item.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=150&q=80'
          };
        }),
        totalSets: totalSets || totalItems,
        totalPairs: totalPairs || (totalItems * 12),
        totalItems: totalSets || totalItems,
        totalAmount,
        status: paymentStatus === 'Paid' ? 'Confirmed' : 'Pending'
      };

      const res = await apiPlaceOrder(orderPayload);
      setLoading(false);

      if (res.success && res.order) {
        setPlacedOrder(res.order);
        setCheckoutStep('success');
        clearCart();

        const statusNote = paymentStatus === 'Paid' ? 'Paid & Confirmed via Razorpay' : 'Pending Verification';

        // 1. Notify Admin in-app
        addNotification({
          recipientRole: 'admin',
          title: paymentStatus === 'Paid' ? '💳 Naya Online Paid Order Aaya!' : 'Naya Wholesale Order Aaya!',
          message: `Party ${partyName} (${station}) ne ₹${totalAmount.toLocaleString('en-IN')} ka order (${res.order.orderId || res.order.id}) lagaya hai. (${statusNote})`,
          type: 'order',
          data: { orderId: res.order.orderId || res.order.id, partyName, amount: totalAmount, paymentStatus, paymentId },
          link: '/admin?tab=orders'
        });

        // 2. Notify Retailer in-app
        addNotification({
          recipientRole: 'retailer',
          recipientId: retailerId,
          title: 'Order Confirmation',
          message: `Aapka order (${res.order.orderId || res.order.id}) ₹${totalAmount.toLocaleString('en-IN')} successfully receive ho gaya hai. Status: ${statusNote}.`,
          type: 'order',
          data: { orderId: res.order.orderId || res.order.id, amount: totalAmount, paymentStatus },
          link: '/retailer'
        });

        if (onOrderSuccess) {
          onOrderSuccess(res.order);
        }
      } else {
        setError(res.error || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setError('Connection error occurred while processing order.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={closeCart} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 z-10">
        <div className="w-full sm:w-screen max-w-full sm:max-w-lg bg-brand-surface border-l border-brand-border flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-brand-dark border-b border-brand-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-card border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-gold-sm">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                  <span>Wholesale Cart</span>
                  {totalItems > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-brand-gold text-brand-dark text-[11px] font-black">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-brand-muted">Direct Manufacturer Bulk Allocation</p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-1.5 rounded-xl bg-brand-card text-slate-400 hover:text-white hover:bg-brand-cardHover transition-colors border border-brand-border cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {/* Error Banner */}
            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: CART ITEMS VIEW */}
            {checkoutStep === 'cart' && (
              <>
                {cartItems.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-center mx-auto text-slate-500">
                      <ShoppingBag className="w-8 h-8 stroke-1" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Your Cart is Empty</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                        Explore our authorized brands collection and add articles to build your wholesale order.
                      </p>
                    </div>
                    <button
                      onClick={closeCart}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all cursor-pointer"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-brand-border/60">
                      <span>{cartItems.length} Products in Batch</span>
                      <button
                        onClick={clearCart}
                        className="text-red-400 hover:text-red-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear All</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {cartItems.map((item) => {
                        const pairsPerSet = item.pairsPerSet || 12;
                        const ratePerPair = item.ratePerPair || item.wholesaleRate || 750;
                        const ratePerSet = item.ratePerSet || (pairsPerSet * ratePerPair);
                        const sets = item.quantity || 1;
                        const linePairs = sets * pairsPerSet;

                        return (
                          <div 
                            key={item.id}
                            className="p-3.5 rounded-2xl bg-brand-card/70 border border-brand-border hover:border-brand-gold/40 transition-all flex gap-3 relative group"
                          >
                            {/* Image */}
                            <div className="w-20 h-20 rounded-xl bg-black/40 border border-brand-border/60 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain"
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                                    {item.brandName}
                                  </span>
                                  <button
                                    onClick={() => removeFromCart(item.id || item.productId)}
                                    className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                                    title="Remove article"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <h5 className="text-sm font-bold text-white truncate">{item.name}</h5>
                                
                                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                  <span className="px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 text-[10px] font-mono font-bold border border-amber-400/20">
                                    1 Set = {pairsPerSet} Pairs
                                  </span>
                                  {item.color && (
                                    <span className="px-1.5 py-0.5 rounded bg-brand-gold/15 text-brand-gold text-[10px] font-semibold border border-brand-gold/30 inline-flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                                      Color: {item.color}
                                    </span>
                                  )}
                                  {item.sizeCurve && (
                                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
                                      {item.sizeCurve}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-brand-border/40">
                                <div>
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-black text-white font-mono">
                                      ₹{ratePerSet.toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-[10px] text-slate-400">/set</span>
                                  </div>
                                  <span className="text-[10px] text-brand-gold font-mono block">
                                    (MRP: ₹{ratePerPair}/pair · {linePairs} Total Pairs)
                                  </span>
                                </div>

                                {/* Sets Quantity Selector */}
                                <div className="flex items-center gap-1 bg-brand-surface rounded-xl border border-brand-border p-1">
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id || item.productId, sets - 1)}
                                    className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white hover:bg-brand-card rounded-lg transition-colors cursor-pointer"
                                    title="Decrease sets"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <div className="text-center px-1.5 min-w-[40px]">
                                    <span className="font-mono font-bold text-xs text-white block leading-tight">
                                      {sets}
                                    </span>
                                    <span className="text-[9px] text-brand-gold uppercase tracking-tighter block leading-none font-bold">
                                      {sets === 1 ? 'Set' : 'Sets'}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id || item.productId, sets + 1)}
                                    className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white hover:bg-brand-card rounded-lg transition-colors cursor-pointer"
                                    title="Increase sets"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Customer Article Specification */}
                              <div className="mt-2.5 pt-2 border-t border-brand-border/40">
                                <label className="text-[10px] font-semibold text-amber-300/90 block mb-1">
                                  Set Specification / विशेष निर्देश (Optional):
                                </label>
                                <input
                                  type="text"
                                  value={item.specification || ''}
                                  onChange={(e) => updateItemSpecification(item.id || item.productId, e.target.value)}
                                  placeholder="e.g. Size curve 7-10, carton marking, color details..."
                                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-900 border border-brand-border text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Wholesale Assured Banner */}
                    <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-blue-300 flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>Direct Tier-1 Factory Wholesale Packing: Sold strictly in complete carton sets</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* STEP 2: CHECKOUT FORM */}
            {checkoutStep === 'checkout' && (
              <form id="order-checkout-form" onSubmit={handlePlaceOrderSubmit} className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-brand-border/60">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="text-xs font-bold text-brand-gold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>← Back to Cart Items</span>
                  </button>
                  <span className="text-[11px] text-slate-400">Step 2 of 2: Dispatch Bilti Details</span>
                </div>

                {currentUser ? (
                  <div className="p-3.5 rounded-2xl bg-brand-card border border-brand-gold/40 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center shrink-0 border border-brand-gold/30">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                          Authorized Wholesale Account
                        </span>
                        <span className="text-[10px] font-mono text-brand-gold bg-black/40 px-1.5 py-0.5 rounded border border-brand-border">
                          ID: {currentUser.retailerId || currentUser.id}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white truncate mt-0.5">
                        {formData.companyName || currentUser.companyName || currentUser.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Station: <span className="text-slate-200 font-medium">{formData.station || formData.city || currentUser.city || 'Standard Transport'}</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-brand-card border border-brand-gold/30 flex items-center justify-between text-xs">
                    <span className="text-slate-300">Registered Retailer? Sign in for fast checkout:</span>
                    <button
                      type="button"
                      onClick={() => {
                        closeCart();
                        if (openAuthModal) openAuthModal('login', 'retailer');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-brand-gold/20 text-brand-gold font-bold hover:bg-brand-gold/30 border border-brand-gold/40 cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        Party / Firm Name (M/S) *
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          placeholder="e.g. Royal Shoe Emporium"
                          className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold transition-colors font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        Destination Station (City) *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={formData.station}
                          onChange={(e) => setFormData({ ...formData, station: e.target.value, city: e.target.value })}
                          placeholder="e.g. Indore, Madhya Pradesh"
                          className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold transition-colors font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        Contact Person / Buyer *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={formData.customerName}
                          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                          placeholder="e.g. Sunil Kumar"
                          className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={formData.customerPhone}
                          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold transition-colors font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                      Official Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        placeholder="buyer@shoestore.com"
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Printable consignment dispatch slip and order receipt will be emailed here.
                    </span>
                  </div>

                  {/* Payment Gateway & Remittance Options */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Payment Gateway & Method *
                    </label>

                    <div className="space-y-2">
                      {/* Option 1: Razorpay Payment Gateway */}
                      <div 
                        onClick={() => setFormData({ ...formData, paymentMethod: 'Online Payment Gateway (Razorpay - UPI/Cards/NetBanking)' })}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          formData.paymentMethod.includes('Razorpay')
                            ? 'bg-brand-gold/10 border-brand-gold ring-1 ring-brand-gold/50 shadow-gold-sm'
                            : 'bg-brand-card/70 border-brand-border hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 p-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30">
                              <Zap className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white text-xs">Online Payment Gateway (Razorpay)</span>
                                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wider border border-emerald-500/30">
                                  Auto Confirmed
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 mt-0.5">
                                UPI (Google Pay, PhonePe, Paytm, BHIM), Debit/Credit Cards & NetBanking (50+ Banks)
                              </p>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="paymentOption"
                            checked={formData.paymentMethod.includes('Razorpay')}
                            onChange={() => setFormData({ ...formData, paymentMethod: 'Online Payment Gateway (Razorpay - UPI/Cards/NetBanking)' })}
                            className="mt-1 text-brand-gold focus:ring-brand-gold"
                          />
                        </div>

                        {formData.paymentMethod.includes('Razorpay') && (
                          <div className="mt-2.5 pt-2 border-t border-brand-border/60 flex items-center justify-between text-[10px] text-slate-300">
                            <span className="flex items-center gap-1 text-brand-gold font-medium">
                              <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Instant Verification
                            </span>
                            <span className="text-emerald-400 font-bold">0% Extra Convenience Fee</span>
                          </div>
                        )}
                      </div>

                      {/* Option 2: Direct Dynamic UPI QR */}
                      <div 
                        onClick={() => setFormData({ ...formData, paymentMethod: 'Direct Instant UPI QR (Scan & Pay)' })}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          formData.paymentMethod.includes('UPI QR')
                            ? 'bg-brand-gold/10 border-brand-gold ring-1 ring-brand-gold/50 shadow-gold-sm'
                            : 'bg-brand-card/70 border-brand-border hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <QrCode className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white text-xs">Direct Instant UPI QR (Scan & Pay)</span>
                                <span className="px-1.5 py-0.2 rounded bg-brand-gold/20 text-brand-gold text-[9px] font-bold">
                                  ₹{totalAmount.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 mt-0.5">
                                Scan exact amount dynamic QR via GPay, PhonePe, Paytm or any UPI App
                              </p>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="paymentOption"
                            checked={formData.paymentMethod.includes('UPI QR')}
                            onChange={() => setFormData({ ...formData, paymentMethod: 'Direct Instant UPI QR (Scan & Pay)' })}
                            className="mt-1 text-brand-gold focus:ring-brand-gold"
                          />
                        </div>

                        {formData.paymentMethod.includes('UPI QR') && (
                          <div className="mt-3 pt-3 border-t border-brand-border/60 bg-black/40 -mx-3 -mb-3 p-3 rounded-b-xl space-y-3">
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                              <div className="p-2 bg-white rounded-xl shadow-lg shrink-0">
                                <img
                                  src={getUpiQrCodeUrl(
                                    generateUpiPaymentLink({
                                      upiId: bankDetails?.upiId || 'jmrshooz@hdfcbank',
                                      payeeName: bankDetails?.accountName || 'JMR SHOOZ DISTRIBUTION',
                                      amount: totalAmount,
                                      orderId: 'JMR-CART'
                                    }),
                                    140
                                  )}
                                  alt="Dynamic UPI QR"
                                  className="w-24 h-24 object-contain"
                                />
                              </div>
                              <div className="space-y-1 text-center sm:text-left flex-1">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Official Company VPA</div>
                                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                                  <code className="text-xs font-mono font-bold text-brand-gold bg-brand-card px-2 py-0.5 rounded border border-brand-border">
                                    {bankDetails?.upiId || 'jmrshooz@hdfcbank'}
                                  </code>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard?.writeText(bankDetails?.upiId || 'jmrshooz@hdfcbank');
                                      setCopiedUpi(true);
                                      setTimeout(() => setCopiedUpi(false), 2000);
                                    }}
                                    className="p-1 rounded bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-300 cursor-pointer"
                                    title="Copy UPI ID"
                                  >
                                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                                <p className="text-[10px] text-slate-400">
                                  Kisi bhi app se scan karein aur niche 12-digit UTR enter karein.
                                </p>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold uppercase text-slate-300 mb-1">
                                12-Digit UPI / UTR Transaction ID *
                              </label>
                              <input
                                type="text"
                                required={formData.paymentMethod.includes('UPI QR')}
                                value={utrNumber}
                                onChange={(e) => setUtrNumber(e.target.value)}
                                placeholder="e.g. 403829182736 (From Payment App Confirmation)"
                                className="w-full px-3 py-1.5 rounded-lg bg-brand-card border border-brand-border text-white text-xs font-mono focus:outline-none focus:border-brand-gold"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Option 3: Standard Bank Transfer / RTGS */}
                      <div 
                        onClick={() => setFormData({ ...formData, paymentMethod: 'Bank Transfer / RTGS' })}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          formData.paymentMethod === 'Bank Transfer / RTGS'
                            ? 'bg-brand-gold/10 border-brand-gold ring-1 ring-brand-gold/50 shadow-gold-sm'
                            : 'bg-brand-card/70 border-brand-border hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-bold text-white text-xs">Bank Transfer / RTGS / NEFT</span>
                              <p className="text-[11px] text-slate-300 mt-0.5">
                                Official Company Commercial Remittance Account
                              </p>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="paymentOption"
                            checked={formData.paymentMethod === 'Bank Transfer / RTGS'}
                            onChange={() => setFormData({ ...formData, paymentMethod: 'Bank Transfer / RTGS' })}
                            className="mt-1 text-brand-gold focus:ring-brand-gold"
                          />
                        </div>

                        {formData.paymentMethod === 'Bank Transfer / RTGS' && (
                          <div className="mt-2.5 pt-2 border-t border-brand-border/60 text-[11px] text-slate-300 space-y-1 bg-black/30 p-2.5 rounded-lg">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Beneficiary:</span>
                              <span className="font-bold text-white">{bankDetails?.accountName || 'JMR SHOOZ DISTRIBUTION'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">A/C Number:</span>
                              <span className="font-mono font-bold text-brand-gold">{bankDetails?.accountNumber || '50200084920194'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">IFSC Code:</span>
                              <span className="font-mono text-white">{bankDetails?.ifscCode || 'HDFC0001234'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Bank & Branch:</span>
                              <span className="text-slate-200">{bankDetails?.bankName || 'HDFC Bank Ltd'}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Option 4: COD / Godown Delivery */}
                      <div 
                        onClick={() => setFormData({ ...formData, paymentMethod: 'Cash on Delivery / Godown Handover' })}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          formData.paymentMethod === 'Cash on Delivery / Godown Handover'
                            ? 'bg-brand-gold/10 border-brand-gold ring-1 ring-brand-gold/50 shadow-gold-sm'
                            : 'bg-brand-card/70 border-brand-border hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 p-1.5 rounded-lg bg-purple-500/15 text-purple-400 border border-purple-500/30">
                              <Truck className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-bold text-white text-xs">Cash on Delivery / Godown Handover</span>
                              <p className="text-[11px] text-slate-300 mt-0.5">
                                Payment upon arrival at destination godown / transport bilti clearance
                              </p>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="paymentOption"
                            checked={formData.paymentMethod === 'Cash on Delivery / Godown Handover'}
                            onChange={() => setFormData({ ...formData, paymentMethod: 'Cash on Delivery / Godown Handover' })}
                            className="mt-1 text-brand-gold focus:ring-brand-gold"
                          />
                        </div>
                      </div>

                      {/* Option 5: Wholesale Credit */}
                      <div 
                        onClick={() => setFormData({ ...formData, paymentMethod: 'Wholesale Credit' })}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          formData.paymentMethod === 'Wholesale Credit'
                            ? 'bg-brand-gold/10 border-brand-gold ring-1 ring-brand-gold/50 shadow-gold-sm'
                            : 'bg-brand-card/70 border-brand-border hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 p-1.5 rounded-lg bg-slate-500/15 text-slate-400 border border-slate-500/30">
                              <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-bold text-white text-xs">Wholesale Credit (Verified Retailers)</span>
                              <p className="text-[11px] text-slate-300 mt-0.5">
                                15-30 days billing cycle for approved partners
                              </p>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="paymentOption"
                            checked={formData.paymentMethod === 'Wholesale Credit'}
                            onChange={() => setFormData({ ...formData, paymentMethod: 'Wholesale Credit' })}
                            className="mt-1 text-brand-gold focus:ring-brand-gold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                      Store / Godown Delivery Address *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.shippingAddress}
                      onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                      placeholder="Shop / Godown No., Street, Market Complex, Landmark, Pincode"
                      className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                      Transport / Dispatch Agency Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g. Transport: Patel Roadways / Jaipur Golden, Godown booking"
                      className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                      Consignment Specification / विशेष निर्देश (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.specification}
                      onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                      placeholder="e.g. Special size ratio, carton label marking, urgency / dispatch timing instructions"
                      className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none"
                    />
                  </div>
                </div>
              </form>
            )}

            {/* STEP 3: ORDER PLACED SUCCESS */}
            {checkoutStep === 'success' && placedOrder && (
              <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 shadow-gold-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-white">Wholesale Consignment Booked!</h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                    Aapka wholesale order registered party identity ke sath receive ho gaya hai. Printable dispatch slip Admin aur aapke email par bhej di gayi hai.
                  </p>
                </div>

                <div className="bg-brand-card p-4 rounded-2xl border border-brand-gold/30 text-left space-y-2.5 text-xs text-slate-300 max-w-sm mx-auto">
                  <div className="flex justify-between items-center pb-2 border-b border-brand-border/60">
                    <span className="text-slate-400">Order ID:</span>
                    <span className="font-mono font-bold text-brand-gold text-sm bg-black/40 px-2 py-0.5 rounded border border-brand-border">
                      #{placedOrder.orderId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Party Name:</span>
                    <span className="font-bold text-white">{placedOrder.companyName || placedOrder.partyName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Destination Station:</span>
                    <span className="font-bold text-slate-200">{placedOrder.station || placedOrder.city}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Consignment Packing:</span>
                    <span className="font-bold text-brand-gold font-mono">{placedOrder.totalSets || placedOrder.totalItems} Sets ({placedOrder.totalPairs || (placedOrder.totalItems * 12)} Pairs)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Consignment Value:</span>
                    <span className="font-bold text-brand-gold font-mono text-sm">
                      ₹{placedOrder.totalAmount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-brand-border/60">
                    <span className="text-slate-400">Current Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      placedOrder.paymentStatus === 'Paid'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {placedOrder.paymentStatus === 'Paid' ? 'Paid & Auto-Confirmed' : 'Pending Processing'}
                    </span>
                  </div>

                  {placedOrder.paymentId && (
                    <div className="flex justify-between items-center pt-1 text-[11px]">
                      <span className="text-slate-400">
                        {placedOrder.paymentStatus === 'Paid' ? 'Razorpay Payment ID:' : 'UPI UTR Ref:'}
                      </span>
                      <span className="font-mono font-bold text-white bg-black/40 px-2 py-0.5 rounded border border-brand-border/80">
                        {placedOrder.paymentId}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Payment Mode:</span>
                    <span className="font-medium text-slate-200 truncate max-w-[180px]">
                      {placedOrder.paymentMethod}
                    </span>
                  </div>
                </div>

                {placedOrder.items && placedOrder.items.length > 0 && (
                  <div className="bg-black/30 p-3 rounded-2xl border border-brand-border/60 text-left space-y-2 max-w-sm mx-auto">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Booked Articles ({placedOrder.items.length}):
                    </span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {placedOrder.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] bg-brand-surface/60 p-1.5 rounded-lg border border-brand-border/40">
                          <img 
                            src={it.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=60'} 
                            alt={it.name} 
                            className="w-8 h-8 rounded object-contain bg-black/40 border border-brand-border/50 shrink-0" 
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-bold truncate leading-tight">{it.name}</p>
                            <div className="flex items-center gap-1.5 text-[9px] mt-0.5">
                              <span className="text-brand-gold font-medium">{it.sets || 1} Sets ({(it.sets || 1) * (it.pairsPerSet || 12)} Pairs)</span>
                              {it.color && (
                                <span className="px-1.5 py-0.2 rounded bg-brand-gold/15 text-brand-gold font-bold">
                                  🎨 {it.color}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-300 text-left flex items-start gap-2 max-w-sm mx-auto">
                  <Truck className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Printable bilti & order confirmation dispatched to <strong>{placedOrder.customerEmail}</strong>. Central hub will coordinate dispatch within 24-48h.</span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={closeCart}
                    className="w-full py-3 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-gold-sm transition-all cursor-pointer"
                  >
                    Done & Return to Catalog
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer Bar */}
          {checkoutStep !== 'success' && cartItems.length > 0 && (
            <div className="p-6 bg-brand-dark border-t border-brand-border space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Total Ordered Sets:</span>
                  <span className="font-mono text-white font-bold">{totalSets} Sets ({totalPairs} Pairs)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Hub Inspection & Packing:</span>
                  <span className="text-emerald-400 font-bold">Free / Included</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-brand-border/60">
                  <span className="text-sm font-bold text-white uppercase tracking-wider">Grand Total:</span>
                  <span className="text-xl font-black text-brand-gold font-mono">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {checkoutStep === 'cart' ? (
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-gold-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Dispatch Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="order-checkout-form"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-gold-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {formData.paymentMethod.includes('Razorpay') ? (
                    <Zap className="w-4 h-4 text-brand-dark fill-brand-dark" />
                  ) : formData.paymentMethod.includes('UPI QR') ? (
                    <QrCode className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>
                    {loading ? (
                      formData.paymentMethod.includes('Razorpay') ? 'Processing Razorpay Secure Payment...' : 'Submitting Order & Emailing Admin...'
                    ) : (
                      formData.paymentMethod.includes('Razorpay') ? `Pay ₹${totalAmount.toLocaleString('en-IN')} via Razorpay` :
                      formData.paymentMethod.includes('UPI QR') ? `Confirm UPI Payment (₹${totalAmount.toLocaleString('en-IN')})` :
                      `Confirm Order (${totalSets} Sets · ₹${totalAmount.toLocaleString('en-IN')})`
                    )}
                  </span>
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
