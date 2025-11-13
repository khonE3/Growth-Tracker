-- ===================================
-- Growth Tracker Database Schema with Authentication
-- ===================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================
-- 1. TODOS TABLE (รองรับทั้ง Guest และ User mode)
-- ===================================
DROP TABLE IF EXISTS todos CASCADE;
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  is_guest BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index สำหรับ performance
CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_date ON todos(date);
CREATE INDEX idx_todos_is_guest ON todos(is_guest);
CREATE INDEX idx_todos_created_at ON todos(created_at);

-- ===================================
-- 2. DAILY TASKS TABLE (รายการประจำวันที่แสดงทุกวัน)
-- ===================================
DROP TABLE IF EXISTS daily_tasks CASCADE;
CREATE TABLE daily_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_guest BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index
CREATE INDEX idx_daily_tasks_user_id ON daily_tasks(user_id);
CREATE INDEX idx_daily_tasks_order ON daily_tasks(display_order);
CREATE INDEX idx_daily_tasks_is_guest ON daily_tasks(is_guest);

-- ===================================
-- 3. USER PROFILES TABLE (ข้อมูลเพิ่มเติมของ user)
-- ===================================
DROP TABLE IF EXISTS user_profiles CASCADE;
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'Asia/Bangkok',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ===================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================

-- Enable RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ===================================
-- TODOS POLICIES
-- ===================================

-- Guest Mode: อ่านได้ทุกคน (แต่เฉพาะ is_guest = true)
CREATE POLICY "Anyone can read guest todos"
  ON todos FOR SELECT
  USING (is_guest = true);

-- Guest Mode: สร้างได้ทุกคน (แต่ต้อง is_guest = true และ user_id = null)
CREATE POLICY "Anyone can create guest todos"
  ON todos FOR INSERT
  WITH CHECK (is_guest = true AND user_id IS NULL);

-- Guest Mode: แก้ไขได้ทุกคน (แต่เฉพาะ is_guest = true)
CREATE POLICY "Anyone can update guest todos"
  ON todos FOR UPDATE
  USING (is_guest = true)
  WITH CHECK (is_guest = true);

-- Guest Mode: ลบได้ทุกคน (แต่เฉพาะ is_guest = true)
CREATE POLICY "Anyone can delete guest todos"
  ON todos FOR DELETE
  USING (is_guest = true);

-- User Mode: อ่านได้เฉพาะของตัวเอง
CREATE POLICY "Users can read own todos"
  ON todos FOR SELECT
  USING (auth.uid() = user_id AND is_guest = false);

-- User Mode: สร้างได้เฉพาะของตัวเอง
CREATE POLICY "Users can create own todos"
  ON todos FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_guest = false);

-- User Mode: แก้ไขได้เฉพาะของตัวเอง
CREATE POLICY "Users can update own todos"
  ON todos FOR UPDATE
  USING (auth.uid() = user_id AND is_guest = false)
  WITH CHECK (auth.uid() = user_id AND is_guest = false);

-- User Mode: ลบได้เฉพาะของตัวเอง
CREATE POLICY "Users can delete own todos"
  ON todos FOR DELETE
  USING (auth.uid() = user_id AND is_guest = false);

-- ===================================
-- DAILY TASKS POLICIES
-- ===================================

-- Guest Mode Policies
CREATE POLICY "Anyone can read guest daily tasks"
  ON daily_tasks FOR SELECT
  USING (is_guest = true);

CREATE POLICY "Anyone can create guest daily tasks"
  ON daily_tasks FOR INSERT
  WITH CHECK (is_guest = true AND user_id IS NULL);

CREATE POLICY "Anyone can update guest daily tasks"
  ON daily_tasks FOR UPDATE
  USING (is_guest = true)
  WITH CHECK (is_guest = true);

CREATE POLICY "Anyone can delete guest daily tasks"
  ON daily_tasks FOR DELETE
  USING (is_guest = true);

-- User Mode Policies
CREATE POLICY "Users can read own daily tasks"
  ON daily_tasks FOR SELECT
  USING (auth.uid() = user_id AND is_guest = false);

CREATE POLICY "Users can create own daily tasks"
  ON daily_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_guest = false);

CREATE POLICY "Users can update own daily tasks"
  ON daily_tasks FOR UPDATE
  USING (auth.uid() = user_id AND is_guest = false)
  WITH CHECK (auth.uid() = user_id AND is_guest = false);

CREATE POLICY "Users can delete own daily tasks"
  ON daily_tasks FOR DELETE
  USING (auth.uid() = user_id AND is_guest = false);

-- ===================================
-- USER PROFILES POLICIES
-- ===================================

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ===================================
-- 5. FUNCTIONS & TRIGGERS
-- ===================================

-- Function: อัพเดท updated_at อัตโนมัติ
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers สำหรับ updated_at
DROP TRIGGER IF EXISTS update_todos_updated_at ON todos;
CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_daily_tasks_updated_at ON daily_tasks;
CREATE TRIGGER update_daily_tasks_updated_at
  BEFORE UPDATE ON daily_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: สร้าง user profile อัตโนมัติเมื่อ sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: สร้าง profile เมื่อมี user ใหม่
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ===================================
-- 6. SAMPLE DATA (Guest Mode)
-- ===================================

-- ตัวอย่างข้อมูล Guest Todos
INSERT INTO todos (title, date, is_guest, completed) VALUES
  ('Welcome to Growth Tracker! 🎉', CURRENT_DATE, true, false),
  ('Try adding your first task', CURRENT_DATE, true, false),
  ('Complete this task to see progress', CURRENT_DATE, true, false)
ON CONFLICT DO NOTHING;

-- ตัวอย่างข้อมูล Guest Daily Tasks
INSERT INTO daily_tasks (title, display_order, is_guest, completed) VALUES
  ('Morning Exercise 🏃', 1, true, false),
  ('Drink 8 glasses of water 💧', 2, true, false),
  ('Read for 30 minutes 📚', 3, true, false),
  ('Review daily goals 🎯', 4, true, false)
ON CONFLICT DO NOTHING;
