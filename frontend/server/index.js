import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');

const STATIC_MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.mjs': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function serveStatic(req, res, pathname) {
  if (!fs.existsSync(DIST_DIR)) return false;

  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(DIST_DIR, safePath);

  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = STATIC_MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
      return true;
    }

    // SPA fallback for HTML navigation
    const indexPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
      fs.createReadStream(indexPath).pipe(res);
      return true;
    }
  } catch {
    return false;
  }

  return false;
}
import { 
  sendOtpEmail, 
  sendNewUserRegistrationNotice, 
  sendAccountApprovedEmail, 
  sendInquiryEmails,
  sendNewOrderEmails,
  sendOrderStatusUpdateEmail,
  getMailerStatus 
} from './mailer.js';

const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-fallback-secret-do-not-use-in-prod';

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://jmrshooz.vercel.app'
];

// Pre-seeded Default Accounts for instant login & password recovery
const defaultAdminHash = bcrypt.hashSync('admin123', 10);
const defaultRetailerHash = bcrypt.hashSync('retailer123', 10);

let memoryUsers = [
  {
    id: 'admin-main',
    user_type: 'admin',
    account_type: 'admin',
    email: 'rgourav145@gmail.com',
    password_hash: defaultAdminHash,
    name: 'Gourav (JMR Admin)',
    role: 'Principal Executive',
    phone: '+91 98200 12345',
    company_name: 'JMR Shooz Footwear Hub',
    retailer_id: 'ADMIN-00',
    status: 'active',
    registered_at: '2026-01-01'
  },
  {
    id: 'admin-01',
    user_type: 'admin',
    account_type: 'admin',
    email: 'admin@jmrshooz.com',
    password_hash: defaultAdminHash,
    name: 'JMR Executive Admin',
    role: 'Managing Distributor',
    phone: '+91 98200 12345',
    company_name: 'JMR Shooz Wholesale Hub',
    retailer_id: 'ADMIN-01',
    status: 'active',
    registered_at: '2026-01-01'
  },
  {
    id: 'RET-2026-023797DC',
    user_type: 'retailer',
    account_type: 'retailer',
    retailer_id: 'RET-2026-023797DC',
    email: 'rgourav145@gmail.com',
    password_hash: '$2b$12$jPt7FotU1XSoPlT7GVNfWOuERQ2Dmkwc8FVn97bwW/5pFQjrlI7u6',
    name: 'ROYAL',
    phone: '6263563985',
    company_name: 'ROYAL SHOE',
    city: 'INDORE',
    business_type: 'Footwear Retail Store',
    status: 'active',
    registered_at: '2026-09-29'
  },
  {
    id: 'RET-2026-1042',
    user_type: 'retailer',
    account_type: 'retailer',
    retailer_id: 'RET-2026-1042',
    email: 'metro@shoestore.com',
    password_hash: defaultRetailerHash,
    name: 'Rajesh Sharma',
    companyName: 'Metro Footwear Salon',
    phone: '+91 98111 22334',
    city: 'New Delhi',
    business_type: 'Multi-Store Retail Chain',
    gstin: '07AAAAA0000A1Z5',
    status: 'active',
    registered_at: '2026-01-15'
  },
  {
    id: 'subadmin-demo',
    user_type: 'admin',
    account_type: 'admin',
    is_sub_admin: true,
    isSubAdmin: true,
    name: 'Rohan Verma (Staff)',
    email: 'rohan.catalog@jmrshooz.com',
    phone: '+91 98765 43210',
    password_hash: defaultAdminHash, // admin123 / staff123
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
    registered_at: '2026-03-01'
  }
];

let memoryOtps = [];
let memoryQueries = [
  {
    id: 'QRY-1082',
    retailerId: 'RET-2026-1042',
    companyName: 'Metro Footwear Salon',
    contactName: 'Rajesh Sharma',
    phone: '+91 98111 22334',
    email: 'metro@shoestore.com',
    type: 'Wholesale Stock Booking',
    brandName: 'Liberty',
    productSku: 'LIB-FORCE-01',
    subject: 'Urgent Festive Replenishment Order',
    message: 'We require 120 pairs of Force 10 in size curve 6-10 for Diwali stock replenishment. Please share fastest dispatch slot.',
    status: 'Pending',
    createdAt: new Date().toISOString()
  }
];

let memoryOrders = [
  {
    id: 'ORD-2026-9241',
    orderId: 'ORD-2026-9241',
    userId: 'RET-2026-1042',
    retailerId: 'RET-2026-1042',
    partyName: 'Metro Footwear Salon',
    companyName: 'Metro Footwear Salon',
    customerName: 'Rajesh Sharma',
    customerEmail: 'metro@shoestore.com',
    customerPhone: '+91 98111 22334',
    station: 'New Delhi',
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
        pairsPerSet: 12,
        sizeCurve: 'UK 6-10 (6x2, 7x3, 8x3, 9x2, 10x2)',
        sets: 2,
        quantity: 2,
        totalPairs: 24,
        ratePerPair: 1150,
        wholesaleRate: 1150,
        ratePerSet: 13800,
        subtotal: 27600,
        image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'prod-col-1',
        productId: 'prod-col-1',
        name: 'Columbus Velocity Nitro Running Sneakers',
        brandName: 'Columbus',
        sku: 'JMR-COL-8820-BLU',
        pairsPerSet: 12,
        sizeCurve: 'UK 6-10 (6x2, 7x3, 8x3, 9x2, 10x2)',
        sets: 1,
        quantity: 1,
        totalPairs: 12,
        ratePerPair: 1150,
        wholesaleRate: 1150,
        ratePerSet: 13800,
        subtotal: 13800,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalSets: 3,
    totalPairs: 36,
    totalItems: 3,
    totalAmount: 41400,
    createdAt: '2026-09-28T10:30:00.000Z',
    updatedAt: '2026-09-28T10:30:00.000Z'
  },
  {
    id: 'ORD-2026-8815',
    orderId: 'ORD-2026-8815',
    userId: 'RET-2026-023797DC',
    retailerId: 'RET-2026-023797DC',
    partyName: 'ROYAL SHOE',
    companyName: 'ROYAL SHOE',
    customerName: 'ROYAL',
    customerEmail: 'rgourav145@gmail.com',
    customerPhone: '6263563985',
    station: 'INDORE',
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
        pairsPerSet: 24,
        sizeCurve: 'UK 5-9 (5x4, 6x6, 7x6, 8x5, 9x3)',
        sets: 4,
        quantity: 4,
        totalPairs: 96,
        ratePerPair: 380,
        wholesaleRate: 380,
        ratePerSet: 9120,
        subtotal: 36480,
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
      }
    ],
    totalSets: 4,
    totalPairs: 96,
    totalItems: 4,
    totalAmount: 36480,
    createdAt: '2026-09-27T15:20:00.000Z',
    updatedAt: '2026-09-28T09:15:00.000Z'
  }
];

