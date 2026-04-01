import styles from "./Card.module.css";

export default function Card({ children, className = "", onClick }) {
  return (
    <div className={`${styles.card} ${className}`.trim()} onClick={onClick}>
      {children}
    </div>
  );
}