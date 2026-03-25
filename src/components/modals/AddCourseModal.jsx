// src/components/modals/AddCourseModal.jsx
// Modal form for creating a new course.
//
// Fields sent to the backend match the finalized Course model (Penny, Feb 12 2026):
//   code, title, instructor, gradeGoal, startWeek, meetings[]
//
// NOTE: 'schedule' and 'credits' are NOT backend fields — do not re-add them.
// meetings[] is initialised as an empty array; the backend accepts this for new courses.

import { useState } from "react";

export default function AddCourseModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    code: "",
    instructor: "",
    gradeGoal: "",
    startWeek: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    // Title and code are the minimum required fields on the backend.
    if (!form.title.trim() || !form.code.trim()) {
      setError("Name and Course Code are required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSave({
        title: form.title.trim(),
        code: form.code.trim(),
        instructor: form.instructor.trim() || null,
        gradeGoal: form.gradeGoal ? Number(form.gradeGoal) : null,
        startWeek: form.startWeek || null,
        // New courses start with no scheduled meetings.
        // Meetings can be added in a future sprint via the Edit flow.
        meetings: [],
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
            <input
              className="modal-input"
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              placeholder="e.g. Capstone I"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">COURSE CODE</label>
            <input
              className="modal-input"
              type="text"
              value={form.code}
              onChange={handleChange("code")}
              placeholder="e.g. COMP3059"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">INSTRUCTOR</label>
            <input
              className="modal-input"
              type="text"
              value={form.instructor}
              onChange={handleChange("instructor")}
              placeholder="e.g. Prof. Laily Ajellu"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">GRADE GOAL (%)</label>
            <input
              className="modal-input"
              type="number"
              value={form.gradeGoal}
              onChange={handleChange("gradeGoal")}
              placeholder="e.g. 75"
              min={0}
              max={100}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">START WEEK</label>
            <input
              className="modal-input"
              type="date"
              value={form.startWeek}
              onChange={handleChange("startWeek")}
            />
          </div>

          {error && <p className="modal-error">{error}</p>}

        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="modal-btn modal-btn--cancel"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal-btn modal-btn--save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
}