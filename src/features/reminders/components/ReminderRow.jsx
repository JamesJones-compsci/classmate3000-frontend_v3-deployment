import { useNavigate } from "react-router-dom";
import ListItem from "../../../components/ui/ListItem";
import Badge from "../../../components/ui/Badge";
import { useCourses } from "../../courses/hooks/useCourses";
import { useTasks } from "../../tasks/hooks/useTasks";
import styles from "./ReminderRow.module.css";

function formatScheduledAt(value) {
  if (!value) return "No scheduled time";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.replace("T", " ");
  }

  const datePart = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const timePart = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${datePart} • ${timePart}`;
}

export default function ReminderRow({ reminder }) {
  const { courses } = useCourses();
  const { tasks } = useTasks();
  const navigate = useNavigate();

  const linkedTask = tasks.find(
    (task) => String(task.taskId) === String(reminder.taskId)
  );

  const linkedCourse = courses.find(
    (course) => String(course.courseId) === String(linkedTask?.courseId)
  );

  const courseCode = linkedCourse?.code ?? "No course";

  return (
    <ListItem className={styles.row} clickable>
      <div className={styles.topRow}>
        <div className={styles.mainText}>
          <span className={styles.message}>{reminder.message}</span>
        </div>

        <Badge tone={reminder.wasSent ? "success" : "warning"}>
          {reminder.wasSent ? "Sent" : "Pending"}
        </Badge>
      </div>

      <div className={styles.metaRow}>
        <button
          type="button"
          className={styles.courseLink}
          onClick={(e) => {
            e.stopPropagation();
            if (linkedCourse?.courseId) {
              navigate(`/dashboard/courses/${linkedCourse.courseId}`);
            }
          }}
        >
          {courseCode}
        </button>
        <span className={styles.metaValue}>
          {formatScheduledAt(reminder.scheduledAt)}
        </span>
      </div>
    </ListItem>
  );
}