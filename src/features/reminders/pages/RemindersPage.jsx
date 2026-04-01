import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { useReminders } from "../hooks/useReminders";
import { useTasks } from "../../tasks/hooks/useTasks";
import ReminderRow from "../components/ReminderRow";
import ReminderForm from "../components/ReminderForm";
import styles from "./RemindersPage.module.css";

export default function RemindersPage() {
  const navigate = useNavigate();
  const { reminders, loading, error, addReminder } = useReminders();
  const { tasks } = useTasks();

  const [showCreate, setShowCreate] = useState(false);

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
        {!loading && !error && reminders.length === 0 && (
          <EmptyState
            title="No reminders yet"
            message="Create your first reminder to get started."
          />
        )}

        {!loading && !error && reminders.length > 0 && (
          <div className={styles.stack}>
            {reminders.map((reminder) => (
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