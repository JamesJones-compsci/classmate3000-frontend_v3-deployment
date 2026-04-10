import FormField from "../../../components/ui/FormField";
import styles from "./ProgressFields.module.css";

export default function ProgressFields({ form, setForm, courses = [] }) {
  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
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

      <FormField label="Current Grade (%)">
        <input
          className={styles.input}
          type="number"
          min="0"
          max="100"
          value={form.currentGradePercent}
          onChange={handleChange("currentGradePercent")}
        />
      </FormField>
    </>
  );
}