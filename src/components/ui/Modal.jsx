import styles from "./Modal.module.css";

export default function Modal({
  title,
  children,
  onClose,
  size = "md",
  narrow = false,
}) {
  const cardClass = [
    styles.card,
    styles[size],
    narrow ? styles.narrow : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={cardClass} onClick={(e) => e.stopPropagation()}>
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        {children}
      </div>
    </div>
  );
}