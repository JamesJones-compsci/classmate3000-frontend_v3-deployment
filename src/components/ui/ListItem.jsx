import styles from "./ListItem.module.css";

export default function ListItem({
  children,
  className = "",
  clickable = false,
  selected = false,
  warm = false,
  overdue = false,
  as: Component = "div",
  ...props
}) {
  const classes = [
    styles.item,
    clickable ? styles.clickable : "",
    selected ? styles.selected : "",
    warm ? styles.warm : "",
    overdue ? styles.overdue : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}