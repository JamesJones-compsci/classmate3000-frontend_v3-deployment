# ClassMate — Frontend

React + Vite frontend. Connects to the ClassMate microservices backend via API Gateway on port `8091`.

---

## Stack

- React 18 + Vite
- React Router v6
- Axios (JWT interceptor)
- CSS

---

## Quick Start

```bash
npm install
npm run dev
```

Create `.env` in project root:
```env
VITE_API_GATEWAY_URL=http://localhost:8091
VITE_USE_MOCK_AUTH=false
VITE_USE_MOCK_API=false
```

App → `http://localhost:5173`

> Backend must be running first. See [classmate-backend_v3](https://github.com/ClassMate3000/classmate-backend_v3)

---

## Mock Mode

Mock mode is controlled via `.env`. Set both flags to `true` to run without a backend:
```env
VITE_USE_MOCK_AUTH=true
VITE_USE_MOCK_API=true
```

Mock flags are read in `src/config/env.js` and passed to each feature service.

---

## Auth Flow
```
User fills Login/Signup
        ↓
POST /api/v1/auth/login  or  /register
        ↓
Backend returns JWT token + firstName + lastName
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
│   ├── client.js                 # Axios instance. Attaches Bearer token. Default port: 8091
│   ├── auth.api.js               # Login, register
│   ├── courses.api.js            # Course CRUD
│   ├── tasks.api.js              # Task CRUD
│   ├── reminders.api.js          # Reminder CRUD
│   └── progress.api.js           # Course progress CRUD — endpoint: /api/v1/course-progress
│
├── auth/
│   ├── AuthContext.jsx           # login(), logout(), user state (token + firstName + lastName)
│   └── ProtectedRoute.jsx        # Redirects to /login if no token in sessionStorage
│
├── config/
│   └── env.js                    # USE_MOCK_AUTH and USE_MOCK_API flags (read from .env)
│
├── components/
│   ├── Sidebar.jsx               # Brand, user initials, LeftPanel, Logout
│   ├── LeftPanel.jsx             # Tab-aware action menu
│   ├── Navbar.jsx                # Top tab navigation
│   └── ui/                       # Shared UI components
│       ├── Modal.jsx             # Reusable modal wrapper
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── FormField.jsx         # Supports inline error display
│       ├── FormShell.jsx         # Form wrapper with save/cancel actions
│       ├── ConfirmDialog.jsx
│       ├── EmptyState.jsx
│       ├── ListItem.jsx
│       ├── Badge.jsx
│       └── SectionHeader.jsx
│
├── features/
│   ├── auth/                     # Login, Signup pages + mock/real service
│   ├── courses/                  # CoursesPage, CourseDetailPage, CourseForm (inline validation)
│   ├── tasks/                    # TasksPage, TaskDetailPage, TaskForm (inline validation)
│   ├── reminders/                # RemindersPage, ReminderDetailPage, ReminderForm (inline validation)
│   ├── progress/                 # ProgressPage, ProgressDetailPage, ProgressForm
│   └── profile/                  # ProfilePage
│
├── routes/
│   └── DashboardLayout.jsx       # Dashboard shell. Shows due reminder popup on login.
│
└── app/
    └── router.jsx                # All routes defined here
```

---

## Dashboard Tabs

| Tab | Endpoint | Key | Dropdowns |
|---|---|---|---|
| Courses | `/api/v1/courses` | `courseId` | — |
| Tasks | `/api/v1/tasks` | `taskId` | Course |
| Reminders | `/api/v1/reminders` | `reminderId` | Task |
| Progress | `/api/v1/course-progress` | `progressId` | Course |

**How selection works:**
1. Click any card/row → item is selected
2. Edit + Delete buttons activate in the left panel
3. Click Edit → form pre-filled with existing data
4. Click Delete → confirm dialog → item removed

**Tasks tab extras:**
- Sorted by due date (nearest first)
- Filter strip: `All` · `Overdue` · `Due Today` · `This Week`
- Overdue tasks → red left border

**Sidebar:**
- User initials circle → derived from firstName + lastName stored in sessionStorage

---

## Form Validation

All forms include inline validation — errors appear per field as the user types.
Validation rules match backend DTO constraints:

| Form | Rules |
|---|---|
| Course | All fields required, code max 10 chars, grade goal 0–100 |
| Task | Course, title, due date required, weight 0–100 |
| Reminder | Task, message, scheduled date required |
| Signup | All fields required, valid email, password min 6 chars |

---

## Due Reminder Popup

On dashboard load, the app fetches reminders and shows a modal if any are past due and not yet sent.
Implemented in `DashboardLayout.jsx` using the existing `Modal` component.

---

## Course Model (backend required fields)
```json
{
  "code": "COMP3095",
  "title": "Capstone Project I",
  "instructor": "GBC",
  "gradeGoal": 85,
  "startWeek": "2026-02-10",
  "meetings": [
    { "dayOfWeek": 1, "startTime": "10:00:00", "endTime": "12:00:00" }
  ]
}
```

> `dayOfWeek`: 1 = Monday, 7 = Sunday (ISO standard)
> All fields required — backend returns 400 if any are missing


## Backend

Repo: [classmate-backend_v3](https://github.com/ClassMate3000/classmate-backend_v3)
```bash
docker compose up -d
```