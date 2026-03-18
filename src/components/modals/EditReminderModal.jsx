// src/components/modals/EditReminderModal.jsx

import { useState } from "react";

// Strip seconds from ISO string for the datetime-local input.
function toDateTimeInput(isoString) {
  if (!isoString) return "";
  return isoString.slice(0, 16);
}

export default function EditReminderModal({ reminder, onClose, onSave, tasks = [] }) {
  const [form, setForm] = useState({
    taskId: reminder.taskId ?? "",
    message: reminder.message ?? "",
    scheduledAt: toDateTimeInput(reminder.scheduledAt),
    wasSent: reminder.wasSent ?? false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.message.trim()) {
      setError("Message is required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSave(reminder.reminderId, {
        taskId: Number(form.taskId),
        message: form.message.trim(),
        scheduledAt: form.scheduledAt ? `${form.scheduledAt}:00` : null,
        wasSent: form.wasSent,
      });
      onClose();
    } catch (err) {
      setError("Failed to update reminder. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        <h2 className="modal-title">EDIT REMINDER</h2>

        <div className="modal-form">

          <div className="modal-field">
            <label className="modal-label">TASK</label>
            {/* Tasks list passed from Dashboard so user selects by title instead of raw ID. */}
            <select
              className="modal-input"
              value={form.taskId}
              onChange={handleChange("taskId")}
            >
              <option value="">Select a task…</option>
              {tasks.map((t) => (
                <option key={t.taskId} value={t.taskId}>
                  {t.title} {t.type ? `(${t.type})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-field">
            <label className="modal-label">MESSAGE</label>
            <input
              className="modal-input"
              type="text"
              value={form.message}
              onChange={handleChange("message")}
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