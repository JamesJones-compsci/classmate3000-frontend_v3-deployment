// src/pages/Dashboard.jsx

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

// Background tint per tab to match Figma design.
const TAB_THEME = {
  Courses: { bg: "#EAF4E6" },
  Tasks: { bg: "#E9F3FF" },
  Reminders: { bg: "#FFF5D9" },
  Grades: { bg: "#F1E8FF" },
};

// Deterministic hash used to generate stable demo stats per course.
function hashToInt(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// Generate placeholder metric values for a course card.
function demoStatsForCourse(course) {
  const seed = hashToInt(`${course?.code ?? ""}-${course?.title ?? ""}`);
  const todo = 1 + (seed % 6);
  const upcoming = (seed >> 3) % 4;
  const progress = clamp(20 + (seed % 81), 0, 100);
  const grade = clamp(60 + (seed % 41), 0, 100);
  return { todo, upcoming, progress, grade };
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Courses");
  const [selectedItem, setSelectedItem] = useState(null);

  // Modal visibility flags — one per modal type.
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showEditCourse, setShowEditCourse] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [showEditReminder, setShowEditReminder] = useState(false);
  const [showAddGrade, setShowAddGrade] = useState(false);
  const [showEditGrade, setShowEditGrade] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [progressSnapshots, setProgressSnapshots] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // Fetch all data on mount. Falls back to mock data if backend is unavailable.
  useEffect(() => {
    let isMounted = true;
    const safeSet = (setter) => (value) => isMounted && setter(value);

    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/v1/courses");
        return Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        if (err?.response?.status === 401) throw err;
        return loadMockCourses();
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await api.get("/api/v1/tasks");
        return Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        if (err?.response?.status === 401) throw err;
        return [];
      }
    };

    const fetchCourseProgress = async () => {
      try {
        const res = await api.get("/api/v1/course-progress");
        return Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        if (err?.response?.status === 401) throw err;
        return [];
      }
    };

    const fetchReminders = async () => {
      try {
        const res = await api.get("/api/v1/reminders");
        return Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        if (err?.response?.status === 401) throw err;
        return [];
      }
    };

    const fetchData = async () => {
      try {
        safeSet(setLoading)(true);
        const [c, t, p, r] = await Promise.all([
          fetchCourses(),
          fetchTasks(),
          fetchCourseProgress(),
          fetchReminders(),
        ]);
        safeSet(setCourses)(c);
        safeSet(setTasks)(t);
        safeSet(setProgressSnapshots)(p);
        safeSet(setReminders)(r);
      } catch (err) {
        if (err?.response?.status === 401) {
          // Force re-login if the token is invalid or expired.
          logout();
          navigate("/login");
          return;
        }
        safeSet(setCourses)(loadMockCourses());
        safeSet(setTasks)([]);
        safeSet(setProgressSnapshots)([]);
        safeSet(setReminders)([]);
      } finally {
        safeSet(setLoading)(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [logout, navigate]);

  // Clear selection when switching tabs so action buttons reset correctly.
  useEffect(() => {
    setSelectedItem(null);
  }, [activeTab]);

  // --- Course CRUD ---

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

  // --- Task CRUD ---

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

  // --- Reminder CRUD ---

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

  // --- Grade (course-progress) CRUD ---

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

  // --- Sidebar action handlers ---

  // Routes the primary CTA button to the correct add modal per tab.
  const handlePrimaryAction = () => {
    if (activeTab === "Courses") { setShowAddCourse(true); return; }
    if (activeTab === "Tasks") { setShowAddTask(true); return; }
    if (activeTab === "Reminders") { setShowAddReminder(true); return; }
    if (activeTab === "Grades") { setShowAddGrade(true); return; }
  };

  // Opens the correct edit modal based on the selected item type.
  const handleEditAction = () => {
    if (!selectedItem) return;
    if (selectedItem.type === "course") setShowEditCourse(true);
    if (selectedItem.type === "task") setShowEditTask(true);
    if (selectedItem.type === "reminder") setShowEditReminder(true);
    if (selectedItem.type === "grade") setShowEditGrade(true);
  };

  // Opens the shared delete confirm modal for any item type.
  const handleDeleteAction = () => {
    if (!selectedItem) return;
    setShowDeleteConfirm(true);
  };

  // Routes the confirmed delete to the correct API call by item type.
  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    if (selectedItem.type === "course") await deleteCourse(selectedItem.id);
    if (selectedItem.type === "task") await deleteTask(selectedItem.id);
    if (selectedItem.type === "reminder") await deleteReminder(selectedItem.id);
    if (selectedItem.type === "grade") await deleteGrade(selectedItem.id);
  };

  const handleShowAll = () => {
    setSelectedItem(null);
  };

  // Store selection in a consistent shape so sidebar actions can depend on it.
  const selectItem = (type, id, data) => {
    setSelectedItem({ type, id, data });
  };

  const isSelected = (type, id) => {
    return selectedItem?.type === type && selectedItem?.id === id;
  };

  // Look up course name by courseId for display in grade cards and preview.
  const getCourseLabel = (courseId) => {
    const match = courses.find((c) => c.courseId === courseId);
    return match ? `${match.code} — ${match.title}` : `Course ${courseId}`;
  };

  // Renders a small info panel above the list when an item is selected.
  const renderSelectedPreview = () => {
    if (!selectedItem) return null;
    const { type, data } = selectedItem;

    if (type === "course") {
      return (
        <div className="panel" style={{ marginBottom: 16 }}>
          <div className="panel-header">
            <h3 className="panel-title">Selected Course</h3>
          </div>
          <p><strong>Code:</strong> {data.code ?? "—"}</p>
          <p><strong>Title:</strong> {data.title ?? "—"}</p>
          <p><strong>Instructor:</strong> {data.instructor ?? "—"}</p>
        </div>
      );
    }
    if (type === "task") {
      return (
        <div className="panel" style={{ marginBottom: 16 }}>
          <div className="panel-header">
            <h3 className="panel-title">Selected Task</h3>
          </div>
          <p><strong>Title:</strong> {data.title ?? "—"}</p>
          <p><strong>Type:</strong> {data.type ?? "—"}</p>
          <p><strong>Due:</strong> {data.dueDate ?? "—"}</p>
        </div>
      );
    }
    if (type === "reminder") {
      return (
        <div className="panel" style={{ marginBottom: 16 }}>
          <div className="panel-header">
            <h3 className="panel-title">Selected Reminder</h3>
          </div>
          <p><strong>Message:</strong> {data.message ?? "—"}</p>
          <p><strong>Scheduled:</strong> {data.scheduledAt ?? "—"}</p>
        </div>
      );
    }
    if (type === "grade") {
      return (
        <div className="panel" style={{ marginBottom: 16 }}>
          <div className="panel-header">
            <h3 className="panel-title">Selected Grade Snapshot</h3>
          </div>
          <p><strong>Course:</strong> {getCourseLabel(data.courseId)}</p>
          <p><strong>Week:</strong> {data.weekOf ?? "—"}</p>
          <p><strong>Current Grade:</strong> {data.currentGradePercent ?? "—"}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="app-shell dashboard-page">

      {/* Course modals */}
      {showAddCourse && (
        <AddCourseModal onClose={() => setShowAddCourse(false)} onSave={createCourse} />
      )}
      {showEditCourse && selectedItem?.type === "course" && (
        <EditCourseModal course={selectedItem.data} onClose={() => setShowEditCourse(false)} onSave={updateCourse} />
      )}

      {/* Task modals */}
      {showAddTask && (
        <AddTaskModal onClose={() => setShowAddTask(false)} onSave={createTask} />
      )}
      {showEditTask && selectedItem?.type === "task" && (
        <EditTaskModal task={selectedItem.data} onClose={() => setShowEditTask(false)} onSave={updateTask} />
      )}

      {/* Reminder modals */}
      {showAddReminder && (
        <AddReminderModal onClose={() => setShowAddReminder(false)} onSave={createReminder} />
      )}
      {showEditReminder && selectedItem?.type === "reminder" && (
        <EditReminderModal reminder={selectedItem.data} onClose={() => setShowEditReminder(false)} onSave={updateReminder} />
      )}

      {/* Grade modals — courses list passed so user can select by name instead of ID */}
      {showAddGrade && (
        <AddGradeModal
          onClose={() => setShowAddGrade(false)}
          onSave={createGrade}
          courses={courses}
        />
      )}
      {showEditGrade && selectedItem?.type === "grade" && (
        <EditGradeModal
          grade={selectedItem.data}
          onClose={() => setShowEditGrade(false)}
          onSave={updateGrade}
          courses={courses}
        />
      )}

      {/* Shared delete confirm modal — works for all item types */}
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
          {loading ? (
            <div className="panel">
              <h2 className="panel-title">{activeTab}</h2>
              <p className="muted">Loading data…</p>
            </div>
          ) : (
            <>
              {renderSelectedPreview()}

              {activeTab === "Courses" && (
                <div className="panel">
                  <div className="panel-header">
                    <h2 className="panel-title">Courses</h2>
                  </div>
                  {courses.length === 0 ? (
                    <p className="muted">No courses yet.</p>
                  ) : (
                    <div className="card-grid">
                      {courses.map((course) => {
                        const s = demoStatsForCourse(course);
                        const courseId = course.courseId ?? course.id ?? `${course.code}-${course.title}`;
                        return (
                          <div
                            key={courseId}
                            className={`course-card ${isSelected("course", courseId) ? "is-selected" : ""}`}
                            onClick={() => selectItem("course", courseId, course)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectItem("course", courseId, course); }
                            }}
                            style={{ cursor: "pointer", outline: isSelected("course", courseId) ? "2px solid #5b8def" : "none" }}
                          >
                            <div className="course-card__top">
                              <div className="course-code">{course.code}</div>
                              <div className="course-title">{course.title}</div>
                            </div>
                            <div className="course-metrics">
                              <div className="metric">
                                <div className="metric__label">UPCOMING</div>
                                <div className="metric__value">{s.upcoming}</div>
                              </div>
                              <div className="metric">
                                <div className="metric__label">TO-DO</div>
                                <div className="metric__value">{s.todo}</div>
                              </div>
                              <div className="metric">
                                <div className="metric__label">PROGRESS</div>
                                <div className="metric__value">{s.progress}%</div>
                              </div>
                              <div className="metric">
                                <div className="metric__label">CURR. GRADE</div>
                                <div className="metric__value">{s.grade}%</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Tasks" && (
                <div className="panel">
                  <div className="panel-header"><h2 className="panel-title">Tasks</h2></div>
                  {tasks.length === 0 ? (
                    <p className="muted">No tasks yet.</p>
                  ) : (
                    <div className="stack">
                      {tasks.map((task) => {
                        // Use taskId from backend; fall back to composite key.
                        const taskId = task.taskId ?? task.id ?? `${task.type}-${task.title}`;
                        return (
                          <div
                            key={taskId}
                            className={`row-card ${isSelected("task", taskId) ? "is-selected" : ""}`}
                            onClick={() => selectItem("task", taskId, task)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectItem("task", taskId, task); } }}
                            style={{ cursor: "pointer", outline: isSelected("task", taskId) ? "2px solid #5b8def" : "none" }}
                          >
                            <div className="row-card__left">
                              <span className="dot" aria-hidden />
                              <div className="row-title">{task.title}</div>
                            </div>
                            <div className="row-meta muted">
                              {task.type ?? "—"} {task.dueDate ? `· Due: ${task.dueDate.split("T")[0]}` : ""}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Reminders" && (
                <div className="panel">
                  <div className="panel-header"><h2 className="panel-title">Reminders</h2></div>
                  {reminders.length === 0 ? (
                    <p className="muted">No reminders yet.</p>
                  ) : (
                    <div className="stack">
                      {reminders.map((r) => {
                        // Use reminderId from backend as the stable key.
                        const reminderId = r.reminderId ?? r.id ?? `${r.message}-${r.scheduledAt ?? ""}`;
                        return (
                          <div
                            key={reminderId}
                            className={`row-card row-card--warm ${isSelected("reminder", reminderId) ? "is-selected" : ""}`}
                            onClick={() => selectItem("reminder", reminderId, r)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectItem("reminder", reminderId, r); } }}
                            style={{ cursor: "pointer", outline: isSelected("reminder", reminderId) ? "2px solid #5b8def" : "none" }}
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
              )}

              {activeTab === "Grades" && (
                <div className="panel">
                  <div className="panel-header">
                    <h2 className="panel-title">Grades</h2>
                  </div>
                  {progressSnapshots.length === 0 ? (
                    <p className="muted">No progress snapshots yet.</p>
                  ) : (
                    <div className="card-grid grades-grid">
                      {progressSnapshots.map((p) => {
                        // Use progressId from backend as the stable key.
                        const idKey = p.progressId ?? p.id ?? `${p.courseId ?? "course"}-${p.weekOf ?? p.computedAt ?? "snap"}`;
                        const gradeValue = p.currentGradePercent ?? null;
                        return (
                          <div
                            key={idKey}
                            className={`grade-card ${isSelected("grade", idKey) ? "is-selected" : ""}`}
                            onClick={() => selectItem("grade", idKey, p)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectItem("grade", idKey, p); } }}
                            style={{ cursor: "pointer", outline: isSelected("grade", idKey) ? "2px solid #5b8def" : "none" }}
                          >
                            <div className="grade-card__top">
                              {/* Resolve course name from the courses list instead of showing a raw ID */}
                              <div className="grade-course">{getCourseLabel(p.courseId)}</div>
                              <div className="grade-type muted">{p.weekOf ? `Week of ${p.weekOf}` : "Progress"}</div>
                            </div>
                            <div className="grade-value">{gradeValue !== null ? `${gradeValue}%` : "—"}</div>
                            <div className="grade-foot muted">
                              {p.canMeetGoal !== undefined ? `Can meet goal: ${String(p.canMeetGoal)}` : ""}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}