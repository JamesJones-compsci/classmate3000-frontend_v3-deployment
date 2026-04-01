import styles from "./Navbar.module.css";

const tabs = [
  { key: "courses", label: "Courses", path: "/dashboard/courses" },
  { key: "tasks", label: "Tasks", path: "/dashboard/tasks" },
  { key: "reminders", label: "Reminders", path: "/dashboard/reminders" },
  { key: "progress", label: "Progress", path: "/dashboard/progress" },
];

export default function Navbar({ currentSection, onNavigate }) {
  return (
    <div className={styles.topTabs}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`${styles.tab} ${currentSection === tab.key ? styles.active : ""}`}
          onClick={() => onNavigate(tab.path)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}