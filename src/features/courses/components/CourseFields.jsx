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

// Accepts optional errors object to show inline validation messages per field
export default function CourseFields({ form, setForm, errors = {} }) {
  function handleChange(field) {
    return (e) => {
      setForm(field, e.target.value);
    };
  }

  return (
    <>
      <FormField label="Name" error={errors.title}>
        <input className={styles.input} value={form.title} onChange={handleChange("title")} />
      </FormField>

      <FormField label="Course Code" error={errors.code}>
        {/* maxLength matches backend constraint: code must be at most 10 characters */}
        <input className={styles.input} value={form.code} onChange={handleChange("code")} maxLength={10} />
      </FormField>

      <FormField label="Instructor" error={errors.instructor}>
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
        <FormField label="Start Time" error={errors.startTime}>
          <input className={styles.input} type="time" value={form.startTime} onChange={handleChange("startTime")} />
        </FormField>

        <FormField label="End Time" error={errors.endTime}>
          <input className={styles.input} type="time" value={form.endTime} onChange={handleChange("endTime")} />
        </FormField>
      </div>

      <div className={styles.row}>
        <FormField label="Grade Goal (%)" error={errors.gradeGoal}>
          <input
            className={styles.input}
            type="number"
            min="0"
            max="100"
            value={form.gradeGoal}
            onChange={handleChange("gradeGoal")}
          />
        </FormField>

        <FormField label="Start Week" error={errors.startWeek}>
          <input className={styles.input} type="date" value={form.startWeek} onChange={handleChange("startWeek")} />
        </FormField>
      </div>
    </>
  );
}