import { useEffect, useState } from "react";
import { remindersService } from "../services/reminders.service";

export function useReminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadReminders() {
    setLoading(true);
    setError(null);
    try {
      const data = await remindersService.getReminders();
      setReminders(data);
    } catch {
      setError("Could not load reminders.");
    } finally {
      setLoading(false);
    }
  }

  async function addReminder(payload) {
    const created = await remindersService.createReminder(payload);
    setReminders((prev) => [...prev, created]);
    return created;
  }

  async function editReminder(id, payload) {
    const updated = await remindersService.updateReminder(id, payload);
    setReminders((prev) =>
      prev.map((reminder) =>
        Number(reminder.reminderId) === Number(id) ? updated : reminder
      )
    );
    return updated;
  }

  async function removeReminder(id) {
    await remindersService.deleteReminder(id);
    setReminders((prev) =>
      prev.filter((reminder) => Number(reminder.reminderId) !== Number(id))
    );
  }

  useEffect(() => {
    loadReminders();
  }, []);

  return {
    reminders,
    loading,
    error,
    loadReminders,
    addReminder,
    editReminder,
    removeReminder,
  };
}