# E-Commerce Backend API

This is the backend REST API for the E-Commerce Application, built using **NestJS**, **TypeScript**, **PostgreSQL**, and **TypeORM**.

## 🏗 Architecture Explanation
The application follows a strictly modular, domain-driven architecture designed for scalability and separation of concerns:
- **`AuthModule` & `UsersModule`**: Handles JWT-based authentication using Passport.js and `bcrypt` for secure password hashing.
- **`ProductsModule`**: Manages product data with server-side pagination, search, and category filtering executed directly at the database level via TypeORM QueryBuilder to ensure maximum performance.
- **`CategoriesModule`**: Provides dynamic category data for frontend filtering.
- **`CartModule`**: Handles all cart interactions (adding items, updating quantities, removing items) entirely on the server side to ensure persistence across sessions and devices.

**Global Configurations:**
- **Validation**: `class-validator` and `class-transformer` are used within a global `ValidationPipe` to strictly enforce DTO structures and strip malicious payloads from incoming requests.
- **Error Handling**: A global `ExceptionFilter` catches all HTTP exceptions and standardizes the error response envelope across all endpoints.
- **Documentation**: Swagger OpenAPI is integrated for automatic API documentation and testing.

## ⚙️ Environment Variables
Create a `.env` file in the root of the backend directory. You must supply the following environment variables for the application to run:

```env
PORT=5001
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_SYNCHRONIZE=true
JWT_SECRET=your_secure_jwt_secret
```
*(Note: Replace the placeholder values with your actual database credentials and secrets.)*

## 🚀 Setup Instructions

### 1. Database Setup (Docker)
This project includes a `docker-compose.yml` file to instantly spin up a local PostgreSQL database alongside the API for development.
```bash
# Start the PostgreSQL database and API containers in the background
docker-compose up -d
```
*(Note: The database is exposed on port 5433 on the host machine to avoid conflicts with any native Postgres installations).*

### 2. Install Dependencies (For Local Execution)
If you wish to run the app natively on your local machine instead of Docker:
```bash
npm install
```

### 3. Database Migrations & Seeding
To initialize the database schema and populate it with a catalog of 50+ products and their categories, run the included TypeORM seeder script:
```bash
# Execute the database migration and seeder
npm run seed
```

### 4. Running the App (Local Dev)
If running locally (outside of Docker), start the development server:
```bash
npm run start:dev
```

### 5. View API Documentation
Once the server is running (either via Docker or locally), navigate to the Swagger UI to interactively test the endpoints:
**http://localhost:5001/api/docs**

## 🛑 Assumptions & Limitations
- **State Management**: Cart state and persistence is handled strictly on the backend (rather than frontend local storage) to ensure that a user's cart persists reliably across multiple devices.
- **Mock Data Seeding**: The initial database seeder acts as a one-time import script. Once the database is seeded, no further external data fetches occur; all runtime requests are served directly from the PostgreSQL database.
- **Security**: `DB_SYNCHRONIZE=true` is enabled in the `.env` configuration for rapid development. In a real-world production environment, this would be disabled in favor of strict, incremental TypeORM migrations.
