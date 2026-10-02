import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';
import { useNavigate } from 'react-router-dom';
import AddProductModal from '../pages/admin/AddProductModal';
import AddBrandModal from '../pages/admin/AddBrandModal';
import { 
  updateProduct, 
  deleteProduct, 
  saveProduct, 
  updateBrand, 
  deleteBrand, 
  saveBrand, 
  getCompanySettings, 
  saveCompanySettings,
  getStoredBrands
} from '../utils/storage';
import { 
  apiUpdateProduct, 
  apiDeleteProduct, 
  apiCreateProduct, 
  apiUpdateBrand, 
  apiDeleteBrand, 
  apiCreateBrand,
  apiUpdateCompanySettings
} from '../services/api';
import { 
  Edit3, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  X, 
  AlertTriangle, 
  Settings, 
  Layers, 
  Zap,
  Sliders,
  LogOut
} from 'lucide-react';

const AdminEditContext = createContext(null);

export function AdminEditProvider({ children, onNotification }) {
  const { currentUser, logout, isAdmin, isMasterAdmin, isSubAdmin, hasPermission } = useAuth();
  const { brands = [], settings } = useData() || {};
  const navigate = useNavigate();

  // Floating Edit Mode Toggle
  const [isEditModeActive, setIsEditModeActive] = useState(true);

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    brandId: '',
    brandName: '',
    category: 'Formal',
    suggestedRetailPrice: '₹1,499 / pair',
    wholesaleRate: '₹750 / pair',
    pairsPerSet: 12,
    sizeCurve: 'UK 6-10 (Standard 12 Pairs Ratio)',
    moq: '1 Set (12 Pairs)',
    cartonSize: '36 Pairs',
    sizeRange: 'UK/IND 6 - 10',
    colors: 'Black, Brown',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
    tag: '⚡ Lightning Deal',
    description: '',
    upper: 'Synthetic PU Leather',
    outsole: 'Direct Injected PU Sole'
  });

  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brandFormData, setBrandFormData] = useState({
    name: '',
    tagline: '',
    category: 'Formal, Casual & Sports',
    origin: 'India',
    partnershipType: 'Authorized Distribution Partner',
    retailMargin: '42% - 48%',
    moq: '36 pairs / carton',
    cartonSize: '36 Pairs',
    description: '',
    bannerImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
    logoText: '',
    logoSubtext: 'OFFICIAL DISTRIBUTOR'
  });

  // Ticker Edit Modal
  const [showTickerModal, setShowTickerModal] = useState(false);
  const [tickerFormData, setTickerFormData] = useState({
    tickerActive: true,
    tickerBadge: 'B2B SUPER SALE',
    tickerText: '⚡ Direct Manufacturer Wholesale Rates · Liberty, Columbus, Aerowalk',
    tickerDispatch: '🚚 Pan-India Hub Dispatch: 24-48h',
    tickerMargin: '🏷️ Guaranteed 40%-52% Retailer Margin',
    tickerPhone: '+91 98111 22334'
  });

  // Delete Confirm Modal
  const [deleteDialog, setDeleteDialog] = useState(null); // { type: 'product' | 'brand', item: Object }

  // Load ticker data when settings change
  useEffect(() => {
    if (settings) {
      setTickerFormData({
        tickerActive: settings.tickerActive !== false,
        tickerBadge: settings.tickerBadge || 'B2B SUPER SALE',
        tickerText: settings.tickerText || '⚡ Direct Manufacturer Wholesale Rates · Liberty, Columbus, Aerowalk',
        tickerDispatch: settings.tickerDispatch || '🚚 Pan-India Hub Dispatch: 24-48h',
        tickerMargin: settings.tickerMargin || '🏷️ Guaranteed 40%-52% Retailer Margin',
        tickerPhone: settings.tickerPhone || '+91 98111 22334'
      });
    }
  }, [settings]);

  // Product actions
  const openEditProduct = (product) => {
    if (!hasPermission('manage_products')) {
      alert('Your account is not authorized to edit footwear products.');
      return;
    }
    setEditingProduct(product);
    const pairsPerSet = product.pairsPerSet || 12;
    setProductFormData({
      ...product,
      pairsPerSet,
      sizeCurve: product.sizeCurve || `UK 6-10 (Standard ${pairsPerSet} Pairs Curve)`,
      colors: Array.isArray(product.colors) ? product.colors.join(', ') : (product.colors || ''),
      upper: product.materials?.upper || product.upper || 'Synthetic PU Leather',
      outsole: product.materials?.outsole || product.outsole || 'Direct Injected PU Sole'
    });
    setShowProductModal(true);
  };

  const openAddProduct = (defaultBrandId = '') => {
    if (!hasPermission('manage_products')) {
      alert('Your account is not authorized to add footwear products.');
      return;
    }
    const currentBrands = brands.length > 0 ? brands : getStoredBrands();
    const selected = currentBrands.find(b => b.id === defaultBrandId) || currentBrands[0] || {};
    setEditingProduct(null);
    setProductFormData({
      name: '',
      brandId: selected.id || 'liberty',
      brandName: selected.name || 'Liberty',
      category: 'Formal',
      suggestedRetailPrice: '₹1,499 / pair',
      wholesaleRate: '₹750 / pair',
      pairsPerSet: 12,
      sizeCurve: 'UK 6-10 (Standard 12 Pairs Ratio)',
      moq: '1 Set (12 Pairs)',
      cartonSize: '36 Pairs',
      sizeRange: 'UK/IND 6 - 10',
      colors: 'Black, Brown',
      image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
      tag: '⚡ Lightning Deal',
      description: '',
      upper: 'Synthetic PU Leather',
      outsole: 'Direct Injected PU Sole'
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    if (e) e.preventDefault();
    try {
      if (editingProduct) {
        updateProduct(editingProduct.id, productFormData);
        await apiUpdateProduct(editingProduct.id, productFormData);
        if (onNotification) {
          onNotification({
            message: 'Footwear SKU Updated',
            subtext: `Saved changes to ${productFormData.name}.`
          });
        }
      } else {
        const created = saveProduct(productFormData);
        await apiCreateProduct(created);
        if (onNotification) {
          onNotification({
            message: 'New SKU Created',
            subtext: `Added ${productFormData.name} to catalog.`
          });
        }
      }
      setShowProductModal(false);
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    }
  };

  const confirmDeleteProduct = (product) => {
    if (!hasPermission('delete_products') && !isMasterAdmin) {
      alert('Your account is not authorized to delete footwear products.');
      return;
    }
    setDeleteDialog({ type: 'product', item: product });
  };

  // Brand actions
  const openEditBrand = (brand) => {
    if (!hasPermission('manage_brands')) {
      alert('Your account is not authorized to edit brands.');
      return;
    }
    setEditingBrand(brand);
    setBrandFormData({
      ...brand
    });
    setShowBrandModal(true);
  };

  const openAddBrand = () => {
    if (!hasPermission('manage_brands')) {
      alert('Your account is not authorized to add brands.');
      return;
    }
    setEditingBrand(null);
    setBrandFormData({
      name: '',
      tagline: '',
      category: 'Formal, Casual & Sports',
      origin: 'India',
      partnershipType: 'Authorized Distribution Partner',
      retailMargin: '42% - 48%',
      moq: '36 pairs / carton',
      cartonSize: '36 Pairs',
      description: '',
      bannerImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
      logoText: '',
      logoSubtext: 'OFFICIAL DISTRIBUTOR'
    });
    setShowBrandModal(true);
  };

  const handleSaveBrand = async (e) => {
    if (e) e.preventDefault();
    try {
      if (editingBrand) {
        updateBrand(editingBrand.id, brandFormData);
        await apiUpdateBrand(editingBrand.id, brandFormData);
        if (onNotification) {
          onNotification({
            message: 'Brand Portfolio Updated',
            subtext: `Saved changes to ${brandFormData.name}.`
          });
        }
      } else {
        const created = saveBrand(brandFormData);
        await apiCreateBrand(created);
        if (onNotification) {
          onNotification({
            message: 'New Brand Added',
            subtext: `Added ${brandFormData.name} to portfolio.`
          });
        }
      }
      setShowBrandModal(false);
    } catch (err) {
      console.error(err);
      alert('Error saving brand');
    }
  };

  const confirmDeleteBrand = (brand) => {
    if (!hasPermission('delete_brands') && !isMasterAdmin) {
      alert('Your account is not authorized to delete brands.');
      return;
    }
    setDeleteDialog({ type: 'brand', item: brand });
  };

  // Ticker actions
  const openEditTicker = () => {
    if (!hasPermission('manage_cms')) {
      alert('Your account is not authorized to edit website deals.');
      return;
    }
    const current = getCompanySettings();
    setTickerFormData({
      tickerActive: current.tickerActive !== false,
      tickerBadge: current.tickerBadge || 'B2B SUPER SALE',
      tickerText: current.tickerText || '⚡ Direct Manufacturer Wholesale Rates · Liberty, Columbus, Aerowalk',
      tickerDispatch: current.tickerDispatch || '🚚 Pan-India Hub Dispatch: 24-48h',
      tickerMargin: current.tickerMargin || '🏷️ Guaranteed 40%-52% Retailer Margin',
      tickerPhone: current.tickerPhone || '+91 98111 22334'
    });
    setShowTickerModal(true);
  };

  const handleSaveTicker = async (e) => {
    if (e) e.preventDefault();
    try {
      saveCompanySettings(tickerFormData);
      await apiUpdateCompanySettings(tickerFormData);
      setShowTickerModal(false);
      if (onNotification) {
        onNotification({
          message: 'Wholesale Ticker Updated',
          subtext: 'Top deal marquee updated live across the website.'
        });
      }
    } catch (err) {
      console.error(err);
      alert('Error saving ticker settings');
    }
  };

  // Execute deletion
  const handleExecuteDelete = async () => {
    if (!deleteDialog) return;
    try {
      if (deleteDialog.type === 'product') {
        deleteProduct(deleteDialog.item.id);
        await apiDeleteProduct(deleteDialog.item.id);
        if (onNotification) {
          onNotification({
            message: 'Footwear SKU Deleted',
            subtext: `${deleteDialog.item.name} removed from catalog.`
          });
        }
      } else if (deleteDialog.type === 'brand') {
        deleteBrand(deleteDialog.item.id);
        await apiDeleteBrand(deleteDialog.item.id);
        if (onNotification) {
          onNotification({
            message: 'Brand Removed',
            subtext: `${deleteDialog.item.name} removed from portfolio.`
          });
        }
      }
      setDeleteDialog(null);
    } catch (err) {
      console.error(err);
      alert('Error executing deletion');
    }
  };

  const value = {
    isEditModeActive,
    setIsEditModeActive,
    openEditProduct,
    openAddProduct,
    confirmDeleteProduct,
    openEditBrand,
    openAddBrand,
    confirmDeleteBrand,
    openEditTicker
  };

  return (
    <AdminEditContext.Provider value={value}>
      {children}

      {/* 1. FLOATING LIVE ADMIN ACTION PILL (When Admin or Sub-Admin is logged in) */}
      {isAdmin && currentUser && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#0f172a]/95 backdrop-blur-xl border border-amber-400/40 rounded-full p-1.5 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300">
          
          {/* Admin Identity Badge */}
          <div className="flex items-center gap-2 pl-3 pr-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-[11px] leading-tight">
                {isMasterAdmin ? '👑 Master Admin' : `🛡️ ${currentUser.name || 'Sub-Admin'}`}
              </span>
              <span className="text-[9px] text-amber-300 font-medium">
                {isMasterAdmin ? 'Full Authority' : (currentUser.role || 'Staff')}
              </span>
            </div>
          </div>

          {/* Edit Mode Toggle Switch */}
          <button
            onClick={() => setIsEditModeActive(!isEditModeActive)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
              isEditModeActive
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Live Edit Buttons on the Website"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isEditModeActive ? 'Edit Mode ON' : 'Edit Mode OFF'}</span>
          </button>

          {/* Quick Admin Portal Button */}
          <button
            onClick={() => navigate('/admin')}
            className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
            title="Open Admin Management Suite"
          >
            <Settings className="w-3 h-3" />
            <span className="hidden sm:inline">Admin Suite</span>
          </button>

          {/* Quick Logout Button */}
          <button
            onClick={() => {
              if (window.confirm('Log out from Admin session?')) {
                logout();
                navigate('/');
              }
            }}
            className="p-1.5 rounded-full bg-red-500/10 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/20 transition-all cursor-pointer"
            title="Exit / Logout Admin"
          >
            <LogOut className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 2. GLOBAL ADD/EDIT PRODUCT MODAL */}
      <AddProductModal
        brands={brands.length > 0 ? brands : getStoredBrands()}
        showAddProductModal={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSubmit={handleSaveProduct}
        productData={productFormData}
        setProductData={setProductFormData}
        isEditing={!!editingProduct}
      />

      {/* 3. GLOBAL ADD/EDIT BRAND MODAL */}
      <AddBrandModal
        showAddBrandModal={showBrandModal}
        onClose={() => setShowBrandModal(false)}
        onSubmit={handleSaveBrand}
        brandData={brandFormData}
        setBrandData={setBrandFormData}
        isEditing={!!editingBrand}
      />

      {/* 4. GLOBAL EDIT WHOLESALE TICKER MODAL */}
      {showTickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0f172a] border border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setShowTickerModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Edit Wholesale Deals Ticker</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update live top notification bar shown on all website pages.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveTicker} className="space-y-4 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tickerFormData.tickerActive}
                  onChange={(e) => setTickerFormData({ ...tickerFormData, tickerActive: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400 bg-slate-800 border-slate-700"
                />
                <span className="font-semibold text-white">Enable Top Wholesale Ticker</span>
              </label>

              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                  Ticker Badge (Pill)
                </label>
                <input
                  type="text"
                  value={tickerFormData.tickerBadge}
                  onChange={(e) => setTickerFormData({ ...tickerFormData, tickerBadge: e.target.value })}
                  placeholder="B2B SUPER SALE"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                  Announcement Text
                </label>
                <input
                  type="text"
                  value={tickerFormData.tickerText}
                  onChange={(e) => setTickerFormData({ ...tickerFormData, tickerText: e.target.value })}
                  placeholder="⚡ Direct Manufacturer Wholesale Rates..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                    Dispatch Notice
                  </label>
                  <input
                    type="text"
                    value={tickerFormData.tickerDispatch}
                    onChange={(e) => setTickerFormData({ ...tickerFormData, tickerDispatch: e.target.value })}
                    placeholder="🚚 Dispatch: 24-48h"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                    Trade Support Phone
                  </label>
                  <input
                    type="text"
                    value={tickerFormData.tickerPhone}
                    onChange={(e) => setTickerFormData({ ...tickerFormData, tickerPhone: e.target.value })}
                    placeholder="+91 98111 22334"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTickerModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs uppercase hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider"
                >
                  Save Ticker Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. GLOBAL DELETE CONFIRMATION MODAL */}
      {deleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0f172a] border border-red-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4">
            
            <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                Delete {deleteDialog.type === 'product' ? 'Footwear Article' : 'Brand Portfolio'}?
              </h3>
              <p className="text-xs text-slate-300 mt-2">
                Are you sure you want to permanently delete <strong className="text-white font-bold">{deleteDialog.item?.name}</strong>? This action will remove it from all catalogs and live search.
              </p>
            </div>

            <div className="pt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteDialog(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30"
              >
                Yes, Delete Permanently
              </button>
            </div>

          </div>
        </div>
      )}

    </AdminEditContext.Provider>
  );
}

export function useAdminEdit() {
  const context = useContext(AdminEditContext);
  if (!context) {
    throw new Error('useAdminEdit must be used within an AdminEditProvider');
  }
  return context;
}
