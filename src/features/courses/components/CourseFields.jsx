import FormField from "../../../components/ui/FormField";
import styles from "./CourseFields.module.css";

const DAYS = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
  { label: "Sunday", value: 7 },
];

export default function CourseFields({ form, setForm }) {
  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  return (
    <>
      <FormField label="Name">
        <input className={styles.input} value={form.title} onChange={handleChange("title")} />
      </FormField>

      <FormField label="Course Code">
        <input className={styles.input} value={form.code} onChange={handleChange("code")} />
      </FormField>

      <FormField label="Instructor">
        <input className={styles.input} value={form.instructor} onChange={handleChange("instructor")} />
      </FormField>

      <FormField label="Class Day">
        <select className={styles.input} value={form.dayOfWeek} onChange={handleChange("dayOfWeek")}>
          {DAYS.map((day) => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </select>
      </FormField>

      <div className={styles.row}>
        <FormField label="Start Time">
          <input className={styles.input} type="time" value={form.startTime} onChange={handleChange("startTime")} />
        </FormField>

        <FormField label="End Time">
          <input className={styles.input} type="time" value={form.endTime} onChange={handleChange("endTime")} />
        </FormField>
      </div>

      <div className={styles.row}>
        <FormField label="Grade Goal (%)">
          <input
            className={styles.input}
            type="number"
            min="0"
            max="100"
            value={form.gradeGoal}
            onChange={handleChange("gradeGoal")}
          />
        </FormField>

        <FormField label="Start Week">
          <input className={styles.input} type="date" value={form.startWeek} onChange={handleChange("startWeek")} />
        </FormField>
      </div>
    </>
  );
}