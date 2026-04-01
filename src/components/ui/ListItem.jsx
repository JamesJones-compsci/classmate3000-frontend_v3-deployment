import styles from "./ListItem.module.css";

export default function ListItem({ children, className = "", onClick }) {
  return (
    <div className={`${styles.item} ${className}`.trim()} onClick={onClick}>
      {children}
    </div>
  );
}