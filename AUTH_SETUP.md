# 🚀 Quick Start - Authentication System

## ✅ ไฟล์ที่สร้างแล้ว

1. **`supabase-schema.sql`** - Database schema พร้อม RLS policies
2. **`src/stores/authStore.js`** - Auth state management
3. **`src/components/AuthModal.vue`** - Sign In/Sign Up modal
4. **`src/stores/todoStore.js`** - อัพเดทให้รองรับ Guest/User mode
5. **`src/stores/dailyTaskStore.js`** - อัพเดทให้รองรับ Guest/User mode
6. **`src/views/Dashboard.vue`** - เพิ่ม Auth UI และ User menu
7. **`AUTH_GUIDE.md`** - คู่มือการใช้งานแบบละเอียด

## 📋 ขั้นตอนติดตั้ง (3 ขั้นตอนง่ายๆ)

### 1️⃣ อัพเดท Database

```bash
# 1. ไปที่ Supabase Dashboard
# 2. เปิด SQL Editor
# 3. Copy ไฟล์ supabase-schema.sql ทั้งหมด
# 4. Paste และกด RUN
```

### 2️⃣ ตรวจสอบ Environment Variables

ตรวจสอบว่าไฟล์ `.env` มี:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3️⃣ รันโปรเจค

```bash
npm run dev
```

## 🎮 ทดสอบระบบ

### ทดสอบ Guest Mode ✅
1. เข้าเว็บ → ดูข้อมูล Sample
2. สร้าง Todo → บันทึกได้
3. Refresh → ข้อมูลยังอยู่

### ทดสอบ User Mode ✅
1. คลิกไอคอน User (มุมซ้ายบน)
2. คลิก "Sign In / Sign Up"
3. Sign Up ด้วย Email
4. Sign In
5. สร้าง Todo → เป็นข้อมูลส่วนตัว

### ทดสอบการแยกข้อมูล ✅
1. Sign Up User A → สร้าง Todo
2. Sign Out
3. Sign Up User B → ไม่เห็น Todo ของ User A ✅

## 🎨 UI Features

### User Menu (มุมซ้ายบน)
- แสดงสถานะ Guest/User
- แสดงชื่อและอีเมล
- ปุ่ม Sign In/Sign Up (สำหรับ Guest)
- ปุ่ม Sign Out (สำหรับ User)
- Mode Indicator (🌐 Shared / 🔒 Personal)

### Auth Modal
- Tab: Sign In / Sign Up
- Input: Email, Password, Full Name
- Button: Continue as Guest
- Error/Success Messages
- Responsive Design

## 📊 Database Schema

### Tables
- ✅ `todos` - รองรับ Guest และ User
- ✅ `daily_tasks` - รองรับ Guest และ User
- ✅ `user_profiles` - โปรไฟล์ผู้ใช้

### Fields ที่เพิ่ม
- `user_id` - FK to auth.users
- `is_guest` - Boolean (true/false)
- `updated_at` - Auto timestamp

### RLS Policies
- Guest: อ่าน/เขียน WHERE is_guest = true
- User: อ่าน/เขียน WHERE user_id = auth.uid() AND is_guest = false

## 🔄 Data Flow

```
Guest Mode:
เข้าเว็บ → isGuest = true → ดึงข้อมูล is_guest = true → แสดงข้อมูล Global

User Mode:
Sign In → isGuest = false → ดึงข้อมูล user_id = current user → แสดงข้อมูลส่วนตัว

Sign Out:
isGuest = true → ดึงข้อมูล is_guest = true → กลับเป็น Guest Mode
```

## 🔒 ความปลอดภัย

- ✅ Row Level Security (RLS) enabled
- ✅ Guest ไม่สามารถแก้ไขข้อมูล User
- ✅ User A ไม่สามารถแก้ไขข้อมูล User B
- ✅ Policies ใช้ `auth.uid()` ตรวจสอบ
- ✅ Auto profile creation ด้วย Trigger

## 🎯 Features

### Guest Mode
- ✅ ใช้งานได้ทันทีโดยไม่ต้อง Sign Up
- ✅ ข้อมูล Sample พร้อมใช้
- ✅ แชร์ข้อมูลกับผู้ใช้คนอื่น

### User Mode
- ✅ ข้อมูลส่วนตัวของแต่ละคน
- ✅ ปลอดภัยด้วย Authentication
- ✅ Auto save และ sync
- ✅ Profile management

## 🐛 Troubleshooting

### ปัญหา: RLS Error
```sql
-- ตรวจสอบ policies
SELECT * FROM pg_policies WHERE tablename = 'todos';

-- รัน schema ใหม่
-- Copy supabase-schema.sql → Run ใน SQL Editor
```

### ปัญหา: Guest Data ไม่แสดง
```sql
-- Insert sample data
INSERT INTO todos (title, date, is_guest, completed) VALUES
  ('Welcome! 🎉', CURRENT_DATE, true, false);
```

### ปัญหา: User Data ไม่แสดง
```javascript
// ตรวจสอบใน Dashboard.vue onMounted
await authStore.initialize() // ต้องมี
await todoStore.fetchTodos() // ต้องมี
```

## 📚 เอกสารเพิ่มเติม

- 📖 **[AUTH_GUIDE.md](./AUTH_GUIDE.md)** - คู่มือแบบละเอียด
- 📖 **[DEPLOY.md](./DEPLOY.md)** - การ Deploy
- 📖 **[README.md](./README.md)** - ภาพรวมโปรเจค

## ✨ สรุป

ระบบ Auth ของคุณพร้อมแล้ว! 🎉

**สิ่งที่ได้:**
- ✅ Guest Mode (Global Data)
- ✅ User Mode (Personal Data)
- ✅ Sign Up / Sign In / Sign Out
- ✅ Row Level Security
- ✅ Beautiful UI
- ✅ Data Isolation

**Next Steps:**
1. Deploy to Vercel
2. Enable Email Confirmation ใน Supabase
3. Customize Email Templates
4. Add Password Reset Feature (optional)
5. Add OAuth Providers (optional)

**Happy Coding! 🚀**
