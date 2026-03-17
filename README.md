# ClassMate — Frontend

React + Vite frontend for the ClassMate student dashboard application.  
Connects to the ClassMate microservices backend via API Gateway.

## Stack

- React 18
- Vite
- React Router v6
- Axios
- Plain CSS (no UI framework)

## Getting Started

### Prerequisites

- Node.js 18+
- ClassMate backend running locally (see [classmate-backend_v3](https://github.com/ClassMate3000/classmate-backend_v3))

### Setup
```bash
npm install
```

Create a `.env` file in the project root:
```env
VITE_API_GATEWAY_URL=http://localhost:8091
```

### Run
```bash
npm run dev
```

App runs at `http://localhost:5173`.

---

## Auth

JWT-based authentication. Login and register endpoints are public.  
All other requests require a valid Bearer token, which is automatically attached by the Axios interceptor in `src/api/axios.js`.

Token is stored in `localStorage` under the key `token`.

---

## Project Structure
```
src/
├── api/
│   └── axios.js              # Axios instance + JWT interceptor
├── auth/
│   ├── AuthContext.jsx        # Global auth state (login, logout, user)
│   └── ProtectedRoute.jsx     # Redirects to /login if no token
├── components/
│   ├── Sidebar.jsx            # Left sidebar wrapper
│   ├── LeftPanel.jsx          # Tab-aware action menu (Add, Edit, Delete)
│   ├── Navbar.jsx
│   ├── AppShell.jsx
│   └── modals/
│       ├── AddCourseModal.jsx
│       ├── EditCourseModal.jsx
│       ├── AddTaskModal.jsx
│       ├── EditTaskModal.jsx
│       ├── AddReminderModal.jsx
│       ├── EditReminderModal.jsx
│       ├── AddGradeModal.jsx
│       ├── EditGradeModal.jsx
│       └── DeleteConfirmModal.jsx
├── mocks/
│   └── loadMockCourses.js     # Fallback data when backend is unavailable
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   └── Dashboard.jsx          # Main page — owns all state and API calls
└── styles/
    ├── index.css
    ├── dashboard.css
    └── App.css
```

---

## Dashboard

The dashboard has four tabs: **Courses**, **Tasks**, **Reminders**, **Grades**.

Each tab supports full CRUD:

| Tab | Backend endpoint | Primary key |
|---|---|---|
| Courses | `/api/v1/courses` | `courseId` |
| Tasks | `/api/v1/tasks` | `taskId` |
| Reminders | `/api/v1/reminders` | `reminderId` |
| Grades | `/api/v1/course-progress` | `progressId` |

Clicking any item selects it and activates the **Edit** and **Delete** buttons in the left panel.  
All write operations update the local state immediately without a full page reload.

---

## Backend

See [classmate-backend_v3](https://github.com/ClassMate3000/classmate-backend_v3) for setup instructions.  
The frontend expects the API Gateway on port `8091`.