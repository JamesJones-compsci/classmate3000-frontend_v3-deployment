// src/pages/Dashboard.jsx
// Main application view for ClassMate.
// Owns all data state (courses, tasks, reminders, grade snapshots) and
// passes handlers down to Sidebar and modal components as props.
//
// Architecture notes:
//   - All API calls are made here; child components receive data via props.
//   - Each tab has its own loading and error state so a slow/failed endpoint
//     on one tab does not block the others.
//   - selectedItem drives Edit/Delete button activation in the Sidebar.
//   - Modal visibility is controlled by boolean flags (showAdd*, showEdit*, showDeleteConfirm).
//   - Token is read from sessionStorage via the axios interceptor — not handled here directly.

import { useEffect, useState } from "react";
import { api } from "../api/axios";
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

// Background tint per tab — matches the Figma design colour tokens.
const TAB_THEME = {
  Courses:   { bg: "#EAF4E6" },
  Tasks:     { bg: "#E9F3FF" },
  Reminders: { bg: "#FFF5D9" },
  Grades:    { bg: "#F1E8FF" },
};

// Derives real-time metrics for a course card from live task and progress data.
// Called on every render — no memoisation needed at current data scale.
function realStatsForCourse(courseId, tasks, progressSnapshots) {
  const courseTasks = tasks.filter(
    (t) => Number(t.courseId) === Number(courseId)
  );

  // TO-DO count: tasks not yet marked as completed.
  const todo = courseTasks.filter((t) => !t.isCompleted).length;

  // UPCOMING count: tasks due within the next 7 days.
  const upcoming = courseTasks.filter((t) => {
    if (!t.dueDate) return false;
    const diff = (new Date(t.dueDate) - new Date()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  }).length;

  // CURRENT GRADE: taken from the most recent CourseProgress snapshot for this course.
  const snapshots = progressSnapshots
    .filter((p) => Number(p.courseId) === Number(courseId))
    .sort((a, b) => new Date(b.weekOf ?? 0) - new Date(a.weekOf ?? 0));
  const grade = snapshots[0]?.currentGradePercent ?? null;

  return { todo, upcoming, grade };
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Courses");

  // selectedItem shape: { type: "course"|"task"|"reminder"|"grade", id, data }
  // Drives Edit/Delete button state in the Sidebar.
  const [selectedItem, setSelectedItem] = useState(null);

  // Modal visibility flags — one flag per modal type.
  const [showAddCourse,    setShowAddCourse]    = useState(false);
  const [showEditCourse,   setShowEditCourse]   = useState(false);
  const [showAddTask,      setShowAddTask]      = useState(false);
  const [showEditTask,     setShowEditTask]     = useState(false);
  const [showAddReminder,  setShowAddReminder]  = useState(false);
  const [showEditReminder, setShowEditReminder] = useState(false);
  const [showAddGrade,     setShowAddGrade]     = useState(false);
  const [showEditGrade,    setShowEditGrade]    = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Data arrays — populated by the fetch effect on mount.
  const [courses,           setCourses]           = useState([]);
  const [tasks,             setTasks]             = useState([]);
  const [progressSnapshots, setProgressSnapshots] = useState([]);
  const [reminders,         setReminders]         = useState([]);

  // Per-tab loading and error states.
  // Isolated so a failure in one tab does not affect the others.
  const [loadingState, setLoadingState] = useState({
    Courses: true, Tasks: true, Reminders: true, Grades: true,
  });
  const [errorState, setErrorState] = useState({
    Courses: null, Tasks: null, Reminders: null, Grades: null,
  });

  const setTabLoading = (tab, val) =>
    setLoadingState((prev) => ({ ...prev, [tab]: val }));
  const setTabError = (tab, val) =>
    setErrorState((prev) => ({ ...prev, [tab]: val }));

  const { logout } = useAuth();
  const navigate   = useNavigate();

  // ─── Data fetching ───────────────────────────────────────────────────────────
  // All four endpoints are fetched in parallel on mount.
  // A 401 response on any endpoint triggers immediate logout and redirect to /login.
  // Non-auth errors fall back gracefully: courses show mock data, others show an error banner.

  useEffect(() => {
    let isMounted = true;

    // Returns true if the error was a 401 and navigation has been triggered.
    const handle401 = (err) => {
      if (err?.response?.status === 401) {
        logout();
        navigate("/login");
        return true;
      }
      return false;
    };

    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/v1/courses");
        if (isMounted) {
          setCourses(Array.isArray(res.data) ? res.data : []);
          setTabError("Courses", null);
        }
      } catch (err) {
        if (handle401(err)) return;
        if (isMounted) {
          // Fall back to mock data so the UI is still usable during backend downtime.
          setCourses(loadMockCourses());
          setTabError("Courses", "Backend unavailable — showing demo data.");
        }
      } finally {
        if (isMounted) setTabLoading("Courses", false);
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await api.get("/api/v1/tasks");
        if (isMounted) {
          setTasks(Array.isArray(res.data) ? res.data : []);
          setTabError("Tasks", null);
        }
      } catch (err) {
        if (handle401(err)) return;
        if (isMounted) setTabError("Tasks", "Could not load tasks. Check backend connection.");
      } finally {
        if (isMounted) setTabLoading("Tasks", false);
      }
    };

    const fetchProgress = async () => {
      try {
        const res = await api.get("/api/v1/course-progress");
        if (isMounted) {
          setProgressSnapshots(Array.isArray(res.data) ? res.data : []);
          setTabError("Grades", null);
        }
      } catch (err) {
        if (handle401(err)) return;
        if (isMounted) setTabError("Grades", "Could not load grade snapshots. Check backend connection.");
      } finally {
        if (isMounted) setTabLoading("Grades", false);
      }
    };

    const fetchReminders = async () => {
      try {
        const res = await api.get("/api/v1/reminders");
        if (isMounted) {
          setReminders(Array.isArray(res.data) ? res.data : []);
          setTabError("Reminders", null);
        }
      } catch (err) {
        if (handle401(err)) return;
        if (isMounted) setTabError("Reminders", "Could not load reminders. Check backend connection.");
      } finally {
        if (isMounted) setTabLoading("Reminders", false);
      }
    };

    fetchCourses();
    fetchTasks();
    fetchProgress();
    fetchReminders();

    // Cleanup flag prevents setState calls on an unmounted component.
    return () => { isMounted = false; };
  }, [logout, navigate]);

  // Clear the selection when the user switches tabs so Edit/Delete reset correctly.
  useEffect(() => {
    setSelectedItem(null);
  }, [activeTab]);

  // ─── Course CRUD ─────────────────────────────────────────────────────────────

  const createCourse = async (courseData) => {
    const res = await api.post("/api/v1/courses", courseData);
    setCourses((prev) => [...prev, res.data]);
  };

  const updateCourse = async (courseId, courseData) => {
    const res = await api.put(`/api/v1/courses/${courseId}`, courseData);
    setCourses((prev) => prev.map((c) => (c.courseId === courseId ? res.data : c)));
    setSelectedItem(null);
  };

  const deleteCourse = async (courseId) => {
    await api.delete(`/api/v1/courses/${courseId}`);
    setCourses((prev) => prev.filter((c) => c.courseId !== courseId));
    setSelectedItem(null);
  };

  // ─── Task CRUD ───────────────────────────────────────────────────────────────

  const createTask = async (taskData) => {
    const res = await api.post("/api/v1/tasks", taskData);
    setTasks((prev) => [...prev, res.data]);
  };

  const updateTask = async (taskId, taskData) => {
    const res = await api.put(`/api/v1/tasks/${taskId}`, taskData);
    setTasks((prev) => prev.map((t) => (t.taskId === taskId ? res.data : t)));
    setSelectedItem(null);
  };

  const deleteTask = async (taskId) => {
    await api.delete(`/api/v1/tasks/${taskId}`);
    setTasks((prev) => prev.filter((t) => t.taskId !== taskId));
    setSelectedItem(null);
  };

  // ─── Reminder CRUD ───────────────────────────────────────────────────────────

  const createReminder = async (reminderData) => {
    const res = await api.post("/api/v1/reminders", reminderData);
    setReminders((prev) => [...prev, res.data]);
  };

  const updateReminder = async (reminderId, reminderData) => {
    const res = await api.put(`/api/v1/reminders/${reminderId}`, reminderData);
    setReminders((prev) => prev.map((r) => (r.reminderId === reminderId ? res.data : r)));
    setSelectedItem(null);
  };

  const deleteReminder = async (reminderId) => {
    await api.delete(`/api/v1/reminders/${reminderId}`);
    setReminders((prev) => prev.filter((r) => r.reminderId !== reminderId));
    setSelectedItem(null);
  };

  // ─── Grade (CourseProgress) CRUD ─────────────────────────────────────────────

  const createGrade = async (payload) => {
    const res = await api.post("/api/v1/course-progress", payload);
    setProgressSnapshots((prev) => [...prev, res.data]);
  };

  const updateGrade = async (progressId, payload) => {
    const res = await api.put(`/api/v1/course-progress/${progressId}`, payload);
    setProgressSnapshots((prev) => prev.map((p) => (p.progressId === progressId ? res.data : p)));
    setSelectedItem(null);
  };

  const deleteGrade = async (progressId) => {
    await api.delete(`/api/v1/course-progress/${progressId}`);
    setProgressSnapshots((prev) => prev.filter((p) => p.progressId !== progressId));
    setSelectedItem(null);
  };

  // ─── Sidebar action handlers ──────────────────────────────────────────────────

  // Routes the primary CTA button to the correct Add modal based on the active tab.
  const handlePrimaryAction = () => {
    if (activeTab === "Courses")   { setShowAddCourse(true);   return; }
    if (activeTab === "Tasks")     { setShowAddTask(true);     return; }
    if (activeTab === "Reminders") { setShowAddReminder(true); return; }
    if (activeTab === "Grades")    { setShowAddGrade(true);    return; }
  };

  // Opens the correct Edit modal based on the type stored in selectedItem.
  const handleEditAction = () => {
    if (!selectedItem) return;
    if (selectedItem.type === "course")   setShowEditCourse(true);
    if (selectedItem.type === "task")     setShowEditTask(true);
    if (selectedItem.type === "reminder") setShowEditReminder(true);
    if (selectedItem.type === "grade")    setShowEditGrade(true);
  };

  // Opens the shared DeleteConfirmModal for any item type.
  const handleDeleteAction = () => {
    if (!selectedItem) return;
    setShowDeleteConfirm(true);
  };

  // Routes the confirmed delete to the correct API call based on selected item type.
  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    if (selectedItem.type === "course")   await deleteCourse(selectedItem.id);
    if (selectedItem.type === "task")     await deleteTask(selectedItem.id);
    if (selectedItem.type === "reminder") await deleteReminder(selectedItem.id);
    if (selectedItem.type === "grade")    await deleteGrade(selectedItem.id);
  };

  // Clears the current selection (used by the "All" button in the sidebar).
  const handleShowAll = () => setSelectedItem(null);

  // Stores the selected item in a consistent shape: { type, id, data }.
  const selectItem = (type, id, data) => setSelectedItem({ type, id, data });

  // Returns true if the given type+id matches the current selection.
  const isSelected = (type, id) =>
    selectedItem?.type === type && selectedItem?.id === id;

  // Resolves a courseId to a human-readable "CODE — Title" label.
  // Used in grade cards and the selected item preview panel.
  // courseId comparison is coerced to Number to handle int/Long mismatches from the backend.
  const getCourseLabel = (courseId) => {
    const match = courses.find((c) => Number(c.courseId) === Number(courseId));
    return match ? `${match.code} — ${match.title}` : `Course ${courseId}`;
  };

  // ─── Selected item preview panel ─────────────────────────────────────────────
  // Renders a small summary card above the list when an item is selected.
  // Gives the user visual confirmation of which item Edit/Delete will act on.

  const renderSelectedPreview = () => {
    if (!selectedItem) return null;
    const { type, data } = selectedItem;

    const configs = {
      course:   { title: "Selected Course",         rows: [["Code", data.code], ["Title", data.title], ["Instructor", data.instructor]] },
      task:     { title: "Selected Task",           rows: [["Title", data.title], ["Type", data.type], ["Due", data.dueDate?.split("T")[0]]] },
      reminder: { title: "Selected Reminder",       rows: [["Message", data.message], ["Scheduled", data.scheduledAt?.split("T")[0]]] },
      grade:    { title: "Selected Grade Snapshot", rows: [["Course", getCourseLabel(data.courseId)], ["Week", data.weekOf], ["Grade", data.currentGradePercent != null ? `${data.currentGradePercent}%` : "—"]] },
    };

    const cfg = configs[type];
    if (!cfg) return null;

    return (
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-header">
          <h3 className="panel-title">{cfg.title}</h3>
        </div>
        {cfg.rows.map(([label, val]) => (
          <p key={label}><strong>{label}:</strong> {val ?? "—"}</p>
        ))}
      </div>
    );
  };

  // ─── Tab content renderer ─────────────────────────────────────────────────────
  // Returns the appropriate list/card view for the active tab.
  // Shows a loading state or error banner before the data list when relevant.

  const renderTabContent = () => {
    const loading = loadingState[activeTab];
    const error   = errorState[activeTab];

    if (loading) {
      return (
        <div className="panel">
          <p className="muted">Loading {activeTab.toLowerCase()}…</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="panel">
          <p style={{ color: "#A32D2D", fontSize: 14 }}>{error}</p>
        </div>
      );
    }

    // ── Courses tab ──
    if (activeTab === "Courses") {
      return (
        <div className="panel">
          <div className="panel-header"><h2 className="panel-title">Courses</h2></div>
          {courses.length === 0 ? (
            <p className="muted">No courses yet. Click +Add Course to get started.</p>
          ) : (
            <div className="card-grid">
              {courses.map((course) => {
                const courseId = course.courseId ?? course.id;
                // Compute real metrics from live task + progress data.
                const stats = realStatsForCourse(courseId, tasks, progressSnapshots);
                return (
                  <div
                    key={courseId}
                    className={`course-card ${isSelected("course", courseId) ? "is-selected" : ""}`}
                    onClick={() => selectItem("course", courseId, course)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        selectItem("course", courseId, course);
                      }
                    }}
                    style={{
                      cursor: "pointer",
                      outline: isSelected("course", courseId) ? "2px solid #5b8def" : "none",
                    }}
                  >
                    <div className="course-card__top">
                      <div className="course-code">{course.code}</div>
                      <div className="course-title">{course.title}</div>
                    </div>
                    <div className="course-metrics">
                      <div className="metric">
                        <div className="metric__label">UPCOMING</div>
                        <div className="metric__value">{stats.upcoming}</div>
                      </div>
                      <div className="metric">
                        <div className="metric__label">TO-DO</div>
                        <div className="metric__value">{stats.todo}</div>
                      </div>
                      <div className="metric">
                        <div className="metric__label">CURR. GRADE</div>
                        <div className="metric__value">
                          {stats.grade !== null ? `${stats.grade}%` : "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // ── Tasks tab ──
    if (activeTab === "Tasks") {
      return (
        <div className="panel">
          <div className="panel-header"><h2 className="panel-title">Tasks</h2></div>
          {tasks.length === 0 ? (
            <p className="muted">No tasks yet. Click +Add Task to get started.</p>
          ) : (
            <div className="stack">
              {tasks.map((task) => {
                const taskId = task.taskId ?? task.id;
                return (
                  <div
                    key={taskId}
                    className={`row-card ${isSelected("task", taskId) ? "is-selected" : ""}`}
                    onClick={() => selectItem("task", taskId, task)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        selectItem("task", taskId, task);
                      }
                    }}
                    style={{
                      cursor: "pointer",
                      outline: isSelected("task", taskId) ? "2px solid #5b8def" : "none",
                    }}
                  >
                    <div className="row-card__left">
                      <span className="dot" aria-hidden />
                      <div className="row-title">{task.title}</div>
                    </div>
                    <div className="row-meta muted">
                      {task.type ?? "—"}{task.dueDate ? ` · Due: ${task.dueDate.split("T")[0]}` : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // ── Reminders tab ──
    if (activeTab === "Reminders") {
      return (
        <div className="panel">
          <div className="panel-header"><h2 className="panel-title">Reminders</h2></div>
          {reminders.length === 0 ? (
            <p className="muted">No reminders yet. Click +Reminder to get started.</p>
          ) : (
            <div className="stack">
              {reminders.map((r) => {
                const reminderId = r.reminderId ?? r.id;
                return (
                  <div
                    key={reminderId}
                    className={`row-card row-card--warm ${isSelected("reminder", reminderId) ? "is-selected" : ""}`}
                    onClick={() => selectItem("reminder", reminderId, r)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        selectItem("reminder", reminderId, r);
                      }
                    }}
                    style={{
                      cursor: "pointer",
                      outline: isSelected("reminder", reminderId) ? "2px solid #5b8def" : "none",
                    }}
                  >
                    <div className="row-card__left">
                      <span className="dot dot--warm" aria-hidden />
                      <div className="row-title">{r.message ?? "—"}</div>
                    </div>
                    <div className="row-meta muted">
                      {r.scheduledAt ? r.scheduledAt.split("T")[0] : "No date"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // ── Grades tab ──
    if (activeTab === "Grades") {
      return (
        <div className="panel">
          <div className="panel-header"><h2 className="panel-title">Grades</h2></div>
          {progressSnapshots.length === 0 ? (
            <p className="muted">No grade snapshots yet. Click +Add Grade to get started.</p>
          ) : (
            <div className="card-grid grades-grid">
              {progressSnapshots.map((p) => {
                const idKey = p.progressId ?? p.id;
                return (
                  <div
                    key={idKey}
                    className={`grade-card ${isSelected("grade", idKey) ? "is-selected" : ""}`}
                    onClick={() => selectItem("grade", idKey, p)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        selectItem("grade", idKey, p);
                      }
                    }}
                    style={{
                      cursor: "pointer",
                      outline: isSelected("grade", idKey) ? "2px solid #5b8def" : "none",
                    }}
                  >
                    <div className="grade-card__top">
                      {/* Resolve courseId to human-readable label using the courses list. */}
                      <div className="grade-course">{getCourseLabel(p.courseId)}</div>
                      <div className="grade-type muted">
                        {p.weekOf ? `Week of ${p.weekOf}` : "Progress"}
                      </div>
                    </div>
                    <div className="grade-value">
                      {p.currentGradePercent != null ? `${p.currentGradePercent}%` : "—"}
                    </div>
                    <div className="grade-foot muted">
                      {p.canMeetGoal !== undefined ? `Can meet goal: ${String(p.canMeetGoal)}` : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="app-shell dashboard-page">

      {/* Course modals */}
      {showAddCourse && (
        <AddCourseModal onClose={() => setShowAddCourse(false)} onSave={createCourse} />
      )}
      {showEditCourse && selectedItem?.type === "course" && (
        <EditCourseModal
          course={selectedItem.data}
          onClose={() => setShowEditCourse(false)}
          onSave={updateCourse}
        />
      )}

      {/* Task modals — courses list passed so the user selects by name instead of raw ID */}
      {showAddTask && (
        <AddTaskModal onClose={() => setShowAddTask(false)} onSave={createTask} courses={courses} />
      )}
      {showEditTask && selectedItem?.type === "task" && (
        <EditTaskModal
          task={selectedItem.data}
          onClose={() => setShowEditTask(false)}
          onSave={updateTask}
          courses={courses}
        />
      )}

      {/* Reminder modals — tasks list passed so the user selects by title instead of raw ID */}
      {showAddReminder && (
        <AddReminderModal onClose={() => setShowAddReminder(false)} onSave={createReminder} tasks={tasks} />
      )}
      {showEditReminder && selectedItem?.type === "reminder" && (
        <EditReminderModal
          reminder={selectedItem.data}
          onClose={() => setShowEditReminder(false)}
          onSave={updateReminder}
          tasks={tasks}
        />
      )}

      {/* Grade modals — courses list passed so the user selects by name instead of raw ID */}
      {showAddGrade && (
        <AddGradeModal onClose={() => setShowAddGrade(false)} onSave={createGrade} courses={courses} />
      )}
      {showEditGrade && selectedItem?.type === "grade" && (
        <EditGradeModal
          grade={selectedItem.data}
          onClose={() => setShowEditGrade(false)}
          onSave={updateGrade}
          courses={courses}
        />
      )}

      {/* Shared delete confirmation modal — reused across all item types */}
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

      <Sidebar
        activeTab={activeTab}
        onPrimaryAction={handlePrimaryAction}
        onShowAll={handleShowAll}
        canEdit={!!selectedItem}
        canDelete={!!selectedItem}
        onEditAction={handleEditAction}
        onDeleteAction={handleDeleteAction}
        onLogout={() => { logout(); navigate("/login"); }}
      />

      <main className="main" style={{ background: TAB_THEME[activeTab]?.bg ?? "#fff" }}>
        <div className="top-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              className={`tab ${activeTab === t ? "tab--active" : ""}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <section className="content">
          {renderSelectedPreview()}
          {renderTabContent()}
        </section>
      </main>
    </div>
  );
}