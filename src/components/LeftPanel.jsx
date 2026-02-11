// src/components/LeftPanel.jsx
export default function LeftPanel({ activeTab, onPrimaryAction }) {
  const labels = {
    Courses: { cta: "+Add Course", all: "All Courses", add: "Add a Course", edit: "Edit a Course", del: "Delete a Course" },
    Tasks: { cta: "+Add Task", all: "All Tasks", add: "Add a Task", edit: "Edit a Task", del: "Delete a Task" },
    Reminders: { cta: "+Reminder", all: "All Reminders", add: "Add a Reminder", edit: "Edit a Reminder", del: "Delete a Reminder" },
    Grades: { cta: "+Add Grade", all: "All Grades", add: "Add a Grade", edit: "Edit a Grade", del: "Delete a Grade" },
  };

  const t = labels[activeTab] ?? labels.Courses;

  return (
    <div className="leftpanel">
      <button type="button" className="pill-cta" onClick={onPrimaryAction}>
        {t.cta}
      </button>

      <div className="subpanel-menu">
        {[t.all, t.add, t.edit, t.del].map((item) => (
          <button key={item} type="button" className="subpanel-item">
            <span>{item}</span>
            <span className="subpanel-arrow">{">"}</span>
          </button>
        ))}
      </div>

      <div className="subpanel-bottom">
        {["Search", "Theme", "Settings", "Profile"].map((item) => (
          <button key={item} type="button" className="subpanel-item subpanel-item--soft">
            <span>{item}</span>
            <span className="subpanel-arrow">{">"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
