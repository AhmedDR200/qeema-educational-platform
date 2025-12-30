# Qeema Educational Platform

A production-ready mini educational platform with a Student Portal and Admin Dashboard, built with clean architecture principles.

## Project Structure

```
qeema-task/
├── backend/              # Express.js REST API
├── student-portal/       # React Vite app for students
├── admin-dashboard/      # React Vite app for admins
├── postman/              # Postman collection
└── README.md
```

## Tech Stack

### Backend
- Node.js + Express.js
- TypeScript
- Prisma ORM
- MySQL
- JWT Authentication
- Zod Validation

### Frontend (Both Apps)
- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router v6
- Axios

## Features

### Student Portal
- User registration & login
- Browse lessons with search & pagination
- Add/remove lessons from favorites
- Edit profile information

### Admin Dashboard
- Admin-only authentication
- Dashboard with statistics
- Students CRUD management
- Lessons CRUD management
- School profile management

## Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

## Setup Instructions

### 1. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE qeema_db;
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file and update DATABASE_URL
cp .env.example .env

# Update .env with your MySQL credentials:
# DATABASE_URL="mysql://root:yourpassword@localhost:3306/qeema_db"

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database (creates admin user and sample data)
npx prisma db seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:3000`

### 3. Student Portal Setup

```bash
# Navigate to student portal
cd student-portal

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

Student Portal will run on `http://localhost:5173`

### 4. Admin Dashboard Setup

```bash
# Navigate to admin dashboard
cd admin-dashboard

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

Admin Dashboard will run on `http://localhost:5174`

## Environment Variables

### Backend (.env)

```env
DATABASE_URL="mysql://root:password@localhost:3306/qeema_db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="24h"
PORT=3000
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173,http://localhost:5174"
ADMIN_EMAIL="admin@school.com"
ADMIN_PASSWORD="Admin123!"
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

## Sample Credentials

### Admin Account
- Email: `admin@school.com`
- Password: `Admin123!`

### Student Account
Register a new account via the Student Portal or use:
- Email: `student@example.com`
- Password: `Student123!`

## API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register student |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Auth | Get current user |

### Students
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/students` | Admin | List students |
| GET | `/api/students/profile` | Student | Get own profile |
| GET | `/api/students/:id` | Admin/Owner | Get student |
| POST | `/api/students` | Admin | Create student |
| PUT | `/api/students/:id` | Admin/Owner | Update student |
| DELETE | `/api/students/:id` | Admin | Delete student |

### Lessons
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/lessons` | Auth | List lessons |
| GET | `/api/lessons/:id` | Auth | Get lesson |
| POST | `/api/lessons` | Admin | Create lesson |
| PUT | `/api/lessons/:id` | Admin | Update lesson |
| DELETE | `/api/lessons/:id` | Admin | Delete lesson |

### Favorites
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/favorites` | Student | Get favorites |
| POST | `/api/favorites/:lessonId` | Student | Add favorite |
| DELETE | `/api/favorites/:lessonId` | Student | Remove favorite |

### School
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/school` | Admin | Get school profile |
| PUT | `/api/school` | Admin | Update school |

### Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/stats` | Admin | Get statistics |

## Project Architecture

### Backend (Clean Architecture)

```
backend/src/
├── config/          # Environment configuration
├── controllers/     # HTTP request handlers
├── services/        # Business logic layer
├── repositories/    # Data access layer (Prisma)
├── middlewares/     # Auth, validation, error handling
├── routes/          # API route definitions
├── utils/           # Helpers, validators, error classes
├── types/           # TypeScript interfaces
└── app.ts           # Express application
```

### Frontend (Feature-Based)

```
src/
├── api/             # Axios instance & API calls
├── components/
│   ├── ui/          # Reusable components
│   └── layout/      # Layout components
├── context/         # Auth context
├── hooks/           # Custom hooks
├── features/        # Feature modules
├── routes/          # Protected routes
└── types/           # TypeScript types
```

## UI Design Principles

- **No Icons**: UI relies on typography, spacing, colors, and borders
- **Responsive**: Mobile-first design with breakpoints for tablet and desktop
- **Accessible**: Proper focus states, ARIA labels, keyboard navigation
- **Consistent**: Design tokens via Tailwind for colors, spacing, and typography
- **Animated**: Subtle animations for page transitions and interactions

## Scripts

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio
```

### Frontend (Both Apps)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Postman Collection

Import the Postman collection from `postman/Qeema-API-Collection.json` to test all API endpoints. The collection includes:

- Pre-configured environment variables
- Automatic token extraction on login
- All CRUD operations for all resources

## Testing the Application

1. Start all three servers (backend, student-portal, admin-dashboard)
2. Open Admin Dashboard (`http://localhost:5174`) and login with admin credentials
3. Explore dashboard, manage students and lessons
4. Open Student Portal (`http://localhost:5173`) and register a new student
5. Browse lessons, add favorites, update profile

## License

MIT

## Author

Built as part of the Qeema Task assessment.

