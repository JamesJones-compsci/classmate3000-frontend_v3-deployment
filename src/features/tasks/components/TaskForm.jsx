import { useState } from "react";
import FormShell from "../../../components/ui/FormShell";
import TaskFields from "./TaskFields";

function toDateInput(isoString) {
  if (!isoString) return "";
  return isoString.split("T")[0];
}

// Validates a single field — rules match backend TaskRequestDTO constraints
function validateField(field, value) {
  switch (field) {
    case "courseId":
      return value ? "" : "Course is required.";
    case "title":
      return value.trim() ? "" : "Task name is required.";
    case "dueDate":
      return value ? "" : "Due date is required.";
    case "weight":
      if (value === "" || value === null) return "";
      if (Number(value) < 0 || Number(value) > 100) return "Weight must be between 0 and 100.";
      return "";
    default:
      return "";
  }
}

// Validates all required fields at once, returns errors object
function validateAll(form) {
  const fields = ["courseId", "title", "dueDate", "weight"];
  const errors = {};
  fields.forEach((field) => {
    const msg = validateField(field, form[field]);
    if (msg) errors[field] = msg;
  });
  return errors;
}

export default function TaskForm({
  mode = "create",
  initialValues = null,
  courses = [],
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState({
    courseId: initialValues?.courseId ?? "",
    title: initialValues?.title ?? "",
    type: initialValues?.type ?? "ASSIGNMENT",
    dueDate: toDateInput(initialValues?.dueDate),
    weight: initialValues?.weight ?? "",
    bonus: initialValues?.bonus ?? false,
    isCompleted: initialValues?.isCompleted ?? false,
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
        courseId: Number(form.courseId),
        title: form.title.trim(),
        type: form.type,
        dueDate: form.dueDate ? `${form.dueDate}T17:00:00` : null,
        weight: form.weight ? Number(form.weight) : null,
        bonus: form.bonus,
        isCompleted: form.isCompleted,
      });
    } catch {
      setError(mode === "edit" ? "Failed to update task." : "Failed to save task.");
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
      submitVariant="tasks"
    >
      {/* Pass errors and handleFieldChange so TaskFields can show inline validation */}
      <TaskFields form={form} setForm={handleFieldChange} courses={courses} mode={mode} errors={errors} />
    </FormShell>
  );
}