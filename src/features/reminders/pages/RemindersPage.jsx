import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { useReminders } from "../hooks/useReminders";
import { useTasks } from "../../tasks/hooks/useTasks";
import ReminderRow from "../components/ReminderRow";
import ReminderForm from "../components/ReminderForm";
import styles from "./RemindersPage.module.css";

function getReminderStatus(reminder) {
  if (!reminder) return "—";
  if (typeof reminder.sent === "boolean") return reminder.sent ? "Sent" : "Pending";
  if (typeof reminder.isSent === "boolean") return reminder.isSent ? "Sent" : "Pending";
  if (typeof reminder.wasSent === "boolean") return reminder.wasSent ? "Sent" : "Pending";
  if (reminder.status) return String(reminder.status).toLowerCase();
  return "pending";
}

export default function RemindersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "all";

  const { reminders, loading, error, addReminder } = useReminders();
  const { tasks } = useTasks();

  const [showCreate, setShowCreate] = useState(false);

  const filteredReminders = useMemo(() => {
    if (filter === "pending") {
      return reminders.filter((reminder) => getReminderStatus(reminder) === "pending");
    }

    if (filter === "sent") {
      return reminders.filter((reminder) => getReminderStatus(reminder) === "sent");
    }

    return reminders;
  }, [reminders, filter]);

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
        title="Reminders"
        breadcrumbs={[
          { label: "Home", to: "/dashboard/courses" },
          { label: "Reminders" },
        ]}
        actions={
          <Button variant="reminders" onClick={() => setShowCreate(true)}>
            Add Reminder
          </Button>
        }
      />

      <div className={styles.body}>
        {loading && <EmptyState title="Loading" message="Loading reminders..." />}
        {!loading && error && <EmptyState title="Error" message={error} />}
        {!loading && !error && filteredReminders.length === 0 && (
          <EmptyState
            title="No reminders found"
            message="No reminders match this filter."
          />
        )}

        {!loading && !error && filteredReminders.length > 0 && (
          <div className={styles.stack}>
            {filteredReminders.map((reminder) => (
              <div
                key={reminder.reminderId}
                className={styles.selectable}
                onClick={() => navigate(`/dashboard/reminders/${reminder.reminderId}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/dashboard/reminders/${reminder.reminderId}`);
                  }
                }}
              >
                <ReminderRow reminder={reminder} />
              </div>
            ))}
          </div>
        )}
        <div className={styles.bottomAction}>
          <Button variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Back to Top
          </Button>
        </div>
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
    </div>
  );
}