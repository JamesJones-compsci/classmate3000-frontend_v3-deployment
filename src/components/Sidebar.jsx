// src/components/Sidebar.jsx
// Main sidebar for the ClassMate dashboard.
// Displays brand, user initials, bell notification icon, LeftPanel, and Logout.
// onPanelOpen is passed down to LeftPanel to trigger Search, Theme, Profile panels.

import LeftPanel from "./LeftPanel";

function getInitials(firstName = "", lastName = "") {
  const f = firstName.trim().charAt(0).toUpperCase();
  const l = lastName.trim().charAt(0).toUpperCase();
  if (f && l) return `${f}${l}`;
  if (f)      return f;
  return "?";
}

export default function Sidebar({
  activeTab,
  onPrimaryAction,
  onShowAll,
  canEdit    = false,
  canDelete  = false,
  onEditAction,
  onDeleteAction,
  onLogout,
  user       = null,
  bellCount  = 0,
  onBellClick,
  onPanelOpen,
}) {
  const initials = getInitials(user?.firstName, user?.lastName);

  return (
    <aside className="sidebar">

      <div className="sidebar-topbar">
        <div className="brand">ClassMate™</div>
        <div className="sidebar-actions">

          <button
            type="button"
            className="sidebar-icon-btn"
            aria-label="Upcoming tasks"
            onClick={onBellClick}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14V11a6 6 0 0 0-5-5.9V4a1 1 0 0 0-2 0v1.1A6 6 0 0 0 6 11v3a2 2 0 0 1-.6 1.4L4 17h5m6 0H9m6 0a3 3 0 0 1-6 0"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {bellCount > 0 && (
              <span className="bell-badge">{bellCount > 9 ? "9+" : bellCount}</span>
            )}
          </button>

          <div
            className="user-initials"
            title={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()}
            onClick={() => onPanelOpen("profile")}
            style={{ cursor: "pointer" }}
          >
            {initials}
          </div>

        </div>
      </div>

      <div className="leftpanel-slot">
        <LeftPanel
          activeTab={activeTab}
          onPrimaryAction={onPrimaryAction}
          onShowAll={onShowAll}
          canEdit={canEdit}
          canDelete={canDelete}
          onEditAction={onEditAction}
          onDeleteAction={onDeleteAction}
          onPanelOpen={onPanelOpen}
        />
      </div>

      <div className="nav-divider" />

      <button type="button" className="nav-item nav-item--danger" onClick={onLogout}>
        <span className="subpanel-item__inner">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
              stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"/>
          </svg>
          Logout
        </span>
      </button>

    </aside>
  );
}