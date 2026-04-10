import styles from "./EmptyState.module.css";

export default function EmptyState({
  title = "Nothing here yet",
  message,
  action = null,
}) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.title}>{title}</div>
      {message ? <p className={styles.message}>{message}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}