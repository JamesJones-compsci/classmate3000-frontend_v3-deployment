import styles from "./LeftPanel.module.css";

const sectionConfig = {
  courses: {
    title: "COURSES",
    actions: [
      { key: "all", label: "All Courses", type: "action" },
      { key: "add", label: "Add Course", type: "action" },
    ],
  },

  tasks: {
    title: "TASKS",
    actions: [
      { key: "all", label: "All Tasks", type: "filter" },
      { key: "overdue", label: "Overdue", type: "filter" },
      { key: "today", label: "Due Today", type: "filter" },
      { key: "week", label: "This Week", type: "filter" },
      { key: "add", label: "Add Task", type: "action" },
    ],
  },

  reminders: {
    title: "REMINDERS",
    actions: [
      { key: "all", label: "All Reminders", type: "filter" },
      { key: "pending", label: "Pending", type: "filter" },
      { key: "sent", label: "Sent", type: "filter" },
      { key: "add", label: "Add Reminder", type: "action" },
    ],
  },

  progress: {
    title: "PROGRESS",
    actions: [
      { key: "all", label: "All Courses", type: "filter" },
      { key: "latest", label: "Latest Week", type: "filter" },
      { key: "add", label: "Add Progress", type: "action" },
    ],
  },
};

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path
        d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path
        d="M10 4H5v16h5v-2H7V6h3V4Zm4.59 4.59L16.17 10H9v2h7.17l-1.58 1.41L16 15l4-4l-4-4l-1.41 1.59Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path
        d="M12 8a4 4 0 1 0 4 4a4 4 0 0 0-4-4Zm0-6h1v3h-1Zm0 19h1v3h-1ZM2 11h3v1H2Zm17 0h3v1h-3ZM4.93 4.22l.71-.71l2.12 2.12l-.71.71Zm10.95 10.95l.71-.71l2.12 2.12l-.71.71ZM15.88 5.64L18 3.52l.71.71l-2.12 2.12ZM5.64 18.36l2.12-2.12l.71.71l-2.12 2.12Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path
        d="M14.5 2.5a8.5 8.5 0 1 0 7 13.33A9.5 9.5 0 0 1 14.5 2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

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
      <div className={styles.divider} />

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
              <span className={styles.itemLabel}>{item.label}</span>
              <span className={styles.arrow}>›</span>
            </button>
          );
        })}
      </div>

      <div className={styles.divider} />

      <div className={styles.sectionTitle}>USER</div>

      <div className={styles.group}>
        <button type="button" className={styles.toggleItem} onClick={onToggleDarkMode}>
          <span className={styles.itemLeft}>
            {darkMode ? <MoonIcon /> : <SunIcon />}
            <span className={styles.itemLabel}>
              {darkMode ? "Dark Mode" : "Light Mode"}
            </span>
          </span>

          <span
            className={`${styles.toggle} ${darkMode ? styles.toggleOn : ""}`}
            aria-hidden="true"
          >
            <span className={styles.toggleKnob} />
          </span>
        </button>

        <button type="button" className={styles.item} onClick={onOpenProfile}>
          <span className={styles.itemLeft}>
            <ProfileIcon />
            <span className={styles.itemLabel}>Profile</span>
          </span>
          <span className={styles.arrow}>›</span>
        </button>

        <button type="button" className={styles.item} onClick={onLogout}>
          <span className={styles.itemLeft}>
            <LogoutIcon />
            <span className={styles.itemLabel}>Logout</span>
          </span>
          <span className={styles.arrow}>›</span>
        </button>
      </div>

      <div className={styles.divider} />
    </div>
  );
}