// src/components/modals/DeleteConfirmModal.jsx

import { useState } from "react";

export default function DeleteConfirmModal({ itemLabel, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError("Failed to delete. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card--narrow" onClick={(e) => e.stopPropagation()}>

        <h2 className="modal-title">Are you sure you want to delete?</h2>

        {itemLabel && (
          <p className="modal-delete-label">{itemLabel}</p>
        )}

        <p className="modal-delete-warning">This action cannot be undone</p>

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button
            type="button"
            className="modal-btn modal-btn--cancel"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal-btn modal-btn--delete"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>

      </div>
    </div>
  );
}
