// src/components/AppShell.jsx
export default function AppShell({ activeTab, onTabChange, sidebar, children }) {
  const tabs = ["Courses", "Tasks", "Reminders", "Grades"];

  return (
    <div className="app-shell">
      {sidebar}

      <main className="main">
        <div className="top-tabs">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              className={`tab ${activeTab === t ? "tab--active" : ""}`}
              onClick={() => onTabChange(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="content">{children}</div>
      </main>
    </div>
  );
}
