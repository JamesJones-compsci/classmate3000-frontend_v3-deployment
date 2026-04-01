import ListItem from "../../../components/ui/ListItem";
import Badge from "../../../components/ui/Badge";
import styles from "./TaskRow.module.css";

export default function TaskRow({ task }) {
  return (
    <ListItem className={styles.row}>
      <div className={styles.top}>
        <div className={styles.title}>{task.title}</div>
        <Badge tone="info">{task.type}</Badge>
      </div>

      <div className={styles.meta}>
        {task.dueDate ? task.dueDate.split("T")[0] : "No due date"}
      </div>
    </ListItem>
  );
}