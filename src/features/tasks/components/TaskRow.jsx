import ListItem from "../../../components/ui/ListItem";
import Badge from "../../../components/ui/Badge";
import styles from "./TaskRow.module.css";

export default function TaskRow({ task }) {
  const overdue =
    task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted;

  return (
    <ListItem className={styles.row} overdue={overdue}>
      <div className={styles.top}>
        <div className={styles.title}>{task.title}</div>
        <Badge tone="info">{task.type}</Badge>
      </div>

      <div className={styles.meta}>
        {task.dueDate ? task.dueDate.split("T")[0] : "No due date"}
        {task.weight ? ` · ${task.weight}%` : ""}
      </div>
    </ListItem>
  );
}