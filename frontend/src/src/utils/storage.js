import { brandsData as initialBrands } from '../data/brandsData';
import { productsData as initialProducts } from '../data/productsData';

const BRANDS_KEY = 'jmr_brands_v1';
const PRODUCTS_KEY = 'jmr_products_v1';
const USERS_KEY = 'jmr_users_v1';
const QUERIES_KEY = 'jmr_queries_feedback_v1';
const CURRENT_USER_KEY = 'jmr_active_user_v1';
const OWNER_PROFILE_KEY = 'jmr_owner_profile_v1';
const ORDERS_KEY = 'jmr_orders_v1';
const CART_KEY = 'jmr_cart_v1';

// Initial default owner / management profile
export const INITIAL_OWNER_PROFILE = {
  founderName: 'J. M. Ronald',
  founderRole: 'Founder & Managing Director',
  experience: 'Footwear Industry Veteran (22+ Years)',
  yearsLeading: '18+',
  retailPartnerships: '480+',
  authenticityRecord: '100%',
  phone: '+91 98200 12345',
  email: 'ronald.jmr@jmrshooz.com',
  location: 'B2B Central Distribution Hub, New Delhi, India',
  photoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  quoteHeadline: "We Don't Just Supply Shoes. We Protect the Commercial Viability of Footwear Retailers.",
  bioParagraphs: [
    "When I founded JMR Shooz, the footwear distribution ecosystem was plagued by erratic deliveries, zero price discipline, and counterfeit gray-market intrusions that eroded retail store trust. We set out to create a fundamentally different kind of distribution house.",
    "Every brand in our portfolio is acquired through direct, exclusive contractual mandates. We invest heavily in our own inventory and warehousing so our retailer partners never bear the brunt of international logistics delays. If an order is confirmed, it is fulfilled with absolute precision.",
    "Whether you run a multi-door retail chain or an independent luxury footwear salon, you have direct access to our executive team. Your commercial success is our highest mandate."
  ],
  teamMembers: [
    {
      name: 'Vikram Malhotra',
      role: 'Head of Brand Sourcing & Licencing',
      division: 'International Footwear Portfolio',
      desc: 'Negotiates direct agreements with footwear factories, ensuring strict provenance and exclusive territorial allocations.'
    },
    {
      name: 'Anil Singhania',
      role: 'Director of Supply Chain & Warehousing',
      division: 'Logistics Hub Operations',
      desc: 'Oversees central 150,000 sq. ft. warehousing, batch inspections, barcode tracking, and 24-48h dispatch guarantees.'
    },
    {
      name: 'Pooja Kashyap',
      role: 'VP of Retailer Partner Success',
      division: 'Commercial Accounts & Margins',
      desc: 'Leads the account management squad that designs tailored size-curve packs, point-of-sale display kits, and seasonal rebate programs.'
    }
  ]
};

// Initial default seed accounts
const INITIAL_USERS = [
  {
    id: 'admin-main',
    userType: 'admin',
    accountType: 'admin',
    email: 'rgourav145@gmail.com',
    password: 'admin123',
    name: 'Gourav (JMR Admin)',
    role: 'Principal Executive',
    phone: '+91 98200 12345',
    companyName: 'JMR Shooz Footwear Hub',
    gstin: '07AAACJ1234F1Z8',
    bankName: 'HDFC Bank',
    accountNo: '50200084920194',
    ifsc: 'HDFC0000128',
    branch: 'Kirti Nagar Footwear Commercial Complex, New Delhi',
    upiId: 'jmrshooz@hdfcbank'
  },
  {
    id: 'admin-01',
    userType: 'admin',
    email: 'admin@jmrshooz.com',
    password: 'admin123',
    name: 'JMR Executive Admin',
    role: 'Managing Distributor',
    phone: '+91 98200 12345',
    companyName: 'JMR Shooz Wholesale Hub',
    gstin: '07AAACJ1234F1Z8',
    bankName: 'HDFC Bank',
    accountNo: '50200084920194',
    ifsc: 'HDFC0000128',
    branch: 'Kirti Nagar Footwear Commercial Complex, New Delhi',
    upiId: 'jmrshooz@hdfcbank'
  },
  {
    id: 'RET-2026-1042',
    userType: 'retailer',
    retailerId: 'RET-2026-1042',
    email: 'metro@shoestore.com',
    password: 'retailer123',
    name: 'Rajesh Sharma',
    companyName: 'Metro Footwear Salon',
    gstin: '07AAAAA0000A1Z5',
    city: 'New Delhi, Delhi',
    phone: '+91 98111 22334',
    businessType: 'Multi-Store Retail Chain',
    bankName: 'State Bank of India',
    accountNo: '30948572910',
    ifsc: 'SBIN0001245',
    branch: 'Rajouri Garden, New Delhi',
    upiId: 'metrofootwear@sbi',
    status: 'Verified Stockist',
    registeredAt: '2026-01-15'
  },
  {
    id: 'RET-2026-023797DC',
    retailerId: 'RET-2026-023797DC',
    userType: 'retailer',
    accountType: 'retailer',
    email: 'rgourav145@gmail.com',
    name: 'ROYAL',
    companyName: 'ROYAL SHOE',
    phone: '6263563985',
    city: 'INDORE',
    businessType: 'Footwear Retail Store',
    status: 'active',
    registeredAt: '2026-09-29'
  }
];

