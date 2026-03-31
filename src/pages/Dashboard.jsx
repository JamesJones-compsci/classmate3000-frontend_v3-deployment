// src/pages/Dashboard.jsx
// Main application view for ClassMate.
// Owns all data state (courses, tasks, reminders, grade snapshots) and
// passes handlers down to Sidebar and modal components as props.
//
// Architecture notes:
//   - All API calls are made here; child components receive data via props.
//   - Each tab has its own loading and error state so a slow/failed endpoint
//     on one tab does not block the others.
//   - selectedItem drives Edit/Delete buttons shown at the bottom of each panel.
//   - Modal visibility is controlled by boolean flags (showAdd*, showEdit*, showDeleteConfirm).
//   - taskFilter drives the Tasks tab filter strip (all/overdue/today/week/by course).
//   - bellCount is derived from tasks due today or overdue — shown on the sidebar bell icon.
//   - sidebarPanel controls which secondary panel is open (search/theme/profile/null).
//   - darkMode is persisted in sessionStorage and applied as a class on document.documentElement.

import { useEffect, useState } from "react";
import { apiClient } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { loadMockCourses } from "../mocks/loadMockCourses";
import Sidebar from "../components/Sidebar";
import AddCourseModal from "../components/modals/AddCourseModal";
import EditCourseModal from "../components/modals/EditCourseModal";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";
import AddTaskModal from "../components/modals/AddTaskModal";
import EditTaskModal from "../components/modals/EditTaskModal";
import AddReminderModal from "../components/modals/AddReminderModal";
import EditReminderModal from "../components/modals/EditReminderModal";
import AddGradeModal from "../components/modals/AddGradeModal";
import EditGradeModal from "../components/modals/EditGradeModal";

const TABS = ["Courses", "Tasks", "Reminders", "Grades"];

const TAB_THEME = {
  Courses:   { bg: "#eaf4e6" },
  Tasks:     { bg: "#e9f3ff" },
  Reminders: { bg: "#fff8e6" },
  Grades:    { bg: "#f3eaff" },
};

