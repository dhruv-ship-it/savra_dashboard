# Principal Teacher Activity Dashboard

A production-ready full-stack dashboard application for principals to monitor teacher activities.

## Tech Stack

- **Frontend**: React (Vite) + React Router + Axios + Chart.js
- **Backend**: Node.js + Express
- **Database**: MariaDB

## Project Structure

```
savra/
├── backend/
│   ├── config/           # Database configuration
│   ├── controllers/      # Request handlers
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── .env              # Environment variables (DB credentials)
│   ├── .env.example      # Environment template
│   ├── package.json      # Backend dependencies
│   └── server.js         # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── pages/        # Page components
    │   ├── services/     # API service layer
    │   ├── App.jsx       # Main app with routing
    │   └── App.css       # Global styles
    ├── .env              # Frontend environment
    ├── index.html        # HTML template
    ├── package.json      # Frontend dependencies
    └── vite.config.js    # Vite configuration
```

## Prerequisites

- Node.js 18+ and npm
- MariaDB (database `savra_dashboard` already exists)

## Database Schema

Database: `savra_dashboard`

```sql
-- Teachers table
CREATE TABLE teachers (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Activities table
CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id VARCHAR(10) NOT NULL,
    grade INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    activity_type ENUM('Lesson Plan', 'Quiz', 'Question Paper') NOT NULL,
    created_at DATETIME NOT NULL,
    
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    UNIQUE (teacher_id, grade, subject, activity_type, created_at)
);

-- Indexes
CREATE INDEX idx_teacher ON activities(teacher_id);
CREATE INDEX idx_grade ON activities(grade);
CREATE INDEX idx_subject ON activities(subject);
CREATE INDEX idx_created ON activities(created_at);
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment variables are already configured in `.env`:
   - DB_HOST=localhost
   - DB_PORT=3306
   - DB_USER=root
   - DB_PASSWORD=1234567890
   - DB_NAME=savra_dashboard
   - PORT=3001

4. Start the server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

   Server runs on http://localhost:3001

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment variable is already configured in `.env`:
   - VITE_API_BASE_URL=http://localhost:3001/api

4. Start the development server:
   ```bash
   npm run dev
   ```

   Frontend runs on http://localhost:5173 (or next available port)

## API Endpoints

### Dashboard
- `GET /api/dashboard/summary?teacherId=` - Activity summary counts
- `GET /api/dashboard/weekly-trends?teacherId=` - Weekly activity trends
- `GET /api/dashboard/grade-breakdown?teacherId=` - Grade-wise breakdown
- `GET /api/dashboard/subject-breakdown?teacherId=` - Subject-wise breakdown

### Teachers
- `GET /api/teachers` - List all teachers
- `GET /api/teachers/:id` - Teacher details with analytics

## Features

### Dashboard Page (`/`)
- Summary cards showing total activities by type
- Weekly trends line chart
- Activity type pie chart
- Grade-wise bar chart
- Subject-wise bar chart
- Teacher filter dropdown with link to details

### Teacher Detail Page (`/teachers/:id`)
- Teacher name and ID
- Activity summary cards
- Activity type bar chart
- Grade breakdown bar chart
- Subject breakdown bar chart
- Recent activities table (last 5)

## Architecture

### Backend
- **routes/**: Define API endpoints
- **controllers/**: Handle HTTP requests/responses
- **services/**: Contain business logic and SQL queries
- **config/**: Database connection configuration

### Frontend
- **components/**: Reusable UI components (charts, filters, cards)
- **pages/**: Dashboard and TeacherDetail page components
- **services/**: API client functions using Axios
- Clean separation of concerns with functional components and hooks

## Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=1234567890
DB_NAME=savra_dashboard
PORT=3001
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3001/api
```

## Available Scripts

### Backend
- `npm start` - Run production server
- `npm run dev` - Run with nodemon (auto-reload)

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Production Deployment

1. Set `NODE_ENV=production` in backend `.env`
2. Build frontend: `cd frontend && npm run build`
3. Serve frontend build from backend or deploy separately
4. Update CORS settings in `backend/server.js` for production domain
