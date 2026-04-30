# MERN Auth App

A full-stack authentication system built with MongoDB, Express, React, and Node.js. Features JWT auth, Google OAuth, role-based access control, and an admin approval workflow.

## Features

- Signup / Login with JWT
- Google OAuth login
- New users are unapproved by default — admin must approve
- Roles: `user` and `admin`
- Admin can approve/reject users, approve/reject admin requests, promote/demote users, delete users
- Seeded super admin cannot be modified or deleted by anyone
- Loader screen handles Render cold starts gracefully

---

## Project Structure

```
mern-auth-app/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── adminController.js
│   ├── middleware/auth.js
│   ├── models/User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   └── admin.js
│   ├── scripts/seed.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── _redirects
    ├── src/
    │   ├── components/
    │   │   ├── LoaderScreen.js
    │   │   ├── ProtectedRoute.js
    │   │   └── Topbar.js
    │   ├── context/AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Signup.js
    │   │   ├── Dashboard.js
    │   │   └── AdminPanel.js
    │   ├── utils/api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env.example
    └── package.json
```

---

## Quick Start (Local)

### 1. Clone and install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

**Backend** — copy `.env.example` to `.env` and fill in:
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=some_long_random_string
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
ADMIN_EMAIL=admin@shubham.com
ADMIN_PASSWORD=Admin@123456
FRONTEND_URL=http://localhost:3000
```

**Frontend** — copy `.env.example` to `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
```

### 3. Seed the admin

```bash
cd backend
npm run seed
```

### 4. Start the servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

App runs at `http://localhost:3000`

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register new user |
| POST | /api/auth/login | Login with email/password |
| POST | /api/auth/google | Google OAuth login |
| GET | /api/auth/me | Get current user (protected) |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/user/request-admin | Request admin role |
| DELETE | /api/user/request-admin | Cancel admin request |

### Admin (admin-only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/users | Get all users |
| PATCH | /api/admin/users/:id/approve | Approve user |
| PATCH | /api/admin/users/:id/reject | Reject/revoke user |
| PATCH | /api/admin/users/:id/approve-admin | Grant admin role |
| PATCH | /api/admin/users/:id/reject-admin | Reject admin request |
| PATCH | /api/admin/users/:id/promote | Promote to admin |
| PATCH | /api/admin/users/:id/demote | Demote to user |
| DELETE | /api/admin/users/:id | Delete user |

---