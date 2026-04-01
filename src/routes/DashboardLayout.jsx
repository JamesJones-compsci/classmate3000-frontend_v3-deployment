import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../auth/AuthContext";
import styles from "./DashboardLayout.module.css";

function getSectionFromPath(pathname) {
  if (pathname.includes("/dashboard/tasks")) return "tasks";
  if (pathname.includes("/dashboard/reminders")) return "reminders";
  if (pathname.includes("/dashboard/progress")) return "progress";
  return "courses";
}

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const currentSection = getSectionFromPath(location.pathname);

  return (
    <div className={styles.appShell}>
      <Sidebar
        currentSection={currentSection}
        onNavigate={navigate}
        onLogout={() => {
          logout();
          navigate("/login");
        }}
        user={user}
      />

      <main className={styles.main}>
        <Navbar currentSection={currentSection} onNavigate={navigate} />
        <section className={styles.content}>
          <Outlet />
        </section>
      </main>
    </div>
  );
}