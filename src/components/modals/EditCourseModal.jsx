// src/components/modals/EditCourseModal.jsx

import { useState } from "react";

export default function EditCourseModal({ course, onClose, onSave }) {
  const [form, setForm] = useState({
    title: course.title ?? "",
    code: course.code ?? "",
    instructor: course.instructor ?? "",
    gradeGoal: course.gradeGoal ?? "",
    startWeek: course.startWeek ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.code.trim()) {
      setError("Name and Course Code are required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Preserve existing meetings — only update the simple fields.
      await onSave(course.courseId ?? course.id, {
        code: form.code.trim(),
        title: form.title.trim(),
        instructor: form.instructor.trim(),
        gradeGoal: form.gradeGoal ? Number(form.gradeGoal) : null,
        startWeek: form.startWeek || null,
        meetings: course.meetings ?? [],
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
            <input
              className="modal-input"
              type="text"
              value={form.title}
              onChange={handleChange("title")}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">COURSE CODE</label>
            <input
              className="modal-input"
              type="text"
              value={form.code}
              onChange={handleChange("code")}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">INSTRUCTOR</label>
            <input
              className="modal-input"
              type="text"
              value={form.instructor}
              onChange={handleChange("instructor")}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">GRADE GOAL (%)</label>
            <input
              className="modal-input"
              type="number"
              value={form.gradeGoal}
              onChange={handleChange("gradeGoal")}
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
