import { useState } from "react";
import styles from "./CourseForm.module.css";

const DAYS = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
  { label: "Sunday", value: 7 },
];

function toTimeInput(timeStr) {
  if (!timeStr) return "";
  return timeStr.slice(0, 5);
}

export default function CourseForm({
  mode = "create",
  initialValues = null,
  onSubmit,
  onCancel,
}) {
  const firstMeeting = initialValues?.meetings?.[0] ?? null;

  const [form, setForm] = useState({
    title: initialValues?.title ?? "",
    code: initialValues?.code ?? "",
    instructor: initialValues?.instructor ?? "",
    gradeGoal: initialValues?.gradeGoal ?? "",
    startWeek: initialValues?.startWeek ?? "",
    dayOfWeek: String(firstMeeting?.dayOfWeek ?? 1),
    startTime: toTimeInput(firstMeeting?.startTime ?? ""),
    endTime: toTimeInput(firstMeeting?.endTime ?? ""),
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

    if (!form.title.trim()) return setError("Course name is required.");
    if (!form.code.trim()) return setError("Course code is required.");
    if (!form.instructor.trim()) return setError("Instructor is required.");
    if (!form.gradeGoal) return setError("Grade goal is required.");
    if (!form.startWeek) return setError("Start week is required.");
    if (!form.startTime || !form.endTime) {
      return setError("Class start and end time are required.");
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        title: form.title.trim(),
        code: form.code.trim(),
        instructor: form.instructor.trim(),
        gradeGoal: Number(form.gradeGoal),
        startWeek: form.startWeek,
        meetings: [
          {
            dayOfWeek: Number(form.dayOfWeek),
            startTime: `${form.startTime}:00`,
            endTime: `${form.endTime}:00`,
          },
          ...((initialValues?.meetings ?? []).slice(1)),
        ],
      };

      await onSubmit(payload);
    } catch {
      setError(
        mode === "edit"
          ? "Failed to update course. Please try again."
          : "Failed to save course. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label}>Name</label>
        <input className={styles.input} value={form.title} onChange={handleChange("title")} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Course Code</label>
        <input className={styles.input} value={form.code} onChange={handleChange("code")} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Instructor</label>
        <input className={styles.input} value={form.instructor} onChange={handleChange("instructor")} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Class Day</label>
        <select className={styles.input} value={form.dayOfWeek} onChange={handleChange("dayOfWeek")}>
          {DAYS.map((day) => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Start Time</label>
          <input className={styles.input} type="time" value={form.startTime} onChange={handleChange("startTime")} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>End Time</label>
          <input className={styles.input} type="time" value={form.endTime} onChange={handleChange("endTime")} />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Grade Goal (%)</label>
          <input
            className={styles.input}
            type="number"
            min="0"
            max="100"
            value={form.gradeGoal}
            onChange={handleChange("gradeGoal")}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Start Week</label>
          <input className={styles.input} type="date" value={form.startWeek} onChange={handleChange("startWeek")} />
        </div>
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