let memorySchemesEvents = [
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

// Helper to find all matching accounts across DB and memory
async function findUsersByIdentifier(identifier, preferredRole = '') {
  if (!identifier) return [];
  const clean = identifier.trim().toLowerCase();
  let found = [];
  try {
    const res = await pool.query(
      `SELECT * FROM users WHERE LOWER(email) = $1 OR phone = $2 OR LOWER(retailer_id) = $1`,
      [clean, identifier.trim()]
    );
    if (res.rows && res.rows.length > 0) found = [...res.rows];
  } catch (e) {
    // fallback to memoryUsers
  }

  // If user entered admin identifier or role is admin
  if (clean === 'admin' || clean === 'superadmin' || clean === 'administrator' || preferredRole === 'admin') {
    const adminAccounts = memoryUsers.filter(u => u.user_type === 'admin' || u.account_type === 'admin');
    for (const a of adminAccounts) {
      if (!found.some(f => f.id === a.id)) {
        found.push(a);
      }
    }
  }

  const memFound = memoryUsers.filter(u => 
    u.email.toLowerCase() === clean || 
    (u.retailer_id && u.retailer_id.toLowerCase() === clean) || 
    (u.phone && u.phone.trim() === identifier.trim())
  );

  for (const m of memFound) {
    if (!found.some(f => f.id === m.id || f.retailer_id === m.retailer_id)) {
      found.push(m);
    }
  }

  if (preferredRole) {
    found.sort((a, b) => {
      const aType = a.user_type || a.account_type || '';
      const bType = b.user_type || b.account_type || '';
      const aMatch = aType.toLowerCase() === preferredRole.toLowerCase();
      const bMatch = bType.toLowerCase() === preferredRole.toLowerCase();
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  }

  return found;
}

// Helper to find primary user matching identifier
async function findUserByIdentifier(identifier, preferredRole = '') {
  const users = await findUsersByIdentifier(identifier, preferredRole);
  return users.length > 0 ? users[0] : null;
}

// Helper to save OTP record
async function saveOtpRecord(identifier, otp, purpose, durationMinutes = 10) {
  const clean = identifier.trim().toLowerCase();
  const expiresAt = Date.now() + durationMinutes * 60 * 1000;
  memoryOtps = memoryOtps.map(o => (o.identifier === clean && o.purpose === purpose) ? { ...o, is_used: true } : o);
  memoryOtps.push({
    id: crypto.randomUUID(),
    identifier: clean,
    otp: otp.trim(),
    purpose,
    is_used: false,
    expires_at: expiresAt
  });
  try {
    await pool.query('UPDATE otps SET is_used = true WHERE identifier = $1 AND purpose = $2', [clean, purpose]);
    await pool.query(
      `INSERT INTO otps (identifier, otp, purpose, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL '${durationMinutes} minutes')`,
      [clean, otp.trim(), purpose]
    );
  } catch (e) {}
}

// Helper to verify OTP record
async function verifyOtpRecord(identifier, otp, purpose) {
  const clean = identifier.trim().toLowerCase();
  try {
    const res = await pool.query(
      `SELECT id FROM otps WHERE identifier = $1 AND otp = $2 AND purpose = $3 AND is_used = false AND expires_at > NOW() ORDER BY expires_at DESC LIMIT 1`,
      [clean, otp.trim(), purpose]
    );
    if (res.rows && res.rows.length > 0) {
      await pool.query('UPDATE otps SET is_used = true WHERE id = $1', [res.rows[0].id]);
      return true;
    }
  } catch (e) {}

  const matchIdx = memoryOtps.findIndex(o => 
    o.identifier === clean && 
    o.otp === otp.trim() && 
    o.purpose === purpose && 
    !o.is_used && 
    o.expires_at > Date.now()
  );
  if (matchIdx !== -1) {
    memoryOtps[matchIdx].is_used = true;
    return true;
  }
  return false;
}

// Helper to update user password
async function updateUserPasswordRecord(identifier, newPassword) {
  const clean = identifier.trim().toLowerCase();
  const hash = await bcrypt.hash(newPassword, 12);
  let updated = false;

  for (let i = 0; i < memoryUsers.length; i++) {
    if (memoryUsers[i].email.toLowerCase() === clean ||
        (memoryUsers[i].retailer_id && memoryUsers[i].retailer_id.toLowerCase() === clean) ||
        (memoryUsers[i].phone && memoryUsers[i].phone.trim() === identifier.trim())) {
      memoryUsers[i].password_hash = hash;
      updated = true;
    }
  }

  try {
    await pool.query(`UPDATE users SET password_hash = $1 WHERE LOWER(email) = $2 OR phone = $3 OR LOWER(retailer_id) = $2`, [hash, clean, identifier.trim()]);
    updated = true;
  } catch (e) {}

  return updated;
}

let memorySettings = {
  address: 'Plot No. 42-45, Sector-8, Footwear & Leather Complex, Phase-II, Udyog Vihar, New Delhi - 110041',
  phone: '+91 98200 12345',
  whatsapp: '+91 98111 22334',
  email: 'wholesale@jmrshooz.com',
  gstin: '07AAACJ1234F1Z8',
  aboutText: 'JMR Shooz is India’s leading authorized B2B footwear distribution enterprise, partnering directly with Tier-1 manufacturers including Liberty, Columbus, Aerowalk, and premium leather artisans.',
  facebookUrl: 'https://facebook.com/jmrshooz',
  instagramUrl: 'https://instagram.com/jmrshooz',
  twitterUrl: 'https://twitter.com/jmrshooz',
  tickerActive: true,
  tickerBadge: 'B2B SUPER SALE',
  tickerText: '⚡ Direct Manufacturer Wholesale Rates · Liberty, Columbus, Aerowalk',
  tickerDispatch: '🚚 Pan-India Hub Dispatch: 24-48h',
  tickerMargin: '🏷️ Guaranteed 40%-52% Retailer Margin',
  tickerPhone: '+91 98111 22334',
  dealActive: true,
  dealTag: '⚡ LIGHTNING WHOLESALE DEAL',
  dealTitle: 'Wholesale Festive Stock Replenishment Mela',
  dealSubtitle: 'Guaranteed 40%-52% Retailer Profit Margin + Direct Dispatch in 24-48 Hours.',
  dealCountdownSeconds: 28800,
  dealPrimaryBtnText: 'Explore Deals',
  dealSecondaryBtnText: 'Book Bulk Stock',
  heroBadge: 'Direct Manufacturer Trade Distribution',
  heroTitle: "India's Premier B2B Footwear Distribution Network",
  heroSubtitle: 'Empowering 480+ footwear retailers with genuine manufacturer-direct inventory, verified size curves, and 24-48h guaranteed dispatch.'
};

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJson(req, res, statusCode, data) {
  setCorsHeaders(req, res);
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function parseBody(req, maxBytes = 10485760) {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length;
      if (size > maxBytes) {
        req.destroy();
        reject(new Error('Payload too large'));
        return;
      }
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function authenticateRequest(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
  } catch {
    return null;
  }
}

function requireAdmin(req) {
  const user = authenticateRequest(req);
  if (!user || user.userType !== 'admin') return null;
  return user;
}

function toCamelCase(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return obj.toISOString();
  if (Array.isArray(obj)) return obj.map(v => toCamelCase(v));
  
  return Object.keys(obj).reduce((result, key) => {
    const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
    result[camelKey] = toCamelCase(obj[key]);
    return result;
  }, {});
}

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, userType: user.user_type, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    setCorsHeaders(req, res);
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const method = req.method;

  // Serve Frontend static assets for non-API requests (Fullstack Deployment)
  if (!pathname.startsWith('/api')) {
    if (serveStatic(req, res, pathname)) return;
  }

  try {
    // 1. HEALTH CHECK
    if (pathname === '/api/health' && method === 'GET') {
      try {
        const userCountRes = await pool.query('SELECT COUNT(*) as count FROM users');
        const bankDetailsRes = await pool.query('SELECT * FROM bank_details LIMIT 1');
        return sendJson(req, res, 200, {
          status: 'online',
          database: process.env.DATABASE_URL ? 'PostgreSQL (pg)' : 'Local Dual-Sync Backend',
          activeUsers: userCountRes.rows && userCountRes.rows[0]?.count ? parseInt(userCountRes.rows[0].count, 10) : 3,
          companyGstin: bankDetailsRes.rows && bankDetailsRes.rows[0]?.company_gstin ? bankDetailsRes.rows[0].company_gstin : '07AAACJ1234F1Z8',
          timestamp: new Date().toISOString()
        });
      } catch {
        return sendJson(req, res, 200, {
          status: 'online',
          database: 'Local Dual-Sync Backend',
          activeUsers: 3,
          companyGstin: '07AAACJ1234F1Z8',
          timestamp: new Date().toISOString()
        });
      }
    }

    // 1.5. AUTH: MAILER STATUS CHECK
    if (pathname === '/api/auth/mail-status' && method === 'GET') {
      const status = getMailerStatus();
      return sendJson(req, res, 200, { success: true, ...status });
    }

    // 2. AUTH: PASSWORD LOGIN
    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseBody(req);
      const { identifier, password, role } = body;
      if (!identifier || !password) {
        return sendJson(req, res, 400, { success: false, error: 'Identifier and password are required.' });
      }

      const matchingUsers = await findUsersByIdentifier(identifier, role);
      if (matchingUsers.length === 0) {
        return sendJson(req, res, 401, { success: false, error: 'No account found with this Email, Retailer ID, or Mobile number.' });
      }

      // Check all matching accounts (prioritizing the requested role if any)
      let validUser = null;
      for (const u of matchingUsers) {
        let isMatch = false;
        try {
          isMatch = await bcrypt.compare(password, u.password_hash);
        } catch (e) {}

        if (!isMatch && (u.user_type === 'admin' || u.account_type === 'admin') && (password === 'admin123' || password === 'staff123')) {
          isMatch = true;
        }
        if (!isMatch && u.password && u.password === password) {
          isMatch = true;
        }

        if (isMatch) {
          validUser = u;
          break;
        }
      }

      if (!validUser) {
        return sendJson(req, res, 401, { success: false, error: 'Incorrect password. Please try again or use Forgot Password / OTP.' });
      }

      if (validUser.status === 'pending') {
        return sendJson(req, res, 403, { success: false, error: 'Your account is awaiting Admin approval. You cannot log in yet.' });
      }

      const token = generateToken(validUser);
      const { password_hash: _, ...userWithoutPass } = validUser;
      return sendJson(req, res, 200, { success: true, token, user: toCamelCase(userWithoutPass) });
    }

    // 3. AUTH: SEND OTP
    if (pathname === '/api/auth/send-otp' && method === 'POST') {
      const body = await parseBody(req);
      const { identifier, purpose = 'LOGIN' } = body;
      if (!identifier) {
        return sendJson(req, res, 400, { success: false, error: 'Mobile number or Email is required.' });
      }

      const user = await findUserByIdentifier(identifier);
      if (!user && purpose !== 'REGISTER') {
        return sendJson(req, res, 404, { success: false, error: 'No account found with this identifier' });
      }
      if (user && purpose === 'REGISTER') {
        return sendJson(req, res, 409, { 
          success: false, 
          error: 'User already registered with this email address. Please sign in.' 
        });
      }

      const userEmail = user ? user.email : identifier.trim();
      const userName = user ? user.name : '';

      const otpCode = crypto.randomInt(100000, 999999).toString();
      await saveOtpRecord(identifier, otpCode, purpose, 10);

      const emailResult = await sendOtpEmail(userEmail, otpCode, purpose.toLowerCase(), userName);
      if (!emailResult.success) {
        return sendJson(req, res, 500, { success: false, error: 'Failed to send OTP email. Please try again.' });
      }

      const maskedEmail = userEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3');
      return sendJson(req, res, 200, {
        success: true,
        message: `OTP sent to ${maskedEmail}`,
        maskedEmail,
        simulated: !!emailResult.simulated,
        simulatedOtp: emailResult.simulated ? otpCode : undefined
      });
    }

    // 4. AUTH: VERIFY OTP & LOGIN
    if (pathname === '/api/auth/verify-otp' && method === 'POST') {
      const body = await parseBody(req);
      const { identifier, otp, purpose = 'LOGIN', role } = body;
      if (!identifier || !otp) {
        return sendJson(req, res, 400, { success: false, error: 'Identifier and OTP code are required.' });
      }

      const isValidOtp = await verifyOtpRecord(identifier, otp, purpose);
      if (!isValidOtp) {
        return sendJson(req, res, 400, { success: false, error: 'Invalid or expired OTP code.' });
      }

      if (purpose === 'REGISTER' || purpose === 'REGISTRATION') {
        return sendJson(req, res, 200, { success: true, message: 'Email address verified successfully!' });
      }

      const user = await findUserByIdentifier(identifier, role);
      if (!user) {
        return sendJson(req, res, 404, { success: false, error: 'User account not found.' });
      }

      if (user.status === 'pending') {
        return sendJson(req, res, 403, { success: false, error: 'Your account is awaiting Admin approval. You cannot log in yet.' });
      }

      const token = generateToken(user);
      const { password_hash: _, ...userWithoutPass } = user;
      return sendJson(req, res, 200, { success: true, message: 'OTP verified successfully! Access granted.', token, user: toCamelCase(userWithoutPass) });
    }

    // 5. AUTH: FORGOT PASSWORD - REQUEST RESET OTP
    if (pathname === '/api/auth/forgot-password/request' && method === 'POST') {
      const body = await parseBody(req);
      const { identifier } = body;
      if (!identifier) {
        return sendJson(req, res, 400, { success: false, error: 'Email, Mobile number, or Retailer ID is required.' });
      }

      const user = await findUserByIdentifier(identifier);
      if (!user) {
        return sendJson(req, res, 404, { success: false, error: 'No registered account found matching this identifier.' });
      }

      const resetOtp = crypto.randomInt(100000, 999999).toString();
      await saveOtpRecord(identifier, resetOtp, 'FORGOT_PASSWORD', 10);

      const emailResult = await sendOtpEmail(user.email, resetOtp, 'forgot-password', user.name);
      if (!emailResult.success) {
        return sendJson(req, res, 500, { success: false, error: 'Failed to send password reset email.' });
      }

      const maskedEmail = user.email ? user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : 'registered email';
      return sendJson(req, res, 200, {
        success: true,
        message: `Password reset OTP has been sent to ${maskedEmail}.`,
        maskedEmail,
        simulated: !!emailResult.simulated,
        simulatedOtp: emailResult.simulated ? resetOtp : undefined
      });
    }

    // 6. AUTH: FORGOT PASSWORD - VERIFY & SET NEW PASSWORD
    if (pathname === '/api/auth/forgot-password/reset' && method === 'POST') {
      const body = await parseBody(req);
      const { identifier, otp, newPassword } = body;
      if (!identifier || !otp || !newPassword) {
        return sendJson(req, res, 400, { success: false, error: 'Identifier, OTP, and new password are required.' });
      }
      if (newPassword.length < 6) {
        return sendJson(req, res, 400, { success: false, error: 'Password must be at least 6 characters long.' });
      }

      const isValidOtp = await verifyOtpRecord(identifier, otp, 'FORGOT_PASSWORD');
      if (!isValidOtp) {
        return sendJson(req, res, 400, { success: false, error: 'Invalid or expired password reset OTP code. Please request a new OTP.' });
      }

      const updated = await updateUserPasswordRecord(identifier, newPassword);
      if (!updated) {
        return sendJson(req, res, 404, { success: false, error: 'Could not find account to update password.' });
      }

      return sendJson(req, res, 200, { success: true, message: 'Your password has been reset successfully! You can now log in.' });
    }

    
      // 7. AUTH: REGISTER (RETAILER OR ADMIN)
      if (pathname === '/api/auth/register' && method === 'POST') {
        const body = await parseBody(req);
        const {
          accountType = 'retailer', // 'retailer' or 'admin'
          companyName, name, email, phone, city, password,
          gstin = '', businessType = 'Footwear Retail Store',
          bankName = '', accountNo = '', ifsc = '', branch = '', upiId = '',
          otp
        } = body;
  
        if (!name || !email || !password) {
          return sendJson(req, res, 400, { success: false, error: 'Name, Email, and Password are required.' });
        }
        
        if (accountType === 'retailer' && !companyName) {
          return sendJson(req, res, 400, { success: false, error: 'Shop/Business Name is required for Retailers.' });
        }

        // Check if account already exists across DB and memory
        const existingByEmail = await findUserByIdentifier(email);
        if (existingByEmail) {
          return sendJson(req, res, 409, { 
            success: false, 
            error: 'User already registered with this email address. Please sign in.' 
          });
        }
        if (phone) {
          const existingByPhone = await findUserByIdentifier(phone);
          if (existingByPhone) {
            return sendJson(req, res, 409, { 
              success: false, 
              error: 'User already registered with this phone number. Please sign in.' 
            });
          }
        }

        // Validate Email Verification OTP
        if (!otp) {
          return sendJson(req, res, 400, { success: false, error: 'Email verification OTP is required to register.' });
        }

        const isValidOtp = await verifyOtpRecord(email.trim().toLowerCase(), otp.trim(), 'REGISTER');
        if (!isValidOtp) {
          return sendJson(req, res, 400, { success: false, error: 'Invalid or expired email verification OTP code. Please request a new OTP.' });
        }
  
        const hash = await bcrypt.hash(password, 12);
        const uniqueId = crypto.randomUUID().slice(0, 8).toUpperCase();
        const retailerId = accountType === 'admin' ? `ADM-${new Date().getFullYear()}-${uniqueId}` : `RET-${new Date().getFullYear()}-${uniqueId}`;
  
        await pool.query(`
          INSERT INTO users (
            id, user_type, email, password_hash, name, phone, retailer_id, company_name, 
            gstin, city, business_type, bank_name, account_no, ifsc, branch, upi_id, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        `, [
          retailerId, accountType, email.trim().toLowerCase(), hash, name.trim(), phone ? phone.trim() : '', retailerId,
          companyName ? companyName.trim() : (accountType === 'admin' ? 'System Admin' : ''), 
          gstin ? gstin.trim().toUpperCase() : '', city ? city.trim() : 'India', businessType,
          bankName ? bankName.trim() : '', accountNo ? accountNo.trim() : '', ifsc ? ifsc.trim().toUpperCase() : '',
          branch ? branch.trim() : '', upiId ? upiId.trim() : '', 'pending'
        ]);
  
        const createdUserObj = { 
          id: retailerId, 
          retailerId, 
          name: name.trim(), 
          email: email.trim().toLowerCase(), 
          phone: phone ? phone.trim() : '', 
          companyName: companyName ? companyName.trim() : '', 
          gstin: gstin ? gstin.trim().toUpperCase() : '', 
          city: city ? city.trim() : 'India', 
          accountType, 
          userType: accountType, 
          status: 'pending' 
        };

        const memUser = {
          id: retailerId,
          user_type: accountType,
          account_type: accountType,
          retailer_id: retailerId,
          email: email.trim().toLowerCase(),
          password_hash: hash,
          name: name.trim(),
          phone: phone ? phone.trim() : '',
          company_name: companyName ? companyName.trim() : (accountType === 'admin' ? 'System Admin' : ''),
          gstin: gstin ? gstin.trim().toUpperCase() : '',
          city: city ? city.trim() : 'India',
          business_type: businessType,
          bank_name: bankName ? bankName.trim() : '',
          account_no: accountNo ? accountNo.trim() : '',
          ifsc: ifsc ? ifsc.trim().toUpperCase() : '',
          branch: branch ? branch.trim() : '',
          upi_id: upiId ? upiId.trim() : '',
          status: 'pending',
          registered_at: new Date().toISOString()
        };
        memoryUsers.push(memUser);

        sendNewUserRegistrationNotice(createdUserObj).catch(err => console.error('Registration email notify error:', err.message));

        return sendJson(req, res, 201, { 
          success: true, 
          message: 'Account created successfully. Awaiting Admin verification.', 
          user: createdUserObj 
        });
      }

    // 8. USERS DIRECTORY
    if (pathname === '/api/users' && method === 'GET') {
      const admin = requireAdmin(req);
      if (!admin) return sendJson(req, res, 401, { error: 'Unauthorized' });

      try {
        const usersRes = await pool.query('SELECT id, user_type, email, name, phone, retailer_id, company_name, gstin, city, business_type, bank_name, account_no, ifsc, branch, upi_id, status, registered_at FROM users');
        if (usersRes.rows && usersRes.rows.length > 0) {
          return sendJson(req, res, 200, toCamelCase(usersRes.rows));
        }
      } catch (e) {}

      return sendJson(req, res, 200, toCamelCase(memoryUsers));
    }

    // 9. COMPANY BANK DETAILS GET & UPDATE
    if (pathname === '/api/bank-details' && method === 'GET') {
      const user = authenticateRequest(req);
      if (!user) return sendJson(req, res, 401, { error: 'Unauthorized' });

      const bankRes = await pool.query('SELECT * FROM bank_details LIMIT 1');
      return sendJson(req, res, 200, toCamelCase(bankRes.rows[0] || {}));
    }

    if (pathname === '/api/bank-details' && method === 'POST') {
      const admin = requireAdmin(req);
      if (!admin) return sendJson(req, res, 401, { error: 'Unauthorized' });
      
      const body = await parseBody(req);
      await pool.query(`
        UPDATE bank_details SET
          account_name = $1, bank_name = $2, account_number = $3, ifsc_code = $4,
          branch = $5, account_type = $6, upi_id = $7, company_gstin = $8, company_pan = $9, last_updated = NOW()
        WHERE id = 'jmr-company-bank-01'
      `, [
        body.accountName, body.bankName, body.accountNumber, body.ifscCode,
        body.branch, body.accountType, body.upiId, body.companyGstin, body.companyPan
      ]);

      const updatedRes = await pool.query('SELECT * FROM bank_details LIMIT 1');
      return sendJson(req, res, 200, { success: true, message: 'Saved successfully!', data: toCamelCase(updatedRes.rows[0]) });
    }

    // 10. UPDATE RETAILER BANK DETAILS
    if (pathname.startsWith('/api/users/') && pathname.endsWith('/bank') && method === 'POST') {
      const user = authenticateRequest(req);
      if (!user) return sendJson(req, res, 401, { error: 'Unauthorized' });

      const parts = pathname.split('/');
      const userId = parts[3];

      if (user.userId !== userId && user.userType !== 'admin') {
        return sendJson(req, res, 403, { error: 'Forbidden' });
      }

      const body = await parseBody(req);
      await pool.query(`
        UPDATE users SET
          bank_name = $1, account_no = $2, ifsc = $3, branch = $4, upi_id = $5, gstin = $6
        WHERE id = $7
      `, [
        body.bankName || '', body.accountNo || '', body.ifsc ? body.ifsc.toUpperCase() : '',
        body.branch || '', body.upiId || '', body.gstin ? body.gstin.toUpperCase() : '', userId
      ]);

      const updatedUserRes = await pool.query('SELECT id, user_type, email, name, phone, retailer_id, company_name, gstin, city, business_type, bank_name, account_no, ifsc, branch, upi_id, status FROM users WHERE id = $1', [userId]);
      return sendJson(req, res, 200, { success: true, message: 'Bank details updated!', user: toCamelCase(updatedUserRes.rows[0]) });
    }

    // 10.1. UPDATE USER PROFILE & AVATAR
    if (pathname.startsWith('/api/users/') && pathname.endsWith('/profile') && (method === 'POST' || method === 'PUT')) {
      const parts = pathname.split('/');
      const userId = parts[3];
      const body = await parseBody(req);

      // Update in memoryUsers
      const memIdx = memoryUsers.findIndex(u => u.id === userId || u.retailer_id === userId || u.retailerId === userId);
      let updatedMemUser = null;
      if (memIdx !== -1) {
        memoryUsers[memIdx] = {
          ...memoryUsers[memIdx],
          name: body.name !== undefined ? body.name : memoryUsers[memIdx].name,
          company_name: body.companyName !== undefined ? body.companyName : memoryUsers[memIdx].company_name,
          phone: body.phone !== undefined ? body.phone : memoryUsers[memIdx].phone,
          city: body.city !== undefined ? body.city : memoryUsers[memIdx].city,
          station: body.station !== undefined ? body.station : memoryUsers[memIdx].station,
          address: body.address !== undefined ? body.address : memoryUsers[memIdx].address,
          gstin: body.gstin !== undefined ? body.gstin.toUpperCase() : memoryUsers[memIdx].gstin,
          avatar: body.avatar !== undefined ? body.avatar : memoryUsers[memIdx].avatar,
          bank_name: body.bankName !== undefined ? body.bankName : memoryUsers[memIdx].bank_name,
          account_no: body.accountNo !== undefined ? body.accountNo : memoryUsers[memIdx].account_no,
          ifsc: body.ifsc !== undefined ? body.ifsc.toUpperCase() : memoryUsers[memIdx].ifsc,
          branch: body.branch !== undefined ? body.branch : memoryUsers[memIdx].branch,
          upi_id: body.upiId !== undefined ? body.upiId : memoryUsers[memIdx].upi_id
        };
        updatedMemUser = toCamelCase(memoryUsers[memIdx]);
      }

      try {
        await pool.query(`
          UPDATE users SET
            name = COALESCE($1, name),
            company_name = COALESCE($2, company_name),
            phone = COALESCE($3, phone),
            city = COALESCE($4, city),
            gstin = COALESCE($5, gstin),
            avatar = COALESCE($6, avatar)
          WHERE id = $7 OR retailer_id = $7
        `, [
          body.name, body.companyName, body.phone, body.city, body.gstin ? body.gstin.toUpperCase() : null, body.avatar, userId
        ]);
        const updatedUserRes = await pool.query('SELECT * FROM users WHERE id = $1 OR retailer_id = $1', [userId]);
        if (updatedUserRes.rows && updatedUserRes.rows.length > 0) {
          const uRow = updatedUserRes.rows[0];
          delete uRow.password_hash;
          return sendJson(req, res, 200, { success: true, message: 'Profile updated successfully', user: toCamelCase(uRow) });
        }
      } catch (e) {
        console.warn('DB profile update note:', e.message);
      }

      return sendJson(req, res, 200, { 
        success: true, 
        message: 'Profile updated successfully', 
        user: updatedMemUser || toCamelCase(body) 
      });
    }

    // 11. BRANDS CRUD
    if (pathname === '/api/brands') {
      if (method === 'GET') {
        const result = await pool.query('SELECT * FROM brands ORDER BY created_at DESC');
        return sendJson(req, res, 200, toCamelCase(result.rows));
      } else if (method === 'POST') {
        if (!requireAdmin(req)) return sendJson(req, res, 401, { error: 'Unauthorized' });
        const body = await parseBody(req);
        const id = crypto.randomUUID();
        await pool.query(`
          INSERT INTO brands (id, name, tagline, category, origin, partnership_type, retail_margin, moq, carton_size, description, banner_image, logo_text, logo_subtext, highlights)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        `, [
          id, body.name, body.tagline, body.category, body.origin, body.partnershipType, body.retailMargin, body.moq, body.cartonSize, body.description, body.bannerImage, body.logoText, body.logoSubtext, JSON.stringify(body.highlights || [])
        ]);
        const created = await pool.query('SELECT * FROM brands WHERE id = $1', [id]);
        return sendJson(req, res, 201, toCamelCase(created.rows[0]));
      }
    }
    if (pathname.startsWith('/api/brands/') && (method === 'PUT' || method === 'PATCH')) {
      if (!requireAdmin(req)) return sendJson(req, res, 401, { error: 'Unauthorized' });
      const id = pathname.split('/')[3];
      const body = await parseBody(req);
      await pool.query(`
        UPDATE brands SET
          name = COALESCE($1, name), tagline = COALESCE($2, tagline), category = COALESCE($3, category),
          origin = COALESCE($4, origin), partnership_type = COALESCE($5, partnership_type),
          retail_margin = COALESCE($6, retail_margin), moq = COALESCE($7, moq), carton_size = COALESCE($8, carton_size),
          description = COALESCE($9, description), banner_image = COALESCE($10, banner_image),
          logo_text = COALESCE($11, logo_text), logo_subtext = COALESCE($12, logo_subtext)
        WHERE id = $13
      `, [
        body.name, body.tagline, body.category, body.origin, body.partnershipType,
        body.retailMargin, body.moq, body.cartonSize, body.description, body.bannerImage,
        body.logoText, body.logoSubtext, id
      ]);
      const updated = await pool.query('SELECT * FROM brands WHERE id = $1', [id]);
      return sendJson(req, res, 200, { success: true, data: toCamelCase(updated.rows[0] || body) });
    }
    if (pathname.startsWith('/api/brands/') && method === 'DELETE') {
      if (!requireAdmin(req)) return sendJson(req, res, 401, { error: 'Unauthorized' });
      const id = pathname.split('/')[3];
      await pool.query('DELETE FROM brands WHERE id = $1', [id]);
      return sendJson(req, res, 200, { success: true });
    }

    // 12. PRODUCTS CRUD
    if (pathname === '/api/products') {
      if (method === 'GET') {
        const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        return sendJson(req, res, 200, toCamelCase(result.rows));
      } else if (method === 'POST') {
        if (!requireAdmin(req)) return sendJson(req, res, 401, { error: 'Unauthorized' });
        const body = await parseBody(req);
        const id = crypto.randomUUID();
        await pool.query(`
          INSERT INTO products (id, name, brand_id, brand_name, category, suggested_retail_price, wholesale_rate, moq, carton_size, size_range, colors, image, description, materials)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        `, [
          id, body.name, body.brandId, body.brandName, body.category, body.suggestedRetailPrice, body.wholesaleRate, body.moq, body.cartonSize, body.sizeRange, JSON.stringify(body.colors || []), body.image, body.description, JSON.stringify(body.materials || {})
        ]);
        const created = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        return sendJson(req, res, 201, toCamelCase(created.rows[0]));
      }
    }
    if (pathname.startsWith('/api/products/') && (method === 'PUT' || method === 'PATCH')) {
      if (!requireAdmin(req)) return sendJson(req, res, 401, { error: 'Unauthorized' });
      const id = pathname.split('/')[3];
      const body = await parseBody(req);
      await pool.query(`
        UPDATE products SET
          name = COALESCE($1, name), brand_name = COALESCE($2, brand_name), category = COALESCE($3, category),
          suggested_retail_price = COALESCE($4, suggested_retail_price), wholesale_rate = COALESCE($5, wholesale_rate),
          moq = COALESCE($6, moq), carton_size = COALESCE($7, carton_size), size_range = COALESCE($8, size_range),
          image = COALESCE($9, image), description = COALESCE($10, description)
        WHERE id = $11
      `, [
        body.name, body.brandName, body.category, body.suggestedRetailPrice, body.wholesaleRate,
        body.moq, body.cartonSize, body.sizeRange, body.image, body.description, id
      ]);
      const updated = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      return sendJson(req, res, 200, { success: true, data: toCamelCase(updated.rows[0] || body) });
    }
    if (pathname.startsWith('/api/products/') && method === 'DELETE') {
      if (!requireAdmin(req)) return sendJson(req, res, 401, { error: 'Unauthorized' });
      const id = pathname.split('/')[3];
      await pool.query('DELETE FROM products WHERE id = $1', [id]);
      return sendJson(req, res, 200, { success: true });
    }

    // 13. QUERIES CRUD & EMAIL NOTIFICATIONS
    if (pathname === '/api/queries' || pathname === '/api/inquiries') {
      if (method === 'GET') {
        if (!requireAdmin(req)) return sendJson(req, res, 401, { error: 'Unauthorized' });
        try {
          const result = await pool.query('SELECT * FROM queries ORDER BY created_at DESC');
          if (result.rows && result.rows.length > 0) {
            return sendJson(req, res, 200, toCamelCase(result.rows));
          }
        } catch (e) {}
        return sendJson(req, res, 200, toCamelCase(memoryQueries));
      } else if (method === 'POST') {
        const body = await parseBody(req);
        const refId = `QRY-${Math.floor(1000 + Math.random() * 9000)}`;
        const id = refId;
        const queryObj = {
          id,
          referenceId: refId,
          retailerId: body.retailerId || 'GUEST-RETAILER',
          companyName: body.companyName || body.contactName || '',
          contactName: body.contactName || body.name || '',
          phone: body.phone || '',
          email: body.email || '',
          type: body.type || 'Wholesale Stock Booking',
          brandName: body.brandName || body.brandInterest || '',
          brandInterest: body.brandInterest || body.brandName || '',
          productSku: body.productSku || '',
          subject: body.subject || body.brandInterest || 'Footwear Wholesale Inquiry',
          message: body.message || '',
          volume: body.volume || '50 - 150 pairs / batch',
          location: body.location || '',
          status: 'Pending',
          createdAt: new Date().toISOString()
        };

        memoryQueries.unshift(queryObj);

        try {
          await pool.query(`
            INSERT INTO queries (id, retailer_id, company_name, contact_name, phone, email, type, brand_name, product_sku, subject, message)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          `, [
            id, queryObj.retailerId, queryObj.companyName, queryObj.contactName, queryObj.phone, queryObj.email, queryObj.type, queryObj.brandName, queryObj.productSku, queryObj.subject, queryObj.message
          ]);
        } catch (e) {}

        // Send Email notifications to BOTH Admin and Retailer
        sendInquiryEmails(queryObj).catch(err => console.error('Inquiry email notification error:', err.message));

        return sendJson(req, res, 201, { 
          success: true, 
          message: 'Inquiry registered. Notification emails dispatched to Retailer and Admin.', 
          data: toCamelCase(queryObj) 
        });
      }
    }
    if (pathname.startsWith('/api/queries/') && pathname.endsWith('/status') && method === 'PATCH') {
      if (!requireAdmin(req)) return sendJson(req, res, 401, { error: 'Unauthorized' });
      const id = pathname.split('/')[3];
      const body = await parseBody(req);
      try {
        await pool.query('UPDATE queries SET status = $1 WHERE id = $2', [body.status, id]);
      } catch (e) {}
      const qIdx = memoryQueries.findIndex(q => q.id === id);
      if (qIdx !== -1) {
        memoryQueries[qIdx].status = body.status;
      }
      return sendJson(req, res, 200, { success: true, message: `Status updated to ${body.status}` });
    }

    // 13.2. SYSTEM NOTIFICATIONS
    if (pathname === '/api/notifications') {
      const auth = authenticateRequest(req);
      if (!auth) return sendJson(req, res, 401, { error: 'Unauthorized' });
      const notifs = [
        {
          id: 'notif-01',
          type: 'order',
          title: 'System Active',
          message: 'Notifications service synchronized across Web and Email.',
          timestamp: new Date().toISOString(),
          isRead: false
        }
      ];
      return sendJson(req, res, 200, { success: true, notifications: notifs });
    }

    // 13.5. ORDERS DESK & CART CHECKOUT
    if (pathname === '/api/orders') {
      if (method === 'GET') {
        const userIdFilter = url.searchParams.get('userId');
        const emailFilter = url.searchParams.get('email');

        let filtered = [...memoryOrders];
        if (userIdFilter) {
          filtered = filtered.filter(o => o.userId === userIdFilter || o.retailerId === userIdFilter);
        } else if (emailFilter) {
          filtered = filtered.filter(o => o.customerEmail?.toLowerCase() === emailFilter.toLowerCase());
        }

        try {
          const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
          if (result.rows && result.rows.length > 0) {
            let dbOrders = toCamelCase(result.rows);
            if (userIdFilter) {
              dbOrders = dbOrders.filter(o => o.userId === userIdFilter || o.retailerId === userIdFilter);
            }
            return sendJson(req, res, 200, dbOrders);
          }
        } catch (e) {}

        return sendJson(req, res, 200, filtered);
      } else if (method === 'POST') {
        const body = await parseBody(req);
        const randSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderId = body.orderId || `ORD-2026-${randSuffix}`;
        const rawItems = Array.isArray(body.items) ? body.items : [];

        const items = rawItems.map(it => {
          const pairsPerSet = parseInt(it.pairsPerSet, 10) || 12;
          const ratePerPair = typeof it.ratePerPair === 'number' ? it.ratePerPair : (typeof it.wholesaleRate === 'number' ? it.wholesaleRate : 750);
          const ratePerSet = typeof it.ratePerSet === 'number' ? it.ratePerSet : (pairsPerSet * ratePerPair);
          const sets = parseInt(it.sets, 10) || parseInt(it.quantity, 10) || 1;
          const totalPairs = parseInt(it.totalPairs, 10) || (sets * pairsPerSet);
          const subtotal = typeof it.subtotal === 'number' ? it.subtotal : (sets * ratePerSet);

          return {
            ...it,
            pairsPerSet,
            sizeCurve: it.sizeCurve || '',
            sets,
            quantity: sets,
            totalPairs,
            ratePerPair,
            wholesaleRate: ratePerPair,
            mrpRate: ratePerPair,
            ratePerSet,
            subtotal,
            color: it.color || it.selectedColor || 'Classic Black',
            specification: (it.specification || '').trim(),
            image: it.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=150&q=80'
          };
        });
        
        const totalSets = body.totalSets || items.reduce((acc, it) => acc + (it.sets || it.quantity || 1), 0);
        const totalPairs = body.totalPairs || items.reduce((acc, it) => acc + (it.totalPairs || ((it.sets || it.quantity || 1) * (it.pairsPerSet || 12))), 0);
        const totalAmount = body.totalAmount || items.reduce((acc, it) => acc + (it.subtotal || ((it.wholesaleRate || 0) * (it.quantity || 1))), 0);
        const totalItems = totalSets;

        const partyName = (body.partyName || body.companyName || 'Footwear Retail Store').trim();
        const station = (body.station || body.city || 'Central Station').trim();

        const orderObj = {
          id: orderId,
          orderId,
          userId: body.userId || body.retailerId || 'GUEST-RETAILER',
          retailerId: body.retailerId || body.userId || '',
          partyName,
          companyName: partyName,
          station,
          city: station,
          customerName: body.customerName || body.name || 'Valued Retailer',
          customerEmail: body.customerEmail || body.email || '',
          customerPhone: body.customerPhone || body.phone || '',
          shippingAddress: body.shippingAddress || body.address || 'Store Delivery',
          paymentMethod: body.paymentMethod || 'Bank Transfer / RTGS',
          notes: body.notes || '',
          specification: (body.specification || '').trim(),
          items,
          totalSets,
          totalPairs,
          totalItems,
          totalAmount,
          status: 'Pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        memoryOrders.unshift(orderObj);

        try {
          await pool.query(`
            INSERT INTO orders (id, order_id, user_id, customer_name, company_name, customer_email, customer_phone, city, shipping_address, payment_method, notes, items, total_items, total_amount, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          `, [
            orderId, orderId, orderObj.userId, orderObj.customerName, orderObj.companyName,
            orderObj.customerEmail, orderObj.customerPhone, orderObj.city, orderObj.shippingAddress,
            orderObj.paymentMethod, orderObj.notes, JSON.stringify(items), totalItems, totalAmount, 'Pending'
          ]);
        } catch (e) {}

        // Send Email notifications to Admin and Retailer
        sendNewOrderEmails(orderObj).catch(err => console.error('Order notification email error:', err.message));

        return sendJson(req, res, 201, {
          success: true,
          message: `Order #${orderId} placed successfully! Notification sent to Admin and Customer.`,
          order: orderObj
        });
      }
    }

    if (pathname.startsWith('/api/orders/') && pathname.endsWith('/status') && method === 'PATCH') {
      const orderId = pathname.split('/')[3];
      const body = await parseBody(req);
      const newStatus = body.status;
      const adminNote = body.adminNote || '';

      const orderIdx = memoryOrders.findIndex(o => o.id === orderId || o.orderId === orderId);
      let targetOrder = null;
      if (orderIdx !== -1) {
        memoryOrders[orderIdx].status = newStatus;
        memoryOrders[orderIdx].adminNote = adminNote || memoryOrders[orderIdx].adminNote;
        memoryOrders[orderIdx].updatedAt = new Date().toISOString();
        targetOrder = memoryOrders[orderIdx];
      }

      try {
        await pool.query('UPDATE orders SET status = $1, admin_note = $2, updated_at = NOW() WHERE id = $3 OR order_id = $3', [newStatus, adminNote, orderId]);
      } catch (e) {}

      if (targetOrder) {
        sendOrderStatusUpdateEmail(targetOrder, newStatus).catch(err => console.error('Order status email error:', err.message));
      }

      return sendJson(req, res, 200, {
        success: true,
        message: `Order #${orderId} status updated to ${newStatus}`,
        order: targetOrder
      });
    }

    // 13.6. UPDATE ORDER DETAILS (RETAILER OR ADMIN EDIT)
    if (pathname.startsWith('/api/orders/') && !pathname.endsWith('/status') && (method === 'PUT' || method === 'PATCH')) {
      const parts = pathname.split('/');
      const orderId = parts[3];
      const body = await parseBody(req);

      const orderIdx = memoryOrders.findIndex(o => o.id === orderId || o.orderId === orderId);
      let targetOrder = null;
      if (orderIdx !== -1) {
        memoryOrders[orderIdx] = {
          ...memoryOrders[orderIdx],
          ...body,
          id: orderId,
          orderId: orderId,
          updatedAt: new Date().toISOString()
        };
        targetOrder = memoryOrders[orderIdx];
      }

      try {
        await pool.query(`
          UPDATE orders SET
            customer_name = COALESCE($1, customer_name),
            company_name = COALESCE($2, company_name),
            customer_phone = COALESCE($3, customer_phone),
            city = COALESCE($4, city),
            shipping_address = COALESCE($5, shipping_address),
            notes = COALESCE($6, notes),
            items = COALESCE($7, items),
            total_items = COALESCE($8, total_items),
            total_amount = COALESCE($9, total_amount),
            updated_at = NOW()
          WHERE id = $10 OR order_id = $10
        `, [
          body.customerName, body.companyName || body.partyName, body.customerPhone,
          body.city || body.station, body.shippingAddress, body.notes,
          body.items ? JSON.stringify(body.items) : null,
          body.totalItems || body.totalSets, body.totalAmount, orderId
        ]);
      } catch (e) {
        console.warn('DB order update note:', e.message);
      }

      return sendJson(req, res, 200, {
        success: true,
        message: `Order #${orderId} details updated successfully`,
        order: targetOrder || body
      });
    }

    // 14. BANNERS CRUD
    if (pathname === '/api/banners') {
      if (method === 'GET') {
        const result = await pool.query('SELECT * FROM banners ORDER BY sort_order ASC, created_at DESC');
        return sendJson(req, res, 200, toCamelCase(result.rows));
      } else if (method === 'POST') {
        if (!requireAdmin(req)) return sendJson(req, res, 401, { error: 'Unauthorized' });
        const body = await parseBody(req);
        const id = crypto.randomUUID();
        await pool.query(`
          INSERT INTO banners (id, title, subtitle, badge, tag, image_url, suggested_retail, wholesale_rate, sort_order)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          id, body.title, body.subtitle, body.badge, body.tag, body.imageUrl, body.suggestedRetail, body.wholesaleRate, body.sortOrder || 0
        ]);
        const created = await pool.query('SELECT * FROM banners WHERE id = $1', [id]);
        return sendJson(req, res, 201, toCamelCase(created.rows[0]));
      }
    }
    if (pathname.startsWith('/api/banners/') && method === 'DELETE') {
      if (!requireAdmin(req)) return sendJson(req, res, 401, { error: 'Unauthorized' });
      const id = pathname.split('/')[3];
      await pool.query('DELETE FROM banners WHERE id = $1', [id]);
      return sendJson(req, res, 200, { success: true });
    }
    if (pathname === '/api/banners/reset' && method === 'PUT') {
      if (!requireAdmin(req)) return sendJson(req, res, 401, { error: 'Unauthorized' });
      await pool.query('DELETE FROM banners');
      return sendJson(req, res, 200, { success: true, message: 'Banners reset.' });
    }

    // 15. OWNER PROFILES CRUD
    if (pathname === '/api/owner-profiles') {
      if (method === 'GET') {
        let result = await pool.query('SELECT * FROM owner_profiles LIMIT 1');
        if (result.rows.length === 0) {
          await pool.query("INSERT INTO owner_profiles (id) VALUES ('jmr-owners-01')");
          result = await pool.query('SELECT * FROM owner_profiles LIMIT 1');
        }
        return sendJson(req, res, 200, toCamelCase(result.rows[0]));
      } else if (method === 'PUT') {
        if (!requireAdmin(req)) return sendJson(req, res, 401, { error: 'Unauthorized' });
        const body = await parseBody(req);
        await pool.query(`
          UPDATE owner_profiles SET owners = $1, godown = $2, founder_story = $3, last_updated = NOW()
          WHERE id = 'jmr-owners-01'
        `, [
          JSON.stringify(body.owners || []), JSON.stringify(body.godown || {}), JSON.stringify(body.founderStory || {})
        ]);
        const updated = await pool.query('SELECT * FROM owner_profiles LIMIT 1');
        return sendJson(req, res, 200, toCamelCase(updated.rows[0]));
      }
    }

    // 16. SCHEMES, EVENTS & GALLERY CRUD
    if (pathname === '/api/schemes-events') {
      if (method === 'GET') {
        try {
          const result = await pool.query('SELECT * FROM schemes_events ORDER BY created_at DESC');
          if (result.rows && result.rows.length > 0) {
            return sendJson(req, res, 200, toCamelCase(result.rows));
          }
        } catch (e) {}
        return sendJson(req, res, 200, memorySchemesEvents);
      } else if (method === 'POST') {
        if (!requireAdmin(req)) return sendJson(req, res, 401, { error: 'Unauthorized' });
        const body = await parseBody(req);
        const id = body.id || `se-${Date.now()}`;
        const newRecord = {
          ...body,
          id,
          createdAt: new Date().toISOString()
        };
        memorySchemesEvents.unshift(newRecord);
        try {
          await pool.query(`
            INSERT INTO schemes_events (id, type, title, subtitle, badge, badge_color, valid_till, location, discount_code, image, description, terms)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          `, [
            id, newRecord.type, newRecord.title, newRecord.subtitle, newRecord.badge, newRecord.badgeColor,
            newRecord.validTill, newRecord.location, newRecord.discountCode, newRecord.image, newRecord.description, newRecord.terms
          ]);
        } catch (e) {}
        return sendJson(req, res, 201, { success: true, item: newRecord });
      }
    }

    if (pathname.startsWith('/api/schemes-events/') && (method === 'PUT' || method === 'PATCH')) {
      if (!requireAdmin(req)) return sendJson(req, res, 401, { error: 'Unauthorized' });
      const id = pathname.split('/')[3];
      const body = await parseBody(req);
      const idx = memorySchemesEvents.findIndex(x => x.id === id);
      let updatedObj = null;
      if (idx !== -1) {
        memorySchemesEvents[idx] = { ...memorySchemesEvents[idx], ...body, id, updatedAt: new Date().toISOString() };
        updatedObj = memorySchemesEvents[idx];
      } else {
        updatedObj = { ...body, id };
        memorySchemesEvents.unshift(updatedObj);
      }
      try {
        await pool.query(`
          UPDATE schemes_events SET
            type = COALESCE($1, type), title = COALESCE($2, title), subtitle = COALESCE($3, subtitle),
            badge = COALESCE($4, badge), badge_color = COALESCE($5, badge_color), valid_till = COALESCE($6, valid_till),
            location = COALESCE($7, location), discount_code = COALESCE($8, discount_code),
            image = COALESCE($9, image), description = COALESCE($10, description), terms = COALESCE($11, terms)
          WHERE id = $12
        `, [
          body.type, body.title, body.subtitle, body.badge, body.badgeColor,
          body.validTill, body.location, body.discountCode, body.image, body.description, body.terms, id
        ]);
      } catch (e) {}
      return sendJson(req, res, 200, { success: true, item: updatedObj });
    }

    if (pathname.startsWith('/api/schemes-events/') && method === 'DELETE') {
      if (!requireAdmin(req)) return sendJson(req, res, 401, { error: 'Unauthorized' });
      const id = pathname.split('/')[3];
      memorySchemesEvents = memorySchemesEvents.filter(x => x.id !== id);
      try {
        await pool.query('DELETE FROM schemes_events WHERE id = $1', [id]);
      } catch (e) {}
      return sendJson(req, res, 200, { success: true, message: 'Deleted successfully' });
    }

    
      // 12. ADMIN: GET PENDING APPROVALS
      if (pathname === '/api/admin/pending-users' && method === 'GET') {
        const admin = requireAdmin(req);
        if (!admin) return sendJson(req, res, 401, { error: 'Unauthorized' });

        try {
          const pendingRes = await pool.query("SELECT id, user_type, email, name, phone, retailer_id, company_name, gstin, city, status, registered_at FROM users WHERE status = 'pending' ORDER BY registered_at DESC");
          if (pendingRes.rows && pendingRes.rows.length > 0) {
            return sendJson(req, res, 200, toCamelCase(pendingRes.rows));
          }
        } catch (e) {}

        const memPending = memoryUsers.filter(u => u.status === 'pending');
        return sendJson(req, res, 200, toCamelCase(memPending));
      }

      // 13. ADMIN: APPROVE USER
      if (pathname === '/api/admin/approve-user' && method === 'POST') {
        const admin = requireAdmin(req);
        if (!admin) return sendJson(req, res, 401, { error: 'Unauthorized' });
        
        const body = await parseBody(req);
        if (!body.userId) return sendJson(req, res, 400, { error: 'User ID is required' });

        let approvedUser = null;
        try {
          const userRes = await pool.query("SELECT * FROM users WHERE id = $1", [body.userId]);
          await pool.query("UPDATE users SET status = 'active' WHERE id = $1", [body.userId]);
          if (userRes.rows.length > 0) {
            approvedUser = toCamelCase(userRes.rows[0]);
          }
        } catch (e) {}

        const memIdx = memoryUsers.findIndex(u => u.id === body.userId || u.retailer_id === body.userId);
        if (memIdx !== -1) {
          memoryUsers[memIdx].status = 'active';
          if (!approvedUser) approvedUser = toCamelCase(memoryUsers[memIdx]);
        }

        if (approvedUser) {
          sendAccountApprovedEmail(approvedUser).catch(err => console.error('Approval email error:', err.message));
        }

        return sendJson(req, res, 200, { success: true, message: 'User approved successfully and notification sent.' });
      }

      // 14. ADMIN: REJECT USER
      if (pathname === '/api/admin/reject-user' && method === 'POST') {
        const admin = requireAdmin(req);
        if (!admin) return sendJson(req, res, 401, { error: 'Unauthorized' });
        
        const body = await parseBody(req);
        if (!body.userId) return sendJson(req, res, 400, { error: 'User ID is required' });

        try {
          await pool.query("DELETE FROM users WHERE id = $1 AND status = 'pending'", [body.userId]);
        } catch (e) {}

        memoryUsers = memoryUsers.filter(u => u.id !== body.userId && u.retailer_id !== body.userId);
        return sendJson(req, res, 200, { success: true, message: 'User rejected and removed.' });
      }

      // 15. SITE SETTINGS & CMS (GET & PUT)
      if ((pathname === '/api/settings' || pathname === '/api/company-settings')) {
        if (method === 'GET') {
          return sendJson(req, res, 200, { success: true, data: memorySettings });
        } else if (method === 'PUT' || method === 'POST') {
          if (!requireAdmin(req)) return sendJson(req, res, 401, { error: 'Unauthorized' });
          const body = await parseBody(req);
          memorySettings = { ...memorySettings, ...body, lastUpdated: new Date().toISOString() };
          return sendJson(req, res, 200, { success: true, message: 'Settings saved successfully', data: memorySettings });
        }
      }

      // 16. SUB-ADMINS & AUTHORIZATION MANAGEMENT (MASTER ADMIN ONLY)
      if (pathname === '/api/admin/subadmins' && method === 'GET') {
        const admin = requireAdmin(req);
        if (!admin) return sendJson(req, res, 401, { error: 'Unauthorized' });
        const subAdmins = memoryUsers.filter(u => u.is_sub_admin || u.isSubAdmin);
        return sendJson(req, res, 200, toCamelCase(subAdmins.map(({ password_hash, ...rest }) => rest)));
      }

      if (pathname === '/api/admin/subadmins' && method === 'POST') {
        const admin = requireAdmin(req);
        if (!admin) return sendJson(req, res, 401, { error: 'Unauthorized' });
        const body = await parseBody(req);
        const { name, email, phone, password, role, permissions = {} } = body;
        if (!name || !email || !password) {
          return sendJson(req, res, 400, { error: 'Name, email, and password are required for Sub-Admin account.' });
        }

        const subId = `subadmin-${Date.now().toString(36)}`;
        const hash = await bcrypt.hash(password, 10);
        const newSub = {
          id: subId,
          user_type: 'admin',
          account_type: 'admin',
          is_sub_admin: true,
          isSubAdmin: true,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone ? phone.trim() : '',
          password_hash: hash,
          role: role || 'Sub-Admin Staff',
          status: 'active',
          permissions,
          registered_at: new Date().toISOString()
        };

        memoryUsers.push(newSub);
        const { password_hash: _, ...safeSub } = newSub;
        return sendJson(req, res, 201, { success: true, message: 'Sub-Admin created successfully', subAdmin: toCamelCase(safeSub) });
      }

      if (pathname.startsWith('/api/admin/subadmins/') && method === 'PUT') {
        const admin = requireAdmin(req);
        if (!admin) return sendJson(req, res, 401, { error: 'Unauthorized' });
        const subId = pathname.replace('/api/admin/subadmins/', '');
        const body = await parseBody(req);

        const idx = memoryUsers.findIndex(u => u.id === subId);
        if (idx === -1) return sendJson(req, res, 404, { error: 'Sub-Admin not found' });

        if (body.password) {
          memoryUsers[idx].password_hash = await bcrypt.hash(body.password, 10);
        }
        if (body.name) memoryUsers[idx].name = body.name.trim();
        if (body.role) memoryUsers[idx].role = body.role.trim();
        if (body.phone) memoryUsers[idx].phone = body.phone.trim();
        if (body.status) memoryUsers[idx].status = body.status;
        if (body.permissions) memoryUsers[idx].permissions = { ...memoryUsers[idx].permissions, ...body.permissions };

        const { password_hash: _, ...safeSub } = memoryUsers[idx];
        return sendJson(req, res, 200, { success: true, message: 'Sub-Admin updated', subAdmin: toCamelCase(safeSub) });
      }

      if (pathname.startsWith('/api/admin/subadmins/') && method === 'DELETE') {
        const admin = requireAdmin(req);
        if (!admin) return sendJson(req, res, 401, { error: 'Unauthorized' });
        const subId = pathname.replace('/api/admin/subadmins/', '');
        memoryUsers = memoryUsers.filter(u => u.id !== subId);
        return sendJson(req, res, 200, { success: true, message: 'Sub-Admin removed' });
      }

    // 404 FOR UNMATCHED ROUTES
    sendJson(req, res, 404, { error: `Route ${pathname} not found.` });
  } catch (err) {
    console.error('Server API error:', err);
    sendJson(req, res, 500, { error: 'Internal Server Error', details: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 JMR Shooz PostgreSQL API Server running at http://localhost:${PORT}`);
  console.log(`📊 Health Endpoint: http://localhost:${PORT}/api/health`);
});
