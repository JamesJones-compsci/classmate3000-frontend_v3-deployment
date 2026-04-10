import Button from "./Button";
import styles from "./FormShell.module.css";

export default function FormShell({
  children,
  error,
  onSubmit,
  onCancel,
  saving = false,
  submitLabel = "Save",
  submitVariant = "primary",
}) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.body}>{children}</div>

      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" variant={submitVariant} disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}