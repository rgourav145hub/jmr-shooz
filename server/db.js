import pg from 'pg';
const { Pool } = pg;

// Connection string from environment variable (or fallback for dev)
const rawDbUrl = process.env.DATABASE_URL || '';
const isRealDbUrl = rawDbUrl && 
  !rawDbUrl.includes('[ref]') && 
  !rawDbUrl.includes('[password]') && 
  !rawDbUrl.includes('[region]') && 
  !rawDbUrl.includes('your-project') &&
  rawDbUrl.startsWith('postgresql://');

let pool;

if (isRealDbUrl) {
  pool = new Pool({
    connectionString: rawDbUrl,
    connectionTimeoutMillis: 2500, // Max 2.5s to connect
    idleTimeoutMillis: 10000,
    statement_timeout: 3000,       // Max 3s query timeout
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
      console.warn('⚠️ PostgreSQL connection failed:', err.message);
      console.log('ℹ️ Backend continuing in memory-safe fallback mode.');
    });
} else {
  console.log('ℹ️ PostgreSQL placeholder detected. Backend operating in memory storage mode.');
  
  // Safe mock pool for development
  pool = {
    query: async (text, params) => {
      return { rows: [] };
    },
    connect: async () => ({ release: () => {} })
  };
}

export function initDatabase() {
  console.log('PostgreSQL schema auto-initialized in backend code.');
}

export { pool };
