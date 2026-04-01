import { useState } from "react";
import FormField from "../../../components/ui/FormField";
import FormShell from "../../../components/ui/FormShell";
import CourseFields from "./CourseFields";

function toTimeInput(timeStr) {
  if (!timeStr) return "";
  return timeStr.slice(0, 5);
}

export default function CourseForm({
  mode = "create",
  initialValues = null,
  onSubmit,
  onCancel,
}) {
  const firstMeeting = initialValues?.meetings?.[0] ?? null;

  const [form, setForm] = useState({
    title: initialValues?.title ?? "",
    code: initialValues?.code ?? "",
    instructor: initialValues?.instructor ?? "",
    gradeGoal: initialValues?.gradeGoal ?? "",
    startWeek: initialValues?.startWeek ?? "",
    dayOfWeek: String(firstMeeting?.dayOfWeek ?? 1),
    startTime: toTimeInput(firstMeeting?.startTime ?? ""),
    endTime: toTimeInput(firstMeeting?.endTime ?? ""),
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) return setError("Course name is required.");
    if (!form.code.trim()) return setError("Course code is required.");
    if (!form.instructor.trim()) return setError("Instructor is required.");
    if (!form.gradeGoal) return setError("Grade goal is required.");
    if (!form.startWeek) return setError("Start week is required.");
    if (!form.startTime || !form.endTime) {
      return setError("Class start and end time are required.");
    }

    setSaving(true);
    setError("");

    try {
      await onSubmit({
        title: form.title.trim(),
        code: form.code.trim(),
        instructor: form.instructor.trim(),
        gradeGoal: Number(form.gradeGoal),
        startWeek: form.startWeek,
        meetings: [
          {
            dayOfWeek: Number(form.dayOfWeek),
            startTime: `${form.startTime}:00`,
            endTime: `${form.endTime}:00`,
          },
          ...((initialValues?.meetings ?? []).slice(1)),
        ],
      });
    } catch {
      setError(mode === "edit" ? "Failed to update course." : "Failed to save course.");
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
      submitVariant="courses"
    >
      <CourseFields form={form} setForm={setForm} />
    </FormShell>
  );
}