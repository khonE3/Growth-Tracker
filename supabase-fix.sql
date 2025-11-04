-- คำสั่ง SQL สำหรับ Supabase
-- คัดลอกและรันใน Supabase SQL Editor (https://supabase.com/dashboard/project/YOUR_PROJECT/sql)

-- ลบตารางเก่า (ถ้ามี)
DROP TABLE IF EXISTS todos CASCADE;

-- สร้างตาราง todos ใหม่
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- สร้าง index
CREATE INDEX idx_todos_date ON todos(date);
CREATE INDEX idx_todos_created_at ON todos(created_at);

-- เปิด RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- ลบ policy เก่าทั้งหมด
DROP POLICY IF EXISTS "Enable all access for todos" ON todos;
DROP POLICY IF EXISTS "Enable read access for all users" ON todos;
DROP POLICY IF EXISTS "Enable insert for all users" ON todos;
DROP POLICY IF EXISTS "Enable update for all users" ON todos;
DROP POLICY IF EXISTS "Enable delete for all users" ON todos;

-- สร้าง policy ใหม่ที่อนุญาตทุกอย่าง
CREATE POLICY "Enable all access for todos" ON todos
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ทดสอบ insert ข้อมูล
INSERT INTO todos (title, date, completed) 
VALUES ('Test Todo', CURRENT_DATE, false);

-- เช็คข้อมูล
SELECT * FROM todos;
