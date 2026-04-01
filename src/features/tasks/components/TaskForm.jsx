import { useState } from "react";
import FormShell from "../../../components/ui/FormShell";
import TaskFields from "./TaskFields";

function toDateInput(isoString) {
  if (!isoString) return "";
  return isoString.split("T")[0];
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

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.courseId) return setError("Course is required.");
    if (!form.title.trim()) return setError("Task name is required.");

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
      <TaskFields form={form} setForm={setForm} courses={courses} mode={mode} />
    </FormShell>
  );
}