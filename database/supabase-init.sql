-- 🌸「只为你」Supabase 数据库初始化脚本
-- 在 Supabase Dashboard → SQL Editor 中执行

-- 1. 心愿表
CREATE TABLE IF NOT EXISTS wishes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author        VARCHAR(10) NOT NULL,
  title         VARCHAR(100) NOT NULL,
  category      VARCHAR(10) NOT NULL,
  description   TEXT,
  desired_at    DATE,
  urgency       SMALLINT DEFAULT 3,
  note          TEXT,
  status        VARCHAR(15) DEFAULT 'pending',
  reply_msg     TEXT,
  confirm_time  DATE,
  done_msg      TEXT,
  done_at       TIMESTAMP,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- 2. 想念记录表
CREATE TABLE IF NOT EXISTS miss_records (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author        VARCHAR(10) NOT NULL,
  level         SMALLINT DEFAULT 5,
  message       TEXT,
  image         TEXT,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- 3. 索引
CREATE INDEX IF NOT EXISTS idx_wishes_author ON wishes(author);
CREATE INDEX IF NOT EXISTS idx_wishes_status ON wishes(status);
CREATE INDEX IF NOT EXISTS idx_wishes_created ON wishes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_miss_author ON miss_records(author);
CREATE INDEX IF NOT EXISTS idx_miss_created ON miss_records(created_at DESC);

-- 4. 关闭 RLS（两人用的私密项目，不需要严格权限）
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE miss_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all wishes" ON wishes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all miss" ON miss_records FOR ALL USING (true) WITH CHECK (true);

-- 5. 自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wishes_updated_at
  BEFORE UPDATE ON wishes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
