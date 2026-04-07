import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import Modal from "../../../components/ui/Modal";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Button from "../../../components/ui/Button";
import CourseCard from "../components/CourseCard";
import CourseForm from "../components/CourseForm";
import { useCourses } from "../hooks/useCourses";
import { useTasks } from "../../tasks/hooks/useTasks";
import { useCourseProgress } from "../../progress/hooks/useCourseProgress";
import styles from "./CourseDetailPage.module.css";

const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function formatMeetingTime(timeValue) {
  if (!timeValue) return "";
  const [h, m] = timeValue.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  }).toLowerCase();
}

function getMeetingLines(course) {
  if (!course?.meetings?.length) return [];

  return course.meetings.map((meeting) => {
    const day = DAY_LABELS[meeting.dayOfWeek] || "—";
    const start = formatMeetingTime(meeting.startTime);
    const end = formatMeetingTime(meeting.endTime);
    return `${day}: ${start}-${end}`;
  });
}

function getGoalStatusMessage(course, latestProgress) {
  const goal = Number(course?.gradeGoal);
  const current = Number(latestProgress?.currentGradePercent);
  const maxPossible = Number(latestProgress?.maxPossiblePercent);

  if (Number.isNaN(goal)) return "No grade goal has been set.";
  if (Number.isNaN(current) || Number.isNaN(maxPossible)) {
    return "Not enough progress data to evaluate the grade goal yet.";
  }

  if (current >= goal) {
    return `You are meeting your grade goal. Your current grade is ${current}%.`;
  }

  if (maxPossible >= goal) {
    return `You have not met your grade goal yet, but it is still possible. Your current grade is ${current}%, your goal is ${goal}%, and your max possible is ${maxPossible}%.`;
  }

  return `Your grade goal is no longer possible based on current results. Your current grade is ${current}%, your goal is ${goal}%, and your max possible is ${maxPossible}%.`;
}

