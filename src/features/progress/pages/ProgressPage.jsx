import { useMemo, useState } from "react";
import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import Modal from "../../../components/ui/Modal";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { useProgress } from "../hooks/useProgress";
import { useCourses } from "../../courses/hooks/useCourses";
import ProgressCard from "../components/ProgressCard";
import ProgressChart from "../components/ProgressChart";
import ProgressForm from "../components/ProgressForm";
import styles from "./ProgressPage.module.css";

export default function ProgressPage() {
  const { progressEntries, loading, error, addProgress, editProgress, removeProgress } = useProgress();
  const { courses } = useCourses();

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const filteredEntries = useMemo(() => {
    if (!selectedCourseId) return progressEntries;
    return progressEntries.filter(
      (entry) => Number(entry.courseId) === Number(selectedCourseId)
    );
  }, [progressEntries, selectedCourseId]);

  return (
    <div className={styles.page}>
      <SectionHeader title="Progress" breadcrumb="Home > Progress > Weekly Progress" />

      <div className={styles.toolbar}>
        <button className={styles.primaryBtn} onClick={() => setShowCreate(true)}>
          Add Progress
        </button>
        <button
          className={styles.secondaryBtn}
          disabled={!selectedEntry}
          onClick={() => setShowEdit(true)}
        >
          Edit
        </button>
        <button
          className={styles.deleteBtn}
          disabled={!selectedEntry}
          onClick={() => setShowDelete(true)}
        >
          Delete
        </button>

        <select
          className={styles.filterSelect}
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course.courseId} value={course.courseId}>
              {course.code} — {course.title}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.body}>
        {loading && <EmptyState message="Loading progress..." />}
        {!loading && error && <EmptyState message={error} />}
        {!loading && !error && filteredEntries.length === 0 && (
          <EmptyState message="No progress entries yet." />
        )}

        {!loading && !error && filteredEntries.length > 0 && (
          <>
            <ProgressChart entries={filteredEntries} />

            <div className={styles.grid}>
              {filteredEntries.map((entry) => (
                <div
                  key={entry.progressId}
                  className={selectedEntry?.progressId === entry.progressId ? styles.selected : ""}
                  onClick={() => setSelectedEntry(entry)}
                >
                  <ProgressCard entry={entry} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showCreate && (
        <Modal title="Add Progress" onClose={() => setShowCreate(false)}>
          <ProgressForm
            mode="create"
            courses={courses}
            onCancel={() => setShowCreate(false)}
            onSubmit={async (payload) => {
              await addProgress(payload);
              setShowCreate(false);
            }}
          />
        </Modal>
      )}

      {showEdit && selectedEntry && (
        <Modal title="Edit Progress" onClose={() => setShowEdit(false)}>
          <ProgressForm
            mode="edit"
            initialValues={selectedEntry}
            courses={courses}
            onCancel={() => setShowEdit(false)}
            onSubmit={async (payload) => {
              await editProgress(selectedEntry.progressId, payload);
              setShowEdit(false);
            }}
          />
        </Modal>
      )}

      {showDelete && selectedEntry && (
        <ConfirmDialog
          title="Delete progress entry?"
          message={`Week of ${selectedEntry.weekOf}`}
          onClose={() => setShowDelete(false)}
          onConfirm={async () => {
            await removeProgress(selectedEntry.progressId);
            setSelectedEntry(null);
            setShowDelete(false);
          }}
        />
      )}
    </div>
  );
}