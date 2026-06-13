# 📝 Blog Backend API

A scalable and modular REST API for a full-stack blogging platform built using **Node.js, Express, TypeScript, Prisma, and PostgreSQL**.
This project demonstrates real-world backend engineering concepts including authentication, authorization, file uploads, and microservice-based architecture.

---

## 🚀 Features

### 🔐 Authentication Service

* User Registration
* User Login
* JWT-based Authentication
* Protected Routes Middleware
* Secure Password Hashing (bcrypt)

---

### 📝 Blog Service

* Create Blog with Image Upload
* Fetch All Blogs
* Fetch Single Blog
* Fetch Logged-in User Blogs
* Fetch Other User’s Blogs
* Update Blog (Ownership Protected)
* Delete Blog (Ownership Protected)

---

### 📁 File Upload System

* Cloudinary Integration
* Multer Middleware
* Image Upload for Blogs
* Profile Picture Support (Auth Service)

---

### 🗄 Database

* PostgreSQL Database
* Prisma ORM
* One-to-Many Relationship (User → Blogs)
* Schema Migrations

---

## 🧱 Tech Stack

**Backend:**

* Node.js
* Express.js
* TypeScript

**Database:**

* PostgreSQL
* Prisma ORM

**Authentication:**

* JWT (JSON Web Token)
* bcrypt

**File Storage:**

* Cloudinary
* Multer

---

## 📂 Project Architecture

This project follows a **microservice-inspired structure**:

```txt id="x1b9k2"
backend/
│
├── auth/          # Authentication Service
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── prisma/
│
├── blog/          # Blog Service
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── prisma/
```

---

## 🌐 API Endpoints

### 🔐 Auth Service

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | `/auth/register` | Register new user       |
| POST   | `/auth/login`    | Login user & return JWT |

---

### 📝 Blog Service

**Base URL:** `/api/blog`

| Method | Endpoint           | Description                | Auth |
| ------ | ------------------ | -------------------------- | ---- |
| POST   | `/`                | Create blog                | ✅    |
| GET    | `/`                | Get all blogs              | ❌    |
| GET    | `/user/me`         | Get logged-in user's blogs | ✅    |
| GET    | `/:id`             | Get single blog            | ❌    |
| GET    | `/users/:id/blogs` | Get specific user's blogs  | ✅    |
| PATCH  | `/update/:id`      | Update blog (owner only)   | ✅    |
| DELETE | `/delete/:id`      | Delete blog (owner only)   | ✅    |

---

## 🔐 Authentication Flow

```txt id="k9v2m1"
User Login/Register
        ↓
JWT Token Generated
        ↓
Client stores token
        ↓
Token sent in Authorization header
        ↓
Middleware verifies token
        ↓
req.userId attached to request
        ↓
Protected routes accessed securely
```

---

## 🛡 Security Features

* Password hashing using bcrypt
* JWT authentication
* Protected routes middleware
* Ownership-based authorization
* Input validation (basic)
* Secure environment variables

---

## 🧠 Key Learning Outcomes

This project helped me understand:

* REST API design patterns
* Authentication & authorization flow
* Prisma ORM with PostgreSQL
* Cloudinary file upload integration
* Middleware-based architecture
* Microservice separation (Auth & Blog)
* Secure backend development practices

---

## 🚀 Future Improvements

* Zod validation for request schemas
* Pagination for blogs
* Search & filtering system
* Refresh token implementation
* Rate limiting (security enhancement)
* API documentation using Swagger
* Docker containerization

---

## 👨‍💻 Author

**Dilip Dhakal**

Backend Developer
Node.js | TypeScript | PostgreSQL | Prisma | Cloudinary
