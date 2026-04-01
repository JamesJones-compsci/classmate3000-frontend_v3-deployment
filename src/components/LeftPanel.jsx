import styles from "./LeftPanel.module.css";

const sectionConfig = {
  courses: {
    title: "Courses",
    actions: [
      { key: "all", label: "All Courses", type: "action" },
      { key: "add", label: "Add Course", type: "action" },
    ],
  },

  tasks: {
    title: "Tasks",
    actions: [
      { key: "all", label: "All Tasks", type: "filter" },
      { key: "overdue", label: "Overdue", type: "filter" },
      { key: "today", label: "Due Today", type: "filter" },
      { key: "week", label: "This Week", type: "filter" },
      { key: "add", label: "Add Task", type: "action" },
    ],
  },

  reminders: {
    title: "Reminders",
    actions: [
      { key: "all", label: "All Reminders", type: "filter" },
      { key: "pending", label: "Pending", type: "filter" },
      { key: "sent", label: "Sent", type: "filter" },
      { key: "add", label: "Add Reminder", type: "action" },
    ],
  },

  progress: {
    title: "Progress",
    actions: [
      { key: "all", label: "All Courses", type: "filter" },
      { key: "latest", label: "Latest Week", type: "filter" },
      { key: "add", label: "Add Progress", type: "action" },
    ],
  },
};

export default function LeftPanel({
  currentSection,
  onAction,
  activeFilter = "all",
  onFilterChange,
  onOpenProfile,
  darkMode = false,
  onToggleDarkMode,
  onLogout,
}) {
  const section = sectionConfig[currentSection] ?? sectionConfig.courses;

  function handleItemClick(item) {
    if (item.type === "filter") {
      onFilterChange?.(item.key);
      return;
    }

    onAction?.(item.key);
  }

  return (
    <div className={styles.panel}>
      <div className={styles.sectionTitle}>{section.title}</div>

      <div className={styles.group}>
        {section.actions.map((item) => {
          const isActiveFilter = item.type === "filter" && activeFilter === item.key;

          return (
            <button
              key={item.key}
              type="button"
              className={[styles.item, isActiveFilter ? styles.active : ""]
                .filter(Boolean)
                .join(" ")}
              onClick={() => handleItemClick(item)}
            >
              <span>{item.label}</span>
              <span className={styles.arrow}>›</span>
            </button>
          );
        })}
      </div>

      <div className={styles.divider} />

      <div className={styles.sectionTitle}>Settings</div>

      <div className={styles.group}>
        <button type="button" className={styles.item} onClick={onOpenProfile}>
          <span>Profile</span>
          <span className={styles.arrow}>›</span>
        </button>

        <button type="button" className={styles.item} onClick={onToggleDarkMode}>
          <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          <span className={styles.arrow}>›</span>
        </button>
      </div>

      <div className={styles.divider} />

      <button type="button" className={`${styles.item} ${styles.danger}`} onClick={onLogout}>
        <span>Logout</span>
        <span className={styles.arrow}>›</span>
      </button>
    </div>
  );
}