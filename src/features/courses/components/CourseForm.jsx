import { useState } from "react";
import FormShell from "../../../components/ui/FormShell";
import CourseFields from "./CourseFields";

function toTimeInput(timeStr) {
  if (!timeStr) return "";
  return timeStr.slice(0, 5);
}

// Validates a single field — rules match backend CourseRequestDTO constraints
function validateField(field, value) {
  switch (field) {
    case "title":
      return value.trim() ? "" : "Course name is required.";
    case "code":
      if (!value.trim()) return "Course code is required.";
      if (value.trim().length > 10) return "Course code must be at most 10 characters.";
      return "";
    case "instructor":
      return value.trim() ? "" : "Instructor is required.";
    case "gradeGoal":
      if (!value && value !== 0) return "Grade goal is required.";
      if (Number(value) < 0 || Number(value) > 100) return "Grade goal must be between 0 and 100.";
      return "";
    case "startWeek":
      return value ? "" : "Start week is required.";
    case "startTime":
      return value ? "" : "Start time is required.";
    case "endTime":
      return value ? "" : "End time is required.";
    default:
      return "";
  }
}

// Validates all fields at once and returns an errors object
function validateAll(form) {
  const fields = ["title", "code", "instructor", "gradeGoal", "startWeek", "startTime", "endTime"];
  const errors = {};
  fields.forEach((field) => {
    const msg = validateField(field, form[field]);
    if (msg) errors[field] = msg;
  });
  return errors;
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

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Passed to CourseFields — validates inline as the user edits each field
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
      {/* Pass errors and handleFieldChange so CourseFields can show inline validation */}
      <CourseFields form={form} setForm={handleFieldChange} errors={errors} />
    </FormShell>
  );
}