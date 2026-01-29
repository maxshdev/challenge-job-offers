# 🚀 Jobberwocky: Enterprise Job Board Challenge

> **Technical Interview Context**: This project is a comprehensive solution to the "Jobberwocky" challenge. It demonstrates advanced architectural decisions, clean code (SOLID), and professional enterprise standards, including features far beyond the initial requirements.

---

## 🏛️ Architectural Overview

This project is built as a **Monorepo** using **pnpm workspaces**, ensuring a unified developer experience and shared context.

### 1. The Stack
- **Backend**: NestJS (Node.js framework) for a modular, scalable, and maintainable API.
- **Frontend**: Next.js (App Router) with SSR for a high-performance, SEO-friendly user interface.
- **Database**: 
  - **Main**: MySQL (Standard production setup).
  - **Portable**: SQLite version (`apps/api-sqlite`) for zero-config demonstrations.
- **Styling**: Tailwind CSS + DaisyUI for a premium, modern "Silk" aesthetic.

---

## ✅ Challenge Requirements vs. Implementation

| Requirement | Status | Implementation Detail |
| :--- | :---: | :--- |
| **1. Job Posting Service** | ✅ | REST API to register new job opportunities. |
| **2. Job Searching Service** | ✅ | Internal search endpoint for registered jobs. |
| **3. External Sources** | ✅ | Consumption and normalization of `jobberwocky-extra-source-v2`. |
| **4. Job Alerts (Optional)** | ✅ | Email subscription service with keyword filtering. |
| **No External DB Required** | ✅ | While we use MySQL/SQLite, it's designed for easy setup. |
| **No Auth Required** | ✅ | **Bonus**: Implemented a full Auth system (see below). |

---

## 💎 The "Plus" Features (Beyond the Challenge)

While the challenge was focused on basic API functionality, I've implemented several enterprise-grade features to demonstrate a production-ready mindset:

### 1. Full Authentication & Roles
- **JWT Security**: Secure access to protected routes.
- **Role-Based Access Control (RBAC)**: Different permissions for Admins and Candidates.
- **Session Persistence**: Persistent login state in the frontend.

### 2. Advanced Job Management
- **Job Applications**: Candidates can actually apply to jobs, not just see them.
- **User Profiles**: Detailed profiles for both candidates and recruiters.
- **Soft Deletes**: Data is never lost; Audit-compliant deletion via TypeORM.

### 3. Professional Frontend (i18n)
- **Internationalization**: Full support for English and Spanish.
- **Premium UI**: Glassmorphism effects, micro-animations, and responsive design.
- **Server Actions**: Modern data mutations using Next.js Server Actions.

### 4. Developer Experience (DX)
- **Swagger Documentation**: Interactive API testing available at `/api/docs`.
- **Portable Version**: `apps/api-sqlite` allows running the backend without a MySQL server.
- **Data Seeding**: Automatic generation of mock data for immediate testing.

---

## 🛠️ Project Structure

- `apps/api`: Main NestJS API (MySQL).
- `apps/api-sqlite`: Portable NestJS API (SQLite).
- `apps/web`: Next.js frontend.
- `apps/jobberwocky-extra-source-v2`: The local external source provided by the challenge.

---

## 🚀 Getting Started

1. **Prerequisites**: Node.js 20+, pnpm.
2. **Install Dependencies**: `pnpm install`
3. **Environment**: Copy `.env.example` to `.env` in `apps/api` and `apps/web`.
4. **Run Everything**:
   ```bash
   pnpm dev
   ```
   *This will start the API, the Frontend, and the Extra Source service simultaneously.*

---

## 📜 API Documentation

Once the server is running, visit:
- **Main API Docs**: `http://localhost:4000/api/docs`
- **SQLite API Docs**: `http://localhost:4001/api/docs` (if running)

---

**Max Shtefec** - *Software Architect / Full Stack Developer*
[GitHub](https://github.com/maxshdev) | [LinkedIn](https://linkedin.com/in/maxshtefec)