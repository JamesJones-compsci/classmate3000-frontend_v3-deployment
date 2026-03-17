// src/components/Sidebar.jsx
import LeftPanel from "./LeftPanel";

export default function Sidebar({
  activeTab,
  onPrimaryAction,
  onShowAll,
  canEdit = false,
  canDelete = false,
  onEditAction,
  onDeleteAction,
  onLogout,
}) {
  return (
    <aside className="sidebar">
      <div className="brand">ClassMate™</div>

      <div className="leftpanel-slot">
        <LeftPanel
          activeTab={activeTab}
          onPrimaryAction={onPrimaryAction}
          onShowAll={onShowAll}
          canEdit={canEdit}
          canDelete={canDelete}
          onEditAction={onEditAction}
          onDeleteAction={onDeleteAction}
        />
      </div>

      <div className="nav-divider" />

      <button type="button" className="nav-item nav-item--danger" onClick={onLogout}>
        Logout
      </button>
    </aside>
  );
}
