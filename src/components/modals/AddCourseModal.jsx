// src/components/modals/AddCourseModal.jsx
// Modal form for creating a new course.
//
// Backend CourseRequestDTO validation (all fields required):
//   code (@NotBlank, max 10 chars), title (@NotBlank), instructor (@NotBlank),
//   gradeGoal (@NotNull Integer), startWeek (@NotNull LocalDate),
//   meetings (@NotNull, min 1) — each meeting: dayOfWeek (1-7), startTime, endTime (LocalTime)

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

export default function AddCourseModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title:      "",
    code:       "",
    instructor: "",
    gradeGoal:  "",
    startWeek:  "",
    dayOfWeek:  "1",
    startTime:  "",
    endTime:    "",
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
      await onSave({
        title:      form.title.trim(),
        code:       form.code.trim(),
        instructor: form.instructor.trim(),
        gradeGoal:  Number(form.gradeGoal),
        startWeek:  form.startWeek,
        // Backend requires List<MeetingDTO> with at least one entry.
        // dayOfWeek: 1 = Monday, 7 = Sunday (ISO standard).
        // startTime / endTime must include seconds: "HH:mm:ss".
        meetings: [
          {
            dayOfWeek: Number(form.dayOfWeek),
            startTime: `${form.startTime}:00`,
            endTime:   `${form.endTime}:00`,
          },
        ],
      });
      onClose();
    } catch (err) {
      setError("Failed to save course. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        <h2 className="modal-title">ADD COURSE</h2>

        <div className="modal-form">

          <div className="modal-field">
            <label className="modal-label">NAME</label>
            <input className="modal-input" type="text" value={form.title}
              onChange={handleChange("title")} placeholder="e.g. Capstone I" />
          </div>

          <div className="modal-field">
            <label className="modal-label">COURSE CODE</label>
            <input className="modal-input" type="text" value={form.code}
              onChange={handleChange("code")} placeholder="e.g. COMP3059" />
          </div>

          <div className="modal-field">
            <label className="modal-label">INSTRUCTOR</label>
            <input className="modal-input" type="text" value={form.instructor}
              onChange={handleChange("instructor")} placeholder="e.g. Prof. Laily Ajellu" />
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
              onChange={handleChange("gradeGoal")} placeholder="e.g. 75" min={0} max={100} />
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