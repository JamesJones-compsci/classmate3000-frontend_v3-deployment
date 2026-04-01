import FormField from "../../../components/ui/FormField";
import styles from "./TaskFields.module.css";

const TASK_TYPES = ["ASSIGNMENT", "STUDY", "LAB", "EXAM", "PROJECT", "OTHER"];

export default function TaskFields({ form, setForm, courses = [], mode = "create" }) {
  function handleChange(field) {
    return (e) => {
      const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };
  }

  return (
    <>
      <FormField label="Course">
        <select className={styles.input} value={form.courseId} onChange={handleChange("courseId")}>
          <option value="">Select a course...</option>
          {courses.map((course) => (
            <option key={course.courseId} value={course.courseId}>
              {course.code} — {course.title}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Task Name">
        <input className={styles.input} value={form.title} onChange={handleChange("title")} />
      </FormField>

      <div className={styles.row}>
        <FormField label="Type">
          <select className={styles.input} value={form.type} onChange={handleChange("type")}>
            {TASK_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Due Date">
          <input className={styles.input} type="date" value={form.dueDate} onChange={handleChange("dueDate")} />
        </FormField>
      </div>

      <div className={styles.row}>
        <FormField label="Weight (%)">
          <input
            className={styles.input}
            type="number"
            min="0"
            max="100"
            value={form.weight}
            onChange={handleChange("weight")}
          />
        </FormField>

        <div className={styles.checkboxField}>
          <label className={styles.checkboxRow}>
            <input type="checkbox" checked={form.bonus} onChange={handleChange("bonus")} />
            Bonus
          </label>
        </div>
      </div>

      {mode === "edit" ? (
        <div className={styles.checkboxField}>
          <label className={styles.checkboxRow}>
            <input type="checkbox" checked={form.isCompleted} onChange={handleChange("isCompleted")} />
            Completed
          </label>
        </div>
      ) : null}
    </>
  );
}