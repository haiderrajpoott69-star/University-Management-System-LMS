# LODANZA UNIVERSITY OF SCIENCE — LMS

A production-ready Learning Management System built with the MERN stack.

## Tech Stack
- **Frontend**: React.js (Vite) + React Router + Recharts
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt
- **Styling**: Custom CSS (Glassmorphism, Dark Theme)

## Color Theme
| Color       | Hex       |
|-------------|-----------|
| Primary     | `#0B0B0B` |
| Secondary   | `#FF4D6D` |
| Accent      | `#FF8C42` |
| Text        | `#FFFFFF` |

## User Roles
- **Admin** — Full system control
- **Teacher** — Course management, grading, attendance
- **Student** — Enroll, submit, take quizzes

## Quick Start

### 1. Prerequisites
- Node.js v18+
- MongoDB running locally (or MongoDB Atlas)
- npm or yarn

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env — set your MONGO_URI and JWT_SECRET
npm run dev
```

### 3. Seed Demo Data
```bash
cd server
npm run seed
```
This creates:
- Admin: `admin@lodanza.edu` / `admin123`
- Teacher: `sarah@lodanza.edu` / `teacher123`
- Student: `alice@lodanza.edu` / `student123`

### 4. Frontend Setup
```bash
cd client
npm install
npm run dev
```

Visit: http://localhost:3000

## Folder Structure

```
lodanza-lms/
├── server/                  # Express Backend
│   ├── config/db.js         # MongoDB connection
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth, error handlers
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── utils/               # Token gen, seeder
│   ├── uploads/             # File uploads
│   └── server.js            # Entry point
│
└── client/                  # React Frontend
    └── src/
        ├── context/         # Auth context
        ├── layouts/         # Admin/Teacher/Student layouts
        ├── pages/           # All page components
        │   ├── admin/       # Admin pages
        │   ├── teacher/     # Teacher pages
        │   └── student/     # Student pages
        ├── routes/          # Protected route
        ├── services/        # Axios API service
        ├── App.jsx          # Router setup
        └── index.css        # Global styles
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/students` | All students |
| GET | `/api/admin/teachers` | All teachers |
| POST | `/api/admin/users` | Create user |
| GET | `/api/admin/departments` | All departments |
| POST | `/api/admin/departments` | Create department |
| GET | `/api/admin/analytics` | Analytics data |
| POST | `/api/admin/announcements` | Post announcement |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | All courses |
| POST | `/api/courses` | Create course (admin) |
| GET | `/api/courses/my/teacher` | Teacher's courses |
| GET | `/api/courses/my/student` | Student's courses |
| POST | `/api/courses/:id/enroll` | Enroll student |
| POST | `/api/courses/:id/materials` | Upload material |

### Assignments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assignments` | Create (teacher) |
| GET | `/api/assignments/my` | Teacher's assignments |
| POST | `/api/assignments/submit` | Submit (student) |
| GET | `/api/assignments/submissions/my` | Student submissions |
| PUT | `/api/assignments/submissions/:id/grade` | Grade submission |

### Quizzes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/quizzes` | Create quiz |
| GET | `/api/quizzes/course/:id` | Course quizzes |
| POST | `/api/quizzes/:id/submit` | Submit quiz |
| GET | `/api/quizzes/attempts/my` | Student attempts |

### Attendance & Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance` | Mark attendance |
| GET | `/api/attendance/my` | Student attendance |
| GET | `/api/notifications` | User notifications |

## Features
- JWT auth with role-based access control
- Admin: user management, departments, analytics charts, announcements
- Teacher: course materials, assignments with grading, interactive quizzes, attendance marking
- Student: course enrollment, assignment submission, quiz taking, grade tracking, attendance view
- Glassmorphism dark UI with animations
- Fully responsive design
- Real-time notifications

## Environment Variables (server/.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/lodanza_lms
JWT_SECRET=your_very_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```
