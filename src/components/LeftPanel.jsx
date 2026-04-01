import styles from "./LeftPanel.module.css";

const navItems = [
  {
    key: "courses",
    label: "Courses",
    description: "Manage courses",
    path: "/dashboard/courses",
  },
  {
    key: "tasks",
    label: "Tasks",
    description: "Assignments and deadlines",
    path: "/dashboard/tasks",
  },
  {
    key: "reminders",
    label: "Reminders",
    description: "Scheduled reminders",
    path: "/dashboard/reminders",
  },
  {
    key: "progress",
    label: "Progress",
    description: "Weekly course progress",
    path: "/dashboard/progress",
  },
];

export default function LeftPanel({ currentSection, onNavigate }) {
  return (
    <nav className={styles.leftpanel} aria-label="Sidebar navigation">
      <div className={styles.sectionTitle}>Workspace</div>

      <div className={styles.menu}>
        {navItems.map((item) => {
          const isActive = currentSection === item.key;

          return (
            <button
              key={item.key}
              type="button"
              className={`${styles.item} ${isActive ? styles.active : ""}`}
              onClick={() => onNavigate(item.path)}
            >
              <span className={styles.itemText}>
                <span className={styles.itemLabel}>{item.label}</span>
                <span className={styles.itemDescription}>{item.description}</span>
              </span>

              <span className={styles.arrow}>›</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}