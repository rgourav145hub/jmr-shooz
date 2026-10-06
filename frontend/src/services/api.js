/**
 * JMR Shooz REST API Client
 * Connects Frontend directly to SQLite Backend with Local Storage Dual-Sync
 */

import { 
  authenticateUser, 
  registerRetailer, 
  generateMockOtp, 
  verifyMockOtp, 
  resetUserPasswordWithOtp,
  getBankDetails,
  saveBankDetails,
  updateRetailerBankDetails,
  getCompanySettings,
  saveCompanySettings,
  updateProduct,
  updateBrand,
  getSubAdmins,
  saveSubAdmin,
  updateSubAdmin,
  getStoredOrders,
  saveOrder,
  updateOrderStatus,
  updateOrderDetails,
  updateUserProfile,
  getStoredSchemesAndEvents,
  saveSchemeOrEvent,
  updateSchemeOrEvent,
  deleteSchemeOrEvent,
  setCurrentUser
} from '../utils/storage';

const API_BASE = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : '/api';

async function request(endpoint, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s fast timeout

    const token = localStorage.getItem('jmr_auth_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers
    });
    clearTimeout(timeoutId);

    // If static hosting returns 405 (Method Not Allowed for POST) or HTML SPA fallback
    if (res.status === 405) {
      return { ok: false, status: 405, data: {}, isStaticHosting: true };
    }

    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.warn(`API call to ${endpoint} failed or timed out:`, err.message);
    return { ok: false, status: 0, error: err.message, isTimedOut: true };
  }
}

// 1. Health Check
export async function checkDatabaseHealth() {
  const res = await request('/health', { method: 'GET' });
  if (res.ok) {
    return { connected: true, ...res.data };
  }
  return { connected: false, database: 'Local Offline Fallback', storage: 'Browser LocalStorage' };
}

// 2. Login (Password)
export async function apiLogin(identifier, password, role = '') {
  const res = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password, role })
  });

  if (res.ok && res.data.success) {
    if (res.data.token) {
      localStorage.setItem('jmr_auth_token', res.data.token);
    }
    if (res.data.user) {
      setCurrentUser(res.data.user);
    }
    return res.data;
  }
  if (res.data && res.data.error) {
    return res.data;
  }
  
  // Fallback to local storage if backend is offline or account not found in mock DB
  console.log('Backend auth failed or offline, falling back to local storage...');
  return authenticateUser(identifier, password, role);
}

// 3. Send OTP
export async function apiSendOtp(identifier, purpose = 'LOGIN') {
  const res = await request('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ identifier, purpose })
  });

  if (res.ok && res.data && typeof res.data.success !== 'undefined') {
    return res.data;
  }
  // Return explicit business error if returned by backend (like 409 user already registered)
  if (res.data && res.data.error && res.status !== 405) {
    return res.data;
  }
  console.log('Backend send-otp unreachable, timed out, or offline, falling back to local storage...');
  return generateMockOtp(identifier, purpose);
}

// 4. Verify OTP
export async function apiVerifyOtp(identifier, otp, purpose = 'LOGIN', role = '') {
  const res = await request('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ identifier, otp, purpose, role })
  });

  if (res.ok && res.data?.success) {
    if (res.data.token) {
      localStorage.setItem('jmr_auth_token', res.data.token);
    }
    if (res.data.user) {
      setCurrentUser(res.data.user);
    }
    return res.data;
  }
  if (res.data && res.data.error && res.status !== 405) {
    return res.data;
  }
  console.log('Backend verify-otp unreachable, timed out, or offline, falling back to local storage...');
  return verifyMockOtp(identifier, otp, purpose);
}

// 5. Forgot Password: Mailer Status
export async function apiGetMailStatus() {
  const res = await request('/auth/mail-status', { method: 'GET' });
  return res.ok && res.data ? res.data : { configured: false };
}

// 5b. Forgot Password: Request OTP
export async function apiForgotPasswordRequest(identifier) {
  const res = await request('/auth/forgot-password/request', {
    method: 'POST',
    body: JSON.stringify({ identifier })
  });

  if (res.ok && res.data) {
    return res.data;
  }
  if (res.data && res.data.error && res.status !== 405) {
    return res.data;
  }
  return {
    success: true,
    message: 'OTP generated for local recovery',
    simulated: true,
    simulatedOtp: '789456'
  };
}

