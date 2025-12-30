# Qeema Educational Platform

A full-stack mini educational platform featuring a **Student Portal** and **Admin Dashboard**, built with modern technologies and clean architecture principles.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat&logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

## 📁 Project Structure

```
qeema-task/
├── backend/              # Express.js REST API
├── student-portal/       # React app for students
├── admin-dashboard/      # React app for administrators
├── postman/              # API collection for testing
└── README.md
```

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| TypeScript | Type safety |
| Prisma ORM | Database access |
| MySQL | Database |
| JWT | Authentication |
| Zod | Request validation |
| Cloudinary | Image storage |
| Multer | File upload handling |

### Frontend (Both Apps)
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| React Router v6 | Navigation |
| Axios | HTTP client |

## ✨ Features

### Student Portal
- **Authentication**: Register & login with JWT
- **Lessons**: Browse, search, and filter lessons with pagination
- **Lesson Details**: View full lesson information
- **Ratings**: Rate lessons (1-5 stars) - average calculated automatically
- **Favorites**: Add/remove lessons from favorites with optimistic updates
- **Profile**: Edit personal information with image upload

### Admin Dashboard
- **Secure Login**: Admin-only authentication
- **Dashboard**: Overview with key statistics
- **Student Management**: Full CRUD operations
- **Lesson Management**: Create, edit, delete lessons
- **School Profile**: Manage school information and logo
- **Image Upload**: Upload images directly to Cloudinary

## 📋 Prerequisites

- **Node.js** 18 or higher
- **MySQL** 8.0 or higher
- **npm** or **yarn**
- **Cloudinary account** (for image uploads)

## 🚀 Quick Start

### 1. Clone & Setup Database

```bash
# Clone the repository
git clone <your-repo-url>
cd qeema-task

# Create MySQL database
mysql -u root -p -e "CREATE DATABASE qeema_db;"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials (see Environment Variables section)

# Setup database
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# Start server
npm run dev
```

**Backend runs on:** `http://localhost:3000`

### 3. Student Portal Setup

```bash
cd student-portal

npm install
cp .env.example .env
npm run dev
```

**Student Portal runs on:** `http://localhost:5173`

### 4. Admin Dashboard Setup

```bash
cd admin-dashboard

npm install
cp .env.example .env
npm run dev
```

**Admin Dashboard runs on:** `http://localhost:5174`

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="mysql://root:yourpassword@localhost:3306/qeema_db"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:5174

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (`student-portal/.env` & `admin-dashboard/.env`)

```env
VITE_API_URL=http://localhost:3000/api
```

## 🔐 Default Credentials

### Admin Account
| Field | Value |
|-------|-------|
| Email | `admin@school.com` |
| Password | `Admin123!` |

### Student Account
Register via Student Portal, or use seeded account:
| Field | Value |
|-------|-------|
| Email | `student@example.com` |
| Password | `Student123!` |

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new student |
| POST | `/api/auth/login` | Public | Login (returns JWT) |
| GET | `/api/auth/me` | Auth | Get current user |

### Students
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/students` | Admin | List all students (paginated) |
| GET | `/api/students/profile` | Student | Get own profile |
| GET | `/api/students/:id` | Admin/Owner | Get student by ID |
| POST | `/api/students` | Admin | Create new student |
| PUT | `/api/students/:id` | Admin/Owner | Update student |
| DELETE | `/api/students/:id` | Admin | Delete student |

### Lessons
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/lessons` | Auth | List lessons (paginated, searchable) |
| GET | `/api/lessons/:id` | Auth | Get lesson details + user rating |
| POST | `/api/lessons` | Admin | Create lesson |
| PUT | `/api/lessons/:id` | Admin | Update lesson |
| DELETE | `/api/lessons/:id` | Admin | Delete lesson |

### Ratings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/lessons/:id/rate` | Student | Rate a lesson (1-5) |
| GET | `/api/lessons/:id/my-rating` | Student | Get your rating |

