import ListItem from "../../../components/ui/ListItem";
import Badge from "../../../components/ui/Badge";
import styles from "./TaskRow.module.css";

function getStatusIcon(task) {
  if (task.isPriority) return "!";
  if (task.isCompleted) return "✓";
  return "";
}

export default function TaskRow({ task, onToggleStatus }) {
  const overdue =
    task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted;

  return (
    <ListItem className={styles.row} overdue={overdue} clickable>
      <button
        type="button"
        className={styles.statusButton}
        onClick={(e) => {
          e.stopPropagation();
          onToggleStatus?.(task);
        }}
      >
        <span className={styles.statusIcon}>{getStatusIcon(task)}</span>
      </button>

      <div className={styles.content}>
        <div className={styles.topRow}>
          <div className={styles.mainText}>
            <span className={styles.date}>
              {task.dueDate ? task.dueDate.slice(0, 10) : "No date"}
            </span>
            <span className={styles.title}>{task.title}</span>
            {task.weight && (
              <span className={styles.weight}>{task.weight}%</span>
            )}
          </div>
          <Badge tone="info">{task.type}</Badge>
        </div>

        <div className={styles.subRow}>
          {task.description || ""} {task.courseCode ? `- ${task.courseCode}` : ""}
        </div>
      </div>
    </ListItem>
  );
}