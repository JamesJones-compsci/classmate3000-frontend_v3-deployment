import styles from "./SectionHeader.module.css";

export default function SectionHeader({ title, breadcrumb }) {
  return (
    <div className={styles.header}>
      {breadcrumb ? <div className={styles.breadcrumb}>{breadcrumb}</div> : null}
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}