### Favorites
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/favorites` | Student | Get all favorites |
| POST | `/api/favorites/:lessonId` | Student | Add to favorites |
| DELETE | `/api/favorites/:lessonId` | Student | Remove from favorites |

### Upload
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/upload` | Auth | Upload image (multipart/form-data) |

### School
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/school` | Admin | Get school profile |
| PUT | `/api/school` | Admin | Update school profile |

### Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/stats` | Admin | Get statistics |

### Health Check
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/health` | Public | API health status |

## 🏗️ Architecture

### Backend (Clean Architecture)

```
backend/src/
├── config/          # Environment & app configuration
├── controllers/     # HTTP request handlers
├── services/        # Business logic layer
├── repositories/    # Data access layer (Prisma)
├── middlewares/     # Auth, validation, error handling
├── routes/          # API route definitions
├── utils/           # Helpers, validators, API response
├── types/           # TypeScript interfaces
└── app.ts           # Express application entry
```

### Frontend (Feature-Based Structure)

```
src/
├── api/             # Axios instance & endpoint functions
│   └── endpoints/   # API calls organized by resource
├── components/
│   ├── ui/          # Reusable UI components
│   └── layout/      # Header, Sidebar, MainLayout
├── context/         # React Context (Auth)
├── hooks/           # Custom hooks (useAuth, useDebounce)
├── features/        # Feature modules (auth, lessons, etc.)
├── routes/          # Protected route components
└── types/           # TypeScript type definitions
```

## 🎨 UI Design Principles

- **No Icons**: UI relies on typography, spacing, colors, and borders for visual hierarchy
- **Responsive**: Mobile-first design with tablet and desktop breakpoints
- **Accessible**: Focus states, keyboard navigation, semantic HTML
- **Consistent**: Design tokens via Tailwind CSS configuration
- **Animated**: Subtle transitions for enhanced user experience

## 📜 Available Scripts

### Backend
```bash
npm run dev              # Start development server (hot reload)
npm run build            # Compile TypeScript
npm run start            # Start production server
npx prisma studio        # Open Prisma database GUI
npx prisma migrate dev   # Run database migrations
npx prisma db seed       # Seed database with sample data
```

### Frontend (Both Apps)
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

## 🧪 Testing with Postman

1. Import `postman/Qeema-API-Collection.json` into Postman
2. The collection includes:
   - Pre-configured variables (`baseUrl`, `token`)
   - Automatic token extraction on login
   - All API endpoints organized by category
3. Login first to set the auth token automatically

## 🖼️ Image Upload

Images are stored on **Cloudinary**. Supported formats:
- JPEG, PNG, GIF, WebP
- Maximum size: 5MB
- Auto-optimized for quality and format

Upload is available for:
- Lesson cover images
- Student profile photos
- School logo

## 📝 Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  role      Role     @default(STUDENT)
  student   Student?
}

model Student {
  id              String     @id @default(uuid())
  userId          String     @unique
  fullName        String
  className       String?
  academicYear    String?
  phoneNumber     String?
  profileImageUrl String?
  user            User       @relation(...)
  favorites       Favorite[]
  ratings         Rating[]
}

model Lesson {
  id          String     @id @default(uuid())
  title       String
  description String
  imageUrl    String?
  rating      Float      @default(0)
  favorites   Favorite[]
  ratings     Rating[]
}

model Rating {
  id        String  @id @default(uuid())
  studentId String
  lessonId  String
  value     Int     // 1-5
  student   Student @relation(...)
  lesson    Lesson  @relation(...)
  @@unique([studentId, lessonId])
}

model Favorite {
  id        String  @id @default(uuid())
  studentId String
  lessonId  String
  student   Student @relation(...)
  lesson    Lesson  @relation(...)
  @@unique([studentId, lessonId])
}

model School {
  id          String  @id @default(uuid())
  name        String
  logoUrl     String?
  phoneNumber String?
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for the Qeema Task Assessment
