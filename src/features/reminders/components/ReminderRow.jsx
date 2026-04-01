import ListItem from "../../../components/ui/ListItem";
import styles from "./ReminderRow.module.css";

export default function ReminderRow({ reminder }) {
  return (
    <ListItem className={styles.row}>
      <div className={styles.title}>{reminder.message}</div>
      <div className={styles.meta}>
        {reminder.scheduledAt ? reminder.scheduledAt.replace("T", " ") : "No scheduled time"}
      </div>
    </ListItem>
  );
}