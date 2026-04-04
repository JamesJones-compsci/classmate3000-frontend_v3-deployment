import styles from "./Modal.module.css";

export default function Modal({
  title,
  children,
  onClose,
  size = "md",
  narrow = false,
}) {
  const shellClass = [
    styles.shell,
    styles[size],
    narrow ? styles.narrow : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={shellClass} onClick={(e) => e.stopPropagation()}>
        <div className={styles.inner}>
          {title ? <h2 className={styles.title}>{title}</h2> : null}
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
}