function getAchievedGrade(task) {
  if (task?.scorePercent != null) return `${task.scorePercent}%`;
  if (task?.achievedGradePercent != null) return `${task.achievedGradePercent}%`;
  if (task?.gradeAchievedPercent != null) return `${task.gradeAchievedPercent}%`;
  if (task?.gradePercent != null) return `${task.gradePercent}%`;
  if (task?.earnedPercent != null) return `${task.earnedPercent}%`;
  if (task?.score != null) return `${task.score}%`;
  return "—";
}

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { courses, loading, error, addCourse, editCourse, removeCourse } = useCourses();
  const { tasks } = useTasks();
  const { entries } = useCourseProgress(courseId);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const course = useMemo(
    () => courses.find((item) => Number(item.courseId) === Number(courseId)) ?? null,
    [courses, courseId]
  );

  const relatedTasks = useMemo(() => {
    return tasks
      .filter((task) => Number(task.courseId) === Number(courseId))
      .sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
  }, [tasks, courseId]);

  const resultTasks = useMemo(() => {
  return relatedTasks.filter((t) => t.isCompleted);
}, [relatedTasks]);

  const latestProgress = entries[entries.length - 1] ?? null;
  const meetingLines = getMeetingLines(course);

  useEffect(() => {
  function handleLeftAction(event) {
    if (event.detail?.section === "courses" && event.detail?.action === "add") {
      setShowCreate(true);
    }
  }

  window.addEventListener("classmate:left-action", handleLeftAction);

  return () => {
    window.removeEventListener("classmate:left-action", handleLeftAction);
  };
}, []);

  return (
    <div className={styles.page}>
      <SectionHeader
        title={course ? `${course.code} — ${course.title}` : "Course Details"}
        breadcrumbs={[
          { label: "Home", to: "/dashboard/courses" },
          { label: "Courses", to: "/dashboard/courses" },
          { label: course ? course.title : "Course Details" },
        ]}
        actions={
          <div className={styles.actions}>
            <Button variant="secondary" disabled={!course} onClick={() => setShowEdit(true)}>
              Edit
            </Button>
            <Button variant="danger" disabled={!course} onClick={() => setShowDelete(true)}>
              Delete
            </Button>
          </div>
        }
      />

      <div className={styles.body}>
        {loading && <EmptyState title="Loading" message="Loading course..." />}
        {!loading && error && <EmptyState title="Error" message={error} />}
        {!loading && !error && !course && (
          <EmptyState title="Course not found" message="This course does not exist." />
        )}

        {!loading && !error && course && (
          <>
            <div className={styles.grid}>
              <section className={`${styles.fullWidth} ${styles.summaryRow}`}>
                <div className={styles.summaryCell}>
                  <div className={styles.summaryLabel}>Schedule</div>
                  {meetingLines.length === 0 ? (
                    <div className={styles.summaryValue}>No scheduled meetings</div>
                  ) : (
                    meetingLines.map((line) => (
                      <div key={line} className={styles.summaryValue}>
                        {line}
                      </div>
                    ))
                  )}
                </div>

                <div className={styles.summaryCellRight}>
                  <div className={styles.summaryLabel}>Instructor</div>
                  <div className={styles.summaryValue}>{course.instructor || "—"}</div>
                </div>
              </section>
              <section className={styles.panel}>
                <h3 className={styles.panelTitle}>Upcoming Tasks</h3>

                {relatedTasks.filter((task) => !task.isCompleted).length === 0 ? (
                  <p className={styles.muted}>No upcoming tasks.</p>
                ) : (
                  <div className={styles.taskList}>
                    {relatedTasks
                      .filter((task) => !task.isCompleted)
                      .map((task) => (
                        <button
                          key={task.taskId}
                          type="button"
                          className={styles.taskLink}
                          onClick={() => navigate(`/dashboard/tasks/${task.taskId}`)}
                        >
                          <div className={styles.taskContent}>
                            <div className={styles.taskMainRow}>
                              <span>{task.title || "Untitled task"}</span>
                              <span>{task.dueDate ? task.dueDate.slice(0, 10) : "No date"}</span>
                            </div>

                            <div className={styles.taskMetaRow}>
                              <span>{task.type || "—"}</span>
                              <span>{task.weight != null ? `${task.weight}%` : "—"}</span>
                            </div>
                          </div>

                          <span className={styles.taskArrow}>›</span>
                        </button>
                      ))}
                  </div>
                )}
              </section>

              <section className={styles.panel}>
                <h3 className={styles.panelTitle}>Completed Tasks</h3>

                {resultTasks.length === 0 ? (
                  <p className={styles.muted}>No completed tasks yet.</p>
                ) : (
                  <div className={styles.taskList}>
                    {resultTasks.map((task) => (
                      <button
                        key={task.taskId}
                        type="button"
                        className={styles.taskLink}
                        onClick={() => navigate(`/dashboard/tasks/${task.taskId}`)}
                      >
                        <div className={styles.taskContent}>
                          <div className={styles.taskMainRow}>
                            <span>{task.title || "Untitled task"}</span>
                            <span>
                              {getAchievedGrade(task)}
                            </span>
                          </div>

                          <div className={styles.taskMetaRow}>
                            <span>{task.type || "—"}</span>
                            <span>{task.weight != null ? `${task.weight}%` : "—"}</span>
                          </div>
                        </div>

                        <span className={styles.taskArrow}>›</span>
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <section className={`${styles.panel} ${styles.fullWidth}`}>
                <div className={styles.goalHeader}>
                  <h3 className={styles.panelTitle}>Goal Status</h3>
                  <span className={styles.goalBadge}>
                    Goal {course.gradeGoal ?? "—"}%
                  </span>
                </div>

                <p className={styles.goalMessage}>
                  {getGoalStatusMessage(course, latestProgress)}
                </p>
              </section>
            </div>

            <div className={styles.bottomAction}>
              <Button variant="ghost" onClick={() => navigate("/dashboard/courses")}>
                Back to All Courses
              </Button>
            </div>
          </>
        )}
      </div>

      {showCreate && (
        <Modal title="Add Course" onClose={() => setShowCreate(false)}>
            <CourseForm
            mode="create"
            onCancel={() => setShowCreate(false)}
            onSubmit={async (payload) => {
                const created = await addCourse(payload);
                setShowCreate(false);
                if (created?.courseId != null) {
                navigate(`/dashboard/courses/${created.courseId}`);
                }
            }}
            />
        </Modal>
        )}

      {showEdit && course && (
        <Modal title="Edit Course" onClose={() => setShowEdit(false)}>
          <CourseForm
            mode="edit"
            initialValues={course}
            onCancel={() => setShowEdit(false)}
            onSubmit={async (payload) => {
              await editCourse(course.courseId, payload);
              setShowEdit(false);
            }}
          />
        </Modal>
      )}

      {showDelete && course && (
        <ConfirmDialog
          title="Delete course?"
          message={course.title}
          onClose={() => setShowDelete(false)}
          onConfirm={async () => {
            await removeCourse(course.courseId);
            navigate("/dashboard/courses");
          }}
        />
      )}
    </div>
  );
}