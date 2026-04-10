import styles from "./Badge.module.css";

export default function Badge({
  children,
  tone = "neutral",
  size = "md",
}) {
  const classes = [styles.badge, styles[tone], styles[size]].join(" ");

  return <span className={classes}>{children}</span>;
}