const DAY_NAMES = ["", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function realStatsForCourse(courseId, tasks, progressSnapshots) {
  const courseTasks = tasks.filter((t) => Number(t.courseId) === Number(courseId));
  const todo = courseTasks.filter((t) => !t.isCompleted).length;
  const upcoming = courseTasks.filter((t) => {
    if (!t.dueDate) return false;
    const diff = (new Date(t.dueDate) - new Date()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  }).length;
  const snapshots = progressSnapshots
    .filter((p) => Number(p.courseId) === Number(courseId))
    .sort((a, b) => new Date(b.weekOf ?? 0) - new Date(a.weekOf ?? 0));
  const latestSnap = snapshots[0] ?? null;
  return {
    todo, upcoming,
    grade:       latestSnap?.currentGradePercent      ?? null,
    accumulated: latestSnap?.accumulatedPercentPoints  ?? null,
    used:        latestSnap?.usedPercentPoints          ?? null,
    lost:        latestSnap?.lostPercentPoints          ?? null,
    maxPossible: latestSnap?.maxPossiblePercent         ?? null,
    canMeetGoal: latestSnap?.canMeetGoal                ?? null,
  };
}

function getStatusType(item) {
  if (item.isCompleted) return "done";
  if (item.dueDate && new Date(item.dueDate) < new Date()) return "alert";
  return "pending";
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// SearchPanel — searches across courses, tasks, and reminders by title/code.
// Clicking a result navigates to the relevant tab and closes the panel.
function SearchPanel({ courses, tasks, reminders, onNavigate }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const matchedCourses   = q ? courses.filter((c) => c.title?.toLowerCase().includes(q) || c.code?.toLowerCase().includes(q)) : [];
  const matchedTasks     = q ? tasks.filter((t) => t.title?.toLowerCase().includes(q)) : [];
  const matchedReminders = q ? reminders.filter((r) => r.message?.toLowerCase().includes(q)) : [];
  const hasResults = matchedCourses.length > 0 || matchedTasks.length > 0 || matchedReminders.length > 0;

  return (
    <div className="sidebar-panel__body">
      <input className="search-input" type="text"
        placeholder="Search courses, tasks, reminders…"
        value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
      {q && !hasResults && <p className="search-empty">No results for "{query}"</p>}
      {matchedCourses.length > 0 && (
        <div className="search-group">
          <div className="search-group__label">Courses</div>
          {matchedCourses.map((c) => (
            <button key={c.courseId} type="button" className="search-result" onClick={() => onNavigate("Courses")}>
              <span className="search-result__title">{c.code} — {c.title}</span>
            </button>
          ))}
        </div>
      )}
      {matchedTasks.length > 0 && (
        <div className="search-group">
          <div className="search-group__label">Tasks</div>
          {matchedTasks.map((t) => (
            <button key={t.taskId} type="button" className="search-result" onClick={() => onNavigate("Tasks")}>
              <span className="search-result__title">{t.title}</span>
              <span className="search-result__meta">{t.type}</span>
            </button>
          ))}
        </div>
      )}
      {matchedReminders.length > 0 && (
        <div className="search-group">
          <div className="search-group__label">Reminders</div>
          {matchedReminders.map((r) => (
            <button key={r.reminderId} type="button" className="search-result" onClick={() => onNavigate("Reminders")}>
              <span className="search-result__title">{r.message}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [activeTab,    setActiveTab]    = useState("Courses");
  const [selectedItem, setSelectedItem] = useState(null);
  const [taskFilter,   setTaskFilter]   = useState("all");
  const [sidebarPanel, setSidebarPanel] = useState(null);
  const [darkMode,     setDarkMode]     = useState(() => sessionStorage.getItem("theme") === "dark");

  const [showAddCourse,     setShowAddCourse]     = useState(false);
  const [showEditCourse,    setShowEditCourse]    = useState(false);
  const [showAddTask,       setShowAddTask]       = useState(false);
  const [showEditTask,      setShowEditTask]      = useState(false);
  const [showAddReminder,   setShowAddReminder]   = useState(false);
  const [showEditReminder,  setShowEditReminder]  = useState(false);
  const [showAddGrade,      setShowAddGrade]      = useState(false);
  const [showEditGrade,     setShowEditGrade]     = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [courses,           setCourses]           = useState([]);
  const [tasks,             setTasks]             = useState([]);
  const [progressSnapshots, setProgressSnapshots] = useState([]);
  const [reminders,         setReminders]         = useState([]);

  const [loadingState, setLoadingState] = useState({ Courses: true, Tasks: true, Reminders: true, Grades: true });
  const [errorState,   setErrorState]   = useState({ Courses: null, Tasks: null, Reminders: null, Grades: null });

  const setTabLoading = (tab, val) => setLoadingState((prev) => ({ ...prev, [tab]: val }));
  const setTabError   = (tab, val) => setErrorState((prev)   => ({ ...prev, [tab]: val }));

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // ─── Dark mode ────────────────────────────────────────────────────────────────
  // Applies a class to <html> so all dark-mode CSS rules activate globally.

  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", darkMode);
    sessionStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // ─── Data fetching ────────────────────────────────────────────────────────────
  // All four endpoints fetched in parallel on mount.
  // 401 on any endpoint triggers immediate logout and redirect to /login.

  useEffect(() => {
    let isMounted = true;
    const handle401 = (err) => {
      if (err?.response?.status === 401) { logout(); navigate("/login"); return true; }
      return false;
    };
    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/v1/courses");
        if (isMounted) { setCourses(Array.isArray(res.data) ? res.data : []); setTabError("Courses", null); }
      } catch (err) {
        if (handle401(err)) return;
        if (isMounted) { setCourses(loadMockCourses()); setTabError("Courses", "Backend unavailable — showing demo data."); }
      } finally { if (isMounted) setTabLoading("Courses", false); }
    };
    const fetchTasks = async () => {
      try {
        const res = await apiClient.get("/api/v1/tasks"); // TODO: -> Client
        if (isMounted) { setTasks(Array.isArray(res.data) ? res.data : []); setTabError("Tasks", null); }
      } catch (err) {
        if (handle401(err)) return;
        if (isMounted) setTabError("Tasks", "Could not load tasks. Check backend connection.");
      } finally { if (isMounted) setTabLoading("Tasks", false); }
    };
    const fetchProgress = async () => {
      try {
        const res = await apiClient.get("/api/v1/course-progress");
        if (isMounted) { setProgressSnapshots(Array.isArray(res.data) ? res.data : []); setTabError("Grades", null); }
      } catch (err) {
        if (handle401(err)) return;
        if (isMounted) setTabError("Grades", "Could not load grade snapshots. Check backend connection.");
      } finally { if (isMounted) setTabLoading("Grades", false); }
    };
    const fetchReminders = async () => {
      try {
        const res = await apiClient.get("/api/v1/reminders");
        if (isMounted) { setReminders(Array.isArray(res.data) ? res.data : []); setTabError("Reminders", null); }
      } catch (err) {
        if (handle401(err)) return;
        if (isMounted) setTabError("Reminders", "Could not load reminders. Check backend connection.");
      } finally { if (isMounted) setTabLoading("Reminders", false); }
    };
    fetchCourses(); fetchTasks(); fetchProgress(); fetchReminders();
    return () => { isMounted = false; };
  }, [logout, navigate]);

  useEffect(() => { setSelectedItem(null); }, [activeTab]);

  // ─── Course CRUD ──────────────────────────────────────────────────────────────

  const createCourse = async (d) => { const res = await apiClient.post("/api/v1/courses", d); setCourses((p) => [...p, res.data]); };
  const updateCourse = async (id, d) => { const res = await api.put(`/api/v1/courses/${id}`, d); setCourses((p) => p.map((c) => (c.courseId === id ? res.data : c))); setSelectedItem(null); };
  const deleteCourse = async (id) => { await apiClient.delete(`/api/v1/courses/${id}`); setCourses((p) => p.filter((c) => c.courseId !== id)); setSelectedItem(null); };

  // ─── Task CRUD ────────────────────────────────────────────────────────────────

  const createTask = async (d) => { const res = await apiClient.post("/api/v1/tasks", d); setTasks((p) => [...p, res.data]); };
  const updateTask = async (id, d) => { const res = await api.put(`/api/v1/tasks/${id}`, d); setTasks((p) => p.map((t) => (t.taskId === id ? res.data : t))); setSelectedItem(null); };
  const deleteTask = async (id) => { await apiClient.delete(`/api/v1/tasks/${id}`); setTasks((p) => p.filter((t) => t.taskId !== id)); setSelectedItem(null); };

  // ─── Reminder CRUD ────────────────────────────────────────────────────────────

  const createReminder = async (d) => { const res = await apiClient.post("/api/v1/reminders", d); setReminders((p) => [...p, res.data]); };
  const updateReminder = async (id, d) => { const res = await api.put(`/api/v1/reminders/${id}`, d); setReminders((p) => p.map((r) => (r.reminderId === id ? res.data : r))); setSelectedItem(null); };
  const deleteReminder = async (id) => { await apiClient.delete(`/api/v1/reminders/${id}`); setReminders((p) => p.filter((r) => r.reminderId !== id)); setSelectedItem(null); };

  // ─── Grade CRUD ───────────────────────────────────────────────────────────────

  const createGrade = async (d) => { const res = await apiClient.post("/api/v1/course-progress", d); setProgressSnapshots((p) => [...p, res.data]); };
  const updateGrade = async (id, d) => { const res = await api.put(`/api/v1/course-progress/${id}`, d); setProgressSnapshots((p) => p.map((s) => (s.progressId === id ? res.data : s))); setSelectedItem(null); };
  const deleteGrade = async (id) => { await apiClient.delete(`/api/v1/course-progress/${id}`); setProgressSnapshots((p) => p.filter((s) => s.progressId !== id)); setSelectedItem(null); };

  // ─── Handlers ─────────────────────────────────────────────────────────────────

  const handlePrimaryAction = () => {
    if (activeTab === "Courses")   { setShowAddCourse(true);   return; }
    if (activeTab === "Tasks")     { setShowAddTask(true);     return; }
    if (activeTab === "Reminders") { setShowAddReminder(true); return; }
    if (activeTab === "Grades")    { setShowAddGrade(true);    return; }
  };

  const handleEditAction = () => {
    if (!selectedItem) return;
    if (selectedItem.type === "course")   setShowEditCourse(true);
    if (selectedItem.type === "task")     setShowEditTask(true);
    if (selectedItem.type === "reminder") setShowEditReminder(true);
    if (selectedItem.type === "grade")    setShowEditGrade(true);
  };

  const handleDeleteAction  = () => { if (!selectedItem) return; setShowDeleteConfirm(true); };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    if (selectedItem.type === "course")   await deleteCourse(selectedItem.id);
    if (selectedItem.type === "task")     await deleteTask(selectedItem.id);
    if (selectedItem.type === "reminder") await deleteReminder(selectedItem.id);
    if (selectedItem.type === "grade")    await deleteGrade(selectedItem.id);
  };

  const handleShowAll  = () => setSelectedItem(null);
  const selectItem     = (type, id, data) => setSelectedItem({ type, id, data });
  const isSelected     = (type, id) => selectedItem?.type === type && selectedItem?.id === id;

  const getCourseLabel = (courseId) => {
    const match = courses.find((c) => Number(c.courseId) === Number(courseId));
    return match ? `${match.code} — ${match.title}` : `Course ${courseId}`;
  };

  // ─── Panel action bar ─────────────────────────────────────────────────────────
  // Edit and Delete sit at the bottom-right of each panel — matches Figma layout.

  const renderPanelActions = () => (
    <div className="panel-actions">
      <button type="button" className="panel-action-btn"
        disabled={!selectedItem} onClick={handleEditAction}>Edit</button>
      <button type="button" className="panel-action-btn panel-action-btn--delete"
        disabled={!selectedItem} onClick={handleDeleteAction}>Delete</button>
    </div>
  );

  // ─── Sidebar panels ───────────────────────────────────────────────────────────
  // Floating panels for Search, Theme, and Profile triggered from the left panel.

  const renderSidebarPanel = () => {
    if (!sidebarPanel) return null;
    return (
      <div className="sidebar-panel-overlay" onClick={() => setSidebarPanel(null)}>
        <div className="sidebar-panel" onClick={(e) => e.stopPropagation()}>
          <div className="sidebar-panel__header">
            <span className="sidebar-panel__title">
              {sidebarPanel === "search"  && "Search"}
              {sidebarPanel === "theme"   && "Theme"}
              {sidebarPanel === "profile" && "Profile"}
            </span>
            <button type="button" className="sidebar-panel__close"
              onClick={() => setSidebarPanel(null)} aria-label="Close panel">✕</button>
          </div>

          {sidebarPanel === "search" && (
            <SearchPanel courses={courses} tasks={tasks} reminders={reminders}
              onNavigate={(tab) => { setActiveTab(tab); setSidebarPanel(null); }} />
          )}

          {sidebarPanel === "theme" && (
            <div className="sidebar-panel__body">
              <p className="sidebar-panel__label">Appearance</p>
              <div className="theme-toggle-row">
                <span>{darkMode ? "Dark mode" : "Light mode"}</span>
                <button type="button"
                  className={`theme-toggle ${darkMode ? "theme-toggle--on" : ""}`}
                  onClick={() => setDarkMode((v) => !v)} aria-label="Toggle dark mode">
                  <span className="theme-toggle__knob" />
                </button>
              </div>
            </div>
          )}

          {sidebarPanel === "profile" && (
            <div className="sidebar-panel__body">
              <div className="profile-avatar">
                {(user?.firstName?.charAt(0) ?? "?").toUpperCase()}
                {(user?.lastName?.charAt(0)  ?? "").toUpperCase()}
              </div>
              <p className="profile-name">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}` : "Student"}
              </p>
              <p className="profile-email">{user?.email ?? "—"}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── Tab content ──────────────────────────────────────────────────────────────

  const renderTabContent = () => {
    const loading = loadingState[activeTab];
    const error   = errorState[activeTab];

    if (loading) {
      return (
        <div className="panel" data-panel={activeTab}>
          <div className="panel-header">
            <div className="panel-breadcrumb">Home &gt; <span>{activeTab}</span></div>
            <h2 className="panel-title">{activeTab}</h2>
          </div>
          <div className="panel-body">
            <p className="muted">Loading {activeTab.toLowerCase()}…</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="panel" data-panel={activeTab}>
          <div className="panel-header">
            <div className="panel-breadcrumb">Home &gt; <span>{activeTab}</span></div>
            <h2 className="panel-title">{activeTab}</h2>
          </div>
          <div className="panel-body">
            <p style={{ color: "#b42318", fontSize: 13 }}>{error}</p>
          </div>
        </div>
      );
    }

    // ── Courses ──
    if (activeTab === "Courses") {
      return (
        <div className="panel" data-panel="Courses">
          <div className="panel-header">
            <div className="panel-breadcrumb">Home &gt; <span>Courses</span> &gt; <span>All Courses</span></div>
            <h2 className="panel-title">Courses</h2>
          </div>
          <div className="panel-body">
            {courses.length === 0 ? (
              <p className="muted">No courses yet. Click Add a Course to get started.</p>
            ) : (
              <div className="card-grid">
                {courses.map((course) => {
                  const courseId = course.courseId ?? course.id;
                  const stats    = realStatsForCourse(courseId, tasks, progressSnapshots);
                  const today    = new Date(); today.setHours(0, 0, 0, 0);
                  const upcomingTasks = tasks
                    .filter((t) => Number(t.courseId) === Number(courseId) && t.dueDate)
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .slice(0, 3);
                  const scheduleText = (course.meetings ?? [])
                    .map((m) => {
                      const day   = DAY_NAMES[m.dayOfWeek] ?? "";
                      const start = m.startTime?.slice(0, 5) ?? "";
                      const end   = m.endTime?.slice(0, 5)   ?? "";
                      return `${day}: ${start}-${end} | ROOM: Zoom`;
                    }).join("\n");
                  return (
                    <div key={courseId}
                      className={`course-card ${isSelected("course", courseId) ? "is-selected" : ""}`}
                      onClick={() => selectItem("course", courseId, course)}
                      role="button" tabIndex={0}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectItem("course", courseId, course); } }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="course-card__top">
                        <div className="course-code">{course.code} - {course.title.toUpperCase()}</div>
                        {scheduleText && (
                          <div className="course-schedule">
                            {scheduleText.split("\n").map((line, i) => <div key={i}>{line}</div>)}
                          </div>
                        )}
                      </div>
                      <div className="course-metrics">
                        <div className="metric">
                          <div className="metric__label">UPCOMING</div>
                          {upcomingTasks.length === 0 ? (
                            <div className="upcoming-item" style={{ color: "#9ca3af" }}>No upcoming tasks</div>
                          ) : (
                            <div className="upcoming-list">
                              {upcomingTasks.map((t) => {
                                const due     = new Date(t.dueDate);
                                const isOv    = due < today && !t.isCompleted;
                                const dateStr = `${due.toLocaleString("en", { month: "short" })} ${due.getDate()}`;
                                return (
                                  <div key={t.taskId ?? t.id}
                                    className={`upcoming-item ${isOv ? "upcoming-item--overdue" : ""}`}>
                                    {dateStr}: {t.title}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        <div className="metric metric--progress">
                          <div>
                            <div className="metric__label">PROGRESS</div>
                            <div className="metric__value">
                              {stats.accumulated !== null ? `${stats.accumulated}/${stats.used ?? "?"}%` : "—"}
                            </div>
                          </div>
                          <div>
                            <div className="progress-grade-label">CURR. GRADE</div>
                            <div className="progress-grade-value">
                              {stats.grade !== null ? `${stats.grade}%` : "—"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {renderPanelActions()}
        </div>
      );
    }

    // ── Tasks ──
    if (activeTab === "Tasks") {
      const now   = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const week  = new Date(today); week.setDate(today.getDate() + 7);

      const sorted = [...tasks].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });

      const filtered = sorted.filter((task) => {
        if (taskFilter === "all")     return true;
        if (taskFilter === "overdue") return task.dueDate && new Date(task.dueDate) < today && !task.isCompleted;
        if (taskFilter === "today") {
          if (!task.dueDate) return false;
          const d = new Date(task.dueDate);
          return d >= today && d < new Date(today.getTime() + 86400000);
        }
        if (taskFilter === "week") {
          if (!task.dueDate) return false;
          const d = new Date(task.dueDate);
          return d >= today && d < week;
        }
        return String(task.courseId) === taskFilter;
      });

      return (
        <div className="panel" data-panel="Tasks">
          <div className="panel-header">
            <div className="panel-breadcrumb">Home &gt; <span>Tasks</span> &gt; <span>All Tasks</span></div>
            <h2 className="panel-title">Tasks</h2>
          </div>
          <div className="panel-body">
            <div className="filter-strip">
              {[
                { key: "all",     label: "All"       },
                { key: "overdue", label: "Overdue"   },
                { key: "today",   label: "Due Today" },
                { key: "week",    label: "This Week" },
              ].map(({ key, label }) => (
                <button key={key} type="button"
                  className={`filter-pill ${taskFilter === key ? "filter-pill--active" : ""}`}
                  onClick={() => setTaskFilter(key)}>{label}</button>
              ))}
              <select className="filter-select"
                value={courses.some((c) => String(c.courseId) === taskFilter) ? taskFilter : ""}
                onChange={(e) => setTaskFilter(e.target.value || "all")}>
                <option value="">By Course</option>
                {courses.map((c) => (
                  <option key={c.courseId} value={String(c.courseId)}>{c.code} — {c.title}</option>
                ))}
              </select>
            </div>

            {filtered.length === 0 ? (
              <p className="muted" style={{ marginTop: 12 }}>No tasks match this filter.</p>
            ) : (
              <div className="stack">
                {filtered.map((task) => {
                  const taskId    = task.taskId ?? task.id;
                  const isOverdue = task.dueDate && new Date(task.dueDate) < today && !task.isCompleted;
                  const status    = getStatusType(task);
                  const parts     = [];
                  if (task.dueDate) parts.push(task.dueDate.split("T")[0]);
                  if (task.weight)  parts.push(`${task.weight}%`);
                  if (task.type)    parts.push(task.type);
                  const subtitle   = parts.join(" · ");
                  const courseName = getCourseLabel(task.courseId);
                  return (
                    <div key={taskId}
                      className={`row-card ${isSelected("task", taskId) ? "is-selected" : ""} ${isOverdue ? "row-card--overdue" : ""}`}
                      onClick={() => selectItem("task", taskId, task)}
                      role="button" tabIndex={0}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectItem("task", taskId, task); } }}
                    >
                      <div className="row-status">
                        <div className={`status-icon status-icon--${status}`}>
                          {status === "alert" && "!"}
                          {status === "done"  && <CheckIcon />}
                        </div>
                      </div>
                      <div className="row-card__body">
                        <div className="row-title">{subtitle} — {task.title}</div>
                        <div className="row-subtitle">{courseName}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {renderPanelActions()}
        </div>
      );
    }

    // ── Reminders ──
    if (activeTab === "Reminders") {
      return (
        <div className="panel" data-panel="Reminders">
          <div className="panel-header">
            <div className="panel-breadcrumb">Home &gt; <span>Reminders</span> &gt; <span>All Reminders</span></div>
            <h2 className="panel-title">Reminders</h2>
          </div>
          <div className="panel-body">
            {reminders.length === 0 ? (
              <p className="muted">No reminders yet. Click Add a Reminder to get started.</p>
            ) : (
              <div className="stack">
                {reminders.map((r) => {
                  const reminderId = r.reminderId ?? r.id;
                  const status     = r.wasSent ? "done" : "pending";
                  let titleLine    = r.message ?? "—";
                  if (r.scheduledAt) {
                    const d = new Date(r.scheduledAt);
                    const dateStr = `${d.toLocaleString("en", { month: "short" })} ${d.getDate()} - ${d.toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" })}`;
                    titleLine = `${dateStr} - ${r.message ?? ""}`;
                  }
                  const linkedTask = tasks.find((t) => Number(t.taskId) === Number(r.taskId));
                  const subtitle   = linkedTask
                    ? `${linkedTask.title} - ${getCourseLabel(linkedTask.courseId)}`
                    : "";
                  return (
                    <div key={reminderId}
                      className={`row-card row-card--warm ${isSelected("reminder", reminderId) ? "is-selected" : ""}`}
                      onClick={() => selectItem("reminder", reminderId, r)}
                      role="button" tabIndex={0}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectItem("reminder", reminderId, r); } }}
                    >
                      <div className="row-status">
                        <div className={`status-icon status-icon--${status}`}>
                          {status === "done" && <CheckIcon />}
                        </div>
                      </div>
                      <div className="row-card__body">
                        <div className="row-title">{titleLine}</div>
                        {subtitle && <div className="row-subtitle">{subtitle}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {renderPanelActions()}
        </div>
      );
    }

    // ── Grades ──
    if (activeTab === "Grades") {
      return (
        <div className="panel" data-panel="Grades">
          <div className="panel-header">
            <div className="panel-breadcrumb">Home &gt; <span>Grades</span> &gt; <span>All Grades</span></div>
            <h2 className="panel-title">Grades</h2>
          </div>
          <div className="panel-body">
            {progressSnapshots.length === 0 ? (
              <p className="muted">No grade snapshots yet. Click Add a Grade to get started.</p>
            ) : (
              <div className="card-grid grades-grid">
                {progressSnapshots.map((p) => {
                  const idKey       = p.progressId ?? p.id;
                  const courseLabel = getCourseLabel(p.courseId);
                  const courseTasks = tasks
                    .filter((t) => Number(t.courseId) === Number(p.courseId))
                    .slice(0, 4);
                  return (
                    <div key={idKey}
                      className={`grade-card ${isSelected("grade", idKey) ? "is-selected" : ""}`}
                      onClick={() => selectItem("grade", idKey, p)}
                      role="button" tabIndex={0}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectItem("grade", idKey, p); } }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="grade-card__header">{courseLabel}</div>
                      <div className="grade-card__body">
                        <div className="grade-details">
                          <div className="grade-details-label">Details</div>
                          {courseTasks.length === 0 ? (
                            <div className="grade-detail-item" style={{ color: "#9ca3af" }}>No tasks yet</div>
                          ) : (
                            courseTasks.map((t) => (
                              <div key={t.taskId ?? t.id} className="grade-detail-item">
                                {t.title} - {t.weight ?? "?"}% - {t.type ?? "—"}
                              </div>
                            ))
                          )}
                        </div>
                        <div className="grade-progress">
                          <div className="grade-stat">
                            <div className="grade-stat-label">Progress</div>
                            <div className="grade-stat-value">
                              {p.accumulatedPercentPoints != null
                                ? `${p.accumulatedPercentPoints}/${p.usedPercentPoints ?? "?"}%` : "—"}
                            </div>
                          </div>
                          <div className="grade-stat">
                            <div className="grade-stat-label">Curr. Grade</div>
                            <div className="grade-stat-value">
                              {p.currentGradePercent != null ? `${p.currentGradePercent}%` : "—"}
                            </div>
                          </div>
                          <div className="grade-stat">
                            <div className="grade-stat-label">Lost Marks</div>
                            <div className={`grade-stat-value ${p.lostPercentPoints > 0 ? "grade-stat-value--lost" : ""}`}>
                              {p.lostPercentPoints != null ? `${p.lostPercentPoints}%` : "—"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {renderPanelActions()}
        </div>
      );
    }

    return null;
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  // Tasks overdue or due today — drives the bell badge count in the sidebar.
  const bellCount = tasks.filter((t) => {
    if (!t.dueDate || t.isCompleted) return false;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return new Date(t.dueDate) < new Date(today.getTime() + 86400000);
  }).length;

  return (
    <div className="app-shell dashboard-page">

      {showAddCourse && <AddCourseModal onClose={() => setShowAddCourse(false)} onSave={createCourse} />}
      {showEditCourse && selectedItem?.type === "course" && (
        <EditCourseModal course={selectedItem.data} onClose={() => setShowEditCourse(false)} onSave={updateCourse} />
      )}
      {showAddTask && <AddTaskModal onClose={() => setShowAddTask(false)} onSave={createTask} courses={courses} />}
      {showEditTask && selectedItem?.type === "task" && (
        <EditTaskModal task={selectedItem.data} onClose={() => setShowEditTask(false)} onSave={updateTask} courses={courses} />
      )}
      {showAddReminder && <AddReminderModal onClose={() => setShowAddReminder(false)} onSave={createReminder} tasks={tasks} />}
      {showEditReminder && selectedItem?.type === "reminder" && (
        <EditReminderModal reminder={selectedItem.data} onClose={() => setShowEditReminder(false)} onSave={updateReminder} tasks={tasks} />
      )}
      {showAddGrade && <AddGradeModal onClose={() => setShowAddGrade(false)} onSave={createGrade} courses={courses} />}
      {showEditGrade && selectedItem?.type === "grade" && (
        <EditGradeModal grade={selectedItem.data} onClose={() => setShowEditGrade(false)} onSave={updateGrade} courses={courses} />
      )}
      {showDeleteConfirm && selectedItem && (
        <DeleteConfirmModal
          itemLabel={
            selectedItem.data?.title ??
            selectedItem.data?.message ??
            selectedItem.data?.code ??
            `Grade – Week ${selectedItem.data?.weekOf ?? ""}`
          }
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {renderSidebarPanel()}

      <Sidebar
        activeTab={activeTab}
        onPrimaryAction={handlePrimaryAction}
        onShowAll={handleShowAll}
        canEdit={!!selectedItem}
        canDelete={!!selectedItem}
        onEditAction={handleEditAction}
        onDeleteAction={handleDeleteAction}
        onLogout={() => { logout(); navigate("/login"); }}
        user={user}
        bellCount={bellCount}
        onBellClick={() => setActiveTab("Tasks")}
        onPanelOpen={setSidebarPanel}
      />

      <main className="main" style={{ background: TAB_THEME[activeTab]?.bg ?? "#f4f6ef" }}>
        <div className="top-tabs">
          {TABS.map((t) => (
            <button key={t} type="button" data-tab={t}
              className={`tab ${activeTab === t ? "tab--active" : ""}`}
              onClick={() => setActiveTab(t)}>{t}</button>
          ))}
        </div>
        <section className="content">
          {renderTabContent()}
        </section>
      </main>
    </div>
  );
}