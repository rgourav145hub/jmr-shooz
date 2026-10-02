import { pool } from './db.js';
import bcrypt from 'bcryptjs';
import { brandsData } from '../src/data/brandsData.js';
import { productsData } from '../src/data/productsData.js';

async function seed() {
  console.log('Seeding initial data into PostgreSQL...');

  const defaultAdminHash = bcrypt.hashSync('admin123', 10);
  const defaultRetailerHash = bcrypt.hashSync('retailer123', 10);

  // 1. Seed Users
  const users = [
    {
      id: 'admin-main',
      user_type: 'admin',
      email: 'rgourav145@gmail.com',
      password_hash: defaultAdminHash,
      name: 'Gourav (JMR Admin)',
      phone: '+91 98200 12345',
      retailer_id: 'ADMIN-00',
      company_name: 'JMR Shooz Footwear Hub',
      city: 'INDORE',
      status: 'active'
    },
    {
      id: 'admin-01',
      user_type: 'admin',
      email: 'admin@jmrshooz.com',
      password_hash: defaultAdminHash,
      name: 'JMR Executive Admin',
      phone: '+91 98200 12345',
      retailer_id: 'ADMIN-01',
      company_name: 'JMR Shooz Wholesale Hub',
      city: 'India',
      status: 'active'
    },
    {
      id: 'RET-2026-023797DC',
      user_type: 'retailer',
      email: 'retailer@jmrshooz.com',
      password_hash: defaultRetailerHash,
      name: 'ROYAL SHOE RETAILER',
      phone: '6263563985',
      retailer_id: 'RET-2026-023797DC',
      company_name: 'ROYAL SHOE',
      city: 'INDORE',
      status: 'active'
    }
  ];

  for (const u of users) {
    await pool.query(`
      INSERT INTO users (id, user_type, email, password_hash, name, phone, retailer_id, company_name, city, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO NOTHING
    `, [u.id, u.user_type, u.email, u.password_hash, u.name, u.phone, u.retailer_id, u.company_name, u.city, u.status]);
  }
  console.log('✅ Users seeded');

  // 2. Seed Brands
  for (const b of brandsData) {
    await pool.query(`
      INSERT INTO brands (id, name, tagline, category, origin, partnership_type, retail_margin, moq, carton_size, description, banner_image, logo_text, logo_subtext, highlights)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (id) DO NOTHING
    `, [
      b.id,
      b.name,
      b.tagline || '',
      b.category || '',
      b.origin || '',
      b.partnershipType || '',
      b.retailMargin || '',
      b.moq || '',
      b.cartonSize || '',
      b.description || '',
      b.bannerImage || '',
      b.logoText || '',
      b.logoSubtext || '',
      JSON.stringify(b.highlights || [])
    ]);
  }
  console.log(`✅ ${brandsData.length} Brands seeded`);

  // 3. Seed Products
  for (const p of productsData) {
    await pool.query(`
      INSERT INTO products (id, name, brand_id, brand_name, category, suggested_retail_price, wholesale_rate, moq, carton_size, size_range, colors, image, description, materials)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (id) DO NOTHING
    `, [
      p.id,
      p.name,
      p.brandId || p.brand_id || '',
      p.brandName || p.brand_name || '',
      p.category || '',
      p.suggestedRetailPrice || p.suggested_retail_price || 0,
      p.wholesaleRate || p.wholesale_rate || 0,
      p.moq || '',
      p.cartonSize || p.carton_size || '',
      p.sizeRange || p.size_range || '',
      JSON.stringify(p.colors || []),
      p.image || '',
      p.description || '',
      p.materials || ''
    ]);
  }
  console.log(`✅ ${productsData.length} Products seeded`);

  console.log('All seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
