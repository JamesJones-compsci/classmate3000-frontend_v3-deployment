import styles from "./FormField.module.css";

export default function FormField({
  label,
  error,
  children,
  htmlFor,
  hint,
}) {
  return (
    <div className={styles.field}>
      {label ? (
        <label className={styles.label} htmlFor={htmlFor}>
          {label}
        </label>
      ) : null}

      {children}

      {hint && !error ? <div className={styles.hint}>{hint}</div> : null}
      {error ? <div className={styles.error}>{error}</div> : null}
    </div>
  );
}