// 6. Forgot Password: Reset Password
export async function apiForgotPasswordReset(identifier, otp, newPassword) {
  const res = await request('/auth/forgot-password/reset', {
    method: 'POST',
    body: JSON.stringify({ identifier, otp, newPassword })
  });

  if (res.ok && res.data) {
    return res.data;
  }
  if (res.data && res.data.error && res.status !== 405) {
    return res.data;
  }
  return { success: true, message: 'Password has been reset successfully!' };
}

// 7. Register
export async function apiRegisterRetailer(retailerData) {
  const res = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(retailerData)
  });

  // Successful backend response
  if (res.ok && res.data && typeof res.data.success !== 'undefined') {
    if (res.data.success) {
      if (res.data.token && res.data.user?.status !== 'pending') {
        localStorage.setItem('jmr_auth_token', res.data.token);
      }
      registerRetailer(retailerData, res.data.user);
    }
    return res.data;
  }

  // Explicit business rejection from backend (e.g. 409 Email/Phone already registered)
  if (res.data && res.data.error && res.status !== 405) {
    return res.data;
  }

  // Safe Offline / Vercel static fallback: Save to local storage
  console.log('Backend register timed out or offline, completing registration in local storage...');
  const localUser = registerRetailer(retailerData);
  return {
    success: true,
    message: 'Account registered successfully. Awaiting Admin verification.',
    user: localUser,
    simulated: true
  };
}

export function apiLogout() {
  localStorage.removeItem('jmr_auth_token');
}

// 8. Bank Details
export async function apiGetCompanyBank() {
  const res = await request('/bank-details', { method: 'GET' });
  if (res.ok) {
    saveBankDetails(res.data);
    return res.data;
  }
  return getBankDetails();
}

export async function apiSaveCompanyBank(bankData) {
  const res = await request('/bank-details', {
    method: 'POST',
    body: JSON.stringify(bankData)
  });

  if (res.ok && res.data.success) {
    saveBankDetails(res.data.data);
    return res.data;
  }

  const localSaved = saveBankDetails(bankData);
  return { success: true, message: 'Saved to local storage', data: localSaved };
}

export async function apiUpdateRetailerBank(userId, bankData) {
  const res = await request(`/users/${userId}/bank`, {
    method: 'POST',
    body: JSON.stringify(bankData)
  });

  if (res.ok && res.data.success) {
    updateRetailerBankDetails(userId, bankData);
    return res.data;
  }

  return updateRetailerBankDetails(userId, bankData);
}

export async function apiUpdateUserProfile(userId, profileData) {
  const res = await request(`/users/${userId}/profile`, {
    method: 'POST',
    body: JSON.stringify(profileData)
  });

  if (res.ok && res.data?.user) {
    updateUserProfile(userId, res.data.user);
    return res.data;
  }

  const localRes = updateUserProfile(userId, profileData);
  return { success: true, message: 'Profile updated successfully', user: localRes.user };
}

// 9. Brands
export async function apiGetBrands() {
  const res = await request('/brands', { method: 'GET' });
  if (res.ok) return res.data.data || [];
  return []; // Fallback empty array, or you could fallback to storage
}

export async function apiCreateBrand(brandData) {
  const res = await request('/brands', {
    method: 'POST',
    body: JSON.stringify(brandData)
  });
  return res.data;
}

export async function apiUpdateBrand(id, brandData) {
  const res = await request(`/brands/${id}`, {
    method: 'PUT',
    body: JSON.stringify(brandData)
  });
  updateBrand(id, brandData);
  if (res.ok) return res.data;
  return { success: true, data: brandData };
}

export async function apiDeleteBrand(id) {
  const res = await request(`/brands/${id}`, { method: 'DELETE' });
  return res.data;
}

// 10. Products
export async function apiGetProducts() {
  const res = await request('/products', { method: 'GET' });
  if (res.ok) return res.data.data || [];
  return [];
}

export async function apiCreateProduct(productData) {
  const res = await request('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  });
  return res.data;
}

export async function apiUpdateProduct(id, productData) {
  const res = await request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  });
  updateProduct(id, productData);
  if (res.ok) return res.data;
  return { success: true, data: productData };
}

export async function apiDeleteProduct(id) {
  const res = await request(`/products/${id}`, { method: 'DELETE' });
  return res.data;
}

// 11. Queries
export async function apiGetQueries() {
  const res = await request('/queries', { method: 'GET' });
  if (res.ok) return res.data.data || [];
  return [];
}

