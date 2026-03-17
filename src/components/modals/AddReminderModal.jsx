// src/components/modals/AddReminderModal.jsx

import { useState } from "react";

// Strip time portion from ISO string for the datetime-local input.
function toDateTimeInput(isoString) {
  if (!isoString) return "";
  return isoString.slice(0, 16);
}

export default function AddReminderModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    taskId: "",
    message: "",
    scheduledAt: "",
    wasSent: false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.message.trim() || !form.taskId) {
      setError("Task ID and Message are required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSave({
        taskId: Number(form.taskId),
        message: form.message.trim(),
        scheduledAt: form.scheduledAt ? `${form.scheduledAt}:00` : null,
        wasSent: form.wasSent,
      });
      onClose();
    } catch (err) {
      setError("Failed to save reminder. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        <h2 className="modal-title">ADD REMINDER</h2>

        <div className="modal-form">

          <div className="modal-field">
            <label className="modal-label">TASK ID</label>
            <input
              className="modal-input"
              type="number"
              value={form.taskId}
              onChange={handleChange("taskId")}
              placeholder="e.g. 1001"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">MESSAGE</label>
            <input
              className="modal-input"
              type="text"
              value={form.message}
              onChange={handleChange("message")}
              placeholder="e.g. Lab deadline approaching"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">SCHEDULED AT</label>
            <input
              className="modal-input"
              type="datetime-local"
              value={form.scheduledAt}
              onChange={handleChange("scheduledAt")}
            />
          </div>

          <div className="modal-field modal-field--row">
            <label className="modal-label">ALREADY SENT</label>
            <input
              type="checkbox"
              checked={form.wasSent}
              onChange={handleChange("wasSent")}
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