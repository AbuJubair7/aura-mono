# E-Commerce Full Stack Application

This repository contains a complete full-stack e-commerce application built to demonstrate modern web development practices. It features a robust NestJS backend with a PostgreSQL database, and a highly responsive, server-side rendered Next.js 15 frontend.

## 🏗 Architecture Overview

The application is divided into two main components:

### Backend (`/e-commerce-assignment-backend`)

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL (via TypeORM)
- **Features**:
  - Clean, modular, domain-driven design (Products, Auth, Cart, Categories).
  - High-performance database-level pagination, search, and filtering via TypeORM QueryBuilder.
  - JWT Authentication for secure, stateless user sessions.
  - Cart persistence directly in the database to ensure state synchrony across devices.
  - Swagger OpenAPI integration for endpoint documentation.

### Frontend (`/e-commerce-assignment-frontend`)

- **Framework**: Next.js 15 (App Router)
- **Styling**: CSS Modules for strict component scoping and a custom design system.
- **State Management**: Zustand (lightweight, performant global store for Auth and Cart syncing).
- **Features**:
  - **SSR & SEO**: The Product List and Detail pages are Server-Side Rendered for optimal SEO and fast initial load times.
  - **URL-Driven State**: Filters and search queries are seamlessly reflected in the URL for shareability (e.g., `?category=mens-shoes`).
  - **Infinite Scrolling**: Product grids implement `IntersectionObserver` to infinitely load paginated data.
  - **Interactivity**: Isolated Client Components (`"use client"`) are used strictly where interactivity is required (like Add To Cart buttons and Image Galleries) to keep the JavaScript bundle small.

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18+)
- Docker (for the database)

### 1. Backend & Database Setup

1. Navigate to the backend folder:
   ```bash
   cd e-commerce-assignment-backend
   ```
2. Create a `.env` file based on the environment variables needed (or use the defaults provided in the backend's README).
3. Start the PostgreSQL Database using Docker:
   ```bash
   docker-compose up -d
   ```
4. Install dependencies and run the Database Seeder to populate 50+ products:
   ```bash
   npm install
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm run start:dev
   ```
   _The backend API will run on http://localhost:5001. You can view the Swagger Docs at http://localhost:5001/api._

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd e-commerce-assignment-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   _The frontend will be accessible at http://localhost:3000._

---

## 🛑 Assumptions & Limitations

1. **Cart Persistence**: We decided to implement Cart persistence purely via the backend database rather than local storage. This requires a user to be authenticated to add items to their cart. This is a deliberate architectural choice to demonstrate secure full-stack integration and prevent stale cache bleeding across users.
2. **Database Seeding**: The seeder script acts as a one-time mock data import. After seeding, all frontend requests natively hit the PostgreSQL database via our own REST API, entirely bypassing external APIs like DummyJSON.
3. **Environment Security**: The `DB_SYNCHRONIZE=true` flag is used for rapid schema generation in development. In a true production deployment, this would be disabled and replaced with strict TypeORM migration scripts.
