import { useState } from "react";
import styles from "./ReminderForm.module.css";

function toDateTimeInput(isoString) {
  if (!isoString) return "";
  return isoString.slice(0, 16);
}

export default function ReminderForm({
  mode = "create",
  initialValues = null,
  tasks = [],
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState({
    taskId: initialValues?.taskId ?? "",
    message: initialValues?.message ?? "",
    scheduledAt: toDateTimeInput(initialValues?.scheduledAt),
    wasSent: initialValues?.wasSent ?? false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(field) {
    return (e) => {
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.taskId) return setError("Task is required.");
    if (!form.message.trim()) return setError("Message is required.");

    setSaving(true);
    setError("");

    try {
      await onSubmit({
        taskId: Number(form.taskId),
        message: form.message.trim(),
        scheduledAt: form.scheduledAt ? `${form.scheduledAt}:00` : null,
        wasSent: form.wasSent,
      });
    } catch {
      setError(
        mode === "edit"
          ? "Failed to update reminder. Please try again."
          : "Failed to save reminder. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>Task</label>
        <select className={styles.input} value={form.taskId} onChange={handleChange("taskId")}>
          <option value="">Select a task...</option>
          {tasks.map((task) => (
            <option key={task.taskId} value={task.taskId}>
              {task.title} {task.type ? `(${task.type})` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Message</label>
        <input className={styles.input} value={form.message} onChange={handleChange("message")} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Scheduled At</label>
        <input
          className={styles.input}
          type="datetime-local"
          value={form.scheduledAt}
          onChange={handleChange("scheduledAt")}
        />
      </div>

      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={form.wasSent} onChange={handleChange("wasSent")} />
        Already Sent
      </label>

      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.actions}>
        <button type="button" className={styles.secondaryBtn} onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className={styles.primaryBtn} disabled={saving}>
          {saving ? "Saving..." : mode === "edit" ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
}