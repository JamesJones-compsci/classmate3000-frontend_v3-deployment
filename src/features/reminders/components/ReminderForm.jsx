import { useState } from "react";
import FormShell from "../../../components/ui/FormShell";
import ReminderFields from "./ReminderFields";

function toDateTimeInput(isoString) {
  if (!isoString) return "";
  return isoString.slice(0, 16);
}

export default function ReminderForm({
  mode = "create",
  initialValues = null,
  tasks = [],
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState({
    taskId: initialValues?.taskId ?? "",
    message: initialValues?.message ?? "",
    scheduledAt: toDateTimeInput(initialValues?.scheduledAt),
    wasSent: initialValues?.wasSent ?? false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.taskId) return setError("Task is required.");
    if (!form.message.trim()) return setError("Message is required.");

    setSaving(true);
    setError("");

    try {
      await onSubmit({
        taskId: Number(form.taskId),
        message: form.message.trim(),
        scheduledAt: form.scheduledAt ? `${form.scheduledAt}:00` : null,
        wasSent: form.wasSent,
      });
    } catch {
      setError(mode === "edit" ? "Failed to update reminder." : "Failed to save reminder.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <FormShell
      onSubmit={handleSubmit}
      onCancel={onCancel}
      saving={saving}
      error={error}
      submitLabel={mode === "edit" ? "Update" : "Save"}
      submitVariant="reminders"
    >
      <ReminderFields form={form} setForm={setForm} tasks={tasks} />
    </FormShell>
  );
}