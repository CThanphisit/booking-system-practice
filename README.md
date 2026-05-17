# 🏨 Booking System Practice

โปรเจกนี้เป็นส่วนหนึ่งของ portfolio ส่วนตัว สร้างขึ้นเพื่อพัฒนาทักษะ **Fullstack Development** โดยเฉพาะฝั่ง Backend

ผมทำงานเป็น Frontend Developer มา 2 ปี จึงตัดสินใจใช้ AI ช่วยในส่วน UI/Frontend เพื่อเปิดพื้นที่ให้ตัวเองได้โฟกัสกับการเรียนรู้ **NestJS, Prisma, PostgreSQL** และ Backend Architecture อย่างจริงจัง

---

## ✨ Live Demo

> ⚠️ Backend รันบน Render (Free Tier) อาจมี **cold start ~1–2 นาที** ในการโหลดครั้งแรก

**[👉 เปิดดูได้เลย](https://booking-system-practice-alvy.vercel.app)**

---

## 🎯 สิ่งที่อยากเรียนรู้จากโปรเจกนี้

- ออกแบบ **REST API** ด้วย NestJS — module, service, controller, guard
- ใช้ **Prisma ORM** กับ PostgreSQL จริง ๆ ครั้งแรก
- ทำ **Authentication** ด้วย JWT + Cookie แบบ Stateless
- จัดการ **Role-based access** (User / Admin) ทั้ง Backend และ Frontend
- เรียนรู้ deployment pipeline จริง (Render + Neon + Vercel)

---

## 🛠️ Tech Stack

### Backend (จุดโฟกัสหลัก)

| Technology            | บทบาท                            |
| --------------------- | -------------------------------- |
| **NestJS**            | Framework หลัก                   |
| **Prisma**            | ORM สำหรับ query PostgreSQL      |
| **PostgreSQL (Neon)** | Serverless database              |
| **JWT + Cookie**      | Authentication                   |
| **Cloudinary**        | จัดเก็บรูปห้องพักและสลิปชำระเงิน |

### Frontend (ใช้ AI ช่วย)

| Technology                      | บทบาท                        |
| ------------------------------- | ---------------------------- |
| **Next.js 16**                  | React framework              |
| **Tailwind CSS v4 + shadcn/ui** | UI components                |
| **React Hook Form + Zod**       | Form validation              |
| **Recharts**                    | Chart สำหรับ Admin dashboard |

---

## 📦 Features

### สำหรับผู้ใช้งานทั่วไป

- สมัครสมาชิก / เข้าสู่ระบบ
- ค้นหาและกรองห้องพักตามวันที่, ประเภท, ราคา, จำนวนผู้เข้าพัก
- จองห้องและอัปโหลดสลิปชำระเงิน
- ดูประวัติการจองและสถานะแบบ real-time
- ยกเลิกการจองและแก้ไขโปรไฟล์

### สำหรับ Admin

- Dashboard พร้อม Revenue Chart และ Room Type Chart
- จัดการห้องพักครบวงจร (CRUD + อัปโหลดรูปผ่าน Cloudinary)
- ตรวจสอบและอนุมัติ/ปฏิเสธสลิปชำระเงิน
- จัดการผู้ใช้งานและการจองทั้งหมด

---

## 🔄 Booking Flow

```
จอง → PENDING → (อัปโหลดสลิป) → WAITING_REVIEW
                                      ↓
                              Admin ตรวจสอบ
                           ↙              ↘
                      APPROVED          REJECTED
                          ↓
                     CONFIRMED → CHECKED_IN → COMPLETED
```

---

## 🏗️ Architecture

```
Browser
  └── Next.js Frontend  (Vercel)
        ├── /api/proxy/[...path]   ← ทุก request วิ่งผ่านตรงนี้
        └── middleware.ts           ← ตรวจสอบ role ก่อน render
              └── NestJS API  (Render)
                    ├── PostgreSQL  (Neon)
                    └── Cloudinary
```

Frontend ไม่เรียก Backend โดยตรง — ทุก API call ผ่าน proxy route เพื่อให้ cookie ถูก forward อย่างถูกต้อง

### Route Access

| Path                                         | สิทธิ์               |
| -------------------------------------------- | -------------------- |
| `/`, `/rooms/*`, `/login`, `/register`       | ทุกคน                |
| `/dashboard`, `/booking/*`, `/my-bookings/*` | ผู้ใช้ที่ login แล้ว |
| `/admin/*`                                   | Admin เท่านั้น       |

---

## 🚀 Local Development

### Prerequisites

- Node.js 18+
- pnpm

### Setup

```bash
git clone <repo-url>
cd booking-system-practice
pnpm install
```

สร้างไฟล์ `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/
API_URL=http://localhost:3001
```

```bash
pnpm dev    # port 3000
```

> Backend ต้องรันแยกบน port 3001

---

## ☁️ Deployment

| ส่วน     | Platform   | หมายเหตุ                    |
| -------- | ---------- | --------------------------- |
| Frontend | Vercel     | Auto-deploy จาก main        |
| Backend  | Render     | Free tier — มี cold start   |
| Database | Neon       | Serverless PostgreSQL       |
| Images   | Cloudinary | Room images + payment slips |

---

## 📁 Project Structure

```
├── app/
│   ├── admin/          # Admin pages
│   ├── api/proxy/      # Catch-all API proxy
│   ├── booking/        # Booking flow
│   ├── components/     # Feature components
│   ├── context/        # AuthContext
│   ├── my-bookings/    # Booking history
│   ├── profile/        # User profile
│   ├── rooms/          # Room listing & detail
│   └── schemas/        # Zod validation
├── components/         # shadcn/ui primitives
├── types/              # Shared TypeScript types
└── middleware.ts       # Route protection
```
