-- ========================================================
-- JMR SHOOZ — Complete PostgreSQL Schema for pgAdmin
-- ========================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    user_type VARCHAR(50) DEFAULT 'retailer',
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    retailer_id VARCHAR(100),
    company_name VARCHAR(255),
    gstin VARCHAR(50),
    city VARCHAR(100) DEFAULT 'India',
    business_type VARCHAR(100),
    bank_name VARCHAR(100),
    account_no VARCHAR(100),
    ifsc VARCHAR(50),
    branch VARCHAR(100),
    upi_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending',
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. OTPS TABLE
CREATE TABLE IF NOT EXISTS otps (
    id SERIAL PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    purpose VARCHAR(50),
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. BANK DETAILS TABLE (Company Bank Info)
CREATE TABLE IF NOT EXISTS bank_details (
    id VARCHAR(100) PRIMARY KEY DEFAULT 'jmr-company-bank-01',
    account_name VARCHAR(255),
    bank_name VARCHAR(255),
    account_number VARCHAR(100),
    ifsc_code VARCHAR(50),
    branch VARCHAR(100),
    account_type VARCHAR(50),
    upi_id VARCHAR(100),
    company_gstin VARCHAR(50),
    company_pan VARCHAR(50),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initial default row for bank_details if not exists
INSERT INTO bank_details (id, account_name, bank_name, account_number, ifsc_code, branch, account_type, upi_id)
VALUES ('jmr-company-bank-01', 'JMR Shooz Footwear Ltd', 'HDFC Bank', '50200012345678', 'HDFC0001234', 'Main Branch', 'Current', 'jmrshooz@upi')
ON CONFLICT (id) DO NOTHING;

-- 4. BRANDS TABLE
CREATE TABLE IF NOT EXISTS brands (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tagline TEXT,
    category VARCHAR(100),
    origin VARCHAR(100),
    partnership_type VARCHAR(100),
    retail_margin VARCHAR(50),
    moq VARCHAR(50),
    carton_size VARCHAR(50),
    description TEXT,
    banner_image TEXT,
    logo_text VARCHAR(100),
    logo_subtext VARCHAR(100),
    highlights JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand_id VARCHAR(100),
    brand_name VARCHAR(255),
    category VARCHAR(100),
    suggested_retail_price NUMERIC,
    wholesale_rate NUMERIC,
    moq VARCHAR(50),
    carton_size VARCHAR(50),
    size_range VARCHAR(100),
    colors JSONB DEFAULT '[]',
    image TEXT,
    description TEXT,
    materials VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY,
    order_id VARCHAR(100),
    user_id VARCHAR(100),
    customer_name VARCHAR(255),
    company_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    city VARCHAR(100),
    shipping_address TEXT,
    payment_method VARCHAR(50),
    notes TEXT,
    items JSONB DEFAULT '[]',
    total_items INT DEFAULT 0,
    total_amount NUMERIC DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. QUERIES / INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS queries (
    id VARCHAR(100) PRIMARY KEY,
    retailer_id VARCHAR(100),
    company_name VARCHAR(255),
    contact_name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    type VARCHAR(50),
    brand_name VARCHAR(255),
    product_sku VARCHAR(100),
    subject VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. BANNERS TABLE
CREATE TABLE IF NOT EXISTS banners (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255),
    subtitle TEXT,
    badge VARCHAR(100),
    tag VARCHAR(100),
    image_url TEXT,
    suggested_retail NUMERIC,
    wholesale_rate NUMERIC,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. OWNER PROFILES TABLE
CREATE TABLE IF NOT EXISTS owner_profiles (
    id VARCHAR(100) PRIMARY KEY DEFAULT 'jmr-owners-01',
    owners JSONB DEFAULT '[]',
    godown JSONB DEFAULT '{}',
    founder_story JSONB DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO owner_profiles (id)
VALUES ('jmr-owners-01')
ON CONFLICT (id) DO NOTHING;

-- 10. SCHEMES & EVENTS TABLE
CREATE TABLE IF NOT EXISTS schemes_events (
    id VARCHAR(100) PRIMARY KEY,
    type VARCHAR(50),
    title VARCHAR(255),
    subtitle TEXT,
    badge VARCHAR(100),
    badge_color VARCHAR(50),
    valid_till VARCHAR(100),
    location VARCHAR(255),
    discount_code VARCHAR(100),
    image TEXT,
    description TEXT,
    terms JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
