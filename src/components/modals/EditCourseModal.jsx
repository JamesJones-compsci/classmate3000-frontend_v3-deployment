// src/components/modals/EditCourseModal.jsx
// Modal form for editing an existing course.
//
// Backend CourseRequestDTO validation (all fields required):
//   code, title, instructor, gradeGoal, startWeek, meetings (min 1)
//   Each meeting: dayOfWeek (1-7), startTime, endTime (LocalTime as "HH:mm:ss")
//
// The first existing meeting is pre-populated from course.meetings[0].
// Additional meetings beyond index 0 are preserved and re-sent unchanged.

import { useState } from "react";

const DAYS = [
  { label: "Monday",    value: 1 },
  { label: "Tuesday",   value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday",  value: 4 },
  { label: "Friday",    value: 5 },
  { label: "Saturday",  value: 6 },
  { label: "Sunday",    value: 7 },
];

// Strip seconds from "HH:mm:ss" for the time input which expects "HH:mm".
function toTimeInput(timeStr) {
  if (!timeStr) return "";
  return timeStr.slice(0, 5);
}

export default function EditCourseModal({ course, onClose, onSave }) {
  // Pre-populate from the first existing meeting if available.
  const firstMeeting = course.meetings?.[0] ?? null;

  const [form, setForm] = useState({
    title:      course.title      ?? "",
    code:       course.code       ?? "",
    instructor: course.instructor ?? "",
    gradeGoal:  course.gradeGoal  ?? "",
    startWeek:  course.startWeek  ?? "",
    dayOfWeek:  String(firstMeeting?.dayOfWeek  ?? 1),
    startTime:  toTimeInput(firstMeeting?.startTime ?? ""),
    endTime:    toTimeInput(firstMeeting?.endTime   ?? ""),
  });

  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    if (!form.title.trim())      return setError("Course name is required.");
    if (!form.code.trim())       return setError("Course code is required.");
    if (!form.instructor.trim()) return setError("Instructor is required.");
    if (!form.gradeGoal)         return setError("Grade goal is required.");
    if (!form.startWeek)         return setError("Start week is required.");
    if (!form.startTime || !form.endTime) return setError("Class start and end time are required.");

    setSaving(true);
    setError(null);

    try {
      // Build updated meeting from form values.
      const updatedMeeting = {
        dayOfWeek: Number(form.dayOfWeek),
        startTime: `${form.startTime}:00`,
        endTime:   `${form.endTime}:00`,
      };

      // Replace meetings[0] with the updated values.
      // Any additional meetings beyond index 0 are preserved unchanged.
      const existingExtra = (course.meetings ?? []).slice(1);

      await onSave(course.courseId ?? course.id, {
        code:       form.code.trim(),
        title:      form.title.trim(),
        instructor: form.instructor.trim(),
        gradeGoal:  Number(form.gradeGoal),
        startWeek:  form.startWeek,
        meetings:   [updatedMeeting, ...existingExtra],
      });
      onClose();
    } catch (err) {
      setError("Failed to update course. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        <h2 className="modal-title">EDIT COURSE</h2>

        <div className="modal-form">

          <div className="modal-field">
            <label className="modal-label">NAME</label>
            <input className="modal-input" type="text" value={form.title}
              onChange={handleChange("title")} />
          </div>

          <div className="modal-field">
            <label className="modal-label">COURSE CODE</label>
            <input className="modal-input" type="text" value={form.code}
              onChange={handleChange("code")} />
          </div>

          <div className="modal-field">
            <label className="modal-label">INSTRUCTOR</label>
            <input className="modal-input" type="text" value={form.instructor}
              onChange={handleChange("instructor")} />
          </div>

          <div className="modal-field">
            <label className="modal-label">CLASS DAY</label>
            <select className="modal-input" value={form.dayOfWeek}
              onChange={handleChange("dayOfWeek")}>
              {DAYS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          <div className="modal-field">
            <label className="modal-label">START TIME</label>
            <input className="modal-input" type="time" value={form.startTime}
              onChange={handleChange("startTime")} />
          </div>

          <div className="modal-field">
            <label className="modal-label">END TIME</label>
            <input className="modal-input" type="time" value={form.endTime}
              onChange={handleChange("endTime")} />
          </div>

          <div className="modal-field">
            <label className="modal-label">GRADE GOAL (%)</label>
            <input className="modal-input" type="number" value={form.gradeGoal}
              onChange={handleChange("gradeGoal")} min={0} max={100} />
          </div>

          <div className="modal-field">
            <label className="modal-label">START WEEK</label>
            <input className="modal-input" type="date" value={form.startWeek}
              onChange={handleChange("startWeek")} />
          </div>

          {error && <p className="modal-error">{error}</p>}

        </div>

        <div className="modal-actions">
          <button type="button" className="modal-btn modal-btn--cancel"
            onClick={onClose} disabled={saving}>Cancel</button>
          <button type="button" className="modal-btn modal-btn--save"
            onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
}