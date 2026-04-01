import styles from "./LeftPanel.module.css";

export default function LeftPanel({
  currentSection,
  onNavigate,
}) {
  const labels = {
    courses: {
      all: "All Courses",
      add: "Add a Course",
      edit: "Edit a Course",
      del: "Delete a Course",
      path: "/dashboard/courses",
    },
    tasks: {
      all: "All Tasks",
      add: "Add a Task",
      edit: "Edit a Task",
      del: "Delete a Task",
      path: "/dashboard/tasks",
    },
    reminders: {
      all: "All Reminders",
      add: "Add a Reminder",
      edit: "Edit a Reminder",
      del: "Delete a Reminder",
      path: "/dashboard/reminders",
    },
    progress: {
      all: "All Progress",
      add: "Add Progress",
      edit: "Edit Progress",
      del: "Delete Progress",
      path: "/dashboard/progress",
    },
  };

  const t = labels[currentSection] ?? labels.courses;

  return (
    <div className={styles.leftpanel}>
      <div className={styles.menu}>
        <button type="button" className={styles.item} onClick={() => onNavigate(t.path)}>
          <span>{t.all}</span>
          <span>›</span>
        </button>
      </div>
    </div>
  );
}