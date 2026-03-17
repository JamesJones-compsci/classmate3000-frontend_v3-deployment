import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { loadMockCourses } from "../mocks/loadMockCourses";
import Sidebar from "../components/Sidebar";

const TABS = ["Courses", "Tasks", "Reminders", "Grades"];

/* Tab background tints */
const TAB_THEME = {
  Courses: { bg: "#EAF4E6" },
  Tasks: { bg: "#E9F3FF" },
  Reminders: { bg: "#FFF5D9" },
  Grades: { bg: "#F1E8FF" },
};

/* Deterministic placeholders (stable across reloads) */
function hashToInt(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function demoStatsForCourse(course) {
  const seed = hashToInt(`${course?.code ?? ""}-${course?.title ?? ""}`);
  const todo = 1 + (seed % 6); // 1..6
  const upcoming = (seed >> 3) % 4; // 0..3
  const progress = clamp(20 + (seed % 81), 0, 100); // 20..100
  const grade = clamp(60 + (seed % 41), 0, 100); // 60..100
  return { todo, upcoming, progress, grade };
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Courses");

  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [progressSnapshots, setProgressSnapshots] = useState([]);
  const [reminders, setReminders] = useState([]);

  const [loading, setLoading] = useState(true);

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const safeSet = (setter) => (value) => isMounted && setter(value);

    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/v1/courses");
        return Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        if (err?.response?.status === 401) throw err;
        // Keep the UI usable when the backend is temporarily unavailable.
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

    return () => {
      isMounted = false;
    };
  }, [logout, navigate]);

  const createCourse = async (courseData) => {
    const res = await api.post("/api/v1/courses", courseData);
    setCourses((prev) => [...prev, res.data]);
  };

  const createTask = async (taskData) => {
    const res = await api.post("/api/v1/tasks", taskData);
    setTasks((prev) => [...prev, res.data]);
  };

  // Keep the payload simple for now until the final DTO is locked.
  const createCourseProgress = async (payload) => {
    const res = await api.post("/api/v1/course-progress", payload);
    setProgressSnapshots((prev) => [...prev, res.data]);
  };

  const createReminder = async (reminderData) => {
    const res = await api.post("/api/v1/reminders", reminderData);
    setReminders((prev) => [...prev, res.data]);
  };

  const handlePrimaryAction = () => {
    if (activeTab === "Courses") {
      return createCourse({
        code: "CS101",
        title: "Intro to CS",
        description: "Basics of Computer Science",
      });
    }

    if (activeTab === "Tasks") {
      return createTask({
        code: "TASK-001",
        title: "My First Task",
        description: "Frontend integration task",
      });
    }

    if (activeTab === "Grades") {
      return createCourseProgress({
        courseId: 1,
        weekOf: "2026-02-15",
        currentGradePercent: 85,
        computedAt: new Date().toISOString(),
      });
    }

    if (activeTab === "Reminders") {
      return createReminder({
        title: "Study for exam",
        dueDate: "2026-02-01",
      });
    }
  };

  return (
    <div className="app-shell dashboard-page">
      <Sidebar
        activeTab={activeTab}
        onPrimaryAction={handlePrimaryAction}
        onLogout={() => {
          logout();
          navigate("/login");
        }}
      />

      <main
        className="main"
        style={{ background: TAB_THEME[activeTab]?.bg ?? "#fff" }}
      >
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
              {/* Keep actions in the left panel to avoid duplicated controls in the content area. */}

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

                        return (
                          <div
                            key={
                              course.courseId ??
                              course.id ??
                              `${course.code}-${course.title}`
                            }
                            className="course-card"
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
                  <div className="panel-header">
                    <h2 className="panel-title">Tasks</h2>
                  </div>

                  {tasks.length === 0 ? (
                    <p className="muted">No tasks yet.</p>
                  ) : (
                    <div className="stack">
                      {tasks.map((task) => (
                        <div
                          key={task.id ?? `${task.code}-${task.title}`}
                          className="row-card"
                        >
                          <div className="row-card__left">
                            <span className="dot" aria-hidden />
                            <div className="row-title">{task.title}</div>
                          </div>
                          <div className="row-meta muted">
                            {task.description ? task.description : "—"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Reminders" && (
                <div className="panel">
                  <div className="panel-header">
                    <h2 className="panel-title">Reminders</h2>
                  </div>

                  {reminders.length === 0 ? (
                    <p className="muted">No reminders yet.</p>
                  ) : (
                    <div className="stack">
                      {reminders.map((r) => (
                        <div
                          key={r.id ?? `${r.title}-${r.dueDate ?? ""}`}
                          className="row-card row-card--warm"
                        >
                          <div className="row-card__left">
                            <span className="dot dot--warm" aria-hidden />
                            <div className="row-title">{r.title}</div>
                          </div>
                          <div className="row-meta muted">
                            {r.dueDate ? `Due: ${r.dueDate}` : "No due date"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Grades" && (
                <div className="panel">
                  <div className="panel-header">
                    <h2 className="panel-title">Grades</h2>
                    <p className="muted" style={{ marginTop: 4 }}>
                      Backed by <code>/api/v1/course-progress</code> (courseprogress-service)
                    </p>
                  </div>

                  {progressSnapshots.length === 0 ? (
                    <p className="muted">No progress snapshots yet.</p>
                  ) : (
                    <div className="card-grid grades-grid">
                      {progressSnapshots.map((p) => {
                        const idKey =
                          p.progressId ??
                          p.id ??
                          `${p.courseId ?? "course"}-${p.weekOf ?? p.computedAt ?? "snap"}`;

                        const courseLabel = p.courseCode ?? p.courseId ?? "—";
                        const gradeValue =
                          p.currentGradePercent ??
                          p.currentGrade ??
                          p.gradePercent ??
                          p.grade ??
                          null;

                        return (
                          <div key={idKey} className="grade-card">
                            <div className="grade-card__top">
                              <div className="grade-course">{courseLabel}</div>
                              <div className="grade-type muted">
                                {p.weekOf ? `Week of ${p.weekOf}` : "Progress"}
                              </div>
                            </div>

                            <div className="grade-value">
                              {gradeValue !== null ? `${gradeValue}%` : "—"}
                            </div>

                            <div className="grade-foot muted">
                              {p.canMeetGoal !== undefined
                                ? `Can meet goal: ${String(p.canMeetGoal)}`
                                : ""}
                              {p.computedAt ? ` • computedAt: ${p.computedAt}` : ""}
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