import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../auth/AuthContext";
import styles from "./DashboardLayout.module.css";

function getSectionFromPath(pathname) {
  if (pathname.startsWith("/dashboard/profile")) return "profile";
  if (pathname.startsWith("/dashboard/tasks")) return "tasks";
  if (pathname.startsWith("/dashboard/reminders")) return "reminders";
  if (pathname.startsWith("/dashboard/progress")) return "progress";
  return "courses";
}

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [darkMode, setDarkMode] = useState(
    () => sessionStorage.getItem("theme") === "dark"
  );
  const [activeFilter, setActiveFilter] = useState("all");

  const currentSection = useMemo(
    () => getSectionFromPath(location.pathname),
    [location.pathname]
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  function handleAction(actionKey) {
    window.dispatchEvent(
      new CustomEvent("classmate:left-action", {
        detail: { section: currentSection, action: actionKey },
      })
    );
  }

  function handleFilterChange(filterKey) {
    setActiveFilter(filterKey);

    window.dispatchEvent(
      new CustomEvent("classmate:left-filter", {
        detail: { section: currentSection, filter: filterKey },
      })
    );
  }

  function handleToggleDarkMode() {
    setDarkMode((prev) => {
      const next = !prev;
      sessionStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  }

  function handleOpenProfile() {
    navigate("/dashboard/profile");
  }

  return (
    <div className={`${styles.appShell} ${styles[`theme-${currentSection}`]}`}>
      <Sidebar
        currentSection={currentSection}
        user={user}
        activeFilter={activeFilter}
        onAction={handleAction}
        onFilterChange={handleFilterChange}
        onOpenProfile={handleOpenProfile}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onLogout={() => {
          logout();
          navigate("/login");
        }}
      />

      <main className={styles.main}>
        <Navbar currentSection={currentSection} onNavigate={navigate} />
        <section className={styles.content}>
          <Outlet context={{ activeFilter }} />
        </section>
      </main>
    </div>
  );
}