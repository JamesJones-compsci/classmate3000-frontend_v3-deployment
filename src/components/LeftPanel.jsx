// src/components/LeftPanel.jsx
// Tab-aware action menu displayed in the sidebar.
// Primary CTA, All/Add/Edit/Delete rows, and secondary nav.
// onPanelOpen triggers Search, Theme, or Profile panels in Dashboard.

export default function LeftPanel({
  activeTab,
  onPrimaryAction,
  onShowAll,
  canEdit    = false,
  canDelete  = false,
  onEditAction,
  onDeleteAction,
  onPanelOpen,
}) {
  const labels = {
    Courses:   { cta: "+Add Course",  all: "All Courses",   add: "Add a Course",   edit: "Edit a Course",   del: "Delete a Course"   },
    Tasks:     { cta: "+Add Task",    all: "All Tasks",     add: "Add a Task",     edit: "Edit a Task",     del: "Delete a Task"     },
    Reminders: { cta: "+Reminder",    all: "All Reminders", add: "Add a Reminder", edit: "Edit a Reminder", del: "Delete a Reminder" },
    Grades:    { cta: "+Add Grade",   all: "All Grades",    add: "Add a Grade",    edit: "Edit a Grade",    del: "Delete a Grade"    },
  };

  const t = labels[activeTab] ?? labels.Courses;

  const secondaryItems = [
    {
      label: "Search",
      panel: "search",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
          <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
        </svg>
      ),
    },
    {
      label: "Theme",
      panel: "theme",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
        </svg>
      ),
    },
    {
      label: "Settings",
      panel: null,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
            stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
    },
    {
      label: "Profile",
      panel: "profile",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="leftpanel">

      <div className="subpanel-menu">
        <button type="button" className="subpanel-item" onClick={onShowAll}>
          <span>{t.all}</span>
          <span className="subpanel-arrow">›</span>
        </button>

        <button type="button" className="subpanel-item" onClick={onPrimaryAction}>
          <span>{t.add}</span>
          <span className="subpanel-arrow">›</span>
        </button>

        <button
          type="button"
          className="subpanel-item"
          disabled={!canEdit}
          onClick={canEdit ? onEditAction : undefined}
          style={{ opacity: canEdit ? 1 : 0.4, cursor: canEdit ? "pointer" : "not-allowed" }}
        >
          <span>{t.edit}</span>
          <span className="subpanel-arrow">›</span>
        </button>

        <button
          type="button"
          className="subpanel-item"
          disabled={!canDelete}
          onClick={canDelete ? onDeleteAction : undefined}
          style={{ opacity: canDelete ? 1 : 0.4, cursor: canDelete ? "pointer" : "not-allowed" }}
        >
          <span>{t.del}</span>
          <span className="subpanel-arrow">›</span>
        </button>
      </div>

      <div className="leftpanel-divider" />

      <div className="subpanel-bottom">
        {secondaryItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className="subpanel-item subpanel-item--soft"
            onClick={item.panel ? () => onPanelOpen(item.panel) : undefined}
            style={!item.panel ? { opacity: 0.5, cursor: "not-allowed" } : {}}
          >
            <span className="subpanel-item__inner">
              <span className="subpanel-icon">{item.icon}</span>
              {item.label}
            </span>
            <span className="subpanel-arrow">›</span>
          </button>
        ))}
      </div>

    </div>
  );
}