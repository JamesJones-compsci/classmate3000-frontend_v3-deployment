import FormField from "../../../components/ui/FormField";
import styles from "./ReminderFields.module.css";

export default function ReminderFields({ form, setForm, tasks = [] }) {
  function handleChange(field) {
    return (e) => {
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };
  }

  return (
    <>
      <FormField label="Task">
        <select className={styles.input} value={form.taskId} onChange={handleChange("taskId")}>
          <option value="">Select a task...</option>
          {tasks.map((task) => (
            <option key={task.taskId} value={task.taskId}>
              {task.title} {task.type ? `(${task.type})` : ""}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Message">
        <input className={styles.input} value={form.message} onChange={handleChange("message")} />
      </FormField>

      <FormField label="Scheduled At">
        <input
          className={styles.input}
          type="datetime-local"
          value={form.scheduledAt}
          onChange={handleChange("scheduledAt")}
        />
      </FormField>

      <div className={styles.checkboxField}>
        <label className={styles.checkboxRow}>
          <input type="checkbox" checked={form.wasSent} onChange={handleChange("wasSent")} />
          Already Sent
        </label>
      </div>
    </>
  );
}