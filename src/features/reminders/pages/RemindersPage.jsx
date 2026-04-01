import { useState } from "react";
import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import Modal from "../../../components/ui/Modal";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { useReminders } from "../hooks/useReminders";
import { useTasks } from "../../tasks/hooks/useTasks";
import ReminderRow from "../components/ReminderRow";
import ReminderForm from "../components/ReminderForm";
import styles from "./RemindersPage.module.css";

export default function RemindersPage() {
  const { reminders, loading, error, addReminder, editReminder, removeReminder } = useReminders();
  const { tasks } = useTasks();

  const [selectedReminder, setSelectedReminder] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className={styles.page}>
      <SectionHeader title="Reminders" breadcrumb="Home > Reminders > All Reminders" />

      <div className={styles.toolbar}>
        <button className={styles.primaryBtn} onClick={() => setShowCreate(true)}>
          Add Reminder
        </button>
        <button
          className={styles.secondaryBtn}
          disabled={!selectedReminder}
          onClick={() => setShowEdit(true)}
        >
          Edit
        </button>
        <button
          className={styles.deleteBtn}
          disabled={!selectedReminder}
          onClick={() => setShowDelete(true)}
        >
          Delete
        </button>
      </div>

      <div className={styles.body}>
        {loading && <EmptyState message="Loading reminders..." />}
        {!loading && error && <EmptyState message={error} />}
        {!loading && !error && reminders.length === 0 && (
          <EmptyState message="No reminders yet." />
        )}

        {!loading && !error && reminders.length > 0 && (
          <div className={styles.stack}>
            {reminders.map((reminder) => (
              <div
                key={reminder.reminderId}
                className={selectedReminder?.reminderId === reminder.reminderId ? styles.selected : ""}
                onClick={() => setSelectedReminder(reminder)}
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
              await addReminder(payload);
              setShowCreate(false);
            }}
          />
        </Modal>
      )}

      {showEdit && selectedReminder && (
        <Modal title="Edit Reminder" onClose={() => setShowEdit(false)}>
          <ReminderForm
            mode="edit"
            initialValues={selectedReminder}
            tasks={tasks}
            onCancel={() => setShowEdit(false)}
            onSubmit={async (payload) => {
              await editReminder(selectedReminder.reminderId, payload);
              setShowEdit(false);
            }}
          />
        </Modal>
      )}

      {showDelete && selectedReminder && (
        <ConfirmDialog
          title="Delete reminder?"
          message={selectedReminder.message}
          onClose={() => setShowDelete(false)}
          onConfirm={async () => {
            await removeReminder(selectedReminder.reminderId);
            setSelectedReminder(null);
            setShowDelete(false);
          }}
        />
      )}
    </div>
  );
}