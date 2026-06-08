# Ecommerce Web

A full-stack ecommerce web application built with React, Vite, Tailwind CSS, and a Node.js/Express backend backed by MongoDB. This project includes product catalog browsing, user authentication, cart and wishlist management, and order processing.

## Features

* React + Vite frontend with a modern component structure
* User authentication with email/password and Google login support
* Product listing, new arrivals, and best sellers sections
* Product details and product management support
* Shopping cart and wishlist functionality
* Order creation and management
* MongoDB with Mongoose models for persistent data storage
* Secure cookie-based authentication using JWT

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* React Icons

### Backend

* Node.js
* Express
* MongoDB
* Mongoose

### Authentication

* bcryptjs
* jsonwebtoken
* cookie-parser
* Firebase Authentication (Google Login)

### Utilities

* dotenv
* cors
* validator

### Development Tools

* ESLint
* nodemon
* PostCSS

## Repository Structure

```text
src/                 # React frontend source files
├── App.jsx
├── main.jsx
├── pages/
└── components/

public/              # Static assets and images

backend/             # Node.js/Express API server
├── controllers/     # Route handlers
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── middleware/      # Authentication middleware
└── config/          # Database and token configuration

utils/               # Firebase utilities and helper functions
```

## Getting Started

### Frontend Setup

Install frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

### Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install backend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

## Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> The backend requires `MONGO_URL` for MongoDB connectivity and `JWT_SECRET` for secure token generation.

## API Endpoints

### Authentication

* `POST /api/auth/registration` — Register a new user
* `POST /api/auth/login` — Login with email/password
* `GET /api/auth/logout` — Logout and clear authentication cookies
* `POST /api/auth/googlelogin` — Login/Register using Google Authentication

### Products

* `GET /api/products/` — Get all products
* `GET /api/products/new-arrivals` — Get new arrival products
* `GET /api/products/best-sellers` — Get best seller products
* `GET /api/products/:id` — Get a product by ID
* `POST /api/products/` — Create a new product
* `PATCH /api/products/:id` — Update an existing product

### Cart

* `POST /api/cart/`
* Additional cart management routes

### Orders

* `POST /api/orders/`
* Additional order management routes

### Wishlist

* `POST /api/wishlist/`
* Additional wishlist management routes

## Available Scripts

### Frontend

```bash
npm run dev
```

Start the Vite development server.

```bash
npm run build
```

Build the production bundle.

```bash
npm run preview
```

Preview the production build.

```bash
npm run lint
```

Run ESLint analysis.

### Backend

```bash
npm run dev
```

Start the backend using nodemon.

```bash
npm start
```

Start the backend in production mode.

## Notes

* CORS should be configured to allow requests from your frontend domain.
* The backend uses cookie-based JWT authentication for secure session management.
* MongoDB is used as the primary database.
* Restart the backend server after modifying environment variables or backend configuration.
