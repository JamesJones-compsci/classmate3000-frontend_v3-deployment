import { useState } from "react";
import styles from "./ProgressForm.module.css";

export default function ProgressForm({
  mode = "create",
  initialValues = null,
  courses = [],
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState({
    courseId: initialValues?.courseId ?? "",
    currentGradePercent: initialValues?.currentGradePercent ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.courseId) return setError("Course is required.");
    if (!form.currentGradePercent && form.currentGradePercent !== 0) {
      return setError("Current grade is required.");
    }

    setSaving(true);
    setError("");

    try {
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
      const weekOf = initialValues?.weekOf ?? monday.toISOString().split("T")[0];

      await onSubmit({
        courseId: Number(form.courseId),
        currentGradePercent: Number(form.currentGradePercent),
        weekOf,
        computedAt: new Date().toISOString(),
      });
    } catch {
      setError(
        mode === "edit"
          ? "Failed to update progress. Please try again."
          : "Failed to save progress. Please try again."
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
        <label className={styles.label}>Current Grade (%)</label>
        <input
          className={styles.input}
          type="number"
          min="0"
          max="100"
          value={form.currentGradePercent}
          onChange={handleChange("currentGradePercent")}
        />
      </div>

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