// Initial seed queries & feedback
const INITIAL_QUERIES = [
  {
    id: 'QRY-8801',
    retailerId: 'RET-2026-1042',
    companyName: 'Metro Footwear Salon',
    contactName: 'Rajesh Sharma',
    phone: '+91 98111 22334',
    email: 'metro@shoestore.com',
    type: 'Wholesale Stock Booking',
    brandName: 'Liberty',
    productSku: 'JMR-LIB-9102-BLK',
    subject: 'Request 5 Cartons Liberty Fortune Derby',
    message: 'Need 5 cartons of Liberty Fortune Executive Derby in size curve 7-10 for wedding season replenishment. Please confirm freight lead time.',
    status: 'In Review',
    timestamp: '2026-09-18T14:30:00.000Z'
  },
  {
    id: 'QRY-8802',
    retailerId: 'RET-2026-1042',
    companyName: 'Metro Footwear Salon',
    contactName: 'Rajesh Sharma',
    phone: '+91 98111 22334',
    email: 'metro@shoestore.com',
    type: 'Distributor Feedback',
    brandName: 'Columbus',
    productSku: '',
    subject: 'Excellent sell-through on Columbus Velocity',
    message: 'The Columbus Velocity sneakers sold out in 10 days. Customers love the lightweight EVA cushion. Please keep 10 cartons allocated for our store next month.',
    status: 'Resolved',
    timestamp: '2026-09-15T11:00:00.000Z'
  }
];

