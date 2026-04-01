import LeftPanel from "./LeftPanel";
import styles from "./Sidebar.module.css";

function getInitials(firstName = "", lastName = "") {
  const f = firstName.trim().charAt(0).toUpperCase();
  const l = lastName.trim().charAt(0).toUpperCase();
  if (f && l) return `${f}${l}`;
  if (f) return f;
  return "?";
}

export default function Sidebar({
  currentSection,
  onNavigate,
  onLogout,
  user,
}) {
  const initials = getInitials(user?.firstName, user?.lastName);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topbar}>
        <div className={styles.brand}>ClassMate™</div>
        <div className={styles.initials}>{initials}</div>
      </div>

      <LeftPanel currentSection={currentSection} onNavigate={onNavigate} />

      <div className={styles.divider} />

      <button type="button" className={styles.logout} onClick={onLogout}>
        Logout
      </button>
    </aside>
  );
}