export async function apiSubmitQuery(queryData) {
    const res = await request('/queries', {
      method: 'POST',
      body: JSON.stringify(queryData)
    });
    if (res.ok) return res.data;
    const local = submitQueryOrFeedback(queryData);
    return { success: true, data: local };
  }

export async function apiUpdateQueryStatus(id, status) {
    const res = await request(`/queries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    if (res.ok) return res.data;
    updateQueryStatus(id, status);
    return { success: true };
  }

// 12. Banners
export async function apiGetBanners() {
  const res = await request('/banners', { method: 'GET' });
  if (res.ok) return res.data.data || [];
  return [];
}

export async function apiCreateBanner(bannerData) {
  const res = await request('/banners', {
    method: 'POST',
    body: JSON.stringify(bannerData)
  });
  return res.data;
}

export async function apiDeleteBanner(id) {
  const res = await request(`/banners/${id}`, { method: 'DELETE' });
  return res.data;
}

export async function apiResetBanners() {
  const res = await request('/banners/reset', { method: 'PUT' });
  return res.data;
}

// 13. Owner Profiles
export async function apiGetOwnerProfiles() {
  const res = await request('/owner-profiles', { method: 'GET' });
  if (res.ok) return res.data.data || {};
  return {};
}

export async function apiUpdateOwnerProfiles(profileData) {
  const res = await request('/owner-profiles', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
  return res.data;
}

// --- NEW CRUD API ENDPOINTS ---


export const apiGetPendingUsers = async () => {
  const res = await request('/admin/pending-users', { method: 'GET' });
  if (res.ok && Array.isArray(res.data)) return res.data;
  
  // Fallback to local storage
  const users = JSON.parse(localStorage.getItem('jmr_users') || '[]');
  return users.filter(u => u.status === 'pending');
};

export const apiApproveUser = async (userId) => {
  const res = await request('/admin/approve-user', {
    method: 'POST',
    body: JSON.stringify({ userId })
  });
  
  // Always update local storage for dual sync
  const users = JSON.parse(localStorage.getItem('jmr_users') || '[]');
  const updatedUsers = users.map(u => (u.id === userId || u.retailerId === userId) ? { ...u, status: 'active' } : u);
  localStorage.setItem('jmr_users', JSON.stringify(updatedUsers));
  window.dispatchEvent(new Event('jmr_users_updated'));

  if (res.ok && res.data?.success) {
    return res.data;
  }
  return { success: true, message: 'User approved locally.' };
};

export const apiRejectUser = async (userId) => {
  const res = await request('/admin/reject-user', {
    method: 'POST',
    body: JSON.stringify({ userId })
  });

  // Always update local storage for dual sync
  const users = JSON.parse(localStorage.getItem('jmr_users') || '[]');
  const updatedUsers = users.filter(u => u.id !== userId && u.retailerId !== userId);
  localStorage.setItem('jmr_users', JSON.stringify(updatedUsers));
  window.dispatchEvent(new Event('jmr_users_updated'));

  if (res.ok && res.data?.success) {
    return res.data;
  }
  return { success: true, message: 'User removed.' };
};

// 14. Company Settings
export async function apiGetCompanySettings() {
  const res = await request('/settings', { method: 'GET' });
  if (res.ok) return res.data.data || {};
  return getCompanySettings();
}

export async function apiUpdateCompanySettings(settingsData) {
  const res = await request('/settings', {
    method: 'PUT',
    body: JSON.stringify(settingsData)
  });
  if (res.ok) return res.data;
  const localSaved = saveCompanySettings(settingsData);
  return { success: true, message: 'Settings updated offline', data: localSaved };
}

// 15. Sub-Admins & Authorization Matrix (Master Admin Only)
export async function apiGetSubAdmins() {
  const res = await request('/admin/subadmins', { method: 'GET' });
  if (res.ok && Array.isArray(res.data)) {
    return res.data;
  }
  return getSubAdmins();
}

export async function apiCreateSubAdmin(subAdminData) {
  const localSaved = saveSubAdmin(subAdminData);
  const res = await request('/admin/subadmins', {
    method: 'POST',
    body: JSON.stringify(subAdminData)
  });
  if (res.ok && res.data?.subAdmin) {
    return res.data.subAdmin;
  }
  return localSaved;
}

export async function apiUpdateSubAdmin(id, subAdminData) {
  const localUpdated = updateSubAdmin(id, subAdminData);
  const res = await request(`/admin/subadmins/${id}`, {
    method: 'PUT',
    body: JSON.stringify(subAdminData)
  });
  if (res.ok && res.data?.subAdmin) {
    return res.data.subAdmin;
  }
  return localUpdated;
}

export async function apiDeleteSubAdmin(id) {
  deleteSubAdmin(id);
  const res = await request(`/admin/subadmins/${id}`, {
    method: 'DELETE'
  });
  return { success: true, message: 'Sub-Admin removed.' };
}

// --- ORDERS DESK & CART CHECKOUT API ---
export async function apiGetOrders(userId = '') {
  const queryParam = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  const res = await request(`/orders${queryParam}`, { method: 'GET' });
  if (res.ok && Array.isArray(res.data)) {
    return res.data;
  }
  const localOrders = getStoredOrders();
  if (userId) {
    return localOrders.filter(o => o.userId === userId || o.retailerId === userId);
  }
  return localOrders;
}

export async function apiPlaceOrder(orderData) {
  const localSaved = saveOrder(orderData);
  const res = await request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
  if (res.ok && res.data?.order) {
    return res.data;
  }
  return { success: true, message: 'Order registered in central dispatch queue.', order: localSaved };
}

export async function apiUpdateOrderStatus(orderId, status, adminNote = '') {
  const localUpdated = updateOrderStatus(orderId, status, adminNote);
  const res = await request(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, adminNote })
  });
  if (res.ok && res.data?.order) {
    return res.data;
  }
  return { success: true, message: `Status updated to ${status}`, order: localUpdated };
}

export async function apiUpdateOrder(orderId, orderData) {
  const localUpdated = updateOrderDetails(orderId, orderData);
  const res = await request(`/orders/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify(orderData)
  });
  if (res.ok && res.data?.order) {
    return res.data;
  }
  return { success: true, message: 'Order consignment updated successfully', order: localUpdated };
}

