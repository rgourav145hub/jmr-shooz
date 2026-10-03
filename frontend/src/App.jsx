import React, { useState, useEffect, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductQuickViewModal from './components/ProductQuickViewModal';
import BusinessEnquiryModal from './components/BusinessEnquiryModal';
import AuthModal from './components/AuthModal';
import FeedbackQueryModal from './components/FeedbackQueryModal';
import Toast from './components/Toast';

import HomePage from './pages/HomePage';
import BrandsPage from './pages/BrandsPage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import OwnerPage from './pages/OwnerPage';
import ContactPage from './pages/ContactPage';
import AdminPortal from './pages/admin/AdminPortal';
import RetailerPortal from './pages/RetailerPortal';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { AdminEditProvider } from './contexts/AdminEditContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import MobileBottomNav from './components/MobileBottomNav';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("JMR_APP_ERROR:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0C10] text-white flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-[#13151D] border border-amber-500/40 p-8 rounded-3xl shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-[#C5A880]">Portal Refresh Required</h2>
            <p className="text-xs text-slate-300">
                A temporary interface state occurred. Click below to reload the distributor catalog.
              </p>
              <pre className="text-left text-xs bg-black/50 p-4 rounded text-red-400 overflow-auto max-h-40">
                {this.state.error?.toString()}
                {"\n"}
                {this.state.error?.stack}
              </pre>
            <button
              onClick={() => { window.location.reload(); }}
              className="px-6 py-2.5 rounded-xl bg-[#C5A880] text-[#0B0C10] font-bold text-xs uppercase"
            >
              Reset Cache & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function ProtectedRoute({ children, role }) {
  const { currentUser, isAdmin, isRetailer } = useAuth();
  if (!currentUser) return <Navigate to="/" replace />;
  if (role === 'admin' && !isAdmin) return <Navigate to="/" replace />;
  if (role === 'retailer' && !isRetailer) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            <WishlistProvider>
              <Router>
                <AppContent />
              </Router>
            </WishlistProvider>
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}


function AppContent() {
  const { currentUser, login } = useAuth();
  
  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryPrefill, setEnquiryPrefill] = useState(null);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [authModalRole, setAuthModalRole] = useState('retailer');

  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [initialQueryBrand, setInitialQueryBrand] = useState('');

  const [toast, setToast] = useState(null);

  const handleOpenAuth = (mode = 'login', role = 'retailer') => {
    setAuthModalMode(mode);
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user) => {
    login(user);
    const isAdminUser = user.userType === 'admin' || user.accountType === 'admin' || user.user_type === 'admin' || user.isSubAdmin;
    if (isAdminUser) {
      setToast({
        message: 'Admin Access Granted',
        subtext: `Logged in as ${user.name || 'Admin'} (Managing Distributor).`
      });
    } else {
      setToast({
        message: 'Retailer Portal Active',
        subtext: `Welcome ${user.companyName || user.name} (ID: ${user.retailerId || user.id}).`
      });
    }
  };

  const handleOpenEnquiryModal = (prefill = null) => {
    setEnquiryPrefill(prefill);
    setIsEnquiryModalOpen(true);
  };

  const handleOpenQueryModal = (brand = '') => {
    setInitialQueryBrand(brand);
    setIsQueryModalOpen(true);
  };

  const handleProductEnquire = (product) => {
    handleOpenEnquiryModal({
      brandName: product.brandName,
      productName: product.name,
      sku: product.sku
    });
  };

  const handleBrandEnquire = (brand) => {
    handleOpenEnquiryModal({
      brandName: brand.name,
      productName: '',
      sku: 'ALL-BRAND-COLLECTION'
    });
  };

  return (
    <AdminEditProvider onNotification={(toastData) => setToast(toastData)}>
      <div className="min-h-screen bg-brand-dark text-slate-100 flex flex-col font-sans selection:bg-brand-gold selection:text-brand-dark pb-16 md:pb-0">
      
      {/* Navbar */}
      <Navbar
        openAuthModal={handleOpenAuth}
        openQueryModal={() => handleOpenQueryModal()}
        onQuickView={(prod) => setQuickViewProduct(prod)}
      />

      {/* Main View Router */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <HomePage
              currentUser={currentUser}
              openAuthModal={handleOpenAuth}
              onQuickView={(prod) => setQuickViewProduct(prod)}
              onEnquire={handleProductEnquire}
              openEnquiryModal={() => handleOpenEnquiryModal()}
            />
          } />
          
          <Route path="/brands" element={
            <BrandsPage
              openAuthModal={handleOpenAuth}
              openEnquiryModal={() => handleOpenEnquiryModal()}
              onEnquireBrand={handleBrandEnquire}
            />
          } />

          <Route path="/products" element={
            <ProductsPage
              openAuthModal={handleOpenAuth}
              onQuickView={(prod) => setQuickViewProduct(prod)}
              onEnquire={handleProductEnquire}
              openEnquiryModal={() => handleOpenEnquiryModal()}
            />
          } />

          <Route path="/about" element={
            <AboutPage
              openEnquiryModal={() => handleOpenEnquiryModal()}
            />
          } />

          <Route path="/owner" element={
            <OwnerPage
              currentUser={currentUser}
              openAuthModal={handleOpenAuth}
              openEnquiryModal={() => handleOpenEnquiryModal()}
            />
          } />

          <Route path="/contact" element={
            <ContactPage
              onEnquirySuccess={(toastData) => setToast(toastData)}
            />
          } />

          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminPortal
                onNotification={(n) => setToast(n)}
              />
            </ProtectedRoute>
          } />

          <Route path="/retailer" element={
            <ProtectedRoute role="retailer">
              <RetailerPortal
                currentUser={currentUser}
                openQueryModal={handleOpenQueryModal}
                onNotification={(n) => setToast(n)}
              />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      {/* Footer */}
      <Footer openEnquiryModal={() => handleOpenEnquiryModal()} />

      {/* Mobile App-Style Bottom Navigation Dock */}
      <MobileBottomNav openAuthModal={handleOpenAuth} />

      {/* Modals */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          openAuthModal={handleOpenAuth}
          onEnquire={(prod) => {
            setQuickViewProduct(null);
            handleProductEnquire(prod);
          }}
        />
      )}

      <BusinessEnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        prefillData={enquiryPrefill}
        onSubmitSuccess={(details) => {
          setToast({
            message: 'Business Enquiry Registered',
            subtext: `Ref ID: ${details.referenceId || 'JMR-B2B'}. Our team will contact you within 24 hours.`
          });
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        initialRole={authModalRole}
        onAuthSuccess={handleAuthSuccess}
      />

      <FeedbackQueryModal
        isOpen={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
        currentUser={currentUser}
        initialBrand={initialQueryBrand}
        onSuccess={(ticket) => {
          setToast({
            message: 'Query / Feedback Submitted',
            subtext: `Ticket #${ticket.id} received by JMR Shooz management.`
          });
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer 
        openAuthModal={handleOpenAuth} 
        onOrderSuccess={(order) => {
          setToast({
            message: 'Wholesale Order Placed!',
            subtext: `Order #${order.orderId} submitted. Confirmation email dispatched.`
          });
        }} 
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer 
        openAuthModal={handleOpenAuth}
        openEnquiryModal={(prod) => {
          handleProductEnquire(prod);
        }}
        onQuickView={(prod) => {
          setQuickViewProduct(prod);
        }}
      />

      {/* Toast Alert */}
      {toast && (
        <Toast
          message={toast.message}
          subtext={toast.subtext}
          onClose={() => setToast(null)}
        />
      )}
    </div>
    </AdminEditProvider>
  );
}

