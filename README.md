# 🎉 EventHub

A full-stack event management platform built for educational institutions. EventHub streamlines the entire event lifecycle — from creation and approval to registration, attendance tracking, and certificate generation — with role-based access control that mirrors real organizational hierarchies.

## ✨ Why EventHub?

Managing college events typically involves scattered spreadsheets, group chats, and manual coordination. EventHub solves this by providing:

- **Structured event workflows** — Events move through a clear lifecycle (Draft → Approval → Published → Completed), ensuring accountability at every step.
- **Role-based delegation** — Super Admins manage departments, Department Admins approve events, Group Admins create events, and Students register and participate.
- **Granular permissions** — Department Admins can assign specific permissions to Group Admins (e.g., create events but not publish them), enabling fine-tuned control.
- **Real-time analytics** — Department-level analytics and trend charts help administrators make data-driven decisions about event planning.
- **Self-service for students** — Students can browse events, register, track their registrations, and download certificates — all from one place.
- **Flexible event modes** — Supports Online, Offline, and Hybrid events with venue/link fields accordingly.

## 🏗️ Tech Stack

| Layer        | Technology                                                         |
| ------------ | ------------------------------------------------------------------ |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS, Radix UI          |
| **State**    | Redux Toolkit, Redux Persist, Zustand                              |
| **Backend**  | Express 5, TypeScript, Prisma ORM 7                                |
| **Database** | PostgreSQL 16                                                      |
| **Auth**     | JWT (access + refresh tokens), bcrypt                              |
| **Validation** | Zod 4 (shared client/server validation)                          |
| **Charts**   | Recharts                                                           |
| **DevOps**   | Docker Compose, Vercel                                             |

## 📁 Project Structure

```
EventHub/
├── client/                     # Next.js frontend
│   └── src/
│       ├── api/                # API client functions (axios)
│       ├── app/
│       │   ├── (auth)/         # Login, Register, Forgot Password
│       │   ├── (dashboard)/    # Role-based dashboards
│       │   │   ├── admin/      # Super Admin dashboard
│       │   │   ├── department/ # Department Admin dashboard
│       │   │   ├── group-admin/# Group Admin dashboard
│       │   │   ├── student/    # Student dashboard
│       │   │   └── approvals/  # Event approval queue
│       │   ├── (public)/       # Public event browsing
│       │   ├── about-us/       # About page
│       │   ├── contact-us/     # Contact page
│       │   ├── my-events/      # Student's registered events
│       │   └── profile/        # User profile management
│       ├── components/         # Reusable UI components
│       ├── lib/                # Schemas, types, validators, utils
│       ├── services/           # Redux async thunks
│       └── store/              # Redux store & slices
│
└── server/                     # Express backend
    ├── prisma/
    │   ├── schema.prisma       # Database schema
    │   └── seed.ts             # Seed roles, permissions, departments
    └── src/
        ├── controllers/        # Route handlers
        ├── middlewares/         # Auth, RBAC, validation, error handling
        ├── routes/             # API route definitions
        ├── services/           # Business logic
        ├── validators/         # Zod request schemas
        ├── types/              # Shared TypeScript types
        └── utils/              # Helpers (JWT, password, ApiError)
```

## 👥 Roles & Permissions

EventHub uses a hierarchical RBAC system with four roles:

| Role               | Capabilities                                                                 |
| ------------------ | ---------------------------------------------------------------------------- |
| **Super Admin**    | Manage departments, assign Department Admins, full system access             |
| **Department Admin** | Approve/reject events, publish events, manage Group Admins & their permissions |
| **Group Admin**    | Create & update events, submit for approval, manage registrations & attendance |
| **Student**        | Browse events, register/cancel, view attendance, download certificates        |

### Granular Permissions (for Group Admins)

Department Admins can assign any combination of these permissions to Group Admins:

`CREATE_EVENT` · `UPDATE_EVENT` · `DELETE_EVENT` · `PUBLISH_EVENT` · `CLOSE_EVENT` · `MARK_ATTENDANCE` · `DECLARE_WINNERS` · `MANAGE_GROUP_ADMINS` · `ASSIGN_PERMISSIONS` · `VIEW_REGISTRATIONS`

## 🔄 Event Lifecycle

