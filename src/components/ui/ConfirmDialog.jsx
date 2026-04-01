import Modal from "./Modal";

export default function ConfirmDialog({
  title = "Are you sure?",
  message,
  onClose,
  onConfirm,
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <p>{message}</p>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        <button type="button" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </Modal>
  );
}