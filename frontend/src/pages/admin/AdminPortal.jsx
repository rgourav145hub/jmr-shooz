import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminKpiStrip from './AdminKpiStrip';
import OrdersTab from './OrdersTab';
import BrandsTab from './BrandsTab';
import ProductsTab from './ProductsTab';
import QueriesTab from './QueriesTab';
import RetailersTab from './RetailersTab';
import BannersTab from './BannersTab';
import OwnersGodownTab from './OwnersGodownTab';
import FounderStoryDrawer from './FounderStoryDrawer';
import BankSettlementTab from './BankSettlementTab';
import WebsiteSettingsTab from './WebsiteSettingsTab';
import PendingApprovalsTab from './PendingApprovalsTab';
import SubAdminsTab from './SubAdminsTab';
import AddBrandModal from './AddBrandModal';
import AddProductModal from './AddProductModal';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Building2, 
  Package, 
  Sliders, 
  Image as ImageIcon, 
  Users, 
  CreditCard, 
  Clock, 
  MessageSquare, 
  Store,
  CheckCircle,
  Database,
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';
import { 
  getStoredBrands, 
  saveBrand, 
  updateBrand,
  deleteBrand, 
  getStoredProducts, 
  saveProduct, 
  updateProduct,
  deleteProduct,
  getStoredQueries,
  updateQueryStatus,
  getRegisteredUsers,
  getOwnerProfile,
  saveOwnerProfile,
  resetOwnerProfile,
  getHomeBanners,
  saveHomeBanner,
  deleteHomeBanner,
  resetHomeBanners,
  getThreeOwnersAndGodown,
  saveThreeOwnersAndGodown,
  resetThreeOwnersAndGodown,
  getBankDetails,
  saveBankDetails,
  resetBankDetails,
  getStoredOrders
} from "../../utils/storage";
import { 
  apiGetCompanyBank, 
  apiSaveCompanyBank, 
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct,
  apiCreateBrand,
  apiUpdateBrand,
  apiDeleteBrand,
  apiCreateBanner,
  apiDeleteBanner,
  apiResetBanners,
  apiUpdateQueryStatus,
  apiUpdateOwnerProfiles,
  checkDatabaseHealth,
  apiGetPendingUsers,
  apiGetOrders
} from "../../services/api";

const BANNER_PRESETS = [
  {
    title: 'Liberty Fortune Executive Derby',
    subtitle: 'Ultra-Comfort Micro-Cushion Sole with Full-Grain Burnished Leather',
    badge: 'Top Selling SKU',
    tag: 'Formal',
    imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=80',
    suggestedRetail: '₹2,499 / pair',
    wholesaleRate: '₹1,150 / pair'
  },
  {
    title: 'Columbus Velocity Nitro-Flex Runner',
    subtitle: 'Engineered Dynamic Mesh with Anti-Abrasion Dual-Density Outsole',
    badge: 'High Velocity Sell-Through',
    tag: 'Athletic',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    suggestedRetail: '₹1,899 / pair',
    wholesaleRate: '₹820 / pair'
  },
  {
    title: 'Aerowalk Air-Stride PU Comfort Slide',
    subtitle: 'Anatomical Orthopedic Arch Support with Waterproof Grip Sole',
    badge: 'Fastest Stock Turnover',
    tag: 'Daily Comfort',
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80',
    suggestedRetail: '₹699 / pair',
    wholesaleRate: '₹310 / pair'
  },
  {
    title: 'Leather Range Imperial Heritage Brogue',
    subtitle: 'Burnished Tan Crust Leather with Goodyear Welt Construction',
    badge: '100% Genuine Leather',
    tag: 'Pure Leather',
    imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1200&q=80',
    suggestedRetail: '₹5,499 / pair',
    wholesaleRate: '₹2,600 / pair'
  },
  {
    title: 'Fuel Turbo-Sprint Track Shoe',
    subtitle: 'Aerodynamic Lightweight Mesh with Reinforced Heel Counter',
    badge: 'High Performance',
    tag: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1200&q=80',
    suggestedRetail: '₹2,199 / pair',
    wholesaleRate: '₹980 / pair'
  },
  {
    title: 'Onsole Ergonomic Italian Loafer',
    subtitle: 'Handcrafted Soft Suede with High-Density Memory Insole',
    badge: 'Executive Leisure',
    tag: 'Loafer',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80',
    suggestedRetail: '₹3,299 / pair',
    wholesaleRate: '₹1,450 / pair'
  }
];

const OWNER_AVATAR_PRESETS = [
  { label: 'Executive 1', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80' },
  { label: 'Executive 2', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Executive 3', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Senior Leader', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80' }
];

export default function AdminPortal({ onNotification, setCurrentView }) {
  const navigate = useNavigate();
  const { currentUser, isMasterAdmin, isSubAdmin, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  
  // Data states
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [queries, setQueries] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState(() => getStoredOrders());
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const [ownerProfile, setOwnerProfile] = useState(() => getOwnerProfile());
  const [ownerSaveSuccess, setOwnerSaveSuccess] = useState(false);

  // Home Banners State
  const [banners, setBanners] = useState(() => getHomeBanners());
  const [bannersSuccess, setBannersSuccess] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    badge: 'Exclusive Wholesale Allocation',
    tag: 'Formal',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
    suggestedRetail: '₹1,999 / pair',
    wholesaleRate: '₹850 / pair'
  });

  // 3 Owners & Godown State
  const [threeOwnersData, setThreeOwnersData] = useState(() => getThreeOwnersAndGodown());
  const [threeOwnersSuccess, setThreeOwnersSuccess] = useState(false);
  const [showFounderDetailsDrawer, setShowFounderDetailsDrawer] = useState(false);

  // Company Bank Details State
  const [companyBank, setCompanyBank] = useState(() => getBankDetails());
  const [bankSaveSuccess, setBankSaveSuccess] = useState(false);
  const [dbInfo, setDbInfo] = useState({ connected: true, database: 'Dual-Sync SQLite & PG Hub' });

  // Modals for Products & Brands
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
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

  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    brandId: '',
    brandName: '',
    category: 'Formal',
    suggestedRetailPrice: '₹1,499 / pair',
    wholesaleRate: '₹750 / pair',
    moq: '36 Pairs (1 Carton)',
    cartonSize: '36 Pairs',
    sizeRange: 'UK/IND 6 - 10',
    colors: 'Black, Brown',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
    tag: '⚡ Lightning Deal',
    description: '',
    upper: 'Synthetic PU Leather',
    outsole: 'Direct Injected PU Sole'
  });

  const loadAllData = () => {
    const loadedBrands = getStoredBrands();
    setBrands(loadedBrands);
    setProducts(getStoredProducts());
    setQueries(getStoredQueries());
    setUsers(getRegisteredUsers());
    setOrders(getStoredOrders());
    setOwnerProfile(getOwnerProfile());
    setBanners(getHomeBanners());
    setThreeOwnersData(getThreeOwnersAndGodown());
    setCompanyBank(getBankDetails());

    apiGetOrders().then(ords => {
      if (Array.isArray(ords)) setOrders(ords);
    });

    apiGetCompanyBank().then(data => {
      if (data && Object.keys(data).length > 0) setCompanyBank(data);
    });

    apiGetPendingUsers().then(pending => {
      if (Array.isArray(pending)) {
        setPendingApprovalsCount(pending.length);
      }
    });

    checkDatabaseHealth().then(info => {
      if (info) setDbInfo(info);
    });

    if (loadedBrands.length > 0 && !productFormData.brandId) {
      setProductFormData(prev => ({
        ...prev,
        brandId: loadedBrands[0].id,
        brandName: loadedBrands[0].name
      }));
    }
  };

  useEffect(() => {
    loadAllData();

    const handleBrandsUpdate = () => setBrands(getStoredBrands());
    const handleProductsUpdate = () => setProducts(getStoredProducts());
    const handleQueriesUpdate = () => setQueries(getStoredQueries());
    const handleOrdersUpdate = () => setOrders(getStoredOrders());
    const handleOwnerUpdate = () => setOwnerProfile(getOwnerProfile());
    const handleBannersUpdate = () => setBanners(getHomeBanners());
    const handleThreeOwnersUpdate = () => setThreeOwnersData(getThreeOwnersAndGodown());
    const handleBankUpdate = () => setCompanyBank(getBankDetails());
    const handleUsersUpdate = () => {
      setUsers(getRegisteredUsers());
      apiGetPendingUsers().then(pending => {
        if (Array.isArray(pending)) setPendingApprovalsCount(pending.length);
      });
    };

    window.addEventListener('jmr_brands_updated', handleBrandsUpdate);
    window.addEventListener('jmr_products_updated', handleProductsUpdate);
    window.addEventListener('jmr_queries_updated', handleQueriesUpdate);
    window.addEventListener('jmr_orders_updated', handleOrdersUpdate);
    window.addEventListener('jmr_owner_updated', handleOwnerUpdate);
    window.addEventListener('jmr_banners_updated', handleBannersUpdate);
    window.addEventListener('jmr_owners_godown_updated', handleThreeOwnersUpdate);
    window.addEventListener('jmr_bank_updated', handleBankUpdate);
    window.addEventListener('jmr_users_updated', handleUsersUpdate);

    return () => {
      window.removeEventListener('jmr_brands_updated', handleBrandsUpdate);
      window.removeEventListener('jmr_products_updated', handleProductsUpdate);
      window.removeEventListener('jmr_queries_updated', handleQueriesUpdate);
      window.removeEventListener('jmr_orders_updated', handleOrdersUpdate);
      window.removeEventListener('jmr_owner_updated', handleOwnerUpdate);
      window.removeEventListener('jmr_banners_updated', handleBannersUpdate);
      window.removeEventListener('jmr_owners_godown_updated', handleThreeOwnersUpdate);
      window.removeEventListener('jmr_bank_updated', handleBankUpdate);
      window.removeEventListener('jmr_users_updated', handleUsersUpdate);
    };
  }, []);

  // 1. PRODUCT CRUD HANDLERS
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      brandId: brands[0]?.id || '',
      brandName: brands[0]?.name || '',
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
    setShowAddProductModal(true);
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setProductFormData({
      ...product,
      pairsPerSet: product.pairsPerSet || 12,
      sizeCurve: product.sizeCurve || 'UK 6-10 (Standard 12 Pairs Ratio)'
    });
    setShowAddProductModal(true);
  };

  const handleCreateOrUpdateProduct = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, productFormData);
      await apiUpdateProduct(editingProduct.id, productFormData);
      if (onNotification) {
        onNotification({
          message: 'Product SKU Updated',
          subtext: `${productFormData.name} (${productFormData.brandName}) saved with new rates.`
        });
      }
    } else {
      const saved = saveProduct(productFormData);
      await apiCreateProduct(saved);
      if (onNotification) {
        onNotification({
          message: 'Product SKU Published',
          subtext: `${productFormData.name} added to live catalog.`
        });
      }
    }
    setShowAddProductModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete SKU "${name}"?`)) return;
    deleteProduct(id);
    await apiDeleteProduct(id);
    if (onNotification) {
      onNotification({
        message: 'Product SKU Removed',
        subtext: `"${name}" was deleted from inventory.`
      });
    }
  };

  // 2. BRAND CRUD HANDLERS
  const handleOpenAddBrand = () => {
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
    setShowAddBrandModal(true);
  };

  const handleOpenEditBrand = (brand) => {
    setEditingBrand(brand);
    setBrandFormData({
      ...brand
    });
    setShowAddBrandModal(true);
  };

  const handleCreateOrUpdateBrand = async (e) => {
    e.preventDefault();
    if (editingBrand) {
      updateBrand(editingBrand.id, brandFormData);
      await apiUpdateBrand(editingBrand.id, brandFormData);
      if (onNotification) {
        onNotification({
          message: 'Brand Portfolio Updated',
          subtext: `${brandFormData.name} details and margins saved.`
        });
      }
    } else {
      const saved = saveBrand(brandFormData);
      await apiCreateBrand(saved);
      if (onNotification) {
        onNotification({
          message: 'Brand Listing Published',
          subtext: `${brandFormData.name} authorized distribution added.`
        });
      }
    }
    setShowAddBrandModal(false);
    setEditingBrand(null);
  };

  const handleDeleteBrand = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete Brand "${name}"?`)) return;
    deleteBrand(id);
    await apiDeleteBrand(id);
    if (onNotification) {
      onNotification({
        message: 'Brand Removed',
        subtext: `"${name}" distribution contract unlisted.`
      });
    }
  };

  // 3. BANNER CRUD HANDLERS
  const handleAddBanner = async (e) => {
    e.preventDefault();
    const created = saveHomeBanner(newBanner);
    await apiCreateBanner(created);
    setBanners(getHomeBanners());
    setBannersSuccess(true);
    setTimeout(() => setBannersSuccess(false), 3000);
    setNewBanner({
      title: '',
      subtitle: '',
      badge: 'Exclusive Wholesale Allocation',
      tag: 'Formal',
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
      suggestedRetail: '₹1,999 / pair',
      wholesaleRate: '₹850 / pair'
    });
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Delete this promotional hero slide?')) return;
    deleteHomeBanner(id);
    await apiDeleteBanner(id);
    setBanners(getHomeBanners());
  };

  const handleResetBanners = async () => {
    if (!window.confirm('Reset all promotional slides to default presets?')) return;
    resetHomeBanners();
    await apiResetBanners();
    setBanners(getHomeBanners());
  };

  // 4. 3 OWNERS & GODOWN HANDLERS
  const handleThreeOwnerFieldChange = (idx, field, value) => {
    setThreeOwnersData(prev => {
      const updatedOwners = [...prev.owners];
      updatedOwners[idx] = { ...updatedOwners[idx], [field]: value };
      return { ...prev, owners: updatedOwners };
    });
  };

  const handleThreeGodownFieldChange = (field, value) => {
    setThreeOwnersData(prev => ({
      ...prev,
      godown: { ...prev.godown, [field]: value }
    }));
  };

  const handleSaveThreeOwners = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const updated = saveThreeOwnersAndGodown(threeOwnersData);
    await apiUpdateOwnerProfiles(updated);
    setThreeOwnersSuccess(true);
    setTimeout(() => setThreeOwnersSuccess(false), 3500);
  };

  const handleResetThreeOwners = () => {
    if (!window.confirm('Reset 3 owners and godown to original default coordinates?')) return;
    const res = resetThreeOwnersAndGodown();
    setThreeOwnersData(res);
  };

  // 5. BANK SETTLEMENT HANDLERS
  const handleCompanyBankChange = (field, value) => {
    setCompanyBank(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveCompanyBank = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    saveBankDetails(companyBank);
    await apiSaveCompanyBank(companyBank);
    setBankSaveSuccess(true);
    setTimeout(() => setBankSaveSuccess(false), 3500);
  };

  const handleResetCompanyBank = () => {
    if (!window.confirm('Reset company settlement bank to default coordinates?')) return;
    const res = resetBankDetails();
    setCompanyBank(res);
  };

  // 6. QUERY STATUS HANDLER
  const handleStatusChange = async (id, status) => {
    updateQueryStatus(id, status);
    await apiUpdateQueryStatus(id, status);
    setQueries(getStoredQueries());
  };

  // 7. FOUNDER DRAWER HANDLERS
  const handleOwnerChange = (field, value) => {
    setOwnerProfile(prev => {
      const updated = { ...prev, [field]: value };
      saveOwnerProfile(updated);
      return updated;
    });
  };

  const handleBioParagraphChange = (idx, value) => {
    setOwnerProfile(prev => {
      const updatedBio = [...prev.bioParagraphs];
      updatedBio[idx] = value;
      const updated = { ...prev, bioParagraphs: updatedBio };
      saveOwnerProfile(updated);
      return updated;
    });
  };

  // All Admin Navigation Tabs filtered by authorization limits
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safeBrands = Array.isArray(brands) ? brands : [];
  const safeBanners = Array.isArray(banners) ? banners : [];
  const safeUsers = Array.isArray(users) ? users : [];
  const safeQueries = Array.isArray(queries) ? queries : [];

  const ALL_ADMIN_TABS = [
    { id: 'orders', label: 'Orders Desk', icon: ShoppingBag, count: safeOrders.filter(o => o && o.status === 'Pending').length, alert: safeOrders.filter(o => o && o.status === 'Pending').length > 0, perm: 'manage_retailers' },
    { id: 'products', label: 'Products (SKUs)', icon: Package, count: safeProducts.length, perm: 'manage_products' },
    { id: 'brands', label: 'Brands Roster', icon: Building2, count: safeBrands.length, perm: 'manage_brands' },
    { id: 'settings', label: 'Website CMS & Deals', icon: Sliders, badge: 'Editable', perm: 'manage_cms' },
    { id: 'banners', label: 'Hero Banners', icon: ImageIcon, count: safeBanners.length, perm: 'manage_cms' },
    { id: 'owners', label: '3 Partners & Godown', icon: Users, perm: 'manage_cms' },
    { id: 'bank', label: 'Bank Settlement', icon: CreditCard, perm: 'manage_cms' },
    { id: 'approvals', label: 'Pending Approvals', icon: Clock, count: pendingApprovalsCount, highlight: pendingApprovalsCount > 0, perm: 'manage_retailers' },
    { id: 'retailers', label: 'Retailers Directory', icon: Store, count: safeUsers.filter(u => u && (u.userType === 'retailer' || u.accountType === 'retailer') && u.status !== 'pending').length, perm: 'manage_retailers' },
    { id: 'queries', label: 'Inquiries Desk', icon: MessageSquare, count: safeQueries.filter(q => q && q.status === 'Pending').length, alert: safeQueries.filter(q => q && q.status === 'Pending').length > 0, perm: 'manage_queries' },
    ...(isMasterAdmin ? [{ id: 'subadmins', label: 'Staff & Roles', icon: ShieldCheck, badge: 'Master Only' }] : [])
  ];

  const NAV_TABS = ALL_ADMIN_TABS.filter(tab => !tab.perm || hasPermission(tab.perm));

  useEffect(() => {
    if (NAV_TABS.length > 0 && !NAV_TABS.some(t => t.id === activeTab)) {
      setActiveTab(NAV_TABS[0].id);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-brand-dark text-white pt-36 sm:pt-40 md:pt-44 pb-24">
      
      {/* Top Banner */}
      <AdminHeader 
        setShowAddBrandModal={handleOpenAddBrand} 
        setShowAddProductModal={handleOpenAddProduct} 
      />

      {/* KPI Metrics Strip */}
      <AdminKpiStrip 
        brands={brands} 
        products={products} 
        queries={queries} 
        setActiveTab={setActiveTab} 
      />

      {/* UNIFIED ADMIN TAB NAVIGATION BAR */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sticky top-20 z-40">
        <div className="bg-[#131b2e]/95 backdrop-blur-md border border-blue-900/40 rounded-2xl p-2 shadow-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
          {NAV_TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-102'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{tab.label}</span>

                {/* Badge Counts */}
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    tab.highlight 
                      ? 'bg-amber-400 text-slate-950 animate-bounce' 
                      : tab.alert
                      ? 'bg-red-500 text-white animate-pulse'
                      : isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}

                {tab.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN TAB CONTENT CONTAINER */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tab 0: Orders Desk */}
        {activeTab === 'orders' && (
          <OrdersTab 
            orders={orders} 
            onOrderUpdated={() => {
              setOrders(getStoredOrders());
              apiGetOrders().then(ords => { if (Array.isArray(ords)) setOrders(ords); });
            }} 
            onNotification={onNotification} 
          />
        )}

        {/* Tab 1: Products */}
        <ProductsTab 
          activeTab={activeTab} 
          products={products} 
          setShowAddProductModal={handleOpenAddProduct} 
          onEditProduct={handleOpenEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />

        {/* Tab 2: Brands */}
        <BrandsTab 
          activeTab={activeTab} 
          brands={brands} 
          setShowAddBrandModal={handleOpenAddBrand} 
          onEditBrand={handleOpenEditBrand}
          onDeleteBrand={handleDeleteBrand}
        />

        {/* Tab 3: Website CMS & Deals Settings */}
        {activeTab === 'settings' && <WebsiteSettingsTab />}

        {/* Tab 4: Hero Banners */}
        <BannersTab 
          BANNER_PRESETS={BANNER_PRESETS} 
          activeTab={activeTab} 
          banners={banners} 
          bannersSuccess={bannersSuccess} 
          handleAddBanner={handleAddBanner} 
          handleResetBanners={handleResetBanners} 
          handleDeleteBanner={handleDeleteBanner}
          newBanner={newBanner} 
          setNewBanner={setNewBanner} 
        />

        {/* Tab 5: 3 Owners & Godown */}
        <OwnersGodownTab 
          OWNER_AVATAR_PRESETS={OWNER_AVATAR_PRESETS} 
          activeTab={activeTab} 
          handleResetThreeOwners={handleResetThreeOwners} 
          handleSaveThreeOwners={handleSaveThreeOwners} 
          handleThreeGodownFieldChange={handleThreeGodownFieldChange} 
          handleThreeOwnerFieldChange={handleThreeOwnerFieldChange} 
          threeOwnersData={threeOwnersData} 
          threeOwnersSuccess={threeOwnersSuccess} 
        />

        {/* Tab 6: Bank Settlement */}
        <BankSettlementTab 
          activeTab={activeTab} 
          bankSaveSuccess={bankSaveSuccess} 
          companyBank={companyBank} 
          handleCompanyBankChange={handleCompanyBankChange} 
          handleResetCompanyBank={handleResetCompanyBank} 
          handleSaveCompanyBank={handleSaveCompanyBank} 
        />

        {/* Tab 7: Pending Approvals */}
        {activeTab === 'approvals' && <PendingApprovalsTab />}

        {/* Tab 8: Retailers Directory */}
        <RetailersTab activeTab={activeTab} />

        {/* Tab 9: Queries & Orders Desk */}
        <QueriesTab 
          activeTab={activeTab} 
          handleStatusChange={handleStatusChange} 
          queries={queries} 
        />

        {/* Tab 10: Sub-Admins Staff & Authorization Matrix (Master Admin Only) */}
        {activeTab === 'subadmins' && isMasterAdmin && (
          <SubAdminsTab onNotification={onNotification} />
        )}
      </div>

      {/* Founder Story Drawer */}
      <FounderStoryDrawer 
        handleBioParagraphChange={handleBioParagraphChange} 
        handleOwnerChange={handleOwnerChange} 
        ownerProfile={ownerProfile} 
        showFounderDetailsDrawer={showFounderDetailsDrawer} 
        setShowFounderDetailsDrawer={setShowFounderDetailsDrawer} 
      />

      {/* Modals for Brands & Products */}
      <AddBrandModal 
        showAddBrandModal={showAddBrandModal}
        onClose={() => {
          setShowAddBrandModal(false);
          setEditingBrand(null);
        }}
        onSubmit={handleCreateOrUpdateBrand}
        brandData={brandFormData}
        setBrandData={setBrandFormData}
        isEditing={!!editingBrand}
      />

      <AddProductModal 
        brands={brands} 
        showAddProductModal={showAddProductModal}
        onClose={() => {
          setShowAddProductModal(false);
          setEditingProduct(null);
        }}
        onSubmit={handleCreateOrUpdateProduct}
        productData={productFormData}
        setProductData={setProductFormData}
        isEditing={!!editingProduct}
      />
    </div>
  );
}
