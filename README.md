# 🎙️ Trading Order System: An Architectural Deep Dive

> **Technical Interview Context**: This project is structured not just as a solution to a challenge, but as a demonstration of high-level architectural decisions, clean code principles, and production-ready enterprise standards.

---

## 🏛️ Architectural Vision & Design Decisions

### 1. The Monorepo Choice (pnpm Workspaces)
**Question: Why a Monorepo for a single-service challenge?**
**Answer**: Scale and shared context. Using **pnpm workspaces**, we've created a environment where the `apps/api` (Backend) and `apps/web` (Frontend) coexist under a single source of truth.
-   **Strict Type Sharing**: Although currently separate, the architecture is primed to move DTOs and Interfaces into `packages/shared`, ensuring that a change in the backend schema instantly surfaces as a type-check error in the frontend.
-   **Orchestration**: A single `pnpm dev` command manages both development servers, significantly reducing developer friction.

### 2. Backend: NestJS & Scalable Modularity
**Question: Why NestJS over a simple Express setup?**
**Answer**: NestJS provides a robust **out-of-the-box infrastructure** based on Angular-like concepts (Modules, Service, Controllers).
-   **Dependency Injection (DI)**: By utilizing Nest's DI container, we ensure that our `TradeOrdersService` is easily mockable for unit testing, adhering to the **Dependency Inversion** principle.
-   **Decorator-Driven Development**: We leverage decorators for everything from API documentation (Swagger) to Request Validation (`class-validator`), which keeps the business logic clean from boilerplate validation code.

### 3. Frontend: Next.js (App Router) & SSR
**Question: What was the strategy for the Frontend?**
**Answer**: We chose **Next.js** to leverage its hybrid nature.
-   **Server Components & Actions**: We use Server Actions for data mutations (Create, Delete). This allows us to keep sensitive logic on the server while updating the UI without complex client-side state management (like Redux).
-   **SEO & Speed**: Server-Side Rendering (SSR) ensures that the initial list of trades is delivered to the client as plain HTML, improving Time-to-Interactive.
-   **User Experience (UX)**: We implemented a "Silk" theme using **DaisyUI** and **Glassmorphism** effects to deliver a premium, modern feel that moves beyond basic MVPs.

---

## 💎 Core Engineering Principles

### 🧱 SOLID Application
1.  **S (Single Responsibility)**:
    -   `Controllers`: Handle HTTP routing and input mapping.
    -   `Services`: Contain the pure domain business logic (e.g., price validations).
    -   `Entities`: Define the data structure and database mapping.
2.  **O (Open/Closed)**: The validation engine in `TradeOrdersService` is designed to be easily extendable. Adding a new currency pair or a new order type doesn't require rewriting the core logic; you simply extend the constants and validation rules.
3.  **L (Liskov Substitution)**: We use an abstract `BaseEntity` which all entities inherit from. This guarantees that all entities share common audit fields (`id`, `created_at`, `deleted_at`) consistently.
4.  **D (Dependency Inversion)**: High-level modules do not depend on low-level database details; they depend on abstractions (Repository pattern provided by TypeORM).

### 🏷️ Domain-Driven Design (DDD) Lite
While we didn't go for a full tactical DDD, we applied several concepts:
-   **Rich Service Layer**: The `TradeOrdersService` acts as the guardian of the domain rules, preventing the creation of invalid trade states.
-   **Ubiquitous Language**: Terminology like "Side" (Buy/Sell), "Type" (Limit/Market/Stop), and "Pair" (BTCUSD) is consistent from the database schema up to the UI labels.

---

## 🛠️ Feature Spotlight

### 📉 Complex Validation Engine
Validated strictly against current market prices:
-   **Limit Orders**: Buy below market, Sell above market.
-   **Stop Orders**: Buy above market, Sell below market.
-   **Market Orders**: Instant execution with no price validation required.

### ♻️ Audit-Compliant Soft Delete
Instead of hard deleting data, we use TypeORM's `@DeleteDateColumn`. 
-   **Why?**: In financial systems, auditing is critical. We never lose history.
-   **UX Integration**: In the frontend, deleted orders remain visible with an `opacity-50` and a **DELETED** badge, allowing admins to see the full history of activity.

### 📜 Interactive Docs (Swagger)
Found at `/api/docs`, the Swagger integration provides a Sandbox where developers can:
-   Visualize the entire API surface.
-   See DTO schemas.
-   Perform real requests and see responses in real-time.

---

## 🧪 Quality & Verification

-   **Unit Testing**: Comprehensive Jest tests for the `TradeOrdersService` ensure that edge cases (invalid amounts, wrong price directions) are caught automatically.
-   **Type Safety**: TypeScript is enforced strictly across both apps to prevent runtime "undefined" errors (as seen in our debug session).

---

## 🚀 Setup Instructions

1.  **Prerequisites**: Node.js 20+, pnpm v8+, MySQL.
2.  **Install**: `pnpm install`
3.  **Database**: The API automatically creates the database if it doesn't exist based on your `.env` credentials in `apps/api`.
4.  **Run**: `pnpm dev`

---

**Max Shtefec** - *Software Architect / Full Stack Developer*
[GitHub](https://github.com/maxshdev) | [LinkedIn](https://linkedin.com/in/maxshtefec)