// src/components/modals/EditTaskModal.jsx

import { useState } from "react";

const TASK_TYPES = ["ASSIGNMENT", "STUDY", "LAB", "EXAM", "PROJECT", "OTHER"];

// Strip time portion from ISO date string for the date input field.
function toDateInput(isoString) {
  if (!isoString) return "";
  return isoString.split("T")[0];
}

export default function EditTaskModal({ task, onClose, onSave }) {
  const [form, setForm] = useState({
    courseId: task.courseId ?? "",
    title: task.title ?? "",
    type: task.type ?? "ASSIGNMENT",
    dueDate: toDateInput(task.dueDate),
    weight: task.weight ?? "",
    bonus: task.bonus ?? false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSave(task.taskId, {
        courseId: Number(form.courseId),
        title: form.title.trim(),
        type: form.type,
        dueDate: form.dueDate ? `${form.dueDate}T17:00:00` : null,
        weight: form.weight ? Number(form.weight) : null,
        bonus: form.bonus,
      });
      onClose();
    } catch (err) {
      setError("Failed to update task. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        <h2 className="modal-title">EDIT TASK</h2>

        <div className="modal-form">

          <div className="modal-field">
            <label className="modal-label">COURSE ID</label>
            <input
              className="modal-input"
              type="number"
              value={form.courseId}
              onChange={handleChange("courseId")}
            />
          </div>

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
            <label className="modal-label">TYPE</label>
            <select
              className="modal-input"
              value={form.type}
              onChange={handleChange("type")}
            >
              {TASK_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="modal-field">
            <label className="modal-label">DUE DATE</label>
            <input
              className="modal-input"
              type="date"
              value={form.dueDate}
              onChange={handleChange("dueDate")}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">WEIGHT (%)</label>
            <input
              className="modal-input"
              type="number"
              value={form.weight}
              onChange={handleChange("weight")}
              min={0}
              max={100}
            />
          </div>

          <div className="modal-field modal-field--row">
            <label className="modal-label">BONUS</label>
            <input
              type="checkbox"
              checked={form.bonus}
              onChange={handleChange("bonus")}
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