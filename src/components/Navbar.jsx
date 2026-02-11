// src/components/Navbar.jsx
export default function Navbar({ activeTab, onSelect }) {
  const items = ["Courses", "Tasks", "Reminders", "Grades"];

  return (
    <nav className="nav">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className={`nav-item ${activeTab === item ? "nav-item--active" : ""}`}
          onClick={() => onSelect(item)}
        >
          {item}
        </button>
      ))}
    </nav>
  );
}
