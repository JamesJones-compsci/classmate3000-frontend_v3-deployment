import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import Login from "../features/auth/pages/LoginPage";
import Signup from "../features/auth/pages/SignupPage";
import DashboardLayout from "../routes/DashboardLayout";

import ProfilePage from "../features/profile/pages/ProfilePage";

import CoursesPage from "../features/courses/pages/CoursesPage";
import CourseDetailPage from "../features/courses/pages/CourseDetailPage";

import TasksPage from "../features/tasks/pages/TasksPage";
import TaskDetailPage from "../features/tasks/pages/TaskDetailPage";

import RemindersPage from "../features/reminders/pages/RemindersPage";
import ReminderDetailPage from "../features/reminders/pages/ReminderDetailPage";

import ProgressPage from "../features/progress/pages/ProgressPage";
import ProgressDetailPage from "../features/progress/pages/ProgressDetailPage";

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
          <Route path="courses/:courseId" element={<CourseDetailPage />} />

          <Route path="tasks" element={<TasksPage />} />
          <Route path="tasks/:taskId" element={<TaskDetailPage />} />

          <Route path="reminders" element={<RemindersPage />} />
          <Route path="reminders/:reminderId" element={<ReminderDetailPage />} />

          <Route path="progress" element={<ProgressPage />} />
          <Route path="progress/:courseId" element={<ProgressDetailPage />} />

          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}