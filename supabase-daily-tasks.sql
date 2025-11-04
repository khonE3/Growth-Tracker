-- สร้างตาราง daily_tasks (รายการที่แสดงทุกวัน)
CREATE TABLE daily_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- สร้าง index
CREATE INDEX idx_daily_tasks_order ON daily_tasks(display_order);
CREATE INDEX idx_daily_tasks_created_at ON daily_tasks(created_at);

-- เปิด RLS
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;

-- สร้าง policy
CREATE POLICY "Enable all access for daily_tasks" ON daily_tasks
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- เพิ่มข้อมูลตัวอย่าง (optional)
INSERT INTO daily_tasks (title, display_order) VALUES
  ('ดื่มน้ำ 8 แก้ว', 1),
  ('ออกกำลังกาย 30 นาที', 2),
  ('อ่านหนังสือ', 3);
