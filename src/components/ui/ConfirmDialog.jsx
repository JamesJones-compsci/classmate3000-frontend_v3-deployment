import Modal from "./Modal";
import Button from "./Button";
import styles from "./ConfirmDialog.module.css";

export default function ConfirmDialog({
  title = "Are you sure?",
  message,
  onClose,
  onConfirm,
}) {
  return (
    <Modal title={title} onClose={onClose} narrow>
      <p className={styles.message}>{message}</p>

      <div className={styles.actions}>
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