import { useState } from "react";
import FormShell from "../../../components/ui/FormShell";
import ReminderFields from "./ReminderFields";

function toDateTimeInput(isoString) {
  if (!isoString) return "";
  return isoString.slice(0, 16);
}

// Validates a single field — rules match backend ReminderRequestDTO constraints
function validateField(field, value) {
  switch (field) {
    case "taskId":
      return value ? "" : "Task is required.";
    case "message":
      return value.trim() ? "" : "Message is required.";
    case "scheduledAt":
      return value ? "" : "Scheduled date and time is required.";
    default:
      return "";
  }
}

// Validates all required fields at once, returns errors object
function validateAll(form) {
  const fields = ["taskId", "message", "scheduledAt"];
  const errors = {};
  fields.forEach((field) => {
    const msg = validateField(field, form[field]);
    if (msg) errors[field] = msg;
  });
  return errors;
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

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Validates inline as the user edits each field
  function handleFieldChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Run full validation before submitting
    const allErrors = validateAll(form);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

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
      {/* Pass errors and handleFieldChange so ReminderFields can show inline validation */}
      <ReminderFields form={form} setForm={handleFieldChange} tasks={tasks} errors={errors} />
    </FormShell>
  );
}