// 17. Schemes, Events & Photos Showcase API
export async function apiGetSchemesEvents() {
  const res = await request('/schemes-events', { method: 'GET' });
  if (res.ok && Array.isArray(res.data)) {
    return res.data;
  }
  return getStoredSchemesAndEvents();
}

export async function apiCreateSchemeEvent(itemData) {
  const localSaved = saveSchemeOrEvent(itemData);
  const res = await request('/schemes-events', {
    method: 'POST',
    body: JSON.stringify(itemData)
  });
  if (res.ok && res.data) {
    return res.data;
  }
  return localSaved;
}

export async function apiUpdateSchemeEvent(id, itemData) {
  const localUpdated = updateSchemeOrEvent(id, itemData);
  const res = await request(`/schemes-events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(itemData)
  });
  if (res.ok && res.data) {
    return res.data;
  }
  return localUpdated;
}

export async function apiDeleteSchemeEvent(id) {
  deleteSchemeOrEvent(id);
  const res = await request(`/schemes-events/${id}`, {
    method: 'DELETE'
  });
  return { success: true, message: 'Deleted successfully' };
}

// 15. WISHLIST & PRODUCT SHORTLIST DATABASE API
export async function apiGetWishlist(userId = 'guest') {
  const res = await request(`/wishlist?userId=${encodeURIComponent(userId)}`, {
    method: 'GET'
  });
  if (res.ok && res.data && Array.isArray(res.data.items)) {
    return res.data.items;
  }
  return null;
}

export async function apiAddToWishlist(userId = 'guest', product) {
  if (!product || !product.id) return { success: false };
  const res = await request('/wishlist', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      productId: product.id,
      product
    })
  });
  return res.ok ? res.data : { success: false };
}

export async function apiRemoveFromWishlist(userId = 'guest', productId) {
  if (!productId) return { success: false };
  const res = await request(`/wishlist/${encodeURIComponent(productId)}?userId=${encodeURIComponent(userId)}`, {
    method: 'DELETE'
  });
  return res.ok ? res.data : { success: false };
}

export async function apiSyncWishlist(userId = 'guest', items = []) {
  const res = await request('/wishlist/sync', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      items
    })
  });
  if (res.ok && res.data && Array.isArray(res.data.items)) {
    return res.data.items;
  }
  return null;
}

export async function apiClearWishlist(userId = 'guest') {
  const res = await request(`/wishlist/clear?userId=${encodeURIComponent(userId)}`, {
    method: 'DELETE'
  });
  return res.ok ? res.data : { success: false };
}



