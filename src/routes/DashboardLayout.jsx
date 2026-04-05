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

function getFilterFromSearch(search) {
  const params = new URLSearchParams(search);
  return params.get("filter") || "all";
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
    const isCoursesListPage = location.pathname === "/dashboard/courses";
    const isTasksListPage = location.pathname === "/dashboard/tasks";
    const isRemindersListPage = location.pathname === "/dashboard/reminders";
    const isProgressListPage = location.pathname === "/dashboard/progress";

    if (isTasksListPage || isRemindersListPage || isProgressListPage) {
      setActiveFilter(getFilterFromSearch(location.search));
      return;
    }

    if (isCoursesListPage) {
      setActiveFilter("all");
      return;
    }

    setActiveFilter("");
  }, [currentSection, location.pathname, location.search]);

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
    if (currentSection === "tasks") {
      navigate(
        filterKey === "all"
          ? "/dashboard/tasks"
          : `/dashboard/tasks?filter=${filterKey}`
      );
      return;
    }

    if (currentSection === "reminders") {
      navigate(
        filterKey === "all"
          ? "/dashboard/reminders"
          : `/dashboard/reminders?filter=${filterKey}`
      );
      return;
    }

    if (currentSection === "progress") {
      navigate(
        filterKey === "all"
          ? "/dashboard/progress"
          : `/dashboard/progress?filter=${filterKey}`
      );
      return;
    }

    if (currentSection === "courses") {
      navigate("/dashboard/courses");
      return;
    }

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
          <Outlet />
        </section>
      </main>
    </div>
  );
}