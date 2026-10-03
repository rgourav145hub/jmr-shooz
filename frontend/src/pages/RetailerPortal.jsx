import React, { useState, useEffect, useRef } from 'react';
import { 
  Store, 
  Package, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  Search, 
  Filter, 
  ShoppingCart, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Plus, 
  Minus,
  Download,
  AlertCircle,
  CreditCard,
  Copy,
  Check,
  Building2,
  QrCode,
  Edit3,
  Save,
  CheckCircle2,
  Database,
  Truck,
  Eye,
  Printer,
  X,
  Camera,
  Upload,
  Trash2,
  UserCheck,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Heart
} from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { 
  getStoredProducts, 
  getStoredBrands, 
  getStoredQueries, 
  submitQueryOrFeedback,
  getBankDetails,
  getStoredOrders,
  getCurrentUser,
  updateUserProfile,
  updateOrderDetails
} from '../utils/storage';
import { 
  apiGetCompanyBank, 
  apiUpdateRetailerBank,
  apiGetOrders,
  apiUpdateUserProfile,
  apiUpdateOrder
} from '../services/api';

const RetailerPortal = function({ currentUser, openQueryModal, onNotification }) {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog', 'orders', 'wishlist', 'profile', 'bank', 'history'
  const { wishlistItems, isInWishlist, toggleWishlist, removeFromWishlist, totalWishlist, openWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [myQueries, setMyQueries] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);
  
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');

  // Company Bank Details
  const [companyBank, setCompanyBank] = useState(() => getBankDetails());
  const [copiedField, setCopiedField] = useState(null);

  // Retailer Bank & GST Edit Modal
  const [showEditBankModal, setShowEditBankModal] = useState(false);
  const [editBankForm, setEditBankForm] = useState({
    gstin: currentUser?.gstin || '',
    bankName: currentUser?.bankName || '',
    accountNo: currentUser?.accountNo || '',
    ifsc: currentUser?.ifsc || '',
    branch: currentUser?.branch || '',
    upiId: currentUser?.upiId || ''
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile Management & Picture Upload
  const [userData, setUserData] = useState(() => getCurrentUser() || currentUser);
  const fileInputRef = useRef(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    companyName: currentUser?.companyName || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    city: currentUser?.city || '',
    station: currentUser?.station || currentUser?.city || '',
    address: currentUser?.address || currentUser?.shippingAddress || '',
    gstin: currentUser?.gstin || '',
    avatar: currentUser?.avatar || '',
    bankName: currentUser?.bankName || '',
    accountNo: currentUser?.accountNo || '',
    ifsc: currentUser?.ifsc || '',
    branch: currentUser?.branch || '',
    upiId: currentUser?.upiId || ''
  });

  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80'
  ];

  // Order Editing State
  const [editingOrder, setEditingOrder] = useState(null);
  const [editOrderItems, setEditOrderItems] = useState([]);
  const [editOrderNotes, setEditOrderNotes] = useState('');
  const [editOrderStation, setEditOrderStation] = useState('');
  const [editOrderAddress, setEditOrderAddress] = useState('');
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Booking Modal
  const [bookingProduct, setBookingProduct] = useState(null);
  const [cartonCount, setCartonCount] = useState(1);
  const [bookingNotes, setBookingNotes] = useState('');

  const filterUserOrders = (ordersList) => {
    if (!ordersList || !Array.isArray(ordersList)) return [];
    const active = userData || currentUser;
    if (!active) return [];
    const cid = active.id;
    const retId = active.retailerId;
    const email = (active.email || '').toLowerCase();

    return ordersList.filter(o => {
      if (cid && (o.userId === cid || o.retailerId === cid)) return true;
      if (retId && (o.retailerId === retId || o.userId === retId)) return true;
      if (email && o.customerEmail && o.customerEmail.toLowerCase() === email) return true;
      return false;
    });
  };

  const loadData = () => {
    setProducts(getStoredProducts());
    setBrands(getStoredBrands());
    
    const active = userData || currentUser;
    const allQueries = getStoredQueries();
    if (active?.retailerId) {
      setMyQueries(allQueries.filter(q => q.retailerId === active.retailerId));
    } else {
      setMyQueries(allQueries);
    }

    const allOrders = getStoredOrders();
    setMyOrders(filterUserOrders(allOrders));

    apiGetCompanyBank().then(data => {
      if (data) setCompanyBank(data);
    });

    apiGetOrders(active?.id || active?.retailerId).then(res => {
      if (res?.orders && Array.isArray(res.orders)) {
        const filtered = filterUserOrders(res.orders);
        if (filtered.length > 0) setMyOrders(filtered);
      }
    }).catch(() => {});
  };

  useEffect(() => {
    const current = getCurrentUser() || currentUser;
    if (current) {
      setUserData(current);
      setProfileForm({
        name: current.name || '',
        companyName: current.companyName || '',
        phone: current.phone || '',
        email: current.email || '',
        city: current.city || '',
        station: current.station || current.city || '',
        address: current.address || current.shippingAddress || '',
        gstin: current.gstin || '',
        avatar: current.avatar || '',
        bankName: current.bankName || '',
        accountNo: current.accountNo || '',
        ifsc: current.ifsc || '',
        branch: current.branch || '',
        upiId: current.upiId || ''
      });
      setEditBankForm({
        gstin: current.gstin || '',
        bankName: current.bankName || '',
        accountNo: current.accountNo || '',
        ifsc: current.ifsc || '',
        branch: current.branch || '',
        upiId: current.upiId || ''
      });
    }

    loadData();

    const handleUserChanged = () => {
      const u = getCurrentUser();
      if (u) {
        setUserData(u);
        setProfileForm(prev => ({ ...prev, ...u }));
      }
    };
    window.addEventListener('jmr_user_changed', handleUserChanged);
    window.addEventListener('jmr_users_updated', handleUserChanged);
    return () => {
      window.removeEventListener('jmr_user_changed', handleUserChanged);
      window.removeEventListener('jmr_users_updated', handleUserChanged);
    };
  }, [currentUser]);

  useEffect(() => {
    const handleQueriesUpdate = () => {
      const allQueries = getStoredQueries();
      if (currentUser?.retailerId) {
        setMyQueries(allQueries.filter(q => q.retailerId === currentUser.retailerId));
      } else {
        setMyQueries(allQueries);
      }
    };

    const handleOrdersUpdate = () => {
      const allOrders = getStoredOrders();
      setMyOrders(filterUserOrders(allOrders));
    };

    const handleProductsUpdate = () => setProducts(getStoredProducts());
    const handleBankUpdate = () => setCompanyBank(getBankDetails());

    window.addEventListener('jmr_queries_updated', handleQueriesUpdate);
    window.addEventListener('jmr_orders_updated', handleOrdersUpdate);
    window.addEventListener('jmr_products_updated', handleProductsUpdate);
    window.addEventListener('jmr_bank_updated', handleBankUpdate);

    return () => {
      window.removeEventListener('jmr_queries_updated', handleQueriesUpdate);
      window.removeEventListener('jmr_orders_updated', handleOrdersUpdate);
      window.removeEventListener('jmr_products_updated', handleProductsUpdate);
      window.removeEventListener('jmr_bank_updated', handleBankUpdate);
    };
  }, [currentUser]);

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveRetailerBank = async (e) => {
    e.preventDefault();
    if (!currentUser?.id) return;

    const res = await apiUpdateRetailerBank(currentUser.id, editBankForm);
    if (res.success) {
      setShowEditBankModal(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (onNotification) {
        onNotification({
          message: 'Bank & GST Details Updated',
          subtext: 'Your settlement coordinates have been saved to the database.'
        });
      }
    }
  };

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Profile photo size 2MB se kam honi chahiye.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result;
      if (base64) {
        setProfileForm(prev => ({ ...prev, avatar: base64 }));
        setUserData(prev => ({ ...prev, avatar: base64 }));
        const userId = userData?.id || userData?.retailerId || currentUser?.id || currentUser?.retailerId;
        if (userId) {
          await apiUpdateUserProfile(userId, { avatar: base64 });
          setProfileSuccessMsg('Profile picture uploaded & saved successfully!');
          setTimeout(() => setProfileSuccessMsg(''), 4000);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetAvatar = async (url) => {
    setProfileForm(prev => ({ ...prev, avatar: url }));
    setUserData(prev => ({ ...prev, avatar: url }));
    const userId = userData?.id || userData?.retailerId || currentUser?.id || currentUser?.retailerId;
    if (userId) {
      await apiUpdateUserProfile(userId, { avatar: url });
      setProfileSuccessMsg('Profile picture updated successfully!');
      setTimeout(() => setProfileSuccessMsg(''), 4000);
    }
  };

  const handleRemoveAvatar = async () => {
    setProfileForm(prev => ({ ...prev, avatar: '' }));
    setUserData(prev => ({ ...prev, avatar: '' }));
    const userId = userData?.id || userData?.retailerId || currentUser?.id || currentUser?.retailerId;
    if (userId) {
      await apiUpdateUserProfile(userId, { avatar: '' });
      setProfileSuccessMsg('Profile picture removed.');
      setTimeout(() => setProfileSuccessMsg(''), 4000);
    }
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    const userId = userData?.id || userData?.retailerId || currentUser?.id || currentUser?.retailerId;
    if (!userId) return;

    const res = await apiUpdateUserProfile(userId, profileForm);
    if (res.success || res.user) {
      const updated = res.user || { ...userData, ...profileForm };
      setUserData(updated);
      setProfileSuccessMsg('Profile & business coordinates saved successfully!');
      setShowEditProfileModal(false);
      setTimeout(() => setProfileSuccessMsg(''), 4000);
      if (onNotification) {
        onNotification({
          message: 'Profile Details Saved',
          subtext: 'Your business profile coordinates have been securely updated.'
        });
      }
    }
  };

  const handleStartEditOrder = (order) => {
    setEditingOrder(order);
    setEditOrderItems(JSON.parse(JSON.stringify(order.items || [])));
    setEditOrderNotes(order.notes || '');
    setEditOrderStation(order.station || order.city || '');
    setEditOrderAddress(order.shippingAddress || '');
  };

  const handleItemSetsChange = (index, delta) => {
    setEditOrderItems(prev => {
      const copy = [...prev];
      const currentSets = copy[index].sets || copy[index].quantity || 1;
      const newSets = Math.max(1, currentSets + delta);
      const pairsPerSet = copy[index].pairsPerSet || 12;
      const ratePerPair = copy[index].ratePerPair || copy[index].wholesaleRate || copy[index].wholesalePrice || 750;
      const ratePerSet = copy[index].ratePerSet || (pairsPerSet * ratePerPair);
      copy[index].sets = newSets;
      copy[index].quantity = newSets;
      copy[index].totalPairs = newSets * pairsPerSet;
      copy[index].subtotal = newSets * ratePerSet;
      return copy;
    });
  };

  const handleItemSpecChange = (index, val) => {
    setEditOrderItems(prev => {
      const copy = [...prev];
      copy[index].specification = val;
      return copy;
    });
  };

  const editCalculatedSubtotal = editOrderItems.reduce((acc, it) => {
    const pairsPerSet = it.pairsPerSet || 12;
    const ratePerPair = it.ratePerPair || it.wholesaleRate || it.wholesalePrice || 750;
    const ratePerSet = it.ratePerSet || (pairsPerSet * ratePerPair);
    const sets = parseInt(it.sets, 10) || parseInt(it.quantity, 10) || 1;
    return acc + (sets * ratePerSet);
  }, 0);

  const editCalculatedSets = editOrderItems.reduce((acc, it) => {
    return acc + (parseInt(it.sets, 10) || parseInt(it.quantity, 10) || 1);
  }, 0);

  const editCalculatedPairs = editOrderItems.reduce((acc, it) => {
    const sets = parseInt(it.sets, 10) || parseInt(it.quantity, 10) || 1;
    const pairsPerSet = it.pairsPerSet || 12;
    return acc + (sets * pairsPerSet);
  }, 0);

  const editGstAmount = Math.round(editCalculatedSubtotal * 0.05);
  const editGrandTotal = editCalculatedSubtotal + editGstAmount;

  const handleSaveEditedOrder = async (saveAsDraft = false) => {
    if (!editingOrder) return;
    setIsSavingOrder(true);
    const orderId = editingOrder.orderId || editingOrder.id;

    const updatedData = {
      items: editOrderItems,
      totalSets: editCalculatedSets,
      totalPairs: editCalculatedPairs,
      totalItems: editCalculatedSets,
      subtotal: editCalculatedSubtotal,
      totalAmount: editGrandTotal,
      grandTotal: editGrandTotal,
      notes: editOrderNotes,
      station: editOrderStation,
      city: editOrderStation,
      shippingAddress: editOrderAddress,
      status: saveAsDraft ? 'Draft' : (editingOrder.status === 'Draft' ? 'Pending' : editingOrder.status),
      updatedAt: new Date().toISOString()
    };

    const res = await apiUpdateOrder(orderId, updatedData);
    setIsSavingOrder(false);
    if (res.success || res.order) {
      setMyOrders(prev => prev.map(o => (o.orderId === orderId || o.id === orderId) ? { ...o, ...updatedData } : o));
      setEditingOrder(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
      if (onNotification) {
        onNotification({
          message: 'Order Consignment Updated',
          subtext: `Order #${orderId} modified: ${editCalculatedSets} Sets (${editCalculatedPairs} Pairs) at ₹${editGrandTotal.toLocaleString('en-IN')}.`
        });
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesBrand = selectedBrand === 'All' || p.brandId === selectedBrand;
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
      p.brandName.toLowerCase().includes(search.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!bookingProduct) return;

    const entry = submitQueryOrFeedback({
      retailerId: currentUser?.retailerId || 'RET-ACTIVE',
      companyName: currentUser?.companyName || 'Registered Retailer',
      contactName: currentUser?.name || 'Retail Buyer',
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
      type: 'Wholesale Stock Booking',
      brandName: bookingProduct.brandName,
      productSku: bookingProduct.sku,
      subject: `Order Booking: ${cartonCount} Cartons of ${bookingProduct.name}`,
      message: `Requested ${cartonCount} cartons (${bookingProduct.moq || 'Assorted Size Curve'}). Additional notes: ${bookingNotes || 'Standard dispatch terms.'}`,
    });

    setBookingProduct(null);
    setCartonCount(1);
    setBookingNotes('');

    if (onNotification) {
      onNotification({
        message: 'Carton Dispatch Request Submitted',
        subtext: `Ticket #${entry.id} dispatched to JMR Shooz warehouse.`
      });
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark pt-36 sm:pt-40 md:pt-44 pb-24 text-slate-100">
      
      {/* Retailer Header Card */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-brand-surface rounded-3xl border border-brand-border p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            {/* Retailer Avatar / Photo Container */}
            <div className="relative group shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-brand-card border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-gold-sm overflow-hidden">
                {userData?.avatar ? (
                  <img src={userData.avatar} alt="Retailer Profile" className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-8 h-8" />
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.click();
                }}
                className="absolute -bottom-1 -right-1 p-1 rounded-full bg-brand-gold text-brand-dark hover:scale-110 shadow-md transition-transform"
                title="Change Profile Picture"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFileUpload}
                className="hidden"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold text-[10px] font-bold uppercase tracking-widest border border-brand-gold/40">
                  {userData?.status || currentUser?.status || 'Authorized Stockist'}
                </span>
                <span className="font-mono text-xs text-brand-muted">
                  ID: <strong className="text-white">{userData?.retailerId || currentUser?.retailerId || 'RET-2026-DEMO'}</strong>
                </span>
                {(userData?.gstin || currentUser?.gstin) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    <CheckCircle className="w-3 h-3" />
                    <span>GSTIN: {userData?.gstin || currentUser?.gstin}</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified B2B Retailer</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
                {userData?.companyName || currentUser?.companyName || 'Footwear Retailer Hub'}
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Representative: <span className="text-brand-gold font-medium">{userData?.name || currentUser?.name || 'Authorized Buyer'}</span> • {userData?.city || currentUser?.city || 'Regional Store'} • Phone: <span className="font-mono">{userData?.phone || currentUser?.phone || '+91 98111 22334'}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                activeTab === 'profile'
                  ? 'bg-brand-gold text-brand-dark border-brand-gold'
                  : 'bg-brand-card hover:bg-brand-cardHover border-brand-gold/40 text-brand-gold'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => setShowEditBankModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <CreditCard className="w-4 h-4 text-brand-gold" />
              <span>GST & Bank</span>
            </button>

            <button
              onClick={() => openQueryModal()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Raise Query</span>
            </button>
          </div>

        </div>
      </div>

      {saveSuccess && (
        <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-center gap-3 text-emerald-300 text-xs font-medium animate-in fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Bank and GST credentials saved and verified successfully!</span>
          </div>
        </div>
      )}

      {profileSuccessMsg && (
        <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-center gap-3 text-emerald-300 text-xs font-medium animate-in fade-in shadow-xl">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{profileSuccessMsg}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex border-b border-brand-border bg-brand-surface/40 rounded-t-2xl px-4 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'catalog'
                ? 'border-brand-gold text-brand-gold bg-brand-surface'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>B2B Catalog ({filteredProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'orders'
                ? 'border-brand-gold text-brand-gold bg-brand-surface'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>My Orders ({myOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'wishlist'
                ? 'border-rose-500 text-rose-400 bg-brand-surface'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${totalWishlist > 0 ? 'fill-rose-500 text-rose-500' : 'text-rose-400'}`} />
            <span>Wishlist ({totalWishlist})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'profile'
                ? 'border-brand-gold text-brand-gold bg-brand-surface'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Profile & Business Details</span>
          </button>

          <button
            onClick={() => setActiveTab('bank')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'bank'
                ? 'border-brand-gold text-brand-gold bg-brand-surface'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Bank & Settlements</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'history'
                ? 'border-brand-gold text-brand-gold bg-brand-surface'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Queries ({myQueries.length})</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TAB 1: WHOLESALE ORDER CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            
            {/* Filter controls */}
            <div className="bg-brand-surface p-4 sm:p-5 rounded-2xl border border-brand-border flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
              
              <div className="w-full md:w-1/2 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by model, brand, or SKU..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="w-full md:w-1/3">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                >
                  <option value="All">All Brands (Liberty, Columbus, Aerowalk...)</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Wholesale Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-brand-surface rounded-2xl border border-brand-border hover:border-brand-gold/50 transition-all overflow-hidden flex flex-col justify-between group shadow-xl"
                >
                  <div>
                    <div className="relative h-48 bg-brand-dark overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-brand-gold text-brand-dark text-[10px] font-bold uppercase tracking-wider">
                        {product.brandName}
                      </div>
                      <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white border border-white/20">
                        {product.category}
                      </div>

                      {/* Wishlist Heart Toggle */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md active:scale-90 ${
                          isInWishlist(product.id)
                            ? 'bg-rose-500 text-white shadow-rose-500/40'
                            : 'bg-black/50 text-white/80 hover:text-white hover:bg-black/80'
                        }`}
                        title={isInWishlist(product.id) ? 'Remove from Shortlist' : 'Add to Shortlist / Wishlist'}
                      >
                        <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-bold text-white text-base leading-snug group-hover:text-brand-gold transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-[11px] text-brand-muted font-mono mt-0.5">SKU: {product.sku}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-brand-card/60 border border-brand-border space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium">B2B Wholesale Rate:</span>
                          <span className="text-brand-gold font-mono font-bold text-sm">{product.wholesaleRate}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium">Suggested Retail MSRP:</span>
                          <span className="text-slate-300 font-mono line-through">{product.suggestedRetailPrice}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs border-t border-brand-border/60 pt-1.5 text-emerald-400 font-medium">
                          <span>Standard Carton Size:</span>
                          <span>{product.moq}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-300 space-y-1">
                        <p><strong className="text-slate-400">Sizes:</strong> {product.sizeRange || 'UK 6 - 10'}</p>
                        <p><strong className="text-slate-400">Colors:</strong> {Array.isArray(product.colors) ? product.colors.join(', ') : product.colors}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => setBookingProduct(product)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Book Wholesale Cartons</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB: MY PLACED WHOLESALE ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Quick KPI Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-brand-surface border border-brand-border">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Placed</span>
                <span className="text-2xl font-black text-white font-mono">{myOrders.length}</span>
                <span className="text-[10px] text-brand-muted block mt-0.5">Wholesale Consignments</span>
              </div>
              <div className="p-4 rounded-2xl bg-brand-surface border border-amber-500/30">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">Pending Approval</span>
                <span className="text-2xl font-black text-amber-300 font-mono">
                  {myOrders.filter(o => o.status === 'Pending').length}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Awaiting dispatch verify</span>
              </div>
              <div className="p-4 rounded-2xl bg-brand-surface border border-sky-500/30">
                <span className="text-[10px] uppercase font-bold text-sky-400 block mb-1">Processing / Dispatched</span>
                <span className="text-2xl font-black text-sky-300 font-mono">
                  {myOrders.filter(o => ['Confirmed', 'Processing', 'Dispatched'].includes(o.status)).length}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">In logistics pipeline</span>
              </div>
              <div className="p-4 rounded-2xl bg-brand-surface border border-emerald-500/30">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Total Investment</span>
                <span className="text-2xl font-black text-emerald-300 font-mono">
                  ₹{myOrders.reduce((sum, o) => sum + (o.grandTotal || o.totalAmount || 0), 0).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Net Wholesale Value</span>
              </div>
            </div>

            {/* Orders List or Empty State */}
            {myOrders.length === 0 ? (
              <div className="text-center py-16 bg-brand-surface rounded-3xl border border-dashed border-brand-border p-8">
                <ShoppingCart className="w-14 h-14 text-amber-400/40 mx-auto mb-4" />
                <h4 className="text-base font-bold text-white mb-1">No Wholesale Orders Placed Yet</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                  You haven't placed any wholesale shoe carton orders yet. Add items from our certified catalog or use the Cart to generate your order consignment.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                >
                  Browse B2B Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {myOrders.map((order) => {
                  const statusColors = {
                    Pending: 'bg-amber-950/80 text-amber-400 border-amber-500/50',
                    Confirmed: 'bg-blue-950/80 text-blue-400 border-blue-500/50',
                    Processing: 'bg-purple-950/80 text-purple-400 border-purple-500/50',
                    Dispatched: 'bg-sky-950/80 text-sky-400 border-sky-500/50',
                    Shipped: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/50',
                    Hold: 'bg-amber-950/80 text-amber-300 border-amber-500/60',
                    Delivered: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50',
                    Cancelled: 'bg-red-950/80 text-red-400 border-red-500/50'
                  };

                  const steps = ['Pending', 'Confirmed', 'Processing', 'Dispatched', 'Delivered'];
                  const currentStepIdx = steps.indexOf(order.status);

                  return (
                    <div
                      key={order.orderId || order.id}
                      className="bg-brand-surface rounded-3xl border border-brand-border overflow-hidden shadow-2xl transition-all hover:border-amber-400/40"
                    >
                      {/* Top Header Card */}
                      <div className="bg-slate-900/90 border-b border-brand-border p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-sm font-black text-amber-400 px-3 py-1 rounded-xl bg-amber-400/10 border border-amber-400/30">
                            {order.orderId || order.id}
                          </span>
                          <span className="text-xs text-slate-400">
                            Placed on: <strong className="text-white">{new Date(order.createdAt || order.timestamp || Date.now()).toLocaleString('en-IN')}</strong>
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusColors[order.status] || 'bg-slate-800 text-slate-300'}`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {['Pending', 'Hold', 'Draft'].includes(order.status) && (
                            <button
                              type="button"
                              onClick={() => handleStartEditOrder(order)}
                              className="px-3.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 text-amber-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-95"
                              title="Edit Sets, Sizes, Specifications or Delivery Notes"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                              <span>Edit Order</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedOrderForInvoice(order)}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Tax Invoice</span>
                          </button>
                        </div>
                      </div>

                      {/* Status Progress Stepper */}
                      {order.status !== 'Cancelled' && (
                        <div className="px-6 py-4 bg-slate-950/40 border-b border-brand-border/60">
                          <div className="grid grid-cols-5 gap-2 text-center">
                            {steps.map((step, idx) => {
                              const isCompleted = currentStepIdx >= idx;
                              const isCurrent = currentStepIdx === idx;
                              return (
                                <div key={step} className="flex flex-col items-center">
                                  <div className="w-full flex items-center">
                                    <div className={`h-1 flex-1 ${idx === 0 ? 'invisible' : isCompleted ? 'bg-amber-400' : 'bg-slate-800'}`} />
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                                      isCurrent
                                        ? 'bg-amber-400 text-slate-950 border-white ring-4 ring-amber-400/20 animate-pulse'
                                        : isCompleted
                                        ? 'bg-amber-400 text-slate-950 border-amber-400'
                                        : 'bg-slate-900 text-slate-500 border-slate-700'
                                    }`}>
                                      {idx + 1}
                                    </div>
                                    <div className={`h-1 flex-1 ${idx === steps.length - 1 ? 'invisible' : currentStepIdx > idx ? 'bg-amber-400' : 'bg-slate-800'}`} />
                                  </div>
                                  <span className={`text-[10px] mt-1.5 font-bold uppercase tracking-wider ${
                                    isCurrent ? 'text-amber-400' : isCompleted ? 'text-slate-200' : 'text-slate-500'
                                  }`}>
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Hold Status Notice */}
                      {order.status === 'Hold' && (
                        <div className="mx-5 mt-4 p-3 rounded-xl bg-amber-950/60 border border-amber-500/50 text-amber-300 text-xs flex items-center gap-2.5">
                          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                          <span>
                            <strong>Consignment on Hold:</strong> Aapka wholesale order temporarily Hold par hai. JMR central logistics team aapse document / payment clearance ke liye jald coordinate karegi.
                          </span>
                        </div>
                      )}

                      {/* Items List */}
                      <div className="p-5 space-y-4">
                        <div className="divide-y divide-slate-800">
                          {(order.items || []).map((item, i) => {
                            const pairsPerSet = item.pairsPerSet || 12;
                            const ratePerPair = item.ratePerPair || item.wholesaleRate || item.wholesalePrice || 750;
                            const ratePerSet = item.ratePerSet || (pairsPerSet * ratePerPair);
                            const sets = item.sets || item.quantity || 1;
                            const totalPairs = item.totalPairs || (sets * pairsPerSet);
                            const subtotal = item.subtotal || (sets * ratePerSet);

                            return (
                              <div key={i} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={item.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100'}
                                    alt={item.name}
                                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                                        {item.brandName || 'Brand Footwear'}
                                      </span>
                                      <span className="px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 text-[10px] font-mono font-bold border border-amber-400/20">
                                        1 Set = {pairsPerSet} Pairs
                                      </span>
                                    </div>
                                    <h5 className="font-bold text-white text-xs sm:text-sm truncate">
                                      {item.name}
                                    </h5>
                                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                      <span className="text-[10px] text-slate-400 font-mono">
                                        SKU: {item.sku || 'N/A'} • MRP: ₹{ratePerPair}/pair (₹{ratePerSet.toLocaleString('en-IN')}/set)
                                      </span>
                                      {item.color && (
                                        <span className="px-1.5 py-0.2 rounded bg-amber-400/15 text-amber-300 text-[10px] font-semibold border border-amber-400/30 inline-flex items-center gap-1">
                                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                          Color: {item.color}
                                        </span>
                                      )}
                                    </div>
                                    {item.specification && (
                                      <div className="mt-1 text-[10px] text-amber-300/90 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                                        <strong>निर्देश (Specification):</strong> {item.specification}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="text-xs text-white font-bold block">
                                    {sets} {sets === 1 ? 'Set' : 'Sets'}
                                  </span>
                                  <span className="text-[10px] text-sky-400 font-mono font-bold block">
                                    ({totalPairs} Pairs)
                                  </span>
                                  <span className="font-mono text-sm font-bold text-amber-300 block">
                                    ₹{subtotal.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Order Footer Breakdown */}
                        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                              Consignment Delivery & Destination
                            </span>
                            <p className="text-white font-bold">
                              Party: {order.partyName || order.companyName || order.customerName}
                            </p>
                            <p className="text-amber-300 font-semibold text-[11px]">
                              📍 Destination Station: {order.station || order.city || 'Standard Hub'}
                            </p>
                            <p className="text-slate-300 text-[11px]">
                              Address: {order.shippingAddress || 'Store premises (Standard Trade Delivery)'}
                            </p>
                            <p className="text-slate-400 text-[11px]">
                              Contact: {order.customerName} • Ph: {order.customerPhone}
                            </p>
                            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-400/20">
                              Payment: {order.paymentMethod || order.paymentMode || 'Commercial NEFT/RTGS'}
                            </span>
                            {order.specification && (
                              <div className="mt-2 pt-2 border-t border-slate-800 text-indigo-300 text-[11px] bg-indigo-950/30 p-2 rounded-lg border border-indigo-500/30">
                                <span className="font-bold block text-indigo-400">Order Specification / निर्देश:</span>
                                {order.specification}
                              </div>
                            )}
                          </div>

                          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1 text-right flex flex-col justify-between">
                            <div className="space-y-0.5 text-[11px] text-slate-400">
                              <div className="flex justify-between">
                                <span>Total Ordered Sets:</span>
                                <span className="font-mono font-bold text-white">{order.totalSets || order.totalItems || (order.items || []).reduce((s, it) => s + (it.sets || it.quantity || 1), 0)} Sets</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Total Footwear Pairs:</span>
                                <span className="font-mono font-bold text-sky-400">{order.totalPairs || (order.items || []).reduce((s, it) => s + (it.totalPairs || ((it.sets || it.quantity || 1) * (it.pairsPerSet || 12))), 0)} Pairs</span>
                              </div>
                              <div className="flex justify-between">
                                <span>GST (18% B2B):</span>
                                <span className="font-mono text-emerald-400 font-medium">Included / ITC Eligible</span>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-700/60 flex justify-between items-baseline">
                              <span className="font-bold text-xs uppercase tracking-wider text-amber-400">Consignment Value:</span>
                              <span className="font-mono text-lg font-black text-amber-300">
                                ₹{(order.grandTotal || order.totalAmount || 0).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Admin Processing Note */}
                        {order.adminNote && (
                          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200">
                            <strong className="text-blue-300 block mb-0.5 font-bold">Warehouse Dispatch Note:</strong>
                            {order.adminNote}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB: SHORTLIST / WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header Banner */}
            <div className="bg-brand-surface rounded-2xl border border-rose-500/30 p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 text-[10px] font-bold uppercase tracking-widest border border-rose-500/30 mb-2">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>Wholesale Footwear Shortlist</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">Your Saved & Liked Footwear Articles</h3>
                <p className="text-xs text-brand-muted mt-1">
                  Articles you have marked for stock replenishment. Move directly to wholesale cart or place quick carton booking.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {wishlistItems.length > 0 && (
                  <button
                    onClick={() => {
                      wishlistItems.forEach(item => addToCart(item, 1));
                      if (onNotification) {
                        onNotification({
                          message: 'All Shortlisted Items Added',
                          subtext: `${wishlistItems.length} articles added to your wholesale cart.`
                        });
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add All to Cart</span>
                  </button>
                )}
                <button
                  onClick={openWishlist}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-rose-500/40 text-rose-300 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <Heart className="w-4 h-4" />
                  <span>View Drawer</span>
                </button>
              </div>
            </div>

            {/* Wishlist Items Grid or Empty State */}
            {wishlistItems.length === 0 ? (
              <div className="bg-brand-surface rounded-3xl border border-brand-border p-12 text-center shadow-xl max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
                  <Heart className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Your Shortlist is Empty</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You haven't liked or shortlisted any footwear articles yet. Explore the B2B catalog and tap the heart icon on any shoe to shortlist it.
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all"
                >
                  <Package className="w-4 h-4" />
                  <span>Browse B2B Catalog</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((product) => (
                  <div 
                    key={product.id}
                    className="bg-brand-surface rounded-2xl border border-brand-border hover:border-rose-500/50 transition-all overflow-hidden flex flex-col justify-between group shadow-xl"
                  >
                    <div>
                      <div className="relative h-48 bg-brand-dark overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-brand-gold text-brand-dark text-[10px] font-bold uppercase tracking-wider">
                          {product.brandName}
                        </div>
                        <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white border border-white/20">
                          {product.category}
                        </div>

                        {/* Remove from Wishlist button */}
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(product.id)}
                          className="absolute bottom-3 right-3 p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600 shadow-md active:scale-90 transition-all"
                          title="Remove from Shortlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-5 space-y-3">
                        <div>
                          <h3 className="font-bold text-white text-base leading-snug group-hover:text-rose-400 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-[11px] text-brand-muted font-mono mt-0.5">SKU: {product.sku}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-brand-card/60 border border-brand-border space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium">B2B Wholesale Rate:</span>
                            <span className="text-brand-gold font-mono font-bold text-sm">{product.wholesaleRate || `₹${product.price}`}</span>
                          </div>
                          {product.suggestedRetailPrice && (
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400 font-medium">Suggested Retail MSRP:</span>
                              <span className="text-slate-300 font-mono line-through">{product.suggestedRetailPrice}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-xs border-t border-brand-border/60 pt-1.5 text-emerald-400 font-medium">
                            <span>Standard Carton Size:</span>
                            <span>{product.moq || 'Assorted Size Curve'}</span>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-300 space-y-1">
                          <p><strong className="text-slate-400">Sizes:</strong> {product.sizeRange || 'UK 6 - 10'}</p>
                          <p><strong className="text-slate-400">Colors:</strong> {Array.isArray(product.colors) ? product.colors.join(', ') : product.colors}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center gap-2">
                      <button
                        onClick={() => {
                          addToCart(product, 1);
                          if (onNotification) {
                            onNotification({
                              message: 'Article Added to Cart',
                              subtext: `${product.name} (1 set / carton) added to wholesale cart.`
                            });
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-sm transition-all active:scale-95"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                      <button
                        onClick={() => setBookingProduct(product)}
                        className="px-3 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-200 hover:text-white font-bold text-xs transition-colors"
                        title="Book Carton Directly"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BANK SETTLEMENT & NEFT DETAILS */}
        {activeTab === 'bank' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Settlement Instructions Banner */}
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-bold uppercase tracking-widest border border-brand-gold/30 mb-2">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Wholesale Trade Payment Gateway</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">Commercial Bank Settlement & NEFT / RTGS Coordinates</h3>
                <p className="text-xs text-brand-muted mt-1">
                  For master carton orders, remit funds to the authorized JMR Shooz distribution current account. Mention your Retailer ID in remittance remarks.
                </p>
              </div>

              <button
                onClick={() => setShowEditBankModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-gold/40 text-brand-gold font-bold text-xs uppercase tracking-wider transition-colors shrink-0"
              >
                <Edit3 className="w-4 h-4" />
                <span>Update My Store's Bank / GST</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Official Company Settlement Account */}
              <div className="lg:col-span-7 bg-brand-surface rounded-3xl border border-brand-gold/40 p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="border-b border-brand-border/80 pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold block">
                      OFFICIAL COMPANY BENEFICIARY ACCOUNT
                    </span>
                    <h4 className="text-lg font-bold text-white mt-0.5">
                      {companyBank.accountName || 'JMR SHOOZ DISTRIBUTION PRIVATE LIMITED'}
                    </h4>
                  </div>
                  <Building2 className="w-8 h-8 text-brand-gold/60" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Bank Name */}
                  <div className="p-4 rounded-xl bg-brand-card/70 border border-brand-border">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Bank Name</span>
                    <span className="text-sm font-bold text-white block">{companyBank.bankName || 'HDFC Bank'}</span>
                    <span className="text-[10px] text-brand-muted">{companyBank.accountType || 'Current Account'}</span>
                  </div>

                  {/* Account Number with Copy */}
                  <div className="p-4 rounded-xl bg-brand-card/70 border border-brand-border relative group">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Account Number</span>
                    <span className="text-sm font-mono font-bold text-brand-gold block">
                      {companyBank.accountNumber || '50200084920194'}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(companyBank.accountNumber, 'acc')}
                      className="absolute right-3 top-3 p-1.5 rounded-lg bg-brand-dark hover:bg-brand-gold/20 text-brand-gold border border-brand-border text-xs"
                      title="Copy Account Number"
                    >
                      {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* IFSC Code with Copy */}
                  <div className="p-4 rounded-xl bg-brand-card/70 border border-brand-border relative group">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">IFSC Code</span>
                    <span className="text-sm font-mono font-bold text-white block">
                      {companyBank.ifscCode || 'HDFC0000128'}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(companyBank.ifscCode, 'ifsc')}
                      className="absolute right-3 top-3 p-1.5 rounded-lg bg-brand-dark hover:bg-brand-gold/20 text-brand-gold border border-brand-border text-xs"
                      title="Copy IFSC Code"
                    >
                      {copiedField === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* UPI ID with Copy */}
                  <div className="p-4 rounded-xl bg-brand-card/70 border border-brand-border relative group">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">UPI ID (Instant Transfer)</span>
                    <span className="text-sm font-mono font-bold text-emerald-400 block">
                      {companyBank.upiId || 'jmrshooz@hdfcbank'}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(companyBank.upiId, 'upi')}
                      className="absolute right-3 top-3 p-1.5 rounded-lg bg-brand-dark hover:bg-brand-gold/20 text-brand-gold border border-brand-border text-xs"
                      title="Copy UPI ID"
                    >
                      {copiedField === 'upi' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                </div>

                <div className="p-4 rounded-xl bg-brand-card/40 border border-brand-border/60 text-xs space-y-2 text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Branch Location:</span>
                    <span className="font-medium text-white">{companyBank.branch || 'Kirti Nagar Commercial Complex, New Delhi'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Distributor GSTIN:</span>
                    <span className="font-mono font-bold text-brand-gold">{companyBank.companyGstin || '07AAACJ1234F1Z8'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Permanent Account Number (PAN):</span>
                    <span className="font-mono font-medium text-white">{companyBank.companyPan || 'AAACJ1234F'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 text-xs text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Payments are processed with 100% statutory compliance under GST Section 16 for full Input Tax Credit (ITC) claim.</span>
                </div>
              </div>

              {/* Right Column: Your Store's Registered Bank & GST Coordinates */}
              <div className="lg:col-span-5 bg-brand-surface rounded-3xl border border-brand-border p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
                <div>
                  <div className="border-b border-brand-border/80 pb-4 mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted block">
                        YOUR REGISTERED STORE PROFILE
                      </span>
                      <h4 className="text-base font-bold text-white">
                        {currentUser?.companyName || 'My Footwear Business'}
                      </h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-bold border border-brand-gold/30">
                      Stockist
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="p-3 rounded-xl bg-brand-card/60 border border-brand-border">
                      <span className="text-[10px] uppercase font-bold text-brand-muted block mb-0.5">Registered GSTIN</span>
                      <span className="text-sm font-mono font-bold text-brand-gold">
                        {currentUser?.gstin || 'Not Provided (Click Edit to Add)'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-brand-card/60 border border-brand-border">
                      <span className="text-[10px] uppercase font-bold text-brand-muted block mb-0.5">Your Settlement Bank</span>
                      <span className="text-sm font-bold text-white block">
                        {currentUser?.bankName || 'Not Set'}
                      </span>
                      <span className="text-[11px] font-mono text-slate-300 block mt-0.5">
                        A/C: {currentUser?.accountNo || '••••••••••••'} • IFSC: {currentUser?.ifsc || 'N/A'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-brand-card/60 border border-brand-border">
                      <span className="text-[10px] uppercase font-bold text-brand-muted block mb-0.5">Contact Coordinates</span>
                      <span className="text-xs text-slate-300 block">
                        {currentUser?.name} • {currentUser?.phone}
                      </span>
                      <span className="text-xs text-slate-400 block font-mono mt-0.5">
                        {currentUser?.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-border/60">
                  <button
                    type="button"
                    onClick={() => setShowEditBankModal(true)}
                    className="w-full py-3 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-gold/50 text-brand-gold font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Update Bank & GST Details</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: QUERIES & STOCK REQUESTS */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-5 flex items-center justify-between shadow-xl">
              <div>
                <h3 className="font-bold text-white text-base">Your Active Inquiry & Dispatch Tickets</h3>
                <p className="text-xs text-brand-muted">Track status of wholesale stock allocations and distributor support queries.</p>
              </div>
              <button
                onClick={() => openQueryModal()}
                className="px-4 py-2 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110"
              >
                + New Inquiry
              </button>
            </div>

            {myQueries.length === 0 ? (
              <div className="text-center py-16 bg-brand-surface rounded-2xl border border-dashed border-brand-border">
                <MessageSquare className="w-12 h-12 text-brand-muted mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white">No Inquiries or Requests Yet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-4">
                  Select a shoe model from the Wholesale Catalog to book cartons or submit distributor feedback.
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-4 py-2 rounded-xl bg-brand-card border border-brand-gold text-brand-gold text-xs font-bold uppercase"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myQueries.map((q) => (
                  <div key={q.id} className="p-4 rounded-xl bg-brand-surface border border-brand-border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-brand-gold">#{q.id}</span>
                        <span className="px-2 py-0.5 rounded-full bg-brand-card text-[10px] font-bold text-slate-300 border border-brand-border">
                          {q.type}
                        </span>
                        {q.brandName && (
                          <span className="text-xs text-brand-muted font-medium">• Brand: <strong className="text-white">{q.brandName}</strong></span>
                        )}
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        q.status === 'Resolved' 
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40' 
                          : q.status === 'In Review' 
                          ? 'bg-blue-950/60 text-blue-400 border border-blue-500/40' 
                          : 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                      }`}>
                        {q.status}
                      </span>
                    </div>

                    <h5 className="font-bold text-white text-sm">{q.subject}</h5>
                    <p className="text-xs text-slate-300 leading-relaxed bg-brand-card/40 p-3 rounded-lg border border-brand-border/60">
                      {q.message}
                    </p>
                    <span className="text-[10px] text-brand-muted block">
                      Submitted on: {new Date(q.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: MY PROFILE & BUSINESS DETAILS */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Profile Card with Photo & Identity */}
            <div className="bg-brand-surface rounded-3xl border border-brand-border p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-brand-border/60">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* Avatar with Upload button */}
                  <div className="relative group shrink-0">
                    <div className="w-24 h-24 rounded-3xl bg-brand-card border-2 border-brand-gold/50 flex items-center justify-center text-brand-gold overflow-hidden shadow-gold-sm">
                      {userData?.avatar ? (
                        <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <Store className="w-12 h-12" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (fileInputRef.current) fileInputRef.current.click();
                      }}
                      className="absolute -bottom-2 -right-2 p-2 rounded-full bg-brand-gold text-brand-dark hover:brightness-110 shadow-lg transition-transform hover:scale-110 cursor-pointer"
                      title="Upload New Profile Picture"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black text-brand-gold px-3 py-0.5 rounded-full bg-brand-gold/15 border border-brand-gold/30">
                        {userData?.retailerId || currentUser?.retailerId || 'RET-ACTIVE'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 inline-flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verified Account</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-400 text-[10px] font-bold border border-sky-500/30">
                        {userData?.businessType || 'Footwear Retail Store'}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
                      {userData?.companyName || currentUser?.companyName || 'Business Name'}
                    </h2>
                    <p className="text-xs text-slate-300">
                      Authorized Buyer: <strong className="text-brand-gold">{userData?.name || currentUser?.name || 'Owner Name'}</strong> • {userData?.city || 'India'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditProfileModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (fileInputRef.current) fileInputRef.current.click();
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-brand-gold" />
                    <span>Upload Photo</span>
                  </button>

                  {userData?.avatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="p-2.5 rounded-xl bg-brand-card hover:bg-red-950/40 border border-brand-border hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                      title="Remove Profile Picture"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Preset Avatars Row */}
              <div className="mt-5 pt-4 flex flex-wrap items-center gap-4">
                <span className="text-xs text-slate-400 font-medium">Quick Avatar Presets:</span>
                <div className="flex items-center gap-2.5">
                  {AVATAR_PRESETS.map((presetUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPresetAvatar(presetUrl)}
                      className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all hover:scale-110 ${
                        userData?.avatar === presetUrl ? 'border-brand-gold ring-2 ring-brand-gold/30' : 'border-slate-700 hover:border-slate-500'
                      }`}
                      title={`Select Avatar ${idx + 1}`}
                    >
                      <img src={presetUrl} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Information Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Official Business Coordinates */}
              <div className="bg-brand-surface rounded-3xl border border-brand-border p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-brand-border pb-3">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-brand-gold" />
                    <h4 className="font-bold text-white text-sm">Store & Contact Profile</h4>
                  </div>
                  <span className="text-[10px] text-brand-muted font-mono uppercase">Identity Record</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Registered Shop / Company:</span>
                    <span className="text-white font-bold">{userData?.companyName || 'Not configured'}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Authorized Contact Person:</span>
                    <span className="text-white font-bold">{userData?.name || 'Not configured'}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Official Retailer Code:</span>
                    <span className="font-mono text-brand-gold font-bold">{userData?.retailerId || 'RET-ACTIVE'}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Contact Phone / WhatsApp:</span>
                    <span className="text-white font-mono font-medium">{userData?.phone || 'Not configured'}</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400">Registered Email Address:</span>
                    <span className="text-slate-200 font-mono">{userData?.email || 'Not configured'}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Delivery Destination & Transport Bilty Coordinates */}
              <div className="bg-brand-surface rounded-3xl border border-brand-border p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-brand-border pb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-sky-400" />
                    <h4 className="font-bold text-white text-sm">Logistics & Delivery Station</h4>
                  </div>
                  <span className="text-[10px] text-sky-400 font-mono uppercase">Bilty Destination</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Destination Station / Transport Hub:</span>
                    <span className="text-amber-300 font-bold">{userData?.station || userData?.city || 'Regional Cargo Hub'}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Base City / Territory:</span>
                    <span className="text-white font-semibold">{userData?.city || 'India'}</span>
                  </div>

                  <div className="py-1 border-b border-slate-800 space-y-1">
                    <span className="text-slate-400 block">Complete Shipping / Godown Address:</span>
                    <p className="text-slate-200 bg-brand-card/60 p-2.5 rounded-xl border border-slate-800 leading-relaxed font-sans text-xs">
                      {userData?.address || userData?.shippingAddress || 'Shop / Godown address not configured. Click Edit Profile to set.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400">Dispatch Preference:</span>
                    <span className="text-emerald-400 font-medium">Direct Hub Express Transport</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Tax & Legal Compliance */}
              <div className="bg-brand-surface rounded-3xl border border-brand-border p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-brand-border pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-bold text-white text-sm">Tax & Compliance Record</h4>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono uppercase">GSTIN Verified</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">GSTIN Number:</span>
                    <span className="font-mono font-bold text-white">{userData?.gstin || 'Not registered / Non-GST'}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Tax Invoice Type:</span>
                    <span className="text-emerald-300 font-medium">B2B Footwear Wholesale (Pure MRP Billing)</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400">Account Authorization:</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      Authorized B2B Partner
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 4: Settlement Bank Coordinates */}
              <div className="bg-brand-surface rounded-3xl border border-brand-border p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-brand-border pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-brand-gold" />
                    <h4 className="font-bold text-white text-sm">Bank Settlement Coordinates</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEditBankModal(true)}
                    className="text-[11px] text-brand-gold hover:underline font-bold"
                  >
                    Edit Bank
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Settlement Bank:</span>
                    <span className="text-white font-bold">{userData?.bankName || 'Not configured'}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Account Number:</span>
                    <span className="font-mono text-white">
                      {userData?.accountNo ? `•••• •••• ${userData.accountNo.slice(-4)}` : 'Not configured'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">IFSC Code:</span>
                    <span className="font-mono text-white">{userData?.ifsc || 'Not configured'}</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400">Store UPI ID:</span>
                    <span className="font-mono text-brand-gold">{userData?.upiId || 'Not configured'}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* MODAL: EDIT RETAILER BANK & GST DETAILS */}
      {showEditBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-1">Update Store Bank & GST Coordinates</h3>
            <p className="text-xs text-brand-muted mb-4">
              Saved securely for trade rebates, tax compliance, and billing reconciliation.
            </p>

            <form onSubmit={handleSaveRetailerBank} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  GSTIN (GST Number) *
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={editBankForm.gstin}
                  onChange={(e) => setEditBankForm({ ...editBankForm, gstin: e.target.value.toUpperCase() })}
                  placeholder="e.g. 07AAAAA0000A1Z5"
                  className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm font-mono uppercase focus:outline-none focus:border-brand-gold"
                />
                <span className="text-[10px] text-emerald-400 mt-1 block">
                  Mandatory for Input Tax Credit (ITC) tax invoice matching.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Settlement Bank Name
                  </label>
                  <input
                    type="text"
                    value={editBankForm.bankName}
                    onChange={(e) => setEditBankForm({ ...editBankForm, bankName: e.target.value })}
                    placeholder="e.g. State Bank of India"
                    className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    value={editBankForm.accountNo}
                    onChange={(e) => setEditBankForm({ ...editBankForm, accountNo: e.target.value })}
                    placeholder="e.g. 30948572910"
                    className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm font-mono focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={editBankForm.ifsc}
                    onChange={(e) => setEditBankForm({ ...editBankForm, ifsc: e.target.value.toUpperCase() })}
                    placeholder="e.g. SBIN0001245"
                    className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm font-mono uppercase focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    value={editBankForm.branch}
                    onChange={(e) => setEditBankForm({ ...editBankForm, branch: e.target.value })}
                    placeholder="e.g. Rajouri Garden, Delhi"
                    className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  UPI ID (Optional)
                </label>
                <input
                  type="text"
                  value={editBankForm.upiId}
                  onChange={(e) => setEditBankForm({ ...editBankForm, upiId: e.target.value })}
                  placeholder="e.g. metrofootwear@sbi"
                  className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm font-mono focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditBankModal(false)}
                  className="px-4 py-2 rounded-xl bg-brand-card text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-bold uppercase tracking-wider hover:brightness-110 shadow-gold-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Bank Coordinates</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT RETAILER PROFILE DETAILS */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-brand-border mb-4">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-brand-gold" />
                <h3 className="text-lg font-bold text-white">Edit Store & Business Profile</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Authorized Representative Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Footwear Shop / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.companyName}
                    onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                    placeholder="e.g. Metro Footwear Store"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Mobile / WhatsApp Contact *
                  </label>
                  <input
                    type="tel"
                    required
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="e.g. 9811122334"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    GSTIN Number (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    value={profileForm.gstin}
                    onChange={(e) => setProfileForm({ ...profileForm, gstin: e.target.value.toUpperCase() })}
                    placeholder="e.g. 07AAAAA0000A1Z5"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    placeholder="e.g. Indore, New Delhi, Agra"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-amber-300 mb-1 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Destination Station / Cargo Hub *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.station}
                    onChange={(e) => setProfileForm({ ...profileForm, station: e.target.value })}
                    placeholder="e.g. Indore Central Goods Shed / Transport Nagar"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-amber-500/40 text-white text-sm focus:outline-none focus:border-brand-gold font-medium"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Used for consignee bilty & master carton markings.</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Complete Store / Godown Delivery Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  placeholder="Shop number, market name, street, landmark, pincode..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold leading-relaxed font-medium"
                />
              </div>

              {/* Settlement Bank Fields */}
              <div className="pt-2 border-t border-brand-border/60">
                <span className="text-[11px] font-bold text-brand-gold uppercase tracking-wider block mb-2">
                  Settlement & Rebate Bank Coordinates (Optional)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={profileForm.bankName}
                      onChange={(e) => setProfileForm({ ...profileForm, bankName: e.target.value })}
                      placeholder="e.g. State Bank of India"
                      className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Account Number</label>
                    <input
                      type="text"
                      value={profileForm.accountNo}
                      onChange={(e) => setProfileForm({ ...profileForm, accountNo: e.target.value })}
                      placeholder="e.g. 30948572910"
                      className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">IFSC Code</label>
                    <input
                      type="text"
                      value={profileForm.ifsc}
                      onChange={(e) => setProfileForm({ ...profileForm, ifsc: e.target.value.toUpperCase() })}
                      placeholder="e.g. SBIN0001245"
                      className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">UPI ID</label>
                    <input
                      type="text"
                      value={profileForm.upiId}
                      onChange={(e) => setProfileForm({ ...profileForm, upiId: e.target.value })}
                      placeholder="e.g. storename@sbi"
                      className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2 rounded-xl bg-brand-card text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold uppercase tracking-wider hover:brightness-110 shadow-gold-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT WHOLESALE ORDER */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-brand-border mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-amber-400 px-2.5 py-0.5 rounded-lg bg-amber-400/10 border border-amber-400/30">
                    {editingOrder.orderId || editingOrder.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-500/60">
                    Status: {editingOrder.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Edit Wholesale Consignment Order
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                <span>Footwear Articles & Set Quantities</span>
                <span>Subtotal (Pure MRP)</span>
              </div>

              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                {editOrderItems.map((item, idx) => {
                  const pairsPerSet = item.pairsPerSet || 12;
                  const ratePerPair = item.ratePerPair || item.wholesaleRate || item.wholesalePrice || 750;
                  const ratePerSet = item.ratePerSet || (pairsPerSet * ratePerPair);
                  const sets = parseInt(item.sets, 10) || parseInt(item.quantity, 10) || 1;
                  const itemSubtotal = sets * ratePerSet;
                  const totalItemPairs = sets * pairsPerSet;

                  return (
                    <div key={idx} className="p-3.5 rounded-2xl bg-brand-card/70 border border-slate-800 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100'}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider block">
                              {item.brandName || 'Brand'}
                            </span>
                            <h5 className="font-bold text-white text-xs sm:text-sm">{item.name}</h5>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              <span>1 Set = {pairsPerSet} Pairs</span>
                              <span>•</span>
                              <span>MRP: ₹{ratePerPair}/pr</span>
                              {item.color && (
                                <>
                                  <span>•</span>
                                  <span className="text-amber-300">Color: {item.color}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-mono font-bold text-amber-300 block">
                            ₹{itemSubtotal.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({totalItemPairs} pairs)
                          </span>
                        </div>
                      </div>

                      {/* Sets Adjustment Controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-300 font-medium">Quantity (Sets):</span>
                          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                            <button
                              type="button"
                              onClick={() => handleItemSetsChange(idx, -1)}
                              disabled={sets <= 1}
                              className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 py-1 text-xs font-mono font-bold text-white min-w-8 text-center">
                              {sets}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleItemSetsChange(idx, 1)}
                              className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-slate-800"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Custom Size/Pair Specification Note */}
                        <div className="flex-1 sm:max-w-xs">
                          <input
                            type="text"
                            value={item.specification || ''}
                            onChange={(e) => handleItemSpecChange(idx, e.target.value)}
                            placeholder="Custom sizes (e.g. 7:4pr, 8:4pr)..."
                            className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Station & Address Updates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-brand-border/60">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Destination Station / Transport Hub
                  </label>
                  <input
                    type="text"
                    value={editOrderStation}
                    onChange={(e) => setEditOrderStation(e.target.value)}
                    placeholder="e.g. Indore Central Hub"
                    className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Store Shipping Address
                  </label>
                  <input
                    type="text"
                    value={editOrderAddress}
                    onChange={(e) => setEditOrderAddress(e.target.value)}
                    placeholder="Delivery shop / godown address"
                    className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Consignment Notes & Special Instructions
                </label>
                <textarea
                  rows={2}
                  value={editOrderNotes}
                  onChange={(e) => setEditOrderNotes(e.target.value)}
                  placeholder="Dispatch instructions, preferred cargo transporter, delivery date requirements..."
                  className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-medium"
                />
              </div>

              {/* Calculated Totals Box (Pure MRP Billing) */}
              <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Total Consignment Sets:</span>
                  <span className="font-bold text-white font-mono">{editCalculatedSets} Sets ({editCalculatedPairs} Pairs)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Pure MRP Subtotal:</span>
                  <span className="font-bold text-white font-mono">₹{editCalculatedSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">GST (5% Footwear B2B):</span>
                  <span className="font-bold text-white font-mono">₹{editGstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-amber-400/30">
                  <span className="font-bold text-amber-300 uppercase">Revised Grand Total:</span>
                  <span className="font-black text-amber-400 font-mono text-base">₹{editGrandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center justify-end gap-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 rounded-xl bg-brand-card text-slate-300 hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveEditedOrder(true)}
                  disabled={isSavingOrder}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider"
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveEditedOrder(false)}
                  disabled={isSavingOrder}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingOrder ? 'Saving...' : 'Save & Update Order'}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL: BOOK WHOLESALE CARTON */}
      {bookingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Book Wholesale Carton Dispatch</h3>
            <p className="text-xs text-brand-muted mb-4">Request warehouse carton reservation and invoice generation.</p>

            <div className="bg-brand-card p-3.5 rounded-xl border border-brand-border mb-4 flex items-center gap-3.5">
              <img src={bookingProduct.image} alt={bookingProduct.name} className="w-14 h-14 object-cover rounded-lg" />
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-gold block">{bookingProduct.brandName}</span>
                <h4 className="text-sm font-bold text-white">{bookingProduct.name}</h4>
                <p className="text-xs text-slate-300 font-mono">Wholesale: {bookingProduct.wholesaleRate || '₹650'} • SKU: {bookingProduct.sku}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Number of Master Cartons *
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={cartonCount}
                  onChange={(e) => setCartonCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold font-mono font-bold"
                />
                <span className="text-[11px] text-brand-muted mt-1 block">
                  Standard carton contains: {bookingProduct.moq || '36 Pairs'} (Full size curve)
                </span>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Specific Size Curve or Dispatch Instructions
                </label>
                <textarea
                  rows="2"
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="e.g. Please include extra size 8 & 9 pairs in curve, dispatch via Patel Roadways..."
                  className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBookingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-brand-card text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-bold uppercase tracking-wider hover:brightness-110 shadow-gold-sm"
                >
                  Confirm Carton Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW & PRINT WHOLESALE TAX INVOICE */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-100">
            {/* Header Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-widest block">
                  Commercial B2B Tax Invoice
                </span>
                <h3 className="text-xl font-bold text-white font-mono">
                  {selectedOrderForInvoice.orderId || selectedOrderForInvoice.id}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Sheet */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6 text-xs font-sans">
              {/* Company & Billing Header */}
              <div className="grid grid-cols-2 gap-6 pb-6 border-b border-slate-800">
                <div>
                  <h4 className="text-base font-black text-white tracking-wider">JMR SHOOZ PVT LTD</h4>
                  <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                    National Footwear Distribution Hub<br />
                    Outer Ring Road, Footwear Complex, New Delhi - 110041<br />
                    GSTIN: <span className="font-mono text-slate-200">07AAACJ4892E1Z8</span><br />
                    Email: distribution@jmrshooz.com | Ph: +91 98765 43210
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">Billed To (Party Details)</span>
                  <h5 className="font-bold text-white text-base mt-0.5">{selectedOrderForInvoice.partyName || selectedOrderForInvoice.companyName || selectedOrderForInvoice.customerName}</h5>
                  <p className="text-amber-300 font-bold text-xs mt-0.5">
                    📍 Destination Station: {selectedOrderForInvoice.station || selectedOrderForInvoice.city || 'Central Hub'}
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    Contact: {selectedOrderForInvoice.customerName}<br />
                    {selectedOrderForInvoice.shippingAddress || 'Registered Retailer Address'}<br />
                    Phone: {selectedOrderForInvoice.customerPhone} • Email: {selectedOrderForInvoice.customerEmail}<br />
                    Retailer ID: <span className="font-mono text-amber-400 font-bold">{selectedOrderForInvoice.retailerId || currentUser?.retailerId || 'N/A'}</span>
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                      <th className="py-2">Item Description</th>
                      <th className="py-2">Curve</th>
                      <th className="py-2 text-center">Pairs/Set</th>
                      <th className="py-2 text-center">Sets</th>
                      <th className="py-2 text-center">Total Pairs</th>
                      <th className="py-2 text-right">Rate/Pair</th>
                      <th className="py-2 text-right">Rate/Set</th>
                      <th className="py-2 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs">
                    {(selectedOrderForInvoice.items || []).map((it, idx) => {
                      const pairsPerSet = it.pairsPerSet || 12;
                      const ratePerPair = it.ratePerPair || it.wholesaleRate || it.wholesalePrice || 750;
                      const ratePerSet = it.ratePerSet || (pairsPerSet * ratePerPair);
                      const sets = it.sets || it.quantity || 1;
                      const totalPairs = it.totalPairs || (sets * pairsPerSet);
                      const subtotal = it.subtotal || (sets * ratePerSet);

                      return (
                        <tr key={idx}>
                          <td className="py-3 font-bold text-white">
                            <span>{it.name}</span>
                            <span className="text-[10px] text-amber-400 block font-normal">{it.brandName} • {it.sku}</span>
                            {it.specification && (
                              <span className="text-[10px] text-indigo-300 block font-normal mt-0.5">
                                Spec: {it.specification}
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-slate-400 font-mono text-[10px]">{it.sizeCurve || 'Standard'}</td>
                          <td className="py-3 text-center font-mono font-bold text-amber-300">{pairsPerSet}</td>
                          <td className="py-3 text-center font-mono font-black text-white">{sets}</td>
                          <td className="py-3 text-center font-mono font-bold text-sky-400">{totalPairs}</td>
                          <td className="py-3 text-right font-mono text-slate-300">₹{ratePerPair.toLocaleString('en-IN')}</td>
                          <td className="py-3 text-right font-mono text-slate-200">₹{ratePerSet.toLocaleString('en-IN')}</td>
                          <td className="py-3 text-right font-mono font-bold text-amber-300">
                            ₹{subtotal.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-700 bg-slate-900/60 font-bold">
                      <td colSpan={3} className="py-2.5 text-right text-slate-400 uppercase text-[10px]">Consignment Totals:</td>
                      <td className="py-2.5 text-center text-white font-mono">{selectedOrderForInvoice.totalSets || (selectedOrderForInvoice.items || []).reduce((s, it) => s + (it.sets || it.quantity || 1), 0)} Sets</td>
                      <td className="py-2.5 text-center text-sky-400 font-mono">{selectedOrderForInvoice.totalPairs || (selectedOrderForInvoice.items || []).reduce((s, it) => s + (it.totalPairs || ((it.sets || it.quantity || 1) * (it.pairsPerSet || 12))), 0)} Pairs</td>
                      <td colSpan={2} className="py-2.5 text-right text-slate-400">Total Value:</td>
                      <td className="py-2.5 text-right text-amber-300 font-mono text-sm">₹{(selectedOrderForInvoice.grandTotal || selectedOrderForInvoice.totalAmount || 0).toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Total Calculation */}
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <div className="w-72 space-y-1.5 text-xs text-right">
                  <div className="flex justify-between text-slate-400">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono text-white">₹{(selectedOrderForInvoice.subtotal || selectedOrderForInvoice.totalAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Applicable GST (18%):</span>
                    <span className="font-mono text-emerald-400">Included (ITC Eligible)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-700 flex justify-between font-bold text-sm text-amber-300">
                    <span>Total Consignment Remittance:</span>
                    <span className="font-mono text-base">₹{(selectedOrderForInvoice.grandTotal || selectedOrderForInvoice.totalAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Consignment Specification Notes */}
              {selectedOrderForInvoice.specification && (
                <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/40 text-indigo-200 text-xs">
                  <strong className="text-indigo-400 block mb-0.5">Special Consignment Specification / विशेष निर्देश:</strong>
                  {selectedOrderForInvoice.specification}
                </div>
              )}

              {/* Bank Settlement Footer */}
              <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4 text-[11px] text-slate-400">
                <div>
                  <span className="font-bold text-slate-300 block mb-0.5">Remittance Instructions:</span>
                  <p>Remit funds to HDFC A/C: 50200084920194 | IFSC: HDFC0000128</p>
                  <p className="mt-0.5 text-slate-500">Subject to Delhi jurisdiction. Computer generated invoice.</p>
                </div>
                <div className="text-right flex flex-col justify-end">
                  <span className="font-mono text-xs text-slate-400">Authorized Signatory</span>
                  <span className="font-bold text-white mt-1">JMR Shooz Logistics Desk</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default React.memo(RetailerPortal);
