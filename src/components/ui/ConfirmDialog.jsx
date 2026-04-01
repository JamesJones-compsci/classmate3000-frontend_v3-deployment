import Modal from "./Modal";
import styles from "./ConfirmDialog.module.css";

export default function ConfirmDialog({
  title = "Are you sure?",
  message,
  onClose,
  onConfirm,
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className={styles.message}>{message}</p>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>
          Cancel
        </button>

        <button type="button" className={styles.deleteBtn} onClick={onConfirm}>
          Delete
        </button>
      </div>
    </Modal>
  );
}