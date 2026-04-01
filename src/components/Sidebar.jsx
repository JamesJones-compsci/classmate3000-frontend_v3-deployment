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
  user,
  activeFilter,
  onAction,
  onFilterChange,
  onOpenProfile,
  darkMode,
  onToggleDarkMode,
  onLogout,
}) {
  const initials = getInitials(user?.firstName, user?.lastName);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topbar}>
        <div className={styles.brand}>ClassMate™</div>
        <div className={styles.userBadge} title={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()}>
          {initials}
        </div>
      </div>

      <div className={styles.leftpanelSlot}>
        <LeftPanel
          currentSection={currentSection}
          activeFilter={activeFilter}
          onAction={onAction}
          onFilterChange={onFilterChange}
          onOpenProfile={onOpenProfile}
          darkMode={darkMode}
          onToggleDarkMode={onToggleDarkMode}
          onLogout={onLogout}
        />
      </div>
    </aside>
  );
}