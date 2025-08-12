-- AI 运势预测应用数据库表创建脚本

-- 创建用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    birth_date DATE,
    birth_time TIME,
    zodiac_sign VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户表索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_zodiac ON users(zodiac_sign);

-- 创建运势记录表
CREATE TABLE fortune_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    time_range VARCHAR(20) NOT NULL CHECK (time_range IN ('daily', 'weekly', 'monthly')),
    fortune_type VARCHAR(20) NOT NULL CHECK (fortune_type IN ('general', 'love', 'career', 'wealth', 'health')),
    content TEXT NOT NULL,
    user_info JSONB,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建运势记录表索引
CREATE INDEX idx_fortune_records_user_id ON fortune_records(user_id);
CREATE INDEX idx_fortune_records_created_at ON fortune_records(created_at DESC);
CREATE INDEX idx_fortune_records_type ON fortune_records(fortune_type);
CREATE INDEX idx_fortune_records_favorite ON fortune_records(is_favorite) WHERE is_favorite = TRUE;

-- 创建用户偏好表
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    default_time_range VARCHAR(20) DEFAULT 'daily',
    default_fortune_type VARCHAR(20) DEFAULT 'general',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    theme VARCHAR(20) DEFAULT 'light',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户偏好表索引
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- 创建收藏记录表
CREATE TABLE favorite_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    fortune_record_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, fortune_record_id)
);

-- 创建收藏记录表索引
CREATE INDEX idx_favorite_records_user_id ON favorite_records(user_id);
CREATE INDEX idx_favorite_records_fortune_id ON favorite_records(fortune_record_id);

-- 启用行级安全策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE fortune_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_records ENABLE ROW LEVEL SECURITY;

-- 创建用户表的 RLS 策略
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- 创建运势记录表的 RLS 策略
CREATE POLICY "Users can view own fortune records" ON fortune_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fortune records" ON fortune_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fortune records" ON fortune_records
    FOR UPDATE USING (auth.uid() = user_id);

-- 创建用户偏好表的 RLS 策略
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- 创建收藏记录表的 RLS 策略
CREATE POLICY "Users can view own favorites" ON favorite_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON favorite_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorite_records
    FOR DELETE USING (auth.uid() = user_id);

-- 为匿名用户授予基本读取权限
GRANT SELECT ON users TO anon;
GRANT SELECT ON fortune_records TO anon;

-- 为认证用户授予完整权限
GRANT ALL PRIVILEGES ON users TO authenticated;
GRANT ALL PRIVILEGES ON fortune_records TO authenticated;
GRANT ALL PRIVILEGES ON user_preferences TO authenticated;
GRANT ALL PRIVILEGES ON favorite_records TO authenticated;