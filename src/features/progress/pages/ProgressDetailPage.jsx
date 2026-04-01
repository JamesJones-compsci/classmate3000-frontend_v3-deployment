import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import Modal from "../../../components/ui/Modal";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Button from "../../../components/ui/Button";
import { useCourses } from "../../courses/hooks/useCourses";
import { useCourseProgress } from "../hooks/useCourseProgress";
import ProgressForm from "../components/ProgressForm";
import ProgressDetailsCard from "../components/ProgressDetailsCard";
import ProgressBarChart from "../components/ProgressBarChart";
import styles from "./ProgressDetailPage.module.css";

export default function ProgressDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses } = useCourses();
  const { course, entries, loading, error, addProgress, editProgress, removeProgress } =
    useCourseProgress(courseId);

  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (entries.length > 0) {
      setSelectedWeekIndex(entries.length - 1);
    }
  }, [entries]);

  const selectedEntry = entries[selectedWeekIndex] ?? null;
  const chartEntries = useMemo(
    () => entries.slice(0, selectedWeekIndex + 1),
    [entries, selectedWeekIndex]
  );

  return (
    <div className={styles.page}>
      <SectionHeader
        title={course ? `${course.code} — ${course.title}` : "Progress Details"}
        breadcrumbs={[
          { label: "Home", to: "/dashboard/courses" },
          { label: "Progress", to: "/dashboard/progress" },
          { label: course ? `${course.code} — ${course.title}` : "Course Details" },
        ]}
        actions={
          <Button variant="ghost" onClick={() => navigate("/dashboard/progress")}>
            Back to all progress
          </Button>
        }
      />

      <div className={styles.toolbar}>
        <Button variant="progress" onClick={() => setShowCreate(true)}>
          Add Progress
        </Button>
        <Button variant="secondary" disabled={!selectedEntry} onClick={() => setShowEdit(true)}>
          Edit
        </Button>
        <Button variant="danger" disabled={!selectedEntry} onClick={() => setShowDelete(true)}>
          Delete
        </Button>

        <select
          className={styles.filterSelect}
          value={selectedWeekIndex}
          onChange={(e) => setSelectedWeekIndex(Number(e.target.value))}
          disabled={!entries.length}
        >
          {entries.map((entry, index) => (
            <option key={entry.progressId} value={index}>
              Week {index + 1}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.body}>
        {loading && <EmptyState title="Loading" message="Loading course progress..." />}
        {!loading && error && <EmptyState title="Error" message={error} />}
        {!loading && !error && !course && (
          <EmptyState title="Course not found" message="This course does not exist." />
        )}
        {!loading && !error && course && entries.length === 0 && (
          <EmptyState title="No progress yet" message="Add a progress entry for this course." />
        )}

        {!loading && !error && course && selectedEntry && (
          <>
            <ProgressDetailsCard
              course={course}
              entry={selectedEntry}
              weekIndex={selectedWeekIndex}
            />
            <ProgressBarChart course={course} entries={chartEntries} />
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
              await addProgress({ ...payload, courseId: Number(courseId) });
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
          message={`Week ${selectedWeekIndex + 1}`}
          onClose={() => setShowDelete(false)}
          onConfirm={async () => {
            await removeProgress(selectedEntry.progressId);
            setShowDelete(false);
          }}
        />
      )}
    </div>
  );
}