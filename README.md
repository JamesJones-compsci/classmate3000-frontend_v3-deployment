# ClassMate — Frontend

React + Vite frontend. Connects to the ClassMate microservices backend via API Gateway on port `8091`.

---

## Stack

- React 18 + Vite
- React Router v6
- Axios (JWT interceptor)
- Plain CSS — no UI framework

---

## Quick Start
```bash
npm install
npm run dev
```

Create `.env` in project root:
```env
VITE_API_GATEWAY_URL=http://localhost:8091
```

App → `http://localhost:5173`

> Backend must be running first. See [classmate-backend_v3](https://github.com/ClassMate3000/classmate-backend_v3)

---

## Auth Flow
```
User fills Login/Signup
        ↓
POST /api/v1/auth/login  or  /register
        ↓
Backend returns JWT token
        ↓
Token stored in sessionStorage (clears on tab close)
        ↓
Axios interceptor attaches token to every request
        ↓
API Gateway validates token → routes to service
```

- Public routes: `/login`, `/signup`
- All other routes: protected via `ProtectedRoute.jsx`
- Token location: `sessionStorage` key `"token"`
- ⚠️ Do NOT change to `localStorage` — security requirement

---

## Project Structure
```
src/
├── api/
│   └── axios.js                 # Axios instance. Attaches Bearer token. Default port: 8091
│
├── auth/
│   ├── AuthContext.jsx           # login(), logout(), user state (token + firstName + lastName)
│   └── ProtectedRoute.jsx        # Redirects to /login if no token in sessionStorage
│
├── components/
│   ├── Sidebar.jsx               # Brand, user initials, bell icon, LeftPanel, Logout
│   ├── LeftPanel.jsx             # Tab-aware action menu: Add / Edit / Delete / All
│   ├── Navbar.jsx                # Top tab navigation
│   ├── AppShell.jsx              # Layout wrapper
│   └── modals/
│       ├── AddCourseModal.jsx    # Requires: code, title, instructor, gradeGoal, startWeek, meetings[]
│       ├── EditCourseModal.jsx   # Pre-populates meetings[0] from backend
│       ├── AddTaskModal.jsx      # Course dropdown (live)
│       ├── EditTaskModal.jsx     # Course dropdown (live)
│       ├── AddReminderModal.jsx  # Task dropdown (live)
│       ├── EditReminderModal.jsx # Task dropdown (live)
│       ├── AddGradeModal.jsx     # Course dropdown (live), weekOf auto-set to Monday
│       ├── EditGradeModal.jsx    # Course dropdown (live)
│       └── DeleteConfirmModal.jsx # Shared confirm dialog — works for all item types
│
├── mocks/
│   └── loadMockCourses.js        # Shown on Courses tab if backend is unreachable
│
├── pages/
│   ├── Login.jsx                 # Email + password. Status-based error messages.
│   ├── Signup.jsx                # firstName, lastName, email, password (min 6 chars)
│   └── Dashboard.jsx             # Owns ALL state and API calls. Everything flows from here.
│
└── styles/
    ├── App.css                   # Resets Vite scaffold defaults only
    ├── index.css                 # Global base styles + Login/Signup auth styles
    └── dashboard.css             # Dashboard layout, cards, modals, filter strip, sidebar
```

---

## Dashboard Tabs

| Tab | Endpoint | Key | Dropdowns |
|---|---|---|---|
| Courses | `/api/v1/courses` | `courseId` | — |
| Tasks | `/api/v1/tasks` | `taskId` | Course |
| Reminders | `/api/v1/reminders` | `reminderId` | Task |
| Grades | `/api/v1/course-progress` | `progressId` | Course |

**How selection works:**
1. Click any card/row → item is selected (blue outline)
2. Edit + Delete buttons activate in the left panel
3. Click Edit → modal pre-filled with existing data
4. Click Delete → confirm dialog → item removed

**Tasks tab extras:**
- Sorted by due date (nearest first)
- Filter strip: `All` · `Overdue` · `Due Today` · `This Week` · `By Course ▾`
- Overdue tasks → red left border

**Sidebar:**
- Bell icon → badge shows overdue + due-today count → click navigates to Tasks tab
- User initials circle → derived from firstName + lastName stored in sessionStorage

---

## Course Model (backend required fields)
```json
{
  "code": "COMP3059",
  "title": "Capstone I",
  "instructor": "Prof. Laily Ajellu",
  "gradeGoal": 75,
  "startWeek": "2026-01-06",
  "meetings": [
    { "dayOfWeek": 2, "startTime": "10:00:00", "endTime": "12:00:00" }
  ]
}
```

> `dayOfWeek`: 1 = Monday, 7 = Sunday (ISO standard)
> All fields are required — backend returns 400 if any are missing

---

## Known Issues / Open Items

| Issue | Status |
|---|---|
| Keycloak integration | Deferred to v2 — current auth uses JJWT |
| Integration tests outdated after model overhaul | In progress |
| API Gateway occasional routing instability | Being debugged |
| courseId int/Long mismatch across services | Frontend coerces to Number as workaround |

---

## Backend

Repo: [classmate-backend_v3](https://github.com/ClassMate3000/classmate-backend_v3)
```bash
docker compose up -d
```