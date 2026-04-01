import styles from "./Card.module.css";

export default function Card({
  children,
  className = "",
  variant = "default",
  clickable = false,
  selected = false,
  as: Component = "div",
  ...props
}) {
  const classes = [
    styles.card,
    styles[variant],
    clickable ? styles.clickable : "",
    selected ? styles.selected : "",
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