```
DRAFT → PENDING_APPROVAL → APPROVED → PUBLISHED → REGISTRATION_CLOSED → ONGOING → COMPLETED
                         ↘ REJECTED
```

1. **Draft** — Group Admin creates an event
2. **Pending Approval** — Submitted for Department Admin review
3. **Approved / Rejected** — Department Admin decides
4. **Published** — Made visible to students for registration
5. **Registration Closed** — Deadline passed or manually closed
6. **Ongoing** — Event is happening; attendance can be marked
7. **Completed** — Event finished; certificates available

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** (package manager)
- **PostgreSQL 16** (or use Docker)
- **Docker & Docker Compose** (optional, for database)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/EventHub.git
cd EventHub
```

### 2. Start the database

Using Docker (recommended):

```bash
cd server
docker-compose up -d
```

This starts PostgreSQL on port `5432` and pgAdmin on port `5050`.

Or connect to an existing PostgreSQL instance and update the connection string in step 3.

### 3. Set up the backend

```bash
cd server
pnpm install
```

Create a `.env` file in the `server/` directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prismadb"
PORT=4000
NODE_ENV=development

JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

SUPER_ADMIN_EMAIL="admin@eventhub.com"
SUPER_ADMIN_PASSWORD="your-secure-password"

FRONTEND_URL="http://localhost:3000"
```

Run migrations and seed the database:

```bash
pnpm prisma:generate
pnpm prisma:migrate
npx prisma db seed
```

Start the dev server:

```bash
pnpm dev
```

The API will be available at `http://localhost:4000/api/v1`.

### 4. Set up the frontend

```bash
cd client
pnpm install
```

Create a `.env.local` file in the `client/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

Start the dev server:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

## 📡 API Overview

All endpoints are prefixed with `/api/v1`.

| Module        | Endpoint                                          | Description                    |
| ------------- | ------------------------------------------------- | ------------------------------ |
| **Auth**      | `POST /auth/register`                             | Register a new user            |
|               | `POST /auth/login`                                | Login & receive tokens         |
|               | `POST /auth/refresh-token`                        | Refresh access token           |
|               | `POST /auth/logout`                               | Logout & invalidate token      |
|               | `GET /auth/profile`                               | Get current user profile       |
| **Events**    | `GET /events`                                     | List all published events      |
|               | `GET /events/:id`                                 | Get event details              |
|               | `POST /events`                                    | Create event (Admin)           |
|               | `POST /events/:id/submit`                         | Submit for approval            |
|               | `POST /events/:id/approval`                       | Approve/reject event           |
|               | `POST /events/:id/publish`                        | Publish approved event         |
|               | `POST /events/:id/register`                       | Register for event (Student)   |
|               | `POST /events/:id/attendance`                     | Mark attendance                |
|               | `GET /events/:id/certificate`                     | Download certificate           |
| **Departments** | `GET /departments`                              | List all departments           |
|               | `POST /departments`                               | Create department (Super Admin)|
|               | `GET /departments/:id/analytics`                  | Department analytics           |
|               | `POST /departments/:id/group-admins`              | Assign group admin             |
|               | `PUT /departments/:id/group-admins/:gid/permissions` | Update admin permissions    |

## 🛠️ Available Scripts

### Server

| Command               | Description                        |
| --------------------- | ---------------------------------- |
| `pnpm dev`            | Start dev server with hot reload   |
| `pnpm build`          | Compile TypeScript                 |
| `pnpm start`          | Start production server            |
| `pnpm prisma:generate`| Generate Prisma client             |
| `pnpm prisma:migrate` | Run database migrations            |
| `pnpm prisma:studio`  | Open Prisma Studio GUI             |

### Client

| Command        | Description                  |
| -------------- | ---------------------------- |
| `pnpm dev`     | Start Next.js dev server     |
| `pnpm build`   | Build for production         |
| `pnpm start`   | Start production server      |
| `pnpm lint`    | Run ESLint                   |

## 🌐 Deployment

- **Backend**: Configured for Vercel deployment via `vercel.json`. Can also be deployed to any Node.js hosting.
- **Frontend**: Standard Next.js deployment — works out of the box on Vercel, Netlify, or any platform supporting Next.js.
- **Database**: Any PostgreSQL provider (Supabase, Neon, Railway, AWS RDS, etc.)

## 📄 License

ISC
