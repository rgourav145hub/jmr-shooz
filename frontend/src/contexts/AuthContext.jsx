import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, setCurrentUser as setStorageUser, logoutUser } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUserState] = useState(() => getCurrentUser());

  useEffect(() => {
    const handleUserChange = () => {
      setCurrentUserState(getCurrentUser());
    };
    window.addEventListener('jmr_user_changed', handleUserChange);
    return () => window.removeEventListener('jmr_user_changed', handleUserChange);
  }, []);

  const login = (user) => {
    if (user) {
      setStorageUser(user);
    }
    setCurrentUserState(user);
  };

  const logout = () => {
    logoutUser();
    localStorage.removeItem('jmr_auth_token');
    setCurrentUserState(null);
  };

  const isSubAdmin = Boolean(currentUser) && (currentUser?.isSubAdmin === true || currentUser?.userType === 'subadmin' || currentUser?.accountType === 'subadmin');
  const isAdmin = Boolean(currentUser) && (currentUser?.userType === 'admin' || currentUser?.accountType === 'admin' || currentUser?.user_type === 'admin' || currentUser?.role?.toLowerCase()?.includes('admin') || isSubAdmin);
  const isMasterAdmin = isAdmin && !isSubAdmin;
  const isRetailer = Boolean(currentUser) && (currentUser?.userType === 'retailer' || currentUser?.accountType === 'retailer' || currentUser?.user_type === 'retailer');

  /**
   * Check granular permission for Admin and Sub-Admin
   * Master Admin always has unconditional access (returns true for everything).
   * Sub-Admin checks their specific permission switches.
   */
  const hasPermission = (permissionKey) => {
    if (!currentUser) return false;
    if (isMasterAdmin) return true; // Master Admin has authority over everything
    if (!isSubAdmin) return false;

    // Check specific sub-admin permission
    const perms = currentUser.permissions || {};
    if (permissionKey === 'manage_products') return perms.manage_products !== false;
    if (permissionKey === 'delete_products') return !!perms.delete_products;
    if (permissionKey === 'manage_brands') return perms.manage_brands !== false;
    if (permissionKey === 'delete_brands') return !!perms.delete_brands;
    if (permissionKey === 'manage_retailers') return perms.manage_retailers !== false;
    if (permissionKey === 'manage_queries') return perms.manage_queries !== false;
    if (permissionKey === 'manage_cms') return perms.manage_cms !== false;
    if (permissionKey === 'manage_subadmins') return false; // Strictly restricted to Master Admin!

    return !!perms[permissionKey];
  };

  const value = {
    currentUser,
    login,
    logout,
    isAdmin,
    isMasterAdmin,
    isSubAdmin,
    isRetailer,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
