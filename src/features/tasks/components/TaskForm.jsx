import { useState } from "react";
import styles from "./TaskForm.module.css";

const TASK_TYPES = ["ASSIGNMENT", "STUDY", "LAB", "EXAM", "PROJECT", "OTHER"];

function toDateInput(isoString) {
  if (!isoString) return "";
  return isoString.split("T")[0];
}

export default function TaskForm({
  mode = "create",
  initialValues = null,
  courses = [],
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState({
    courseId: initialValues?.courseId ?? "",
    title: initialValues?.title ?? "",
    type: initialValues?.type ?? "ASSIGNMENT",
    dueDate: toDateInput(initialValues?.dueDate),
    weight: initialValues?.weight ?? "",
    bonus: initialValues?.bonus ?? false,
    isCompleted: initialValues?.isCompleted ?? false,
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

    if (!form.courseId) return setError("Course is required.");
    if (!form.title.trim()) return setError("Task name is required.");

    setSaving(true);
    setError("");

    try {
      await onSubmit({
        courseId: Number(form.courseId),
        title: form.title.trim(),
        type: form.type,
        dueDate: form.dueDate ? `${form.dueDate}T17:00:00` : null,
        weight: form.weight ? Number(form.weight) : null,
        bonus: form.bonus,
        isCompleted: form.isCompleted,
      });
    } catch {
      setError(
        mode === "edit"
          ? "Failed to update task. Please try again."
          : "Failed to save task. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>Course</label>
        <select className={styles.input} value={form.courseId} onChange={handleChange("courseId")}>
          <option value="">Select a course...</option>
          {courses.map((course) => (
            <option key={course.courseId} value={course.courseId}>
              {course.code} — {course.title}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Task Name</label>
        <input className={styles.input} value={form.title} onChange={handleChange("title")} />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Type</label>
          <select className={styles.input} value={form.type} onChange={handleChange("type")}>
            {TASK_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Due Date</label>
          <input className={styles.input} type="date" value={form.dueDate} onChange={handleChange("dueDate")} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Weight (%)</label>
          <input
            className={styles.input}
            type="number"
            min="0"
            max="100"
            value={form.weight}
            onChange={handleChange("weight")}
          />
        </div>

        <label className={styles.checkboxRow}>
          <input type="checkbox" checked={form.bonus} onChange={handleChange("bonus")} />
          Bonus
        </label>
      </div>

      {mode === "edit" ? (
        <label className={styles.checkboxRow}>
          <input type="checkbox" checked={form.isCompleted} onChange={handleChange("isCompleted")} />
          Completed
        </label>
      ) : null}

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