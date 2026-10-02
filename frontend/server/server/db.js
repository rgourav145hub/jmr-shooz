import pg from 'pg';
const { Pool } = pg;

// Connection string from environment variable (or fallback for dev)
const DATABASE_URL = process.env.DATABASE_URL;

let pool;

if (DATABASE_URL) {
  pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  // Verify connection
  pool.connect()
    .then(client => {
      console.log('✅ PostgreSQL Database connected successfully');
      client.release();
    })
    .catch(err => {
      console.error('❌ PostgreSQL connection error:', err.message);
    });
} else {
  console.warn('⚠️ DATABASE_URL not found in .env. Mocking pg connection for UI development.');
  
  // Mock pool for development if no DB is provided
  // This prevents the server from crashing so the frontend can still load
  pool = {
    query: async (text, params) => {
      console.log(`[MOCK QUERY]: ${text}`);
      return { rows: [] };
    },
    connect: async () => ({ release: () => {} })
  };
}

export function initDatabase() {
  console.log('PostgreSQL schema must be initialized in Supabase Dashboard (SQL Editor).');
  console.log('Database initialization skipped in backend code.');
}

export { pool };
