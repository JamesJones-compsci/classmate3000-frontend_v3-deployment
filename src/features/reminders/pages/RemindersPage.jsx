import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import { useReminders } from "../hooks/useReminders";
import ReminderRow from "../components/ReminderRow";
import styles from "./RemindersPage.module.css";

export default function RemindersPage() {
  const { reminders, loading, error } = useReminders();

  return (
    <div className={styles.page}>
      <SectionHeader title="Reminders" breadcrumb="Home > Reminders > All Reminders" />

      <div className={styles.body}>
        {loading && <EmptyState message="Loading reminders..." />}
        {!loading && error && <EmptyState message={error} />}
        {!loading && !error && reminders.length === 0 && (
          <EmptyState message="No reminders yet." />
        )}

        {!loading && !error && reminders.length > 0 && (
          <div className={styles.stack}>
            {reminders.map((reminder) => (
              <ReminderRow key={reminder.reminderId} reminder={reminder} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}