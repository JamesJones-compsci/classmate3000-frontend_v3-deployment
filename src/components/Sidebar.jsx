import LeftPanel from "./LeftPanel";
import styles from "./Sidebar.module.css";

function getInitials(user) {
  const first = user?.firstName?.trim() || "";
  const last = user?.lastName?.trim() || "";

  if (first && last) {
    return `${first[0]}${last[0]}`.toUpperCase();
  }

  return "?";
}

function getProfileTitle(user) {
  const firstName = user?.firstName ?? sessionStorage.getItem("firstName") ?? "";
  const lastName = user?.lastName ?? sessionStorage.getItem("lastName") ?? "";
  const email = user?.email ?? sessionStorage.getItem("email") ?? "";

  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || email || "Profile";
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
  const initials = getInitials(user);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topbar}>
        <div className={styles.brandBlock}>
          <div className={styles.brand}>ClassMate™</div>

          <button
            type="button"
            className={styles.userBadge}
            onClick={onOpenProfile}
            title={getProfileTitle(user)}
          >
            {initials}
          </button>
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