# Ecommerce Web

A full-stack ecommerce web application built with React, Vite, Tailwind CSS, and a Node.js/Express backend backed by MongoDB. This project includes product catalog browsing, user authentication, cart and wishlist management, order creation, and chat support.

## Features

- React + Vite frontend with modern component structure
- User authentication with email/password and Google login support
- Product listing, new arrivals, and best sellers sections
- Product details and admin-style creation/update support
- Shopping cart and wishlist APIs
- Order processing and management endpoints
- Chat support layer via backend AI/chat service
- MongoDB with Mongoose models for persistent data storage
- Secure cookie-based authentication with JWT

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, React Icons
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: bcryptjs, jsonwebtoken, cookie-parser
- Utilities: dotenv, cors, validator
- Dev tools: ESLint, nodemon, PostCSS

## Repository Structure

- `src/` - React frontend source files
  - `App.jsx`, `main.jsx`, pages/components
- `public/` - Static assets and images
- `backend/` - Node.js/Express API server
  - `controllers/` - Route handlers
  - `models/` - Mongoose schemas
  - `routes/` - API route definitions
  - `middleware/` - Authentication middleware
  - `config/` - Database and token configuration
- `utils/` - Firebase utilities for frontend auth integration

## Getting Started

### Frontend

1. Install frontend dependencies:

```bash
cd d:\latest-project\ecommerce-web
npm install
```

2. Start the Vite development server:

```bash
npm run dev
```

3. Open `http://localhost:5173` in your browser.

### Backend

1. Install backend dependencies:

```bash
cd d:\latest-project\ecommerce-web\backend
npm install
```

2. Start the backend server:

```bash
npm run dev
```

3. The backend runs on `http://localhost:5000` by default.

## Environment Variables

Create a `.env` file in `backend/` with at least the following values:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

> The backend expects `MONGO_URL` for MongoDB connectivity and `JWT_SECRET` for token generation.

## API Endpoints

### Authentication

- `POST /api/auth/registration` - Register a new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/logout` - Logout and clear auth cookie
- `POST /api/auth/googlelogin` - Login/register with Google

### Products

- `GET /api/products/` - Get all products
- `GET /api/products/new-arrivals` - Get new arrival products
- `GET /api/products/best-sellers` - Get best seller products
- `GET /api/products/:id` - Get a product by ID
- `POST /api/products/` - Create a product
- `PATCH /api/products/:id` - Update a product

### Cart, Orders, Wishlist, Chat

- `POST /api/cart/` and related cart routes
- `POST /api/orders/` and related order routes
- `POST /api/wishlist/` and related wishlist routes
- `POST /api/chat/` for chat interactions

## Available Scripts

From the frontend root:

- `npm run dev` - Start Vite development server
- `npm run build` - Build the production frontend bundle
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint analysis

From `backend/`:

- `npm run dev` - Start the backend with `nodemon`
- `npm start` - Start the backend once

## Notes

- CORS is configured for `http://localhost:5173`.
- The backend uses cookie-based JWT authentication for secure session handling.
- If you add new API routes or update models, restart the backend server.


