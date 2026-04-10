import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import Modal from "../../../components/ui/Modal";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Button from "../../../components/ui/Button";
import ReminderForm from "../components/ReminderForm";
import { useReminders } from "../hooks/useReminders";
import { useTasks } from "../../tasks/hooks/useTasks";
import styles from "./ReminderDetailPage.module.css";

function getReminderTime(reminder) {
  return (
    reminder?.scheduledAt ||
    reminder?.remindAt ||
    reminder?.scheduledTime ||
    reminder?.sendAt ||
    "—"
  );
}

function getReminderStatus(reminder) {
  if (!reminder) return "—";
  if (typeof reminder.sent === "boolean") return reminder.sent ? "Sent" : "Pending";
  if (typeof reminder.isSent === "boolean") return reminder.isSent ? "Sent" : "Pending";
  if (typeof reminder.wasSent === "boolean") return reminder.wasSent ? "Sent" : "Pending";
  if (reminder.status) return reminder.status;
  return "Pending";
}

export default function ReminderDetailPage() {
  const { reminderId } = useParams();
  const navigate = useNavigate();

  const { reminders, loading, error, addReminder, editReminder, removeReminder } = useReminders();
  const { tasks } = useTasks();

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const reminder = useMemo(
    () =>
      reminders.find((item) => Number(item.reminderId) === Number(reminderId)) ?? null,
    [reminders, reminderId]
  );

  const task = useMemo(() => {
    if (!reminder) return null;
    return tasks.find((item) => Number(item.taskId) === Number(reminder.taskId)) ?? null;
  }, [tasks, reminder]);

  useEffect(() => {
    function handleLeftAction(event) {
      if (event.detail?.section === "reminders" && event.detail?.action === "add") {
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
        title={reminder ? reminder.message : "Reminder Details"}
        breadcrumbs={[
          { label: "Home", to: "/dashboard/courses" },
          { label: "Reminders", to: "/dashboard/reminders" },
          { label: "Reminder Details" },
        ]}
        actions={
          <div className={styles.actions}>
            <Button variant="secondary" disabled={!reminder} onClick={() => setShowEdit(true)}>
              Edit
            </Button>
            <Button variant="danger" disabled={!reminder} onClick={() => setShowDelete(true)}>
              Delete
            </Button>
          </div>
        }
      />

      <div className={styles.body}>
        {loading && <EmptyState title="Loading" message="Loading reminder..." />}
        {!loading && error && <EmptyState title="Error" message={error} />}
        {!loading && !error && !reminder && (
          <EmptyState title="Reminder not found" message="This reminder does not exist." />
        )}

        {!loading && !error && reminder && (
          <>
            <section className={`${styles.fullWidth} ${styles.summaryRow}`}>
              <button type="button" className={styles.statusBadgeButton}>
                {getReminderStatus(reminder)}
              </button>
            </section>

            <div className={styles.grid}>
              <section className={styles.panel}>
                <h3 className={styles.panelTitle}>Reminder Info</h3>

                <div className={styles.infoGrid}>
                  <div className={styles.infoBlock}>
                    <div className={styles.infoLabel}>Message</div>
                    <div className={styles.infoValue}>{reminder.message || "—"}</div>
                  </div>

                  <div className={styles.infoBlock}>
                    <div className={styles.infoLabel}>Scheduled Time</div>
                    <div className={styles.infoValue}>{getReminderTime(reminder)}</div>
                  </div>

                  <div className={styles.infoBlock}>
                    <div className={styles.infoLabel}>Status</div>
                    <div className={styles.infoValue}>{getReminderStatus(reminder)}</div>
                  </div>
                </div>
              </section>

              <section className={styles.panel}>
                <h3 className={styles.panelTitle}>Linked Task</h3>

                {!task ? (
                  <p className={styles.muted}>No linked task found.</p>
                ) : (
                  <>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoBlock}>
                        <div className={styles.infoLabel}>Title</div>
                        <div className={styles.infoValue}>{task.title || "—"}</div>
                      </div>

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
                    </div>

                    <div className={styles.sectionAction}>
                      <Button
                        variant="secondary"
                        onClick={() => navigate(`/dashboard/tasks/${task.taskId}`)}
                      >
                        View Task
                      </Button>
                    </div>
                  </>
                )}
              </section>
            </div>

            <div className={styles.bottomAction}>
              <Button variant="ghost" onClick={() => navigate("/dashboard/reminders")}>
                Back to All Reminders
              </Button>
            </div>
          </>
        )}
      </div>

      {showCreate && (
        <Modal title="Add Reminder" onClose={() => setShowCreate(false)}>
          <ReminderForm
            mode="create"
            tasks={tasks}
            onCancel={() => setShowCreate(false)}
            onSubmit={async (payload) => {
              const created = await addReminder(payload);
              setShowCreate(false);
              if (created?.reminderId != null) {
                navigate(`/dashboard/reminders/${created.reminderId}`);
              }
            }}
          />
        </Modal>
      )}

      {showEdit && reminder && (
        <Modal title="Edit Reminder" onClose={() => setShowEdit(false)}>
          <ReminderForm
            mode="edit"
            initialValues={reminder}
            tasks={tasks}
            onCancel={() => setShowEdit(false)}
            onSubmit={async (payload) => {
              await editReminder(reminder.reminderId, payload);
              setShowEdit(false);
            }}
          />
        </Modal>
      )}

      {showDelete && reminder && (
        <ConfirmDialog
          title="Delete reminder?"
          message={reminder.message}
          onClose={() => setShowDelete(false)}
          onConfirm={async () => {
            await removeReminder(reminder.reminderId);
            navigate("/dashboard/reminders");
          }}
        />
      )}
    </div>
  );
}