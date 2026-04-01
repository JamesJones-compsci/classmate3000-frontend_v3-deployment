import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({
  title = "Are you sure?",
  message,
  onClose,
  onConfirm,
}) {
  return (
    <Modal title={title} onClose={onClose} narrow>
      <p style={{ marginTop: 0, color: "#6b7280", textAlign: "center" }}>{message}</p>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}