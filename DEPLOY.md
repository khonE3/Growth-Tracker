# 🚀 Deploy Growth Tracker ไปยัง Vercel

## ขั้นตอนการ Deploy

### 1. เตรียม Supabase
ตรวจสอบว่าคุณมี:
- Supabase Project URL
- Supabase Anon Key

หาได้จาก: Supabase Dashboard → Project Settings → API

### 2. Deploy ผ่าน Vercel Dashboard

#### ขั้นตอนที่ 1: Import Project
1. ไปที่ [https://vercel.com](https://vercel.com)
2. คลิก "Add New" → "Project"
3. Import repository `Growth-Tracker`
4. เลือก Framework Preset: **Vite**

#### ขั้นตอนที่ 2: ตั้งค่า Environment Variables
ใน Vercel Dashboard, เพิ่ม Environment Variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### ขั้นตอนที่ 3: Deploy
1. คลิก "Deploy"
2. รอ build process เสร็จ (ประมาณ 1-2 นาที)
3. เว็บจะ deploy ที่ URL: `https://your-project.vercel.app`

### 3. Deploy ผ่าน Vercel CLI (ทางเลือก)

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

# Deploy production
vercel --prod
```

## Build Settings (อัตโนมัติ)

Vercel จะใช้การตั้งค่าจาก `vercel.json`:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite

## การอัปเดต

เมื่อ push code ใหม่ไปที่ GitHub:
- Branch `main` → Auto deploy to Production
- Branch อื่นๆ → Auto deploy to Preview

## ตรวจสอบการ Deploy

### สิ่งที่ต้องทำงาน:
✅ หน้าเว็บโหลดได้
✅ Background animations ทำงาน
✅ Calendar แสดงผล
✅ เพิ่ม/ลบ Todo ได้ (ต้องมี Supabase ENV vars)
✅ Daily Tasks ทำงาน

### ถ้ามีปัญหา:
1. ตรวจสอบ Build Logs ใน Vercel Dashboard
2. ตรวจสอบ Environment Variables ถูกต้อง
3. ตรวจสอบ Supabase RLS policies

## Domain ของคุณเอง (ทางเลือก)

1. ไปที่ Project Settings → Domains
2. เพิ่ม custom domain ของคุณ
3. ตั้งค่า DNS ตามที่ Vercel แนะนำ

## เสร็จสิ้น! 🎉

เว็บของคุณจะพร้อมใช้งานที่:
- Production: `https://your-project.vercel.app`
- Preview: `https://your-project-xxx.vercel.app` (สำหรับ PR)
