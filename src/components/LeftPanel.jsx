// src/components/LeftPanel.jsx

export default function LeftPanel({
  activeTab,
  onPrimaryAction,
  onShowAll,
  canEdit = false,
  canDelete = false,
}) {
  // Labels per tab
  const labels = {
    Courses: {
      cta: "+Add Course",
      all: "All Courses",
      add: "Add a Course",
      edit: "Edit a Course",
      del: "Delete a Course",
    },
    Tasks: {
      cta: "+Add Task",
      all: "All Tasks",
      add: "Add a Task",
      edit: "Edit a Task",
      del: "Delete a Task",
    },
    Reminders: {
      cta: "+Reminder",
      all: "All Reminders",
      add: "Add a Reminder",
      edit: "Edit a Reminder",
      del: "Delete a Reminder",
    },
    Grades: {
      cta: "+Add Grade",
      all: "All Grades",
      add: "Add a Grade",
      edit: "Edit a Grade",
      del: "Delete a Grade",
    },
  };

  const t = labels[activeTab] ?? labels.Courses;

  return (
    <div className="leftpanel">
      {/* Primary CTA (always enabled) */}
      <button
        type="button"
        className="pill-cta"
        onClick={onPrimaryAction}
      >
        {t.cta}
      </button>

      <div className="subpanel-menu">
        {/* All */}
        <button
          type="button"
          className="subpanel-item"
          onClick={onShowAll}
        >
          <span>{t.all}</span>
          <span className="subpanel-arrow">{">"}</span>
        </button>

        {/* Add */}
        <button
          type="button"
          className="subpanel-item"
          onClick={onPrimaryAction}
        >
          <span>{t.add}</span>
          <span className="subpanel-arrow">{">"}</span>
        </button>

        {/* Edit (disabled until selection logic exists) */}
        <button
          type="button"
          className="subpanel-item"
          disabled={!canEdit}
          style={{ opacity: canEdit ? 1 : 0.5, cursor: canEdit ? "pointer" : "not-allowed" }}
        >
          <span>{t.edit}</span>
          <span className="subpanel-arrow">{">"}</span>
        </button>

        {/* Delete (disabled until selection logic exists) */}
        <button
          type="button"
          className="subpanel-item"
          disabled={!canDelete}
          style={{ opacity: canDelete ? 1 : 0.5, cursor: canDelete ? "pointer" : "not-allowed" }}
        >
          <span>{t.del}</span>
          <span className="subpanel-arrow">{">"}</span>
        </button>
      </div>

      {/* Secondary actions (still static for now) */}
      <div className="subpanel-bottom">
        {["Search", "Theme", "Settings", "Profile"].map((item) => (
          <button
            key={item}
            type="button"
            className="subpanel-item subpanel-item--soft"
          >
            <span>{item}</span>
            <span className="subpanel-arrow">{">"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}