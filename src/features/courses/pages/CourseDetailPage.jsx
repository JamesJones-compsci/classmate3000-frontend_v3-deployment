import { useMemo, useState } from "react";
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

function getMeetingLines(course) {
  const lines = [];

  if (course?.meetingDays || course?.meetingTime) {
    lines.push(
      [course.meetingDays, course.meetingTime].filter(Boolean).join(" • ")
    );
  }

  if (course?.location) lines.push(course.location);
  if (course?.semester) lines.push(course.semester);

  return lines.filter(Boolean);
}

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const { courses, loading, error, editCourse, removeCourse } = useCourses();
  const { tasks } = useTasks();
  const { entries } = useCourseProgress(courseId);

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

  const latestProgress = entries[entries.length - 1] ?? null;
  const meetingLines = getMeetingLines(course);

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
            <div className={styles.topCard}>
              <CourseCard course={course} />
            </div>

            <div className={styles.grid}>
              <section className={styles.panel}>
                <h3 className={styles.panelTitle}>Course Info</h3>
                <div className={styles.infoList}>
                  <div><strong>Code:</strong> {course.code || "—"}</div>
                  <div><strong>Title:</strong> {course.title || "—"}</div>
                  <div><strong>Instructor:</strong> {course.instructor || "—"}</div>
                  <div><strong>Grade Goal:</strong> {course.gradeGoal ?? "—"}</div>
                </div>
              </section>

              <section className={styles.panel}>
                <h3 className={styles.panelTitle}>Meetings</h3>
                {meetingLines.length === 0 ? (
                  <p className={styles.muted}>No meeting details available.</p>
                ) : (
                  <div className={styles.infoList}>
                    {meetingLines.map((line) => (
                      <div key={line}>{line}</div>
                    ))}
                  </div>
                )}
              </section>

              <section className={styles.panel}>
                <h3 className={styles.panelTitle}>Latest Progress</h3>
                {!latestProgress ? (
                  <p className={styles.muted}>No progress entries yet.</p>
                ) : (
                  <div className={styles.infoList}>
                    <div><strong>Current Grade:</strong> {latestProgress.currentGradePercent ?? "—"}%</div>
                    <div><strong>Max Possible:</strong> {latestProgress.maxPossiblePercent ?? "—"}%</div>
                    <div><strong>Week Of:</strong> {latestProgress.weekOf || "—"}</div>
                  </div>
                )}

                <div className={styles.sectionAction}>
                  <Button
                    variant="progress"
                    onClick={() => navigate(`/dashboard/progress/${course.courseId}`)}
                  >
                    View Progress
                  </Button>
                </div>
              </section>

              <section className={`${styles.panel} ${styles.fullWidth}`}>
                <h3 className={styles.panelTitle}>Related Tasks</h3>

                {relatedTasks.length === 0 ? (
                  <p className={styles.muted}>No tasks linked to this course yet.</p>
                ) : (
                  <div className={styles.linkList}>
                    {relatedTasks.map((task) => (
                      <button
                        key={task.taskId}
                        type="button"
                        className={styles.linkRow}
                        onClick={() => navigate(`/dashboard/tasks/${task.taskId}`)}
                      >
                        <span>{task.title || "Untitled task"}</span>
                        <span>{task.dueDate || "No due date"}</span>
                      </button>
                    ))}
                  </div>
                )}
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