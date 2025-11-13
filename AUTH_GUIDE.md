# 🔐 Authentication System Guide

## ภาพรวมของระบบ

Growth Tracker ใช้ระบบ Authentication ที่แบ่งเป็น 2 โหมด:

### 1. **Guest Mode** (โหมดผู้เยี่ยมชม)
- ข้อมูลแชร์ร่วมกัน (Global/Public Data)
- ไม่ต้องสมัครสมาชิก
- เหมาะสำหรับทดลองใช้งาน
- ข้อมูลอาจถูกแก้ไขโดยผู้ใช้คนอื่น

### 2. **User Mode** (โหมดผู้ใช้งาน)
- ข้อมูลส่วนตัว (Private Data)
- ต้อง Sign Up/Sign In
- ข้อมูลแยกเฉพาะแต่ละบัญชี
- ปลอดภัยด้วย Row Level Security (RLS)

---

## 📋 Database Schema

### Tables

#### 1. `todos` - รายการ Todo
```sql
id UUID PRIMARY KEY
user_id UUID (Foreign Key -> auth.users)
title TEXT
date DATE
completed BOOLEAN
is_guest BOOLEAN -- true = Guest Mode, false = User Mode
created_at TIMESTAMP
updated_at TIMESTAMP
```

#### 2. `daily_tasks` - รายการประจำวัน
```sql
id UUID PRIMARY KEY
user_id UUID (Foreign Key -> auth.users)
title TEXT
completed BOOLEAN
display_order INTEGER
is_guest BOOLEAN
created_at TIMESTAMP
updated_at TIMESTAMP
```

#### 3. `user_profiles` - โปรไฟล์ผู้ใช้
```sql
id UUID PRIMARY KEY (Foreign Key -> auth.users)
email TEXT
full_name TEXT
avatar_url TEXT
timezone TEXT (default: 'Asia/Bangkok')
created_at TIMESTAMP
updated_at TIMESTAMP
```

---

## 🛡️ Row Level Security (RLS) Policies

### Guest Mode Policies
```sql
-- อ่านได้ทุกคน (แต่เฉพาะ is_guest = true)
"Anyone can read guest todos"

-- สร้าง/แก้ไข/ลบ ได้ทุกคน (แต่ต้อง is_guest = true)
"Anyone can create/update/delete guest todos"
```

### User Mode Policies
```sql
-- อ่าน/สร้าง/แก้ไข/ลบ ได้เฉพาะของตัวเอง
"Users can read/create/update/delete own todos"
WHERE auth.uid() = user_id AND is_guest = false
```

---

## 🚀 การติดตั้งฐานข้อมูล

### ขั้นตอนที่ 1: ไปที่ Supabase Dashboard

1. เปิด [https://supabase.com](https://supabase.com)
2. เข้าสู่ Project ของคุณ
3. ไปที่ **SQL Editor**

### ขั้นตอนที่ 2: รัน SQL Schema

1. คัดลอกไฟล์ `supabase-schema.sql` ทั้งหมด
2. วางใน SQL Editor
3. คลิก **RUN** หรือกด `Ctrl+Enter`
4. รอจนเสร็จสิ้น (ประมาณ 10-20 วินาที)

### ขั้นตอนที่ 3: ตรวจสอบ

ใน **Table Editor** ควรเห็น:
- ✅ `todos` (พร้อม sample data)
- ✅ `daily_tasks` (พร้อม sample data)
- ✅ `user_profiles`

---

## 💻 การใช้งานใน Code

### 1. Auth Store

```javascript
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

// ตรวจสอบสถานะ
authStore.isGuest // true = Guest Mode
authStore.isAuthenticated // true = User Mode
authStore.user // user object (null ถ้า guest)
authStore.userName // ชื่อผู้ใช้

// Actions
await authStore.signUp(email, password, fullName)
await authStore.signIn(email, password)
await authStore.signOut()
authStore.continueAsGuest()
```

### 2. Todo Store (อัพเดทแล้ว)

```javascript
import { useTodoStore } from '@/stores/todoStore'

const todoStore = useTodoStore()

// Fetch จะ auto filter ตาม auth state
await todoStore.fetchTodos()
// - Guest: ดึงเฉพาะ is_guest = true
// - User: ดึงเฉพาะ user_id = current user

// Create จะ auto เพิ่ม is_guest และ user_id
await todoStore.createTodo({
  title: 'My Todo',
  date: '2025-11-13',
  completed: false
})
```

### 3. Daily Task Store (อัพเดทแล้ว)

```javascript
import { useDailyTaskStore } from '@/stores/dailyTaskStore'

const dailyTaskStore = useDailyTaskStore()

// ใช้งานเหมือน todoStore
await dailyTaskStore.fetchDailyTasks()
await dailyTaskStore.createDailyTask({ ... })
```

---

## 🎨 UI Components

### 1. AuthModal Component

```vue
<AuthModal v-if="showAuthModal" @close="showAuthModal = false" />
```

**Features:**
- Sign In / Sign Up Tabs
- Email + Password Form
- Guest Mode Button
- Error/Success Messages
- Responsive Design

### 2. User Menu (ใน Dashboard)

**Features:**
- แสดงสถานะ Guest/User
- แสดงชื่อและอีเมล
- ปุ่ม Sign In/Sign Up (สำหรับ Guest)
- ปุ่ม Sign Out (สำหรับ User)
- Mode Indicator

---

## 🔄 Data Flow

### Guest Mode Flow
```
1. User เข้าเว็บครั้งแรก
2. authStore.isGuest = true
3. Fetch data WHERE is_guest = true
4. แสดงข้อมูล Global/Shared
5. Create/Update/Delete ไปที่ rows ที่ is_guest = true
```

### User Mode Flow
```
1. User Sign Up หรือ Sign In
2. authStore.isGuest = false
3. authStore.user = { id, email, ... }
4. Fetch data WHERE user_id = current user AND is_guest = false
5. แสดงข้อมูลส่วนตัว
6. Create/Update/Delete ไปที่ rows ที่ user_id = current user
```

### Sign Out Flow
```
1. User คลิก Sign Out
2. authStore.signOut()
3. authStore.isGuest = true
4. Re-fetch data (กลับเป็น Guest data)
5. UI อัพเดทเป็น Guest Mode
```

---

## 🧪 การทดสอบ

### ทดสอบ Guest Mode

1. เข้าเว็บโดยไม่ Sign In
2. ลองสร้าง Todo
3. Refresh หน้าเว็บ → ข้อมูลยังอยู่
4. เปิดเว็บใน Incognito → เห็นข้อมูลเดียวกัน ✅

### ทดสอบ User Mode

1. Sign Up ด้วยอีเมลใหม่
2. Sign In
3. สร้าง Todo → ข้อมูลของตัวเอง
4. Sign Out → เห็นข้อมูล Guest
5. Sign In อีกครั้ง → เห็นข้อมูลตัวเองกลับมา ✅

### ทดสอบการแยกข้อมูล

1. Sign Up User A → สร้าง Todo "A's Task"
2. Sign Out
3. Sign Up User B → สร้าง Todo "B's Task"
4. User B ไม่เห็น "A's Task" ✅
5. Sign In เป็น User A → เห็นเฉพาะ "A's Task" ✅

---

## 🔒 ความปลอดภัย

### RLS Policies

- ✅ Guest ไม่สามารถแก้ไขข้อมูล User
- ✅ User A ไม่สามารถแก้ไขข้อมูล User B
- ✅ User ต้อง authenticate ก่อนเข้าถึงข้อมูลส่วนตัว

### Best Practices

1. **อย่า** ปิด RLS (`ENABLE ROW LEVEL SECURITY`)
2. **อย่า** ใช้ policy `USING (true)` ใน production
3. **ควร** ใช้ `auth.uid()` ใน policies
4. **ควร** validate input ทั้ง frontend และ backend
5. **ควร** ใช้ HTTPS (Vercel มีให้ฟรี)

---

## 📱 User Experience

### First Visit
```
1. Intro Animation (2.5s)
2. แสดง Guest Mode
3. แสดง Guest Data (Sample)
4. User สามารถใช้งานได้ทันที
```

### Sign Up Flow
```
1. คลิกไอคอน User (มุมซ้ายบน)
2. คลิก "Sign In / Sign Up"
3. เลือก Tab "Sign Up"
4. กรอก Email, Password, Full Name
5. กด "Create Account"
6. ตรวจสอบ Email → คลิก Verify
7. Sign In → เห็นหน้าจอว่างเปล่า (ข้อมูลใหม่)
```

### Migration Flow (Guest → User)
```
⚠️ หมายเหตุ: ข้อมูล Guest จะไม่ย้ายมาที่ User Account
เพราะเป็นคนละ context

ถ้าต้องการ migrate data:
1. Export Guest data (feature ที่ต้องทำเอง)
2. Sign Up
3. Import data เข้า User account
```

---

## 🐛 Troubleshooting

### ปัญหา: "Row Level Security" Error

**สาเหตุ:** Policy ไม่ถูกต้องหรือไม่ครบ

**แก้ไข:**
```sql
-- ตรวจสอบ policies
SELECT * FROM pg_policies WHERE tablename = 'todos';

-- ลบ policies เก่า
DROP POLICY IF EXISTS "policy_name" ON todos;

-- รัน schema ใหม่ทั้งหมด
```

### ปัญหา: Guest Data ไม่แสดง

**สาเหตุ:** ไม่มี Sample Data

**แก้ไข:**
```sql
-- Insert sample data manually
INSERT INTO todos (title, date, is_guest, completed) VALUES
  ('Welcome to Growth Tracker! 🎉', CURRENT_DATE, true, false);
```

### ปัญหา: User Data ไม่แสดงหลัง Sign In

**สาเหตุ:** Store ไม่ได้ re-fetch

**แก้ไข:**
```javascript
// ใน Dashboard.vue onMounted
await authStore.initialize()
await todoStore.fetchTodos() // ต้องมี
await dailyTaskStore.fetchDailyTasks() // ต้องมี
```

---

## 📊 Database Stats (ตัวอย่าง)

```sql
-- จำนวน Todos แต่ละประเภท
SELECT 
  is_guest,
  COUNT(*) as total,
  SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed_count
FROM todos
GROUP BY is_guest;

-- Result:
-- is_guest | total | completed_count
-- true     | 150   | 45
-- false    | 300   | 180
```

---

## 🚀 Production Checklist

- [ ] รัน `supabase-schema.sql` ใน Production DB
- [ ] ตั้งค่า ENV vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] ตรวจสอบ RLS Policies ทั้งหมด
- [ ] ทดสอบ Guest Mode
- [ ] ทดสอบ User Sign Up/Sign In
- [ ] ทดสอบ Data Isolation
- [ ] ตรวจสอบ Email Confirmation Settings
- [ ] Enable Supabase Auth Email Templates
- [ ] Monitor Database Performance
- [ ] Set up Database Backups

---

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Pinia Store Docs](https://pinia.vuejs.org/)

---

## 🎉 Summary

ตอนนี้ระบบของคุณมี:
- ✅ Authentication System (Sign Up/Sign In/Sign Out)
- ✅ Guest Mode (Global Data)
- ✅ User Mode (Personal Data)
- ✅ Row Level Security
- ✅ Auto Profile Creation
- ✅ Beautiful Auth Modal
- ✅ User Menu with Mode Indicator
- ✅ Data Isolation

**Happy Coding! 🚀**
