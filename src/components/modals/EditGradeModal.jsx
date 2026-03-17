// src/components/modals/EditGradeModal.jsx

import { useState } from "react";

export default function EditGradeModal({ grade, onClose, onSave, courses = [] }) {
  const [form, setForm] = useState({
    courseId: grade.courseId ?? "",
    currentGradePercent: grade.currentGradePercent ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    if (!form.currentGradePercent) {
      setError("Grade is required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSave(grade.progressId, {
        courseId: Number(form.courseId),
        currentGradePercent: Number(form.currentGradePercent),
        weekOf: grade.weekOf ?? null,
        computedAt: new Date().toISOString(),
      });
      onClose();
    } catch (err) {
      setError("Failed to update grade. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        <h2 className="modal-title">EDIT GRADE</h2>

        <div className="modal-form">

          <div className="modal-field">
            <label className="modal-label">COURSE</label>
            <select
              className="modal-input"
              value={form.courseId}
              onChange={handleChange("courseId")}
            >
              <option value="">Select a course…</option>
              {courses.map((c) => (
                <option key={c.courseId} value={c.courseId}>
                  {c.code} — {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-field">
            <label className="modal-label">CURRENT GRADE (%)</label>
            <input
              className="modal-input"
              type="number"
              value={form.currentGradePercent}
              onChange={handleChange("currentGradePercent")}
              min={0}
              max={100}
            />
          </div>

          {error && <p className="modal-error">{error}</p>}

        </div>

        <div className="modal-actions">
          <button type="button" className="modal-btn modal-btn--cancel" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="button" className="modal-btn modal-btn--save" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
}