# Database Schema

## Users Table
Stores user account information and credit balance.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  credits INTEGER DEFAULT 0,
  subscription_tier VARCHAR(50) DEFAULT 'free', -- 'free', 'pro', 'enterprise'
  subscription_status VARCHAR(50) DEFAULT 'inactive', -- 'active', 'inactive', 'cancelled'
  last_login TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
```

## Ads Table
Stores generated video ad metadata and history.

```sql
CREATE TABLE ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  target_audience VARCHAR(255) NOT NULL,
  main_benefit TEXT NOT NULL,

  -- Generated content
  script_hook TEXT,
  script_body TEXT,
  script_cta TEXT,

  -- Media assets
  avatar_type VARCHAR(100), -- 'ai_avatar', 'stock_footage'
  avatar_id VARCHAR(255),
  voiceover_url TEXT,
  video_url TEXT,
  thumbnail_url TEXT,

  -- Metadata
  duration_seconds INTEGER,
  video_format VARCHAR(50) DEFAULT 'mp4',
  resolution VARCHAR(50) DEFAULT '1080x1920', -- Vertical for TikTok/Reels

  -- Status tracking
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  generation_id UUID,

  -- Cost tracking
  credits_used INTEGER DEFAULT 1,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_ads_user_id ON ads(user_id);
CREATE INDEX idx_ads_status ON ads(status);
CREATE INDEX idx_ads_created_at ON ads(created_at DESC);
```

## Generations Table
Tracks the async processing state of video generation jobs.

```sql
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Processing stages
  script_generated BOOLEAN DEFAULT FALSE,
  voiceover_generated BOOLEAN DEFAULT FALSE,
  video_rendered BOOLEAN DEFAULT FALSE,

  -- Error handling
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  -- External service IDs
  openai_request_id VARCHAR(255),
  elevenlabs_request_id VARCHAR(255),
  video_render_job_id VARCHAR(255),

  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  script_completed_at TIMESTAMP WITH TIME ZONE,
  voiceover_completed_at TIMESTAMP WITH TIME ZONE,
  video_completed_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_generations_ad_id ON generations(ad_id);
CREATE INDEX idx_generations_started_at ON generations(started_at DESC);
```

## Credit Transactions Table
Audit trail for credit purchases and usage.

```sql
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Transaction details
  type VARCHAR(50) NOT NULL, -- 'purchase', 'usage', 'refund', 'bonus'
  amount INTEGER NOT NULL, -- Positive for credits added, negative for credits used
  balance_after INTEGER NOT NULL,

  -- Related entities
  ad_id UUID REFERENCES ads(id) ON DELETE SET NULL,

  -- Payment details (for purchases)
  payment_intent_id VARCHAR(255),
  payment_amount_cents INTEGER,

  -- Description
  description TEXT,

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
```

## Export History Table
Tracks exports to ad platforms.

```sql
CREATE TABLE export_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Export details
  platform VARCHAR(50) NOT NULL, -- 'tiktok', 'meta', 'download'
  export_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'success', 'failed'

  -- Platform-specific metadata
  platform_ad_id VARCHAR(255),
  platform_response JSON,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_export_history_ad_id ON export_history(ad_id);
CREATE INDEX idx_export_history_user_id ON export_history(user_id);
```

## Relationships

```
users (1) ──→ (many) ads
users (1) ──→ (many) credit_transactions
users (1) ──→ (many) generations
ads (1) ──→ (1) generations
ads (1) ──→ (many) export_history
ads (1) ──→ (many) credit_transactions
```

## Supabase Setup Script

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables in order
-- (Insert all CREATE TABLE statements above)

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_history ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own ads" ON ads
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own generations" ON generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own export history" ON export_history
  FOR SELECT USING (auth.uid() = user_id);
```

## Sample Data

```sql
-- Insert sample user
INSERT INTO users (id, email, full_name, credits, subscription_tier)
VALUES
  ('123e4567-e89b-12d3-a456-426614174000', 'demo@instantugc.com', 'Demo User', 10, 'pro');

-- Sample ad generation
INSERT INTO ads (user_id, product_name, target_audience, main_benefit, status)
VALUES
  ('123e4567-e89b-12d3-a456-426614174000', 'EcoBottle', 'Eco-conscious millennials', 'Reduce plastic waste by 90%', 'completed');
```
