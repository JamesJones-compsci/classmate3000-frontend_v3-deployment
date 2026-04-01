import styles from "./SectionHeader.module.css";

export default function SectionHeader({
  title,
  breadcrumb,
  actions = null,
}) {
  return (
    <div className={styles.header}>
      <div className={styles.textBlock}>
        {breadcrumb ? <div className={styles.breadcrumb}>{breadcrumb}</div> : null}
        <h2 className={styles.title}>{title}</h2>
      </div>

      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
}