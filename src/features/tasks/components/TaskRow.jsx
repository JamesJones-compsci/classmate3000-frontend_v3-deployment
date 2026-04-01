import ListItem from "../../../components/ui/ListItem";
import styles from "./TaskRow.module.css";

export default function TaskRow({ task }) {
  return (
    <ListItem className={styles.row}>
      <div className={styles.title}>{task.title}</div>
      <div className={styles.meta}>
        {task.type} {task.dueDate ? `· ${task.dueDate.split("T")[0]}` : ""}
      </div>
    </ListItem>
  );
}