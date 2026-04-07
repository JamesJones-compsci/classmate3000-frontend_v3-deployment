import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import Modal from "../../../components/ui/Modal";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Button from "../../../components/ui/Button";
import TaskForm from "../components/TaskForm";
import { useTasks } from "../hooks/useTasks";
import { useCourses } from "../../courses/hooks/useCourses";
import { useReminders } from "../../reminders/hooks/useReminders";
import styles from "./TaskDetailPage.module.css";

function getTaskStatus(task) {
  if (!task) return "—";
  if (task.isPriority) return "Priority";
  if (task.isCompleted) return "Completed";
  return "Not Completed";
}

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const { tasks, loading, error, addTask, editTask, removeTask } = useTasks();
  const { courses } = useCourses();
  const { reminders } = useReminders();

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const task = useMemo(
    () => tasks.find((item) => Number(item.taskId) === Number(taskId)) ?? null,
    [tasks, taskId]
  );

  const course = useMemo(() => {
    if (!task) return null;
    return courses.find((item) => Number(item.courseId) === Number(task.courseId)) ?? null;
  }, [courses, task]);

  const linkedReminders = useMemo(() => {
    if (!task) return [];
    return reminders.filter(
      (reminder) => Number(reminder.taskId) === Number(task.taskId)
    );
  }, [reminders, task]);

  async function handleToggleStatus(currentTask) {
    if (!currentTask.isCompleted && !currentTask.isPriority) {
      await editTask(currentTask.taskId, { isCompleted: false, isPriority: true });
      return;
    }

    if (!currentTask.isCompleted && currentTask.isPriority) {
      await editTask(currentTask.taskId, { isCompleted: true, isPriority: false });
      return;
    }

    await editTask(currentTask.taskId, { isCompleted: false, isPriority: false });
  }

  useEffect(() => {
    function handleLeftAction(event) {
      if (event.detail?.section === "tasks" && event.detail?.action === "add") {
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
        title={task ? task.title : "Task Details"}
        breadcrumbs={[
          { label: "Home", to: "/dashboard/courses" },
          { label: "Tasks", to: "/dashboard/tasks" },
          { label: task ? task.title : "Task Details" },
        ]}
        actions={
          <div className={styles.actions}>
            <Button variant="secondary" disabled={!task} onClick={() => setShowEdit(true)}>
              Edit
            </Button>
            <Button variant="danger" disabled={!task} onClick={() => setShowDelete(true)}>
              Delete
            </Button>
          </div>
        }
      />

      <div className={styles.body}>
        {loading && <EmptyState title="Loading" message="Loading task..." />}
        {!loading && error && <EmptyState title="Error" message={error} />}
        {!loading && !error && !task && (
          <EmptyState title="Task not found" message="This task does not exist." />
        )}

        {!loading && !error && task && (
          <>
            <section className={`${styles.fullWidth} ${styles.summaryRow}`}>
              <button
                type="button"
                className={styles.statusBadgeButton}
                onClick={() => handleToggleStatus(task)}
              >
                {getTaskStatus(task)}
              </button>
            </section>

            <div className={styles.grid}>
              <section className={styles.panel}>
                <h3 className={styles.panelTitle}>Task Info</h3>

                <div className={styles.infoGrid}>
                  <div className={styles.infoBlock}>
                    <div className={styles.infoLabel}>Type</div>
                    <div className={styles.infoValue}>{task.type || "—"}</div>
                  </div>

                  <div className={styles.infoBlock}>
                    <div className={styles.infoLabel}>Due Date</div>
                    <div className={styles.infoValue}>
                      {task.dueDate ? task.dueDate.slice(0, 10) : "—"}
                    </div>
                  </div>

                  <div className={styles.infoBlock}>
                    <div className={styles.infoLabel}>Weight</div>
                    <div className={styles.infoValue}>
                      {task.weight != null ? `${task.weight}%` : "—"}
                    </div>
                  </div>

                  <div className={styles.infoBlock}>
                    <div className={styles.infoLabel}>Status</div>
                    <div className={styles.infoValue}>{getTaskStatus(task)}</div>
                  </div>

                  <div className={styles.infoBlock}>
                    <div className={styles.infoLabel}>Bonus</div>
                    <div className={styles.infoValue}>{task.isBonus ? "Yes" : "No"}</div>
                  </div>
                </div>
              </section>

              <section className={styles.panel}>
                <h3 className={styles.panelTitle}>Course</h3>

                {!course ? (
                  <p className={styles.muted}>No linked course found.</p>
                ) : (
                  <>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoBlock}>
                        <div className={styles.infoLabel}>Code</div>
                        <div className={styles.infoValue}>{course.code || "—"}</div>
                      </div>

                      <div className={styles.infoBlock}>
                        <div className={styles.infoLabel}>Title</div>
                        <div className={styles.infoValue}>{course.title || "—"}</div>
                      </div>

                      <div className={styles.infoBlock}>
                        <div className={styles.infoLabel}>Instructor</div>
                        <div className={styles.infoValue}>{course.instructor || "—"}</div>
                      </div>
                    </div>

                    <div className={styles.sectionAction}>
                      <Button
                        variant="secondary"
                        onClick={() => navigate(`/dashboard/courses/${course.courseId}`)}
                      >
                        View Course
                      </Button>
                    </div>
                  </>
                )}
              </section>

              <section className={`${styles.panel} ${styles.fullWidth}`}>
                <h3 className={styles.panelTitle}>Linked Reminders</h3>

                {linkedReminders.length === 0 ? (
                  <p className={styles.muted}>No reminders linked to this task.</p>
                ) : (
                  <div className={styles.taskList}>
                    {linkedReminders.map((reminder) => (
                      <button
                        key={reminder.reminderId}
                        type="button"
                        className={styles.taskLink}
                        onClick={() => navigate(`/dashboard/reminders/${reminder.reminderId}`)}
                      >
                        <div className={styles.taskContent}>
                          <div className={styles.taskMainRow}>
                            <span>{reminder.message || "Reminder"}</span>
                            <span>{reminder.wasSent ? "Sent" : "Pending"}</span>
                          </div>

                          <div className={styles.taskMetaRow}>
                            <span>Reminder</span>
                            <span>{reminder.scheduledAt || reminder.remindAt || "No time set"}</span>
                          </div>
                        </div>

                        <span className={styles.taskArrow}>›</span>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className={styles.bottomAction}>
              <Button variant="ghost" onClick={() => navigate("/dashboard/tasks")}>
                Back to All Tasks
              </Button>
            </div>
          </>
        )}
      </div>

      {showCreate && (
        <Modal title="Add Task" onClose={() => setShowCreate(false)}>
          <TaskForm
            mode="create"
            courses={courses}
            onCancel={() => setShowCreate(false)}
            onSubmit={async (payload) => {
              const created = await addTask(payload);
              setShowCreate(false);
              if (created?.taskId != null) {
                navigate(`/dashboard/tasks/${created.taskId}`);
              }
            }}
          />
        </Modal>
      )}

      {showEdit && task && (
        <Modal title="Edit Task" onClose={() => setShowEdit(false)}>
          <TaskForm
            mode="edit"
            initialValues={task}
            courses={courses}
            onCancel={() => setShowEdit(false)}
            onSubmit={async (payload) => {
              await editTask(task.taskId, payload);
              setShowEdit(false);
            }}
          />
        </Modal>
      )}

      {showDelete && task && (
        <ConfirmDialog
          title="Delete task?"
          message={task.title}
          onClose={() => setShowDelete(false)}
          onConfirm={async () => {
            await removeTask(task.taskId);
            navigate("/dashboard/tasks");
          }}
        />
      )}
    </div>
  );
}