import styles from "./TaskFilterBar.module.css";

const filters = [
  { key: "all", label: "All" },
  { key: "overdue", label: "Overdue" },
  { key: "today", label: "Due Today" },
  { key: "week", label: "This Week" },
];

export default function TaskFilterBar({ filter, onFilterChange }) {
  return (
    <div className={styles.bar}>
      {filters.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`${styles.pill} ${filter === item.key ? styles.active : ""}`}
          onClick={() => onFilterChange(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}