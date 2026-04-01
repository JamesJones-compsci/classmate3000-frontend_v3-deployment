import ListItem from "../../../components/ui/ListItem";
import Badge from "../../../components/ui/Badge";
import styles from "./ReminderRow.module.css";

export default function ReminderRow({ reminder }) {
  return (
    <ListItem className={styles.row} warm>
      <div className={styles.top}>
        <div className={styles.title}>{reminder.message}</div>
        <Badge tone={reminder.wasSent ? "success" : "warning"}>
          {reminder.wasSent ? "Sent" : "Pending"}
        </Badge>
      </div>

      <div className={styles.meta}>
        {reminder.scheduledAt ? reminder.scheduledAt.replace("T", " ") : "No scheduled time"}
      </div>
    </ListItem>
  );
}