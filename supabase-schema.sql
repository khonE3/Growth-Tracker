-- สร้างตาราง todos
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- สร้าง index เพื่อเพิ่มประสิทธิภาพการค้นหา
CREATE INDEX idx_todos_date ON todos(date);
CREATE INDEX idx_todos_created_at ON todos(created_at);

-- เปิดใช้งาน Row Level Security (RLS)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- สร้าง policy สำหรับการเข้าถึงข้อมูล (ตัวอย่าง: อนุญาตทุกอย่าง)
-- หมายเหตุ: ในการใช้งานจริง ควรปรับ policy ให้เหมาะสมกับความต้องการด้านความปลอดภัย
CREATE POLICY "Enable all access for todos" ON todos
  FOR ALL
  USING (true)
  WITH CHECK (true);
