import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import DashboardLayout from "../routes/DashboardLayout";
import CoursesPage from "../features/courses/pages/CoursesPage";
import TasksPage from "../features/tasks/pages/TasksPage";
import RemindersPage from "../features/reminders/pages/RemindersPage";
import ProgressPage from "../features/progress/pages/ProgressPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="courses" replace />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="progress" element={<ProgressPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}