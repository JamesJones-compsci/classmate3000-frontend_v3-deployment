import { useState } from "react";
import FormShell from "../../../components/ui/FormShell";
import ProgressFields from "./ProgressFields";

export default function ProgressForm({
  mode = "create",
  initialValues = null,
  courses = [],
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState({
    courseId: initialValues?.courseId ?? "",
    currentGradePercent: initialValues?.currentGradePercent ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.courseId) return setError("Course is required.");
    if (!form.currentGradePercent && form.currentGradePercent !== 0) {
      return setError("Current grade is required.");
    }

    setSaving(true);
    setError("");

    try {
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
      const weekOf = initialValues?.weekOf ?? monday.toISOString().split("T")[0];

      await onSubmit({
        courseId: Number(form.courseId),
        currentGradePercent: Number(form.currentGradePercent),
        weekOf,
        computedAt: new Date().toISOString(),
      });
    } catch {
      setError(mode === "edit" ? "Failed to update progress." : "Failed to save progress.");
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
      submitVariant="progress"
    >
      <ProgressFields form={form} setForm={setForm} courses={courses} />
    </FormShell>
  );
}