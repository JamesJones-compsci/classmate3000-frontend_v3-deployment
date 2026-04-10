import { Link } from "react-router-dom";
import styles from "./SectionHeader.module.css";

export default function SectionHeader({
  title,
  breadcrumb,
  breadcrumbs,
  actions = null,
}) {
  return (
    <div className={styles.header}>
      <div className={styles.textBlock}>
        {breadcrumbs?.length ? (
          <div className={styles.breadcrumb}>
            {breadcrumbs.map((item, index) => (
              <span key={`${item.label}-${index}`} className={styles.crumb}>
                {item.to ? (
                  <Link to={item.to} className={styles.crumbLink}>
                    {item.label}
                  </Link>
                ) : (
                  <span className={styles.crumbCurrent}>{item.label}</span>
                )}

                {index < breadcrumbs.length - 1 ? (
                  <span className={styles.separator}>›</span>
                ) : null}
              </span>
            ))}
          </div>
        ) : breadcrumb ? (
          <div className={styles.breadcrumb}>{breadcrumb}</div>
        ) : null}

        <h2 className={styles.title}>{title}</h2>
      </div>

      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
}