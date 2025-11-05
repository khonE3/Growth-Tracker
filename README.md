# Growth Tracker 📊


https://growth-tracker-psi.vercel.app/


<img width="1352" height="886" alt="image" src="https://github.com/user-attachments/assets/d3c7d00c-da73-46e9-884a-df4586ea2a7a" />


Growth Tracker เป็นเว็บแอปพลิเคชันสำหรับติดตามการเติบโตของคุณผ่านระบบ Todo List รายวัน พร้อมปฏิทินแดชบอร์ดที่แสดงความคืบหน้าของคุณ

## ✨ ฟีเจอร์

- 📝 **Todo List รายวัน** - สร้างและจัดการรายการงานของแต่ละวัน
- 📅 **ปฏิทินแดชบอร์ด** - มองเห็นภาพรวมของงานทั้งหมดในรูปแบบปฏิทิน
- ✅ **CRUD Operations** - สร้าง อ่าน แก้ไข และลบรายการได้อย่างสมบูรณ์
- 💾 **Supabase Backend** - บันทึกข้อมูลแบบเรียลไทม์และปลอดภัย
- 📱 **Responsive Design** - รองรับการใช้งานบนมือถือและแท็บเล็ต
- 🎨 **Dark Green Hi-Tech Theme** - ธีมสีเขียวเข้มสไตล์ไฮเทค

## 🛠️ เทคโนโลยีที่ใช้

- **Vue 3** - Progressive JavaScript Framework
- **Vite** - Next Generation Frontend Tooling
- **Tailwind CSS** - Utility-First CSS Framework
- **Pinia** - State Management for Vue
- **Supabase** - Backend as a Service
- **Vue Router** - Official Router for Vue.js

## 📋 ข้อกำหนดเบื้องต้น

- Node.js (เวอร์ชัน 16 หรือสูงกว่า)
- npm หรือ yarn
- บัญชี Supabase (ฟรี)

## 🚀 การติดตั้ง

### 1. Clone โปรเจค

```bash
git clone <repository-url>
cd Growth-Tracker
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. ตั้งค่า Supabase

1. สร้างโปรเจคใหม่ที่ [Supabase](https://supabase.com)
2. สร้างตารางในฐานข้อมูล:

```sql
-- สร้างตาราง todos
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- สร้างตาราง daily_tasks (รายการประจำวันที่แสดงทุกวัน)
CREATE TABLE daily_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- สร้าง index เพื่อเพิ่มประสิทธิภาพการค้นหา
CREATE INDEX idx_todos_date ON todos(date);
CREATE INDEX idx_todos_created_at ON todos(created_at);
CREATE INDEX idx_daily_tasks_order ON daily_tasks(display_order);

-- เปิดใช้งาน Row Level Security (RLS)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;

-- สร้าง policy สำหรับการเข้าถึงข้อมูล (ตัวอย่าง: อนุญาตทุกอย่าง)
CREATE POLICY "Enable all access for todos" ON todos
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for daily_tasks" ON daily_tasks
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

3. คัดลอก Project URL และ Anon Key จาก Settings > API

### 4. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` จาก `.env.example`:

```bash
copy .env.example .env
```

แก้ไขไฟล์ `.env` และใส่ค่าจาก Supabase:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. รันโปรเจค

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:5173`

## 📦 Build สำหรับ Production

```bash
npm run build
```

ไฟล์ที่ build เสร็จจะอยู่ในโฟลเดอร์ `dist/`

### Preview Build

```bash
npm run preview
```

## 🚀 Deploy ไปยัง Vercel

### วิธีที่ 1: Deploy ผ่าน Vercel Dashboard (แนะนำ)

1. **Push โค้ดขึ้น GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import Project ใน Vercel**
   - ไปที่ [vercel.com](https://vercel.com)
   - คลิก "Add New" → "Project"
   - Import repository `Growth-Tracker`
   - Framework Preset จะตรวจจับเป็น **Vite** อัตโนมัติ

3. **ตั้งค่า Environment Variables**
   
   ใน Vercel Dashboard → Settings → Environment Variables เพิ่ม:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Deploy**
   - คลิก "Deploy"
   - รอ 1-2 นาที
   - เว็บพร้อมใช้งานที่ `https://your-project.vercel.app`

### วิธีที่ 2: Deploy ผ่าน Vercel CLI

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# ตั้งค่า Environment Variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy to Production
vercel --prod
```

### Auto Deployment
เมื่อ push โค้ดใหม่:
- Branch `main` → Auto deploy to Production
- Branch อื่นๆ → Auto deploy to Preview URL

📖 **คู่มือ Deploy แบบละเอียด**: ดูได้ที่ [DEPLOY.md](./DEPLOY.md)

## 🎯 การใช้งาน

### 1. เพิ่ม Todo
- เลือกวันที่จากปฏิทิน
- พิมพ์รายการงานในช่อง input
- กดปุ่ม "เพิ่มรายการ"

### 2. แก้ไข Todo
- คลิกไอคอนดินสอที่รายการที่ต้องการแก้ไข
- แก้ไขข้อความ
- กดปุ่ม "บันทึก"

### 3. ทำเครื่องหมายว่าเสร็จสิ้น
- คลิกที่ checkbox หน้ารายการ

### 4. ลบ Todo
- คลิกไอคอนถังขยะ
- ยืนยันการลบ

## 🎨 ธีมสี

โปรเจคใช้ธีมสีเขียวเข้มสไตล์ไฮเทค:

- **Background**: เฉดสีดำเขียว (#0a0e0d)
- **Primary**: เขียวนีออน (#00ff94)
- **Accent**: เขียวเรืองแสง (#00ffaa)
- **Text**: เขียวอ่อน (#c2fff0)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 ความปลอดภัย

- ใช้ Environment Variables สำหรับข้อมูลสำคัญ
- ไม่ commit ไฟล์ `.env` ลง Git
- ใช้ Row Level Security (RLS) ของ Supabase

## 🤝 การมีส่วนร่วม

ยินดีรับ Pull Requests! สำหรับการเปลี่ยนแปลงครั้งใหญ่ กรุณาเปิด Issue ก่อน

## 📄 License

MIT License

## 👨‍💻 ผู้พัฒนา

สร้างด้วย ❤️ โดยใช้ Vue 3 + Tailwind CSS + Supabase

## 🆘 การแก้ปัญหา

### ไม่สามารถเชื่อมต่อ Supabase
- ตรวจสอบว่า `.env` มีค่าที่ถูกต้อง
- ตรวจสอบว่า Supabase project ยังใช้งานได้
- ตรวจสอบ network connection

### Todo ไม่แสดงผล
- ตรวจสอบ Console สำหรับ errors
- ตรวจสอบว่าตาราง `todos` มีอยู่ใน Supabase
- ตรวจสอบ RLS policies

### Styling ไม่แสดงผล
- ลองรัน `npm install` ใหม่
- ล้าง cache: `npm run dev -- --force`
- ตรวจสอบว่า Tailwind config ถูกต้อง

## 📞 ติดต่อ

หากมีคำถามหรือข้อเสนอแนะ กรุณาติดต่อผ่าน Issues ในโปรเจค