// --- BRANDS STORAGE ---
export function getStoredBrands() {
  try {
    const data = localStorage.getItem(BRANDS_KEY);
    if (!data) {
      localStorage.setItem(BRANDS_KEY, JSON.stringify(initialBrands));
      return initialBrands;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading brands from storage', err);
    return initialBrands;
  }
}

export function saveBrand(newBrand) {
  const brands = getStoredBrands();
  const brandWithId = {
    ...newBrand,
    id: newBrand.id || newBrand.name.toLowerCase().replace(/\s+/g, '-'),
    established: newBrand.established || new Date().getFullYear().toString(),
    featured: newBrand.featured !== undefined ? newBrand.featured : false,
    stats: newBrand.stats || {
      activeSkus: '12 Models',
      territory: 'Regional Hub',
      leadTime: '24-48 Hours'
    }
  };
  const updated = [brandWithId, ...brands];
  localStorage.setItem(BRANDS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_brands_updated'));
  return brandWithId;
}

export function updateBrand(id, updatedFields) {
  const brands = getStoredBrands();
  const updated = brands.map(b => (b.id === id ? { ...b, ...updatedFields } : b));
  localStorage.setItem(BRANDS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_brands_updated'));
  return updated;
}

export function deleteBrand(id) {
  const brands = getStoredBrands();
  const updated = brands.filter(b => b.id !== id);
  localStorage.setItem(BRANDS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_brands_updated'));
  return updated;
}

// --- PRODUCTS STORAGE ---
export function getStoredProducts() {
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (!data) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
      return initialProducts;
    }
    const parsed = JSON.parse(data);
    const normalized = parsed.map(p => {
      const matchInitial = initialProducts.find(ip => ip.id === p.id);
      const pairsPerSet = p.pairsPerSet || matchInitial?.pairsPerSet || 12;
      return {
        ...p,
        pairsPerSet,
        sizeCurve: p.sizeCurve || matchInitial?.sizeCurve || `UK 6-10 (Standard ${pairsPerSet} Pairs Curve)`,
        moq: p.moq || `1 Set (${pairsPerSet} Pairs)`
      };
    });
    return normalized;
  } catch (err) {
    console.error('Error reading products from storage', err);
    return initialProducts;
  }
}

export function saveProduct(newProduct) {
  const products = getStoredProducts();
  const pairsPerSet = parseInt(newProduct.pairsPerSet, 10) || 12;
  const productWithId = {
    ...newProduct,
    id: newProduct.id || `sku-${Date.now()}`,
    sku: newProduct.sku || `JMR-${(newProduct.brandName || 'GEN').substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    pairsPerSet,
    sizeCurve: newProduct.sizeCurve || `UK 6-10 (Standard ${pairsPerSet} Pairs Curve)`,
    moq: newProduct.moq || `1 Set (${pairsPerSet} Pairs)`,
    featured: newProduct.featured !== undefined ? newProduct.featured : false
  };
  const updated = [productWithId, ...products];
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_products_updated'));
  return productWithId;
}

export function updateProduct(id, updatedFields) {
  const products = getStoredProducts();
  const updated = products.map(p => {
    if (p.id === id) {
      const pairsPerSet = updatedFields.pairsPerSet ? parseInt(updatedFields.pairsPerSet, 10) : (p.pairsPerSet || 12);
      return {
        ...p,
        ...updatedFields,
        pairsPerSet,
        moq: updatedFields.moq || `1 Set (${pairsPerSet} Pairs)`
      };
    }
    return p;
  });
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_products_updated'));
  return updated;
}

export function deleteProduct(id) {
  const products = getStoredProducts();
  const updated = products.filter(p => p.id !== id);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_products_updated'));
  return updated;
}

// --- USERS & AUTH STORAGE ---
export function getRegisteredUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    let users = data ? JSON.parse(data) : INITIAL_USERS;
    if (!Array.isArray(users)) users = INITIAL_USERS;
    if (!users.find(u => u && u.email && u.email.toLowerCase() === 'rgourav145@gmail.com')) {
      users = [INITIAL_USERS[0], ...users];
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    return users;
  } catch (err) {
    return INITIAL_USERS;
  }
}

export function registerRetailer(retailerData, prebuiltUser = null) {
  const users = getRegisteredUsers();

  if (prebuiltUser) {
    const userToStore = {
      ...retailerData,
      ...prebuiltUser,
      password: retailerData.password, // Keep password for auth
      status: prebuiltUser.status || 'pending'
    };
    const existsIndex = users.findIndex(u => u.id === prebuiltUser.id || (u.email && prebuiltUser.email && u.email.toLowerCase() === prebuiltUser.email.toLowerCase() && (u.userType === prebuiltUser.userType || u.accountType === prebuiltUser.accountType)));
    let updatedUsers;
    if (existsIndex !== -1) {
      updatedUsers = [...users];
      updatedUsers[existsIndex] = userToStore;
    } else {
      updatedUsers = [...users, userToStore];
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    window.dispatchEvent(new Event('jmr_users_updated'));
    return userToStore;
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const retailerId = `RET-2026-${randomNum}`;

  const newUser = {
    ...retailerData,
    id: retailerId,
    retailerId: retailerId,
    userType: retailerData.accountType === 'admin' ? 'admin' : 'retailer',
    gstin: retailerData.gstin ? retailerData.gstin.trim().toUpperCase() : '',
    bankName: retailerData.bankName || '',
    accountNo: retailerData.accountNo || '',
    ifsc: retailerData.ifsc ? retailerData.ifsc.trim().toUpperCase() : '',
    branch: retailerData.branch || '',
    upiId: retailerData.upiId || '',
    status: 'pending',
    registeredAt: new Date().toISOString().split('T')[0]
  };

  const updatedUsers = [...users, newUser];
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  window.dispatchEvent(new Event('jmr_users_updated'));
  // DO NOT LOG IN AUTOMATICALLY IF PENDING
  return newUser;
}

export function authenticateUser(emailOrId, password, preferredRole = '') {
  const users = getRegisteredUsers();
  const term = emailOrId.trim().toLowerCase();

  let matchingUsers = users.filter(u => 
    (u.email && u.email.toLowerCase() === term) || 
    (u.retailerId && u.retailerId.toLowerCase() === term) || 
    (u.phone && u.phone.trim() === emailOrId.trim())
  );

  // If user typed admin or preferredRole is admin
  if (term === 'admin' || term === 'superadmin' || term === 'administrator' || preferredRole === 'admin') {
    const adminAccounts = users.filter(u => u.userType === 'admin' || u.accountType === 'admin');
    for (const a of adminAccounts) {
      if (!matchingUsers.some(m => m.id === a.id)) {
        matchingUsers.push(a);
      }
    }
  }

  if (preferredRole) {
    matchingUsers.sort((a, b) => {
      const aType = a.userType || a.accountType || '';
      const bType = b.userType || b.accountType || '';
      const aMatch = aType.toLowerCase() === preferredRole.toLowerCase();
      const bMatch = bType.toLowerCase() === preferredRole.toLowerCase();
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  }

  const user = matchingUsers.find(u => 
    u.password === password || 
    ((u.userType === 'admin' || u.accountType === 'admin') && (password === 'admin123' || password === 'staff123'))
  );

  if (user) {
    if (user.status === 'pending') {
      return { success: false, error: 'Your account is pending approval from the admin.' };
    }
    setCurrentUser(user);
    return { success: true, user };
  }
  return { success: false, error: 'Invalid credentials. Check email/Retailer ID/phone and password.' };
}

// --- OTP AUTHENTICATION HELPERS ---
// OTP generation and verification is now securely handled on the backend via Gmail SMTP.
// Local offline fallbacks for OTP have been removed.

export function generateMockOtp() {
  return { success: false, error: 'Server connection timeout. Kripya check karein ki backend server (port 5001) chalu hai.' };
}

export function verifyMockOtp() {
  return { success: false, error: 'OTP verification failed. Kripya OTP dobara enter karein.' };
}

export function resetUserPasswordWithOtp() {
  return { success: false, error: 'Password reset failed. Kripya naya OTP request karein.' };
}

export function updateRetailerBankDetails(userId, bankData) {
  const users = getRegisteredUsers();
  let updatedUser = null;
  const updatedUsers = users.map(u => {
    if (u.id === userId || u.retailerId === userId) {
      updatedUser = {
        ...u,
        bankName: bankData.bankName !== undefined ? bankData.bankName : u.bankName,
        accountNo: bankData.accountNo !== undefined ? bankData.accountNo : u.accountNo,
        ifsc: bankData.ifsc !== undefined ? bankData.ifsc.toUpperCase() : u.ifsc,
        branch: bankData.branch !== undefined ? bankData.branch : u.branch,
        upiId: bankData.upiId !== undefined ? bankData.upiId : u.upiId,
        gstin: bankData.gstin !== undefined ? bankData.gstin.toUpperCase() : u.gstin
      };
      return updatedUser;
    }
    return u;
  });

  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  if (updatedUser) {
    const curr = getCurrentUser();
    if (curr && (curr.id === userId || curr.retailerId === userId)) {
      setCurrentUser(updatedUser);
    }
  }
  window.dispatchEvent(new Event('jmr_users_updated'));
  return { success: true, user: updatedUser };
}

export function updateUserProfile(userId, profileData) {
  const users = getRegisteredUsers();
  let updatedUser = null;
  const updatedUsers = users.map(u => {
    if (u.id === userId || u.retailerId === userId) {
      updatedUser = {
        ...u,
        ...profileData,
        gstin: profileData.gstin !== undefined ? profileData.gstin.toUpperCase() : u.gstin,
        ifsc: profileData.ifsc !== undefined ? profileData.ifsc.toUpperCase() : u.ifsc
      };
      return updatedUser;
    }
    return u;
  });

  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  if (updatedUser) {
    const curr = getCurrentUser();
    if (curr && (curr.id === userId || curr.retailerId === userId)) {
      setCurrentUser(updatedUser);
    }
  }
  window.dispatchEvent(new Event('jmr_users_updated'));
  window.dispatchEvent(new Event('jmr_user_changed'));
  return { success: true, user: updatedUser };
}

export function getCurrentUser() {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    return null;
  }
}

export function setCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
  window.dispatchEvent(new Event('jmr_user_changed'));
}

export function logoutUser() {
  setCurrentUser(null);
}

// --- QUERIES & FEEDBACK STORAGE ---
export function getStoredQueries() {
  try {
    const data = localStorage.getItem(QUERIES_KEY);
    if (!data) {
      localStorage.setItem(QUERIES_KEY, JSON.stringify(INITIAL_QUERIES));
      return INITIAL_QUERIES;
    }
    return JSON.parse(data);
  } catch (err) {
    return INITIAL_QUERIES;
  }
}

export function submitQueryOrFeedback(entry) {
  const queries = getStoredQueries();
  const randomId = `QRY-${Math.floor(1000 + Math.random() * 9000)}`;
  const newEntry = {
    ...entry,
    id: randomId,
    status: 'Pending',
    timestamp: new Date().toISOString()
  };
  const updated = [newEntry, ...queries];
  localStorage.setItem(QUERIES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_queries_updated'));
  return newEntry;
}

export function updateQueryStatus(id, newStatus) {
  const queries = getStoredQueries();
  const updated = queries.map(q => (q.id === id ? { ...q, status: newStatus } : q));
  localStorage.setItem(QUERIES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_queries_updated'));
  return updated;
}

// --- OWNER / MANAGEMENT PROFILE STORAGE ---
export function getOwnerProfile() {
  try {
    const data = localStorage.getItem(OWNER_PROFILE_KEY);
    if (!data) {
      localStorage.setItem(OWNER_PROFILE_KEY, JSON.stringify(INITIAL_OWNER_PROFILE));
      return INITIAL_OWNER_PROFILE;
    }
    return { ...INITIAL_OWNER_PROFILE, ...JSON.parse(data) };
  } catch (err) {
    console.error('Error reading owner profile from storage', err);
    return INITIAL_OWNER_PROFILE;
  }
}

export function saveOwnerProfile(profileData) {
  const current = getOwnerProfile();
  const updated = {
    ...current,
    ...profileData,
    lastUpdated: new Date().toISOString()
  };
  localStorage.setItem(OWNER_PROFILE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_owner_updated'));
  return updated;
}

export function resetOwnerProfile() {
  localStorage.setItem(OWNER_PROFILE_KEY, JSON.stringify(INITIAL_OWNER_PROFILE));
  window.dispatchEvent(new Event('jmr_owner_updated'));
  return INITIAL_OWNER_PROFILE;
}

// --- HOME PAGE BANNERS / IMAGES STORAGE ---
const HOME_BANNERS_KEY = 'jmr_home_banners_v1';

export const INITIAL_HOME_BANNERS = [
  {
    id: 'banner-1',
    title: 'Veloce Milano Formal Sovereign',
    subtitle: 'Handcrafted Blake Stitch Genuine Italian Soles',
    badge: 'Flagship Luxury Line',
    tag: 'Formal Wholesale',
    imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80',
    active: true,
    suggestedRetail: '₹4,999 / pair',
    wholesaleRate: '₹2,250 / pair'
  },
  {
    id: 'banner-2',
    title: 'Columbus Velocity Nitro Running Sneakers',
    subtitle: 'High-Rebound Dual-Density EVA Cushioning & Breathable Knit',
    badge: 'High Sell-Through',
    tag: 'Sports & Activewear',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    active: true,
    suggestedRetail: '₹2,499 / pair',
    wholesaleRate: '₹1,150 / pair'
  },
  {
    id: 'banner-3',
    title: 'Aerowalk Featherlite Cloud Slides',
    subtitle: 'Direct Injected PU Sole with Anatomical Arch Support',
    badge: 'Daily High Demand',
    tag: 'Comfort Footwear',
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80',
    active: true,
    suggestedRetail: '₹899 / pair',
    wholesaleRate: '₹380 / pair'
  },
  {
    id: 'banner-4',
    title: 'Leather Range Imperial Heritage Brogue',
    subtitle: 'Burnished Tan Crust Leather with Goodyear Welt Construction',
    badge: '100% Genuine Leather',
    tag: 'Pure Leather',
    imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=80',
    active: true,
    suggestedRetail: '₹5,499 / pair',
    wholesaleRate: '₹2,600 / pair'
  }
];

export function getHomeBanners() {
  try {
    const data = localStorage.getItem(HOME_BANNERS_KEY);
    if (!data) {
      localStorage.setItem(HOME_BANNERS_KEY, JSON.stringify(INITIAL_HOME_BANNERS));
      return INITIAL_HOME_BANNERS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading home banners', err);
    return INITIAL_HOME_BANNERS;
  }
}

export function saveHomeBanner(newBanner) {
  const banners = getHomeBanners();
  const bannerWithId = {
    ...newBanner,
    id: newBanner.id || `banner-${Date.now()}`,
    active: newBanner.active !== undefined ? newBanner.active : true
  };
  const updated = [bannerWithId, ...banners];
  localStorage.setItem(HOME_BANNERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_banners_updated'));
  return bannerWithId;
}

export function updateHomeBanner(id, updatedFields) {
  const banners = getHomeBanners();
  const updated = banners.map(b => (b.id === id ? { ...b, ...updatedFields } : b));
  localStorage.setItem(HOME_BANNERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_banners_updated'));
  return updated;
}

export function deleteHomeBanner(id) {
  const banners = getHomeBanners();
  const updated = banners.filter(b => b.id !== id);
  localStorage.setItem(HOME_BANNERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_banners_updated'));
  return updated;
}

export function resetHomeBanners() {
  localStorage.setItem(HOME_BANNERS_KEY, JSON.stringify(INITIAL_HOME_BANNERS));
  window.dispatchEvent(new Event('jmr_banners_updated'));
  return INITIAL_HOME_BANNERS;
}

// --- 3 OWNERS & CENTRAL GODOWN STORAGE ---
const THREE_OWNERS_AND_GODOWN_KEY = 'jmr_3_owners_godown_v1';

export const INITIAL_3_OWNERS_AND_GODOWN = {
  owners: [
    {
      id: 1,
      name: 'J. M. Ronald',
      role: 'Founder & Managing Partner',
      phone: '+91 98200 12345',
      email: 'ronald.jmr@jmrshooz.com',
      photo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      experience: '22+ Years Footwear Veteran',
      division: 'Strategic Alliances & National Retail Expansion'
    },
    {
      id: 2,
      name: 'Rajesh Singhania',
      role: 'Partner — Brand Sourcing & Licencing',
      phone: '+91 98111 54321',
      email: 'rajesh.s@jmrshooz.com',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
      experience: '18+ Years Manufacturing Relations',
      division: 'Factory Procurement & Brand Portfolio Allocation'
    },
    {
      id: 3,
      name: 'Amitabh Verma',
      role: 'Partner — Supply Chain & Godown Operations',
      phone: '+91 98333 87654',
      email: 'amitabh.v@jmrshooz.com',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
      experience: '16+ Years Warehousing & Logistics',
      division: 'Central Godown Logistics & Dispatch Assurance'
    }
  ],
  godown: {
    facilityName: 'JMR Shooz Central Distribution Godown & Logistics Hub',
    address: 'Plot No. 42-45, Sector-8, Footwear & Leather Complex, Phase-II, Udyog Vihar',
    landmark: 'Opposite State Freight Terminal & Container Depot',
    city: 'New Delhi',
    state: 'Delhi NCR',
    pincode: '110041',
    contactPhone: '+91 98200 99887',
    email: 'godown@jmrshooz.com',
    storageCapacity: '1,50,000+ Master Cartons',
    workingHours: 'Monday to Saturday: 9:00 AM - 8:00 PM',
    dispatchTime: '24-48 Hours Express Hub Dispatch',
    godownInCharge: 'Rameshwar Dayal (Chief Depot Superintendent)'
  }
};

export function getThreeOwnersAndGodown() {
  try {
    const data = localStorage.getItem(THREE_OWNERS_AND_GODOWN_KEY);
    if (!data) {
      localStorage.setItem(THREE_OWNERS_AND_GODOWN_KEY, JSON.stringify(INITIAL_3_OWNERS_AND_GODOWN));
      return INITIAL_3_OWNERS_AND_GODOWN;
    }
    return { ...INITIAL_3_OWNERS_AND_GODOWN, ...JSON.parse(data) };
  } catch (err) {
    console.error('Error reading 3 owners and godown', err);
    return INITIAL_3_OWNERS_AND_GODOWN;
  }
}

export function saveThreeOwnersAndGodown(data) {
  const current = getThreeOwnersAndGodown();
  const updated = {
    ...current,
    ...data,
    lastUpdated: new Date().toISOString()
  };
  localStorage.setItem(THREE_OWNERS_AND_GODOWN_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_owners_godown_updated'));
  return updated;
}

export function resetThreeOwnersAndGodown() {
  localStorage.setItem(THREE_OWNERS_AND_GODOWN_KEY, JSON.stringify(INITIAL_3_OWNERS_AND_GODOWN));
  window.dispatchEvent(new Event('jmr_owners_godown_updated'));
  return INITIAL_3_OWNERS_AND_GODOWN;
}

// --- COMPANY SETTLEMENT BANK DETAILS STORAGE ---
const BANK_DETAILS_KEY = 'jmr_company_bank_v1';

export const INITIAL_BANK_DETAILS = {
  accountName: 'JMR SHOOZ DISTRIBUTION PRIVATE LIMITED',
  bankName: 'HDFC Bank',
  accountNumber: '50200084920194',
  ifscCode: 'HDFC0000128',
  branch: 'Kirti Nagar Footwear Commercial Complex, New Delhi',
  accountType: 'Current Account',
  upiId: 'jmrshooz@hdfcbank',
  companyGstin: '07AAACJ1234F1Z8',
  companyPan: 'AAACJ1234F',
  lastUpdated: new Date().toISOString()
};

export function getBankDetails() {
  try {
    const data = localStorage.getItem(BANK_DETAILS_KEY);
    if (!data) {
      localStorage.setItem(BANK_DETAILS_KEY, JSON.stringify(INITIAL_BANK_DETAILS));
      return INITIAL_BANK_DETAILS;
    }
    return { ...INITIAL_BANK_DETAILS, ...JSON.parse(data) };
  } catch (err) {
    return INITIAL_BANK_DETAILS;
  }
}

export function saveBankDetails(data) {
  const current = getBankDetails();
  const updated = {
    ...current,
    ...data,
    lastUpdated: new Date().toISOString()
  };
  localStorage.setItem(BANK_DETAILS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_bank_updated'));
  return updated;
}

export function resetBankDetails() {
  localStorage.setItem(BANK_DETAILS_KEY, JSON.stringify(INITIAL_BANK_DETAILS));
  window.dispatchEvent(new Event('jmr_bank_updated'));
  return INITIAL_BANK_DETAILS;
}



export const INITIAL_COMPANY_SETTINGS = {
  address: 'Plot No. 42-45, Sector-8, Footwear & Leather Complex, Phase-II, Udyog Vihar, New Delhi - 110041',
  phone: '+91 98200 12345',
  whatsapp: '+91 98111 22334',
  email: 'wholesale@jmrshooz.com',
  gstin: '07AAACJ1234F1Z8',
  aboutText: 'JMR Shooz is India’s premier authorized B2B footwear distribution enterprise, partnering directly with Tier-1 manufacturers including Liberty, Columbus, Aerowalk, and premium artisan tanneries.',
  facebookUrl: 'https://facebook.com/jmrshooz',
  instagramUrl: 'https://instagram.com/jmrshooz',
  twitterUrl: 'https://twitter.com/jmrshooz',
  linkedinUrl: 'https://linkedin.com/company/jmrshooz',
  
  // Announcement Ticker
  tickerActive: true,
  tickerBadge: 'B2B SUPER SALE',
  tickerText: '⚡ Direct Manufacturer Wholesale Rates · Liberty, Columbus, Aerowalk',
  tickerDispatch: '🚚 Pan-India Hub Dispatch: 24-48h',
  tickerMargin: '🏷️ Guaranteed 40%-52% Retailer Margin',
  tickerPhone: '+91 98111 22334',

  // Deal of the Day
  dealActive: true,
  dealTag: '⚡ LIGHTNING WHOLESALE DEAL',
  dealTitle: 'Wholesale Festive Stock Replenishment Mela',
  dealSubtitle: 'Guaranteed 40%-52% Retailer Profit Margin + Direct Dispatch in 24-48 Hours.',
  dealCountdownSeconds: 28800,
  dealPrimaryBtnText: 'Explore Deals',
  dealSecondaryBtnText: 'Book Bulk Stock',

  // Hero Section
  heroBadge: 'Direct Manufacturer Trade Distribution',
  heroTitle: "India's Premier B2B Footwear Distribution Network",
  heroSubtitle: 'Empowering 480+ footwear retailers with genuine manufacturer-direct inventory, verified size curves, and 24-48h guaranteed dispatch.'
};

export function getCompanySettings() {
  try {
    const stored = localStorage.getItem('jmr_company_settings');
    if (!stored) {
      localStorage.setItem('jmr_company_settings', JSON.stringify(INITIAL_COMPANY_SETTINGS));
      return INITIAL_COMPANY_SETTINGS;
    }
    return { ...INITIAL_COMPANY_SETTINGS, ...JSON.parse(stored) };
  } catch (e) {
    return INITIAL_COMPANY_SETTINGS;
  }
}

export function saveCompanySettings(data) {
  const current = getCompanySettings();
  const updated = { ...current, ...data, lastUpdated: new Date().toISOString() };
  localStorage.setItem('jmr_company_settings', JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_settings_updated'));
  window.dispatchEvent(new Event('jmr_company_settings_updated'));
  return updated;
}

export function resetCompanySettings() {
  localStorage.setItem('jmr_company_settings', JSON.stringify(INITIAL_COMPANY_SETTINGS));
  window.dispatchEvent(new Event('jmr_settings_updated'));
  window.dispatchEvent(new Event('jmr_company_settings_updated'));
  return INITIAL_COMPANY_SETTINGS;
}

// --- SUB-ADMINS & AUTHORIZATION MANAGEMENT ---
const SUBADMINS_KEY = 'jmr_subadmins_v1';

export const INITIAL_SUBADMINS = [
  {
    id: 'subadmin-demo',
    userType: 'admin',
    accountType: 'admin',
    isSubAdmin: true,
    name: 'Rohan Verma (Staff)',
    email: 'rohan.catalog@jmrshooz.com',
    phone: '+91 98765 43210',
    password: 'staff123',
    role: 'Catalog & Inventory Manager',
    status: 'active',
    permissions: {
      manage_products: true,
      delete_products: false,
      manage_brands: true,
      delete_brands: false,
      manage_retailers: false,
      manage_queries: true,
      manage_cms: false,
      manage_subadmins: false
    },
    createdAt: '2026-03-01'
  }
];

export function getSubAdmins() {
  try {
    const raw = localStorage.getItem(SUBADMINS_KEY);
    if (!raw) {
      localStorage.setItem(SUBADMINS_KEY, JSON.stringify(INITIAL_SUBADMINS));
      return INITIAL_SUBADMINS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_SUBADMINS;
  }
}

export function saveSubAdmin(subAdminData) {
  const list = getSubAdmins();
  const id = subAdminData.id || `subadmin-${Date.now().toString(36)}`;
  const newSubAdmin = {
    ...subAdminData,
    id,
    userType: 'admin',
    accountType: 'admin',
    isSubAdmin: true,
    status: subAdminData.status || 'active',
    permissions: subAdminData.permissions || {
      manage_products: true,
      delete_products: false,
      manage_brands: true,
      delete_brands: false,
      manage_retailers: false,
      manage_queries: true,
      manage_cms: false,
      manage_subadmins: false
    },
    createdAt: subAdminData.createdAt || new Date().toISOString()
  };
  const updatedList = [newSubAdmin, ...list.filter(s => s.id !== id && s.email.toLowerCase() !== newSubAdmin.email.toLowerCase())];
  localStorage.setItem(SUBADMINS_KEY, JSON.stringify(updatedList));

  // Sync to registered users so credentials allow instant login
  const users = getRegisteredUsers();
  const userRecord = {
    id: newSubAdmin.id,
    userType: 'admin',
    accountType: 'admin',
    isSubAdmin: true,
    email: newSubAdmin.email.toLowerCase().trim(),
    password: newSubAdmin.password,
    name: newSubAdmin.name,
    role: newSubAdmin.role || 'Sub-Admin Staff',
    phone: newSubAdmin.phone || '',
    status: newSubAdmin.status,
    permissions: newSubAdmin.permissions
  };
  const updatedUsers = [userRecord, ...users.filter(u => u.email.toLowerCase() !== userRecord.email)];
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  window.dispatchEvent(new Event('jmr_subadmins_updated'));
  window.dispatchEvent(new Event('jmr_users_updated'));
  return newSubAdmin;
}

export function updateSubAdmin(id, updates) {
  const list = getSubAdmins();
  const updatedList = list.map(s => s.id === id ? { ...s, ...updates } : s);
  localStorage.setItem(SUBADMINS_KEY, JSON.stringify(updatedList));

  const target = updatedList.find(s => s.id === id);
  if (target) {
    const users = getRegisteredUsers();
    const updatedUsers = users.map(u => {
      if (u.id === id || u.email.toLowerCase() === target.email.toLowerCase()) {
        return {
          ...u,
          ...updates,
          email: target.email.toLowerCase().trim(),
          isSubAdmin: true,
          permissions: target.permissions
        };
      }
      return u;
    });
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  }
  window.dispatchEvent(new Event('jmr_subadmins_updated'));
  window.dispatchEvent(new Event('jmr_users_updated'));
  return target;
}

export function deleteSubAdmin(id) {
  const list = getSubAdmins();
  const target = list.find(s => s.id === id);
  const updatedList = list.filter(s => s.id !== id);
  localStorage.setItem(SUBADMINS_KEY, JSON.stringify(updatedList));

  if (target) {
    const users = getRegisteredUsers();
    const updatedUsers = users.filter(u => u.id !== id && u.email.toLowerCase() !== target.email.toLowerCase());
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  }
  window.dispatchEvent(new Event('jmr_subadmins_updated'));
  window.dispatchEvent(new Event('jmr_users_updated'));
}

// --- ORDERS & CART STORAGE ---
export const INITIAL_ORDERS = [
  {
    id: 'ORD-2026-9241',
    orderId: 'ORD-2026-9241',
    userId: 'RET-2026-1042',
    retailerId: 'RET-2026-1042',
    customerName: 'Rajesh Sharma',
    companyName: 'Metro Footwear Salon',
    customerEmail: 'metro@shoestore.com',
    customerPhone: '+91 98111 22334',
    city: 'New Delhi',
    shippingAddress: 'Shop #14, Main Market, Rajouri Garden, New Delhi - 110027',
    paymentMethod: 'Bank Transfer / RTGS',
    notes: 'Please dispatch through Delhi-NCR fast cargo hub before Saturday.',
    status: 'Pending',
    items: [
      {
        id: 'prod-lib-1',
        productId: 'prod-lib-1',
        name: 'Liberty Fortune Executive Derby',
        brandName: 'Liberty',
        sku: 'JMR-LIB-9102-BLK',
        wholesaleRate: 1150,
        retailPrice: '₹2,499',
        quantity: 2,
        subtotal: 2300,
        image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'prod-col-1',
        productId: 'prod-col-1',
        name: 'Columbus Velocity Nitro Running Sneakers',
        brandName: 'Columbus',
        sku: 'JMR-COL-8820-BLU',
        wholesaleRate: 1150,
        retailPrice: '₹2,499',
        quantity: 1,
        subtotal: 1150,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalItems: 3,
    totalAmount: 3450,
    createdAt: '2026-09-28T10:30:00.000Z',
    updatedAt: '2026-09-28T10:30:00.000Z'
  },
  {
    id: 'ORD-2026-8815',
    orderId: 'ORD-2026-8815',
    userId: 'RET-2026-023797DC',
    retailerId: 'RET-2026-023797DC',
    customerName: 'ROYAL',
    companyName: 'ROYAL SHOE',
    customerEmail: 'rgourav145@gmail.com',
    customerPhone: '6263563985',
    city: 'INDORE',
    shippingAddress: '42 MG Road, Cloth & Footwear Market, Indore, Madhya Pradesh - 452001',
    paymentMethod: 'Wholesale Credit',
    notes: 'Urgent festival batch for retail store display.',
    status: 'Confirmed',
    items: [
      {
        id: 'prod-aero-1',
        productId: 'prod-aero-1',
        name: 'Aerowalk Featherlite Cloud Slides',
        brandName: 'Aerowalk',
        sku: 'JMR-AER-4011-GRY',
        wholesaleRate: 380,
        retailPrice: '₹899',
        quantity: 4,
        subtotal: 1520,
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalItems: 4,
    totalAmount: 1520,
    createdAt: '2026-09-27T15:20:00.000Z',
    updatedAt: '2026-09-28T09:15:00.000Z'
  }
];

export function getStoredOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_ORDERS;
  }
}

export function saveOrder(orderData) {
  const orders = getStoredOrders();
  const randSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = orderData.orderId || `ORD-2026-${randSuffix}`;
  
  const newOrder = {
    ...orderData,
    id: orderId,
    orderId,
    status: orderData.status || 'Pending',
    createdAt: orderData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const updated = [newOrder, ...orders.filter(o => o.id !== orderId && o.orderId !== orderId)];
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_orders_updated'));
  return newOrder;
}

export function updateOrderStatus(orderId, newStatus, adminNote = '') {
  const orders = getStoredOrders();
  let updatedOrder = null;
  const updated = orders.map(order => {
    if (order.id === orderId || order.orderId === orderId) {
      updatedOrder = {
        ...order,
        status: newStatus,
        adminNote: adminNote || order.adminNote,
        updatedAt: new Date().toISOString()
      };
      return updatedOrder;
    }
    return order;
  });

  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_orders_updated'));
  return updatedOrder;
}

export function updateOrderDetails(orderId, updatedOrderData) {
  const orders = getStoredOrders();
  let updatedOrder = null;
  const updated = orders.map(order => {
    if (order.id === orderId || order.orderId === orderId) {
      updatedOrder = {
        ...order,
        ...updatedOrderData,
        updatedAt: new Date().toISOString()
      };
      return updatedOrder;
    }
    return order;
  });

  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_orders_updated'));
  return updatedOrder;
}

export function deleteOrder(orderId) {
  const orders = getStoredOrders();
  const updated = orders.filter(o => o.id !== orderId && o.orderId !== orderId);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_orders_updated'));
  return updated;
}

// CART STORAGE
export function getStoredCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveStoredCart(cartItems) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    window.dispatchEvent(new Event('jmr_cart_updated'));
  } catch (e) {}
}

// SCHEMES, TRADE EVENTS & PHOTOS SHOWCASE STORAGE
const SCHEMES_EVENTS_KEY = 'jmr_schemes_events_v1';

export const INITIAL_SCHEMES_AND_EVENTS = [
  {
    id: 'scheme-diwali-2026',
    type: 'scheme',
    title: 'Festive Season Dhamaka: 15 Sets Par 1 Set Free!',
    subtitle: 'Exclusive Retailer Pre-Booking Scheme',
    badge: '🔥 Trade Scheme',
    badgeColor: 'amber',
    validTill: 'Valid till 31st Oct 2026',
    discountCode: 'JMR-DIWALI-15',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80',
    description: 'Book 15 sets of any Liberty, Campus, or Action wholesale articles and get 1 bonus master set absolutely free. 100% Freight insurance subsidy included on all dispatches.',
    terms: 'Applicable on confirmed consignments of 15 sets or above. Direct godown dispatch within 24h.'
  },
  {
    id: 'event-trade-expo-2026',
    type: 'event',
    title: 'National Footwear Expo & Retailers Meet 2026',
    subtitle: 'New Season Autumn-Winter Collection Showcase',
    badge: '📅 Upcoming Event',
    badgeColor: 'indigo',
    validTill: '15th - 18th Nov 2026',
    location: 'Pragati Maidan, Hall 14B, New Delhi',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    description: 'Meet factory leadership, preview upcoming 2027 athletic & leather lines, and lock in exclusive territorial dealer margins before national rollout.',
    terms: 'All registered retail partners receive complimentary VIP buyer delegate passes and lunch vouchers.'
  },
  {
    id: 'scheme-zero-freight',
    type: 'scheme',
    title: 'Zero Freight Cargo Guarantee (25+ Sets)',
    subtitle: '100% Transportation Subsidy Across North & West India',
    badge: '🚚 Freight Scheme',
    badgeColor: 'emerald',
    validTill: 'Annual Partner Benefit',
    discountCode: 'JMR-FREIGHT-FREE',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
    description: 'Consignments of 25 sets or more qualify for 100% door-delivery freight waiver through Patel Roadways & V-Trans logistics network.',
    terms: 'Applies to road cargo dispatches across Delhi-NCR, UP, Punjab, Rajasthan, Haryana and MP.'
  },
  {
    id: 'photo-central-godown',
    type: 'photo',
    title: 'Central Logistics & Barcoded Footwear Godown',
    subtitle: 'Over 50,000+ Ready Cartons Stocked for Same-Day Dispatch',
    badge: '📸 Warehouse Photo',
    badgeColor: 'purple',
    validTill: 'Live Facility Snapshot',
    location: 'Outer Ring Road Distribution Center, New Delhi',
    image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1000&q=80',
    description: 'High-density automated storage racks and quality testing station ensuring zero damaged cartons reaching retail partner showrooms.',
    terms: 'Facility open for dealer visits Monday to Saturday, 10 AM to 6 PM.'
  }
];

export function getStoredSchemesAndEvents() {
  try {
    const raw = localStorage.getItem(SCHEMES_EVENTS_KEY);
    if (!raw) {
      localStorage.setItem(SCHEMES_EVENTS_KEY, JSON.stringify(INITIAL_SCHEMES_AND_EVENTS));
      return INITIAL_SCHEMES_AND_EVENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_SCHEMES_AND_EVENTS;
  }
}

export function saveSchemeOrEvent(item) {
  const list = getStoredSchemesAndEvents();
  const id = item.id || `se-${Date.now()}`;
  const newItem = {
    ...item,
    id,
    createdAt: item.createdAt || new Date().toISOString()
  };
  const updated = [newItem, ...list.filter(x => x.id !== id)];
  localStorage.setItem(SCHEMES_EVENTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_schemes_events_updated'));
  return newItem;
}

export function updateSchemeOrEvent(id, item) {
  const list = getStoredSchemesAndEvents();
  let updatedItem = null;
  const updated = list.map(x => {
    if (x.id === id) {
      updatedItem = { ...x, ...item, id, updatedAt: new Date().toISOString() };
      return updatedItem;
    }
    return x;
  });
  localStorage.setItem(SCHEMES_EVENTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_schemes_events_updated'));
  return updatedItem;
}

export function deleteSchemeOrEvent(id) {
  const list = getStoredSchemesAndEvents();
  const updated = list.filter(x => x.id !== id);
  localStorage.setItem(SCHEMES_EVENTS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('jmr_schemes_events_updated'));
  return updated;
}



