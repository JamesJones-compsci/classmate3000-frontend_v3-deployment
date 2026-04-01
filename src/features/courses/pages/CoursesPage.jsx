import { useState } from "react";
import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import Modal from "../../../components/ui/Modal";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import Button from "../../../components/ui/Button";
import { useCourses } from "../hooks/useCourses";
import CourseCard from "../components/CourseCard";
import CourseForm from "../components/CourseForm";
import styles from "./CoursesPage.module.css";

export default function CoursesPage() {
  const { courses, loading, error, addCourse, editCourse, removeCourse } = useCourses();

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className={styles.page}>
      <SectionHeader title="Courses" breadcrumb="Home > Courses > All Courses" />

      <div className={styles.toolbar}>
        <Button variant="courses" onClick={() => setShowCreate(true)}>
          Add Course
        </Button>
        <Button variant="secondary" disabled={!selectedCourse} onClick={() => setShowEdit(true)}>
          Edit
        </Button>
        <Button variant="danger" disabled={!selectedCourse} onClick={() => setShowDelete(true)}>
          Delete
        </Button>
      </div>

      <div className={styles.body}>
        {loading && <EmptyState title="Loading" message="Loading courses..." />}
        {!loading && error && <EmptyState title="Error" message={error} />}
        {!loading && !error && courses.length === 0 && (
          <EmptyState title="No courses yet" message="Create your first course to get started." />
        )}

        {!loading && !error && courses.length > 0 && (
          <div className={styles.grid}>
            {courses.map((course) => (
              <div
                key={course.courseId}
                className={`${styles.selectable} ${
                  selectedCourse?.courseId === course.courseId ? styles.selected : ""
                }`}
                onClick={() => setSelectedCourse(course)}
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <Modal title="Add Course" onClose={() => setShowCreate(false)}>
          <CourseForm
            mode="create"
            onCancel={() => setShowCreate(false)}
            onSubmit={async (payload) => {
              await addCourse(payload);
              setShowCreate(false);
            }}
          />
        </Modal>
      )}

      {showEdit && selectedCourse && (
        <Modal title="Edit Course" onClose={() => setShowEdit(false)}>
          <CourseForm
            mode="edit"
            initialValues={selectedCourse}
            onCancel={() => setShowEdit(false)}
            onSubmit={async (payload) => {
              await editCourse(selectedCourse.courseId, payload);
              setShowEdit(false);
            }}
          />
        </Modal>
      )}

      {showDelete && selectedCourse && (
        <ConfirmDialog
          title="Delete course?"
          message={selectedCourse.title}
          onClose={() => setShowDelete(false)}
          onConfirm={async () => {
            await removeCourse(selectedCourse.courseId);
            setSelectedCourse(null);
            setShowDelete(false);
          }}
        />
      )}
    </div>
  );
}