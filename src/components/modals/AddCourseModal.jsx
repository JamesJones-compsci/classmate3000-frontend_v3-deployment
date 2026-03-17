// src/components/modals/AddCourseModal.jsx

import { useState } from "react";

export default function AddCourseModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    code: "",
    instructor: "",
    schedule: "",
    credits: "",
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
      await onSave({
        title: form.title.trim(),
        code: form.code.trim(),
        instructor: form.instructor.trim(),
        schedule: form.schedule.trim(),
        credits: form.credits ? Number(form.credits) : null,
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
              placeholder="e.g. Prof. Laily Ajeilu"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">SCHEDULE</label>
            <input
              className="modal-input"
              type="text"
              value={form.schedule}
              onChange={handleChange("schedule")}
              placeholder="e.g. MON 10am-12pm | ROOM: Zoom"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">CREDITS</label>
            <input
              className="modal-input"
              type="number"
              value={form.credits}
              onChange={handleChange("credits")}
              placeholder="e.g. 3"
              min={0}
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
