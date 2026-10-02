import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Layers, 
  MessageSquare, 
  Users, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  Upload, 
  Package, 
  ShieldCheck, 
  ArrowUpRight,
  Search,
  ExternalLink,
  Store,
  Award,
  Save,
  RotateCcw,
  Sparkles,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  FileText,
  Image as ImageIcon,
  Warehouse,
  Truck,
  Boxes,
  Eye,
  Check,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Database,
  Copy
} from 'lucide-react';
import { 
  getStoredBrands, 
  saveBrand, 
  deleteBrand, 
  getStoredProducts, 
  saveProduct, 
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
  resetBankDetails
} from '../utils/storage';
import { 
  apiGetCompanyBank, 
  apiSaveCompanyBank, 
  checkDatabaseHealth 
} from '../services/api';

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
  const [activeTab, setActiveTab] = useState('brands'); // 'brands', 'products', 'queries', 'retailers', 'banners', 'owners'
  
  // Data states
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [queries, setQueries] = useState([]);
  const [users, setUsers] = useState([]);
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
  const [dbInfo, setDbInfo] = useState({ connected: true, database: 'SQLite v3 (node:sqlite)' });
  const [copiedBankField, setCopiedBankField] = useState(null);

  // Modals for Uploads
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New Brand Form State
  const [newBrand, setNewBrand] = useState({
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

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
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
    setOwnerProfile(getOwnerProfile());
    setBanners(getHomeBanners());
    setThreeOwnersData(getThreeOwnersAndGodown());
    setCompanyBank(getBankDetails());

    apiGetCompanyBank().then(data => {
      if (data) setCompanyBank(data);
    });
    checkDatabaseHealth().then(info => {
      if (info) setDbInfo(info);
    });

    if (loadedBrands.length > 0 && !newProduct.brandId) {
      setNewProduct(prev => ({
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
    const handleOwnerUpdate = () => setOwnerProfile(getOwnerProfile());
    const handleBannersUpdate = () => setBanners(getHomeBanners());
    const handleThreeOwnersUpdate = () => setThreeOwnersData(getThreeOwnersAndGodown());
    const handleBankUpdate = () => setCompanyBank(getBankDetails());
    const handleUsersUpdate = () => setUsers(getRegisteredUsers());

    window.addEventListener('jmr_brands_updated', handleBrandsUpdate);
    window.addEventListener('jmr_products_updated', handleProductsUpdate);
    window.addEventListener('jmr_queries_updated', handleQueriesUpdate);
    window.addEventListener('jmr_owner_updated', handleOwnerUpdate);
    window.addEventListener('jmr_banners_updated', handleBannersUpdate);
    window.addEventListener('jmr_owners_godown_updated', handleThreeOwnersUpdate);
    window.addEventListener('jmr_bank_updated', handleBankUpdate);
    window.addEventListener('jmr_users_updated', handleUsersUpdate);

    return () => {
      window.removeEventListener('jmr_brands_updated', handleBrandsUpdate);
      window.removeEventListener('jmr_products_updated', handleProductsUpdate);
      window.removeEventListener('jmr_queries_updated', handleQueriesUpdate);
      window.removeEventListener('jmr_owner_updated', handleOwnerUpdate);
      window.removeEventListener('jmr_banners_updated', handleBannersUpdate);
      window.removeEventListener('jmr_owners_godown_updated', handleThreeOwnersUpdate);
      window.removeEventListener('jmr_bank_updated', handleBankUpdate);
      window.removeEventListener('jmr_users_updated', handleUsersUpdate);
    };
  }, []);

  // Handlers for Company Bank Details
  const handleCompanyBankChange = (field, value) => {
    setCompanyBank(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveCompanyBank = async (e) => {
    if (e) e.preventDefault();
    await apiSaveCompanyBank(companyBank);
    setCompanyBank(getBankDetails());
    setBankSaveSuccess(true);
    setTimeout(() => setBankSaveSuccess(false), 3500);
    if (onNotification) {
      onNotification({
        message: 'Bank Coordinates Saved to Database',
        subtext: 'Official company remittance details updated in SQLite.'
      });
    }
  };

  const handleResetCompanyBank = () => {
    if (window.confirm('Reset company settlement bank coordinates to default?')) {
      const def = resetBankDetails();
      setCompanyBank(def);
      if (onNotification) {
        onNotification({
          message: 'Bank Details Reset',
          subtext: 'Default HDFC wholesale account restored.'
        });
      }
    }
  };

  // Handlers for Banners
  const handleAddBanner = (e) => {
    e.preventDefault();
    if (!newBanner.title || !newBanner.imageUrl) return;
    saveHomeBanner(newBanner);
    setBanners(getHomeBanners());
    setNewBanner({
      title: '',
      subtitle: '',
      badge: 'Exclusive Wholesale Allocation',
      tag: 'Formal',
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
      suggestedRetail: '₹1,999 / pair',
      wholesaleRate: '₹850 / pair'
    });
    setBannersSuccess(true);
    setTimeout(() => setBannersSuccess(false), 3000);
    if (onNotification) {
      onNotification({
        message: 'Home Banner Added',
        subtext: 'New promotional image is now live on the homepage hero slider.'
      });
    }
  };

  const handleDeleteBanner = (id) => {
    if (window.confirm('Delete this banner slide from homepage?')) {
      deleteHomeBanner(id);
      setBanners(getHomeBanners());
      if (onNotification) {
        onNotification({
          message: 'Banner Removed',
          subtext: 'Slide has been removed from homepage carousel.'
        });
      }
    }
  };

  const handleResetBanners = () => {
    if (window.confirm('Reset homepage hero banners to default?')) {
      const def = resetHomeBanners();
      setBanners(def);
      if (onNotification) {
        onNotification({
          message: 'Banners Reset',
          subtext: 'Default 4 luxury footwear banners restored.'
        });
      }
    }
  };

  // Handlers for 3 Owners & Godown
  const handleThreeOwnerFieldChange = (index, field, value) => {
    setThreeOwnersData(prev => {
      const copyOwners = [...(prev.owners || [])];
      copyOwners[index] = { ...copyOwners[index], [field]: value };
      return { ...prev, owners: copyOwners };
    });
  };

  const handleThreeGodownFieldChange = (field, value) => {
    setThreeOwnersData(prev => ({
      ...prev,
      godown: {
        ...(prev.godown || {}),
        [field]: value
      }
    }));
  };

  const handleSaveThreeOwners = (e) => {
    if (e) e.preventDefault();
    saveThreeOwnersAndGodown(threeOwnersData);
    saveOwnerProfile(ownerProfile); // FIX: Step 3.4
    setThreeOwnersSuccess(true);
    setTimeout(() => setThreeOwnersSuccess(false), 3500);
    if (onNotification) {
      onNotification({ type: 'success', message: 'Owner Details & Founder Story Saved' });
    }
  };

  const handleResetThreeOwners = () => {
    if (window.confirm('Reset 3 owners and godown details to default?')) {
      const def = resetThreeOwnersAndGodown();
      setThreeOwnersData(def);
      if (onNotification) {
        onNotification({
          message: 'Reset Successful',
          subtext: 'Default 3 owners and godown details restored.'
        });
      }
    }
  };

  // Legacy single owner profile handlers
  const handleOwnerChange = (field, value) => {
    setOwnerProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleBioParagraphChange = (index, value) => {
    setOwnerProfile(prev => {
      const copy = [...(prev.bioParagraphs || [])];
      copy[index] = value;
      return { ...prev, bioParagraphs: copy };
    });
  };

  const handleTeamMemberChange = (index, field, value) => {
    setOwnerProfile(prev => {
      const copy = [...(prev.teamMembers || [])];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, teamMembers: copy };
    });
  };

  const handleSaveOwnerProfile = (e) => {
    if (e) e.preventDefault();
    saveOwnerProfile(ownerProfile);
    setOwnerSaveSuccess(true);
    setTimeout(() => setOwnerSaveSuccess(false), 3500);

    if (onNotification) {
      onNotification({
        message: 'Owner Details Saved Successfully',
        subtext: 'Your updated management information is now live across the Owner page and Homepage.'
      });
    }
  };

  const handleResetOwner = () => {
    if (window.confirm('Reset owner & management details to default settings?')) {
      const def = resetOwnerProfile();
      setOwnerProfile(def);
      if (onNotification) {
        onNotification({
          message: 'Owner Profile Reset',
          subtext: 'Default executive leadership details restored.'
        });
      }
    }
  };

  // Handlers
  const handleCreateBrand = (e) => {
    e.preventDefault();
    if (!newBrand.name) return;

    saveBrand({
      ...newBrand,
      logoText: newBrand.logoText || newBrand.name.toUpperCase(),
      highlights: [
        'High consumer trust across Indian retail markets',
        'Direct-from-factory guaranteed authenticity',
        'High sell-through in multi-brand footwear stores',
        'Full point-of-sale branding support'
      ]
    });

    setShowAddBrandModal(false);
    setNewBrand({
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

    if (onNotification) {
      onNotification({
        message: 'New Brand Listed Successfully',
        subtext: `${newBrand.name} is now live across the website.`
      });
    }
  };

  const handleDeleteBrand = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from distribution listings?`)) {
      deleteBrand(id);
      if (onNotification) {
        onNotification({
          message: 'Brand Removed',
          subtext: `${name} has been unlisted.`
        });
      }
    }
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.brandId) return;

    const brand = brands.find(b => b.id === newProduct.brandId);
    const brandTitle = brand ? brand.name : newProduct.brandName;

    saveProduct({
      ...newProduct,
      brandName: brandTitle,
      colors: newProduct.colors.split(',').map(c => c.trim()),
      materials: {
        upper: newProduct.upper,
        lining: 'Breathable Foam Cushion Lining',
        outsole: newProduct.outsole,
        construction: 'Direct Injection / Vulcanized'
      }
    });

    setShowAddProductModal(false);
    if (onNotification) {
      onNotification({
        message: 'Product SKU Listed',
        subtext: `${newProduct.name} has been added under ${brandTitle}.`
      });
    }
  };

  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`Delete product ${name}?`)) {
      deleteProduct(id);
      if (onNotification) {
        onNotification({
          message: 'Product Listing Removed',
          subtext: `${name} has been removed.`
        });
      }
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateQueryStatus(id, newStatus);
    if (onNotification) {
      onNotification({
        message: 'Query Status Updated',
        subtext: `Ticket #${id} set to ${newStatus}.`
      });
    }
  };

  const retailersList = users.filter(u => u.userType === 'retailer');

  return (
    <div className="min-h-screen bg-brand-dark pt-36 sm:pt-40 md:pt-44 pb-24 text-slate-100">
      
      {/* Top Banner */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-brand-surface rounded-3xl border border-brand-border p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-card border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-gold-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-bold uppercase tracking-widest border border-brand-gold/30">
                  Executive Control Suite
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  <Database className="w-3 h-3" />
                  <span>SQLite Database Connected</span>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                JMR Shooz — Distribution Admin Portal
              </h1>
              <p className="text-xs text-brand-muted mt-0.5">
                Manage Brand Portfolios, Footwear Listings, Retailer Accounts & Inquiries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddBrandModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Brand</span>
            </button>

            <button
              onClick={() => setShowAddProductModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <Package className="w-4 h-4 text-brand-gold" />
              <span>Add Shoe Listing</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-brand-surface p-5 rounded-2xl border border-brand-border">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-muted block">Live Brands</span>
            <span className="text-3xl font-display font-extrabold text-brand-gold mt-1 block">{brands.length}</span>
            <span className="text-[11px] text-slate-400">Liberty, Columbus, Aerowalk, etc.</span>
          </div>

          <div className="bg-brand-surface p-5 rounded-2xl border border-brand-border">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-muted block">Active SKUs</span>
            <span className="text-3xl font-display font-extrabold text-white mt-1 block">{products.length}</span>
            <span className="text-[11px] text-slate-400">Wholesale Footwear Models</span>
          </div>

          <div className="bg-brand-surface p-5 rounded-2xl border border-brand-border">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-muted block">Registered Retailers</span>
            <span className="text-3xl font-display font-extrabold text-white mt-1 block">{retailersList.length}</span>
            <span className="text-[11px] text-slate-400">Active B2B Stockists</span>
          </div>

          <div className="bg-brand-surface p-5 rounded-2xl border border-brand-border">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-muted block">Pending Queries</span>
            <span className="text-3xl font-display font-extrabold text-amber-400 mt-1 block">
              {queries.filter(q => q.status === 'Pending').length}
            </span>
            <span className="text-[11px] text-slate-400">Requires Dispatch Review</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex border-b border-brand-border bg-brand-surface/40 rounded-t-2xl px-4 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('brands')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'brands'
                ? 'border-brand-gold text-brand-gold bg-brand-surface'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Brand Listings ({brands.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'products'
                ? 'border-brand-gold text-brand-gold bg-brand-surface'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product SKUs ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('queries')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'queries'
                ? 'border-brand-gold text-brand-gold bg-brand-surface'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Retailer Queries & Feedback ({queries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('retailers')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'retailers'
                ? 'border-brand-gold text-brand-gold bg-brand-surface'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Registered Retailers ({retailersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'banners'
                ? 'border-brand-gold text-brand-gold bg-brand-surface'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Home Banners & Images ({banners.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('owners')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
              activeTab === 'owners'
                ? 'border-brand-gold text-brand-gold bg-brand-surface'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3 Owners & Godown Hub</span>
          </button>

          
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
                activeTab === 'pending'
                  ? 'border-brand-gold text-brand-gold bg-brand-surface'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Pending Approvals</span>
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
            <span>Bank & GST Settlement</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TAB 1: BRANDS MANAGEMENT */}
        {activeTab === 'brands' && (
          <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-xl">
            <div className="p-5 border-b border-brand-border flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Active Distributed Footwear Brands</h3>
              <button
                onClick={() => setShowAddBrandModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider"
              >
                + Add Brand
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-brand-card/60 text-brand-muted uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Brand</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Origin / Hub</th>
                    <th className="py-3 px-4">Retail Margin</th>
                    <th className="py-3 px-4">Carton MOQ</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  {brands.map((b) => (
                    <tr key={b.id} className="hover:bg-brand-card/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-brand-card border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold">
                            {b.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{b.name}</span>
                            <span className="text-[10px] text-brand-muted">{b.partnershipType}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-200">{b.category}</td>
                      <td className="py-3.5 px-4 text-slate-400">{b.origin}</td>
                      <td className="py-3.5 px-4 text-brand-gold font-semibold">{b.retailMargin}</td>
                      <td className="py-3.5 px-4 font-mono">{b.moq || b.cartonSize}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                          Active Listing
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteBrand(b.id, b.name)}
                          className="p-1.5 rounded bg-brand-card hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete Brand"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-xl">
            <div className="p-5 border-b border-brand-border flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Wholesale Footwear SKU Directory</h3>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider"
              >
                + Add Shoe Listing
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-brand-card/60 text-brand-muted uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Model & SKU</th>
                    <th className="py-3 px-4">Brand</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Wholesale Rate</th>
                    <th className="py-3 px-4">MSRP</th>
                    <th className="py-3 px-4">Carton MOQ</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-brand-card/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-brand-card" />
                          <div>
                            <span className="font-bold text-white block">{p.name}</span>
                            <span className="text-[10px] text-brand-muted font-mono">{p.sku}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-brand-card text-brand-gold font-semibold border border-brand-border">
                          {p.brandName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{p.category}</td>
                      <td className="py-3.5 px-4 text-brand-gold font-bold">{p.wholesaleRate || '₹650 / pair'}</td>
                      <td className="py-3.5 px-4 text-slate-200">{p.suggestedRetailPrice}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">{p.moq || p.cartonSize}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 rounded bg-brand-card hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete SKU"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: QUERIES & FEEDBACK DESK */}
        {activeTab === 'queries' && (
          <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-xl">
            <div className="p-5 border-b border-brand-border">
              <h3 className="font-bold text-white text-base">Incoming Retailer Inquiries, Orders & Feedback</h3>
              <p className="text-xs text-brand-muted mt-0.5">Review stock requests, custom curve orders, and distributor feedback.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-brand-card/60 text-brand-muted uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Ticket Ref</th>
                    <th className="py-3 px-4">Retailer Store</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Brand / SKU</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  {queries.map((q) => (
                    <tr key={q.id} className="hover:bg-brand-card/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-gold">{q.id}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{q.companyName || 'Retail Stockist'}</span>
                        <span className="text-[10px] text-brand-muted">{q.contactName} ({q.phone})</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-card text-slate-200 border border-brand-border">
                          {q.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-brand-gold">{q.brandName}</td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-semibold text-white block line-clamp-1">{q.subject}</span>
                        <span className="text-[11px] text-slate-400 line-clamp-2">{q.message}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          q.status === 'Resolved'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                            : q.status === 'In Review'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                            : 'bg-blue-950/60 text-blue-300 border border-blue-800'
                        }`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <select
                          value={q.status}
                          onChange={(e) => handleStatusChange(q.id, e.target.value)}
                          className="px-2 py-1 rounded bg-brand-card border border-brand-border text-[11px] text-slate-200 focus:outline-none focus:border-brand-gold"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Review">In Review</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: REGISTERED RETAILERS DIRECTORY */}
        {activeTab === 'retailers' && (
          <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-xl">
            <div className="p-5 border-b border-brand-border">
              <h3 className="font-bold text-white text-base">Authorized Retailer Accounts Directory</h3>
              <p className="text-xs text-brand-muted mt-0.5">Footwear retailers with generated User IDs and trade portal credentials.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-brand-card/60 text-brand-muted uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Retailer ID</th>
                    <th className="py-3 px-4">Store / Business Name</th>
                    <th className="py-3 px-4">Contact Person</th>
                    <th className="py-3 px-4">City / Location</th>
                    <th className="py-3 px-4">Phone / WhatsApp</th>
                    <th className="py-3 px-4">GSTIN / Tax ID</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  {retailersList.map((r) => (
                    <tr key={r.id} className="hover:bg-brand-card/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-gold">{r.retailerId || r.id}</td>
                      <td className="py-3.5 px-4 font-bold text-white">{r.companyName || r.name}</td>
                      <td className="py-3.5 px-4 text-slate-200">{r.name}</td>
                      <td className="py-3.5 px-4 text-slate-300">{r.city || 'Regional Outlet'}</td>
                      <td className="py-3.5 px-4 font-mono">{r.phone}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{r.gstin || 'Registered Trade'}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                          {r.status || 'Verified'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: HOME BANNERS & IMAGES MANAGEMENT */}
        {activeTab === 'banners' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header info & actions */}
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-bold uppercase tracking-widest border border-brand-gold/30 mb-2">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Homepage Dynamic Media Suite</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">Homepage Hero Showcase & Promotional Banners</h3>
                <p className="text-xs text-brand-muted mt-1">
                  Add, update, or remove the rotating footwear visual slides on the Homepage. Instant real-time updates for all website visitors.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {setCurrentView && (
                  <button
                    type="button"
                    onClick={() => setCurrentView('home')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-gold font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View on Home Page</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleResetBanners}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>

            {bannersSuccess && (
              <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-4 flex items-center gap-3 text-emerald-300 text-xs font-medium animate-in fade-in">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Homepage promotional banner updated successfully! Check the live homepage slider.</span>
              </div>
            )}

            {/* ADD NEW BANNER SLIDE */}
            <div className="bg-brand-surface rounded-2xl border border-brand-gold/30 p-6 sm:p-8 shadow-xl">
              <div className="border-b border-brand-border/80 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-brand-gold flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Add New Promotional Footwear Slide</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select a 1-click curated footwear model preset or enter custom image URL and details.
                  </p>
                </div>
              </div>

              {/* 1-Click Curated Presets */}
              <div className="mb-6 bg-brand-card/60 rounded-xl p-4 border border-brand-border/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold block mb-2">
                  ⚡ 1-Click Footwear Presets (Liberty, Columbus, Aerowalk, Leather Range, Fuel, Onsole):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {BANNER_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewBanner(preset)}
                      className="p-2.5 rounded-lg bg-brand-dark/80 hover:bg-brand-gold/15 border border-brand-border hover:border-brand-gold/60 text-left transition-all group"
                    >
                      <span className="text-[11px] font-bold text-slate-200 group-hover:text-brand-gold block truncate">
                        {preset.title.split(' ')[0]} {preset.title.split(' ')[1]}
                      </span>
                      <span className="text-[9px] text-brand-muted block uppercase tracking-wider truncate">
                        {preset.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Inputs */}
                <form onSubmit={handleAddBanner} className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Shoe / Model Title <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newBanner.title}
                      onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                      placeholder="e.g. Liberty Fortune Executive Derby"
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={newBanner.subtitle}
                      onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                      placeholder="e.g. Ultra-Comfort Micro-Cushion Sole with Full-Grain Burnished Leather"
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Highlight</label>
                      <input
                        type="text"
                        value={newBanner.badge}
                        onChange={(e) => setNewBanner({ ...newBanner, badge: e.target.value })}
                        placeholder="e.g. Trending Wholesale SKU"
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Footwear Category Tag</label>
                      <input
                        type="text"
                        value={newBanner.tag}
                        onChange={(e) => setNewBanner({ ...newBanner, tag: e.target.value })}
                        placeholder="e.g. Formal / Sports / Daily Comfort"
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Suggested Retail MSRP</label>
                      <input
                        type="text"
                        value={newBanner.suggestedRetail}
                        onChange={(e) => setNewBanner({ ...newBanner, suggestedRetail: e.target.value })}
                        placeholder="e.g. ₹2,499 / pair"
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Wholesale Trade Rate</label>
                      <input
                        type="text"
                        value={newBanner.wholesaleRate}
                        onChange={(e) => setNewBanner({ ...newBanner, wholesaleRate: e.target.value })}
                        placeholder="e.g. ₹1,150 / pair"
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Promotional Image URL <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={newBanner.imageUrl}
                      onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                      placeholder="Paste direct image URL (Unsplash, CDN, or uploaded link)"
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Publish Slide to Homepage Hero Carousel</span>
                    </button>
                  </div>
                </form>

                {/* Live Card Preview */}
                <div className="lg:col-span-5 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Live Homepage Preview:</span>
                    <span className="text-[10px] text-brand-gold font-mono">Hero Visual Mockup</span>
                  </div>

                  <div className="flex-grow rounded-2xl bg-gradient-to-b from-brand-card to-brand-dark border border-brand-gold/40 p-4 relative overflow-hidden shadow-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-bold uppercase tracking-wider border border-brand-gold/30">
                          {newBanner.tag || 'Footwear'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                          {newBanner.badge || 'Distributor Allocation'}
                        </span>
                      </div>

                      <div className="w-full h-44 rounded-xl overflow-hidden bg-brand-dark border border-brand-border relative mb-3">
                        <img
                          src={newBanner.imageUrl || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'}
                          alt="Banner preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      </div>

                      <h5 className="text-base font-bold text-white leading-tight">
                        {newBanner.title || 'Footwear Model Title'}
                      </h5>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {newBanner.subtitle || 'High-grade sole construction with maximum retail turnover.'}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-brand-border/60 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-brand-muted block uppercase">Wholesale Trade</span>
                        <span className="font-bold text-brand-gold font-mono">{newBanner.wholesaleRate || '₹0 / pair'}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-brand-muted block uppercase">Retail MSRP</span>
                        <span className="font-medium text-slate-300 font-mono line-through">{newBanner.suggestedRetail || '₹0'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTIVE BANNERS LIST */}
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-border/80">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-gold" />
                    <span>Active Slides on Homepage Carousel ({banners.length})</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    These slides rotate automatically on the hero section of the Homepage. Retailers and visitors can browse through them.
                  </p>
                </div>
                <span className="text-xs font-mono text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/30">
                  {banners.length} Live Slides
                </span>
              </div>

              {banners.length === 0 ? (
                <div className="text-center py-12 bg-brand-card/30 rounded-2xl border border-dashed border-brand-border">
                  <ImageIcon className="w-12 h-12 text-brand-muted mx-auto mb-3" />
                  <p className="text-sm text-slate-300 font-bold">No slides active</p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">Add a new slide above or restore default curated footwear slides.</p>
                  <button
                    type="button"
                    onClick={handleResetBanners}
                    className="px-4 py-2 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110"
                  >
                    Restore Default Slides
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {banners.map((banner, index) => (
                    <div
                      key={banner.id || index}
                      className="bg-brand-card rounded-2xl border border-brand-border/80 overflow-hidden hover:border-brand-gold/50 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="relative h-40 bg-brand-dark overflow-hidden">
                          <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white border border-white/20">
                            Slide #{index + 1}
                          </div>
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-brand-gold text-brand-dark text-[10px] font-bold">
                            {banner.tag || 'Footwear'}
                          </div>
                        </div>

                        <div className="p-4">
                          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block mb-1">
                            {banner.badge || 'Distributor SKU'}
                          </span>
                          <h5 className="font-bold text-white text-xs leading-snug line-clamp-1">
                            {banner.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                            {banner.subtitle}
                          </p>

                          <div className="mt-3 pt-2 border-t border-brand-border/60 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">Wholesale: <strong className="text-brand-gold font-mono">{banner.wholesaleRate || 'Trade'}</strong></span>
                            <span className="text-slate-400">MSRP: <strong className="text-slate-300 font-mono">{banner.suggestedRetail || 'MSRP'}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-brand-dark/50 border-t border-brand-border flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          Active on Hero
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 hover:text-red-200 border border-red-500/30 transition-colors"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: 3 OWNERS & GODOWN HUB SETTINGS */}
        {activeTab === 'owners' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header info & actions */}
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-bold uppercase tracking-widest border border-brand-gold/30 mb-2">
                  <Users className="w-3.5 h-3.5" />
                  <span>Executive Governance & Central Logistics</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">3 Managing Partners & Central Distribution Godown</h3>
                <p className="text-xs text-brand-muted mt-1">
                  Manage the 3 business owners (Name, Designation, Phone, Email) and the central distribution godown facility address displayed across Home and Owner pages.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {setCurrentView && (
                  <button
                    type="button"
                    onClick={() => setCurrentView('owner')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-gold font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View on Owner Page</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleResetThreeOwners}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveThreeOwners}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save 3 Owners & Godown</span>
                </button>
              </div>
            </div>

            {threeOwnersSuccess && (
              <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-4 flex items-center gap-3 text-emerald-300 text-xs font-medium animate-in fade-in">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>All 3 Owners and Godown Hub details saved successfully! Updates are live across the Home page and Owner page.</span>
              </div>
            )}

            <form onSubmit={handleSaveThreeOwners} className="space-y-8">
              
              {/* SECTION 1: 3 OWNERS (3 DEDICATED COLUMNS) */}
              <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 sm:p-8 shadow-xl space-y-6">
                <div className="border-b border-brand-border/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-brand-gold flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>3 Business Owners & Managing Partners</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Each column represents one of the 3 business owners with their direct phone, email, and photo.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/30">
                    3 Columns
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {(threeOwnersData.owners || []).map((owner, idx) => (
                    <div
                      key={owner.id || idx}
                      className="bg-brand-card/80 rounded-2xl border border-brand-gold/30 p-5 space-y-4 hover:border-brand-gold/60 transition-colors shadow-lg"
                    >
                      {/* Column Header & Avatar Preview */}
                      <div className="flex items-center gap-3 pb-3 border-b border-brand-border/60">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-brand-gold/60 bg-brand-dark shrink-0">
                          <img
                            src={owner.photo}
                            alt={owner.name}
                            className="w-full h-full object-cover grayscale contrast-105"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold block">
                            OWNER #{idx + 1}
                          </span>
                          <h5 className="font-bold text-white text-sm truncate">
                            {owner.name || `Owner ${idx + 1}`}
                          </h5>
                          <span className="text-[11px] text-slate-400 truncate block">
                            {owner.role || 'Partner'}
                          </span>
                        </div>
                      </div>

                      {/* Photo Preset Buttons */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-300">Photo URL</label>
                          <span className="text-[10px] text-slate-400">Presets:</span>
                        </div>
                        <input
                          type="url"
                          value={owner.photo || ''}
                          onChange={(e) => handleThreeOwnerFieldChange(idx, 'photo', e.target.value)}
                          placeholder="Paste photo URL"
                          className="w-full px-3 py-1.5 rounded-lg bg-brand-dark border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold font-mono"
                        />
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {OWNER_AVATAR_PRESETS.map((preset, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => handleThreeOwnerFieldChange(idx, 'photo', preset.url)}
                              className="px-2 py-0.5 rounded bg-brand-dark hover:bg-brand-gold/20 text-[10px] text-brand-gold border border-brand-border/60"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Name & Designation */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Owner Full Name <span className="text-brand-gold">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={owner.name || ''}
                            onChange={(e) => handleThreeOwnerFieldChange(idx, 'name', e.target.value)}
                            placeholder="e.g. Full Name"
                            className="w-full px-3 py-2 rounded-xl bg-brand-dark border border-brand-border text-white text-xs font-bold focus:outline-none focus:border-brand-gold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Designation / Role <span className="text-brand-gold">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={owner.role || ''}
                            onChange={(e) => handleThreeOwnerFieldChange(idx, 'role', e.target.value)}
                            placeholder="e.g. Partner — Sourcing & Licencing"
                            className="w-full px-3 py-2 rounded-xl bg-brand-dark border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                          />
                        </div>
                      </div>

                      {/* Contact Phone & Email */}
                      <div className="space-y-3 pt-2 border-t border-brand-border/50">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Direct Contact Phone / WhatsApp <span className="text-brand-gold">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-brand-muted" />
                            <input
                              type="text"
                              required
                              value={owner.phone || ''}
                              onChange={(e) => handleThreeOwnerFieldChange(idx, 'phone', e.target.value)}
                              placeholder="+91 98200 12345"
                              className="w-full pl-9 pr-3 py-2 rounded-xl bg-brand-dark border border-brand-border text-white text-xs font-mono focus:outline-none focus:border-brand-gold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Official Direct Email ID <span className="text-brand-gold">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-brand-muted" />
                            <input
                              type="email"
                              required
                              value={owner.email || ''}
                              onChange={(e) => handleThreeOwnerFieldChange(idx, 'email', e.target.value)}
                              placeholder="owner@jmrshooz.com"
                              className="w-full pl-9 pr-3 py-2 rounded-xl bg-brand-dark border border-brand-border text-white text-xs font-mono focus:outline-none focus:border-brand-gold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Experience & Division */}
                      <div className="space-y-2 pt-2 border-t border-brand-border/50">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-1">Experience</label>
                          <input
                            type="text"
                            value={owner.experience || ''}
                            onChange={(e) => handleThreeOwnerFieldChange(idx, 'experience', e.target.value)}
                            placeholder="e.g. 20+ Years Veteran"
                            className="w-full px-3 py-1.5 rounded-lg bg-brand-dark border border-brand-border text-white text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-1">Core Responsibility</label>
                          <input
                            type="text"
                            value={owner.division || ''}
                            onChange={(e) => handleThreeOwnerFieldChange(idx, 'division', e.target.value)}
                            placeholder="e.g. Supply Chain & Operations"
                            className="w-full px-3 py-1.5 rounded-lg bg-brand-dark border border-brand-border text-white text-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: CENTRAL GODOWN & LOGISTICS HUB */}
              <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 sm:p-8 shadow-xl space-y-6">
                <div className="border-b border-brand-border/80 pb-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-brand-gold flex items-center gap-2">
                    <Warehouse className="w-4 h-4" />
                    <span>Central Distribution Godown & Logistics Hub Address</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter the physical address, storage capacity, helpline contact, and dispatch specifications of the central distribution warehouse.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Facility / Godown Hub Name <span className="text-brand-gold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={threeOwnersData.godown?.facilityName || ''}
                        onChange={(e) => handleThreeGodownFieldChange('facilityName', e.target.value)}
                        placeholder="e.g. JMR Shooz Central Distribution Godown & Logistics Hub"
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Prominent Landmark
                      </label>
                      <input
                        type="text"
                        value={threeOwnersData.godown?.landmark || ''}
                        onChange={(e) => handleThreeGodownFieldChange('landmark', e.target.value)}
                        placeholder="e.g. Opposite State Freight Terminal & Container Depot"
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Physical Street Address <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={threeOwnersData.godown?.address || ''}
                      onChange={(e) => handleThreeGodownFieldChange('address', e.target.value)}
                      placeholder="e.g. Plot No. 42-45, Sector-8, Footwear & Leather Complex, Phase-II, Udyog Vihar"
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        City <span className="text-brand-gold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={threeOwnersData.godown?.city || ''}
                        onChange={(e) => handleThreeGodownFieldChange('city', e.target.value)}
                        placeholder="e.g. New Delhi"
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        State / Region <span className="text-brand-gold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={threeOwnersData.godown?.state || ''}
                        onChange={(e) => handleThreeGodownFieldChange('state', e.target.value)}
                        placeholder="e.g. Delhi NCR"
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Postal Pincode <span className="text-brand-gold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={threeOwnersData.godown?.pincode || ''}
                        onChange={(e) => handleThreeGodownFieldChange('pincode', e.target.value)}
                        placeholder="e.g. 110041"
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-brand-border/60">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Godown Direct Helpline Phone <span className="text-brand-gold">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 w-4 h-4 text-brand-muted" />
                        <input
                          type="text"
                          required
                          value={threeOwnersData.godown?.contactPhone || ''}
                          onChange={(e) => handleThreeGodownFieldChange('contactPhone', e.target.value)}
                          placeholder="+91 98200 99887"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Godown Official Email ID <span className="text-brand-gold">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 w-4 h-4 text-brand-muted" />
                        <input
                          type="email"
                          required
                          value={threeOwnersData.godown?.email || ''}
                          onChange={(e) => handleThreeGodownFieldChange('email', e.target.value)}
                          placeholder="godown@jmrshooz.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Storage Capacity</label>
                      <input
                        type="text"
                        value={threeOwnersData.godown?.storageCapacity || ''}
                        onChange={(e) => handleThreeGodownFieldChange('storageCapacity', e.target.value)}
                        placeholder="e.g. 1,50,000+ Master Cartons"
                        className="w-full px-4 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Working Hours</label>
                      <input
                        type="text"
                        value={threeOwnersData.godown?.workingHours || ''}
                        onChange={(e) => handleThreeGodownFieldChange('workingHours', e.target.value)}
                        placeholder="Mon-Sat: 9 AM - 8 PM"
                        className="w-full px-4 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Dispatch Turnaround</label>
                      <input
                        type="text"
                        value={threeOwnersData.godown?.dispatchTime || ''}
                        onChange={(e) => handleThreeGodownFieldChange('dispatchTime', e.target.value)}
                        placeholder="e.g. 24-48 Hours Express"
                        className="w-full px-4 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Superintendent In-Charge</label>
                      <input
                        type="text"
                        value={threeOwnersData.godown?.godownInCharge || ''}
                        onChange={(e) => handleThreeGodownFieldChange('godownInCharge', e.target.value)}
                        placeholder="e.g. Rameshwar Dayal"
                        className="w-full px-4 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: EXTENDED STORY & PHILOSOPHY (COLLAPSIBLE DRAWER) */}
              <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-xl">
                <button
                  type="button"
                  onClick={() => setShowFounderDetailsDrawer(prev => !prev)}
                  className="w-full p-5 flex items-center justify-between bg-brand-card/40 hover:bg-brand-card/70 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-brand-gold" />
                    <div>
                      <span className="font-bold text-white text-sm block">
                        Detailed Founder Story & Executive Philosophy Paragraphs
                      </span>
                      <span className="text-xs text-slate-400">
                        Edit the long-form founder philosophy quote and 3-paragraph story if desired.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-wider">
                    <span>{showFounderDetailsDrawer ? 'Hide Details' : 'Edit Story'}</span>
                    {showFounderDetailsDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {showFounderDetailsDrawer && (
                  <div className="p-6 sm:p-8 space-y-6 border-t border-brand-border/80 animate-in fade-in">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Lead Quote / Management Headline
                      </label>
                      <input
                        type="text"
                        value={ownerProfile.quoteHeadline || ''}
                        onChange={(e) => handleOwnerChange('quoteHeadline', e.target.value)}
                        placeholder="e.g. We Don't Just Supply Shoes. We Protect the Commercial Viability of Footwear Retailers."
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-medium focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-xs font-semibold text-slate-300">
                        Detailed Message & Story (3 Paragraphs)
                      </label>
                      
                      <div>
                        <span className="text-[11px] text-brand-gold font-medium block mb-1">Paragraph 1 (The Genesis & Vision):</span>
                        <textarea
                          rows={3}
                          value={ownerProfile.bioParagraphs?.[0] || ''}
                          onChange={(e) => handleBioParagraphChange(0, e.target.value)}
                          className="w-full p-3 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold leading-relaxed"
                        />
                      </div>

                      <div>
                        <span className="text-[11px] text-brand-gold font-medium block mb-1">Paragraph 2 (Commitment to Supply & Logistics):</span>
                        <textarea
                          rows={3}
                          value={ownerProfile.bioParagraphs?.[1] || ''}
                          onChange={(e) => handleBioParagraphChange(1, e.target.value)}
                          className="w-full p-3 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold leading-relaxed"
                        />
                      </div>

                      <div>
                        <span className="text-[11px] text-brand-gold font-medium block mb-1">Paragraph 3 (Retailer Partnership Guarantee):</span>
                        <textarea
                          rows={3}
                          value={ownerProfile.bioParagraphs?.[2] || ''}
                          onChange={(e) => handleBioParagraphChange(2, e.target.value)}
                          className="w-full p-3 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Bottom Save Action */}
              <div className="p-4 rounded-2xl bg-brand-surface/95 backdrop-blur-md border border-brand-gold/40 shadow-2xl flex items-center justify-between">
                <span className="text-xs text-slate-300">
                  Ready to publish updated 3 Owners & Godown details?
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetThreeOwners}
                    className="px-4 py-2 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-300 font-bold text-xs uppercase"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider hover:bg-brand-gold-light shadow-gold-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save 3 Owners & Godown Hub</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

        {/* TAB 7: BANK & GST SETTLEMENT MANAGEMENT */}
        {activeTab === 'bank' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header info & actions */}
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-bold uppercase tracking-widest border border-brand-gold/30 mb-2">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Commercial Banking & GST Verification</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">Bank Settlement & Retailer GST Invoicing Hub</h3>
                <p className="text-xs text-brand-muted mt-1">
                  Configure official company wholesale remittance bank coordinates and review registered retailer GSTINs stored in the SQLite database.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetCompanyBank}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveCompanyBank}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Bank Coordinates</span>
                </button>
              </div>
            </div>

            {bankSaveSuccess && (
              <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-4 flex items-center gap-3 text-emerald-300 text-xs font-medium animate-in fade-in">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Company bank details saved successfully to the SQLite database! Live for all retailers.</span>
              </div>
            )}

            {/* SECTION 1: EDIT OFFICIAL COMPANY SETTLEMENT ACCOUNT */}
            <form onSubmit={handleSaveCompanyBank} className="bg-brand-surface rounded-2xl border border-brand-gold/40 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="border-b border-brand-border/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-brand-gold flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Official Company Wholesale Collection Bank Account</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Retailers see these bank details on their wholesale portal for RTGS, NEFT, IMPS, and UPI transfers.
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  SQLite Synced
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Account Beneficiary Name <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyBank.accountName || ''}
                    onChange={(e) => handleCompanyBankChange('accountName', e.target.value)}
                    placeholder="e.g. JMR SHOOZ DISTRIBUTION PRIVATE LIMITED"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-bold focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Bank Name <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyBank.bankName || ''}
                    onChange={(e) => handleCompanyBankChange('bankName', e.target.value)}
                    placeholder="e.g. HDFC Bank, ICICI, SBI"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Bank Account Number <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyBank.accountNumber || ''}
                    onChange={(e) => handleCompanyBankChange('accountNumber', e.target.value)}
                    placeholder="e.g. 50200084920194"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono font-bold text-brand-gold focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    IFSC Code <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyBank.ifscCode || ''}
                    onChange={(e) => handleCompanyBankChange('ifscCode', e.target.value.toUpperCase())}
                    placeholder="e.g. HDFC0000128"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono uppercase focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Account Type <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyBank.accountType || ''}
                    onChange={(e) => handleCompanyBankChange('accountType', e.target.value)}
                    placeholder="e.g. Current Account"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Official UPI ID
                  </label>
                  <input
                    type="text"
                    value={companyBank.upiId || ''}
                    onChange={(e) => handleCompanyBankChange('upiId', e.target.value)}
                    placeholder="e.g. jmrshooz@hdfcbank"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono text-emerald-400 focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Distributor GSTIN <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyBank.companyGstin || ''}
                    onChange={(e) => handleCompanyBankChange('companyGstin', e.target.value.toUpperCase())}
                    placeholder="e.g. 07AAACJ1234F1Z8"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono uppercase focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Company PAN Number
                  </label>
                  <input
                    type="text"
                    value={companyBank.companyPan || ''}
                    onChange={(e) => handleCompanyBankChange('companyPan', e.target.value.toUpperCase())}
                    placeholder="e.g. AAACJ1234F"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono uppercase focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Bank Branch Name & Full Address
                </label>
                <input
                  type="text"
                  value={companyBank.branch || ''}
                  onChange={(e) => handleCompanyBankChange('branch', e.target.value)}
                  placeholder="e.g. Kirti Nagar Footwear Commercial Complex, New Delhi - 110015"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Update & Save to Database</span>
                </button>
              </div>
            </form>

            {/* SECTION 2: RETAILERS GST & BANK DIRECTORY */}
            <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-xl">
              <div className="p-5 border-b border-brand-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Registered Retailers GST & Bank Account Directory</h3>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Live retailer billing coordinates retrieved from the central SQLite database.
                  </p>
                </div>
                <span className="text-xs font-mono text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/30">
                  {retailersList.length} Accounts
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-brand-card/60 text-brand-muted uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Retailer / Store</th>
                      <th className="py-3.5 px-4">Retailer ID</th>
                      <th className="py-3.5 px-4">GSTIN (GST No.)</th>
                      <th className="py-3.5 px-4">Settlement Bank</th>
                      <th className="py-3.5 px-4">Account Number</th>
                      <th className="py-3.5 px-4">IFSC Code</th>
                      <th className="py-3.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/60">
                    {retailersList.map((r) => (
                      <tr key={r.id} className="hover:bg-brand-card/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-xs">{r.companyName || r.name}</div>
                          <div className="text-[11px] text-slate-400">{r.name} • {r.city || 'India'}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-brand-gold font-bold text-xs">
                          {r.retailerId || r.id}
                        </td>
                        <td className="py-3.5 px-4">
                          {r.gstin ? (
                            <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 text-[11px]">
                              <Check className="w-3 h-3" />
                              {r.gstin}
                            </span>
                          ) : (
                            <span className="text-slate-500 italic text-[11px]">Unregistered</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-white">{r.bankName || 'Not Set'}</span>
                          {r.branch && <div className="text-[10px] text-slate-400">{r.branch}</div>}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-200">
                          {r.accountNo || '—'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          {r.ifsc || '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold text-[10px] border border-emerald-500/30">
                            {r.status || 'Verified'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* MODAL: UPLOAD NEW BRAND */}
      {showAddBrandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-1">Upload New Footwear Brand Listing</h3>
            <p className="text-xs text-brand-muted mb-4">Add a new footwear brand to the JMR Shooz distribution roster.</p>

            <form onSubmit={handleCreateBrand} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={newBrand.name}
                  onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                  placeholder="e.g. Liberty, Columbus, Fuel..."
                  className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">Tagline / Brand Specialty</label>
                <input
                  type="text"
                  value={newBrand.tagline}
                  onChange={(e) => setNewBrand({ ...newBrand, tagline: e.target.value })}
                  placeholder="e.g. High-Performance Sports & Running Footwear"
                  className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={newBrand.category}
                    onChange={(e) => setNewBrand({ ...newBrand, category: e.target.value })}
                    placeholder="e.g. Athletic, Formal, PU Slippers"
                    className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">Origin / Hub</label>
                  <input
                    type="text"
                    value={newBrand.origin}
                    onChange={(e) => setNewBrand({ ...newBrand, origin: e.target.value })}
                    placeholder="e.g. Karnal / Delhi / Mumbai (India)"
                    className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">Retail Margin Range</label>
                  <input
                    type="text"
                    value={newBrand.retailMargin}
                    onChange={(e) => setNewBrand({ ...newBrand, retailMargin: e.target.value })}
                    placeholder="e.g. 40% - 48%"
                    className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">Standard Carton MOQ</label>
                  <input
                    type="text"
                    value={newBrand.moq}
                    onChange={(e) => setNewBrand({ ...newBrand, moq: e.target.value })}
                    placeholder="e.g. 36 pairs / carton"
                    className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">Banner Image URL</label>
                <input
                  type="text"
                  value={newBrand.bannerImage}
                  onChange={(e) => setNewBrand({ ...newBrand, bannerImage: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">Brand Description</label>
                <textarea
                  rows="2"
                  value={newBrand.description}
                  onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
                  placeholder="Short distributor summary..."
                  className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold resize-none"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddBrandModal(false)}
                  className="px-4 py-2 rounded-xl bg-brand-card text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-brand-gold text-brand-dark font-bold uppercase tracking-wider hover:brightness-110 shadow-gold-sm"
                >
                  Publish Brand Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT LISTING */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-brand-surface border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-1">Add Footwear SKU Listing</h3>
            <p className="text-xs text-brand-muted mb-4">Add a wholesale footwear model under an authorized brand.</p>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">Select Brand *</label>
                <select
                  value={newProduct.brandId}
                  onChange={(e) => {
                    const b = brands.find(item => item.id === e.target.value);
                    setNewProduct({
                      ...newProduct,
                      brandId: e.target.value,
                      brandName: b ? b.name : ''
                    });
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                >
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">Model Name *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Liberty Fortune Executive Derby"
                  className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                  >
                    <option value="Formal">Formal</option>
                    <option value="Athletic">Athletic & Sports</option>
                    <option value="Casual">Casual / Daily</option>
                    <option value="Boots">Boots & Heritage</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">Carton MOQ</label>
                  <input
                    type="text"
                    value={newProduct.moq}
                    onChange={(e) => setNewProduct({ ...newProduct, moq: e.target.value })}
                    placeholder="e.g. 36 Pairs (1 Carton)"
                    className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">Wholesale Rate / Pair *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.wholesaleRate}
                    onChange={(e) => setNewProduct({ ...newProduct, wholesaleRate: e.target.value })}
                    placeholder="e.g. ₹680 / pair"
                    className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">Suggested Retail MSRP *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.suggestedRetailPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, suggestedRetailPrice: e.target.value })}
                    placeholder="e.g. ₹1,499 / pair"
                    className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-300 mb-1">Product Photo URL</label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-brand-card text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-brand-gold text-brand-dark font-bold uppercase tracking-wider hover:brightness-110 shadow-gold-sm"
                >
                  Publish Shoe Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
