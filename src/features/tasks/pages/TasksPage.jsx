import { useState } from "react";
import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import Modal from "../../../components/ui/Modal";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { useTasks } from "../hooks/useTasks";
import { useCourses } from "../../courses/hooks/useCourses";
import TaskRow from "../components/TaskRow";
import TaskFilterBar from "../components/TaskFilterBar";
import TaskForm from "../components/TaskForm";
import styles from "./TasksPage.module.css";

export default function TasksPage() {
  const { tasks, loading, error, addTask, editTask, removeTask } = useTasks();
  const { courses } = useCourses();

  const [filter, setFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const week = new Date(today);
  week.setDate(today.getDate() + 7);

  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const filteredTasks = sortedTasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "overdue") {
      return task.dueDate && new Date(task.dueDate) < today && !task.isCompleted;
    }
    if (filter === "today") {
      if (!task.dueDate) return false;
      const date = new Date(task.dueDate);
      return date >= today && date < new Date(today.getTime() + 86400000);
    }
    if (filter === "week") {
      if (!task.dueDate) return false;
      const date = new Date(task.dueDate);
      return date >= today && date < week;
    }
    return true;
  });

  return (
    <div className={styles.page}>
      <SectionHeader title="Tasks" breadcrumb="Home > Tasks > All Tasks" />

      <div className={styles.toolbar}>
        <button className={styles.primaryBtn} onClick={() => setShowCreate(true)}>
          Add Task
        </button>
        <button
          className={styles.secondaryBtn}
          disabled={!selectedTask}
          onClick={() => setShowEdit(true)}
        >
          Edit
        </button>
        <button
          className={styles.deleteBtn}
          disabled={!selectedTask}
          onClick={() => setShowDelete(true)}
        >
          Delete
        </button>
      </div>

      <div className={styles.body}>
        <TaskFilterBar filter={filter} onFilterChange={setFilter} />

        {loading && <EmptyState message="Loading tasks..." />}
        {!loading && error && <EmptyState message={error} />}
        {!loading && !error && filteredTasks.length === 0 && (
          <EmptyState message="No tasks match this filter." />
        )}

        {!loading && !error && filteredTasks.length > 0 && (
          <div className={styles.stack}>
            {filteredTasks.map((task) => (
              <div
                key={task.taskId}
                className={selectedTask?.taskId === task.taskId ? styles.selected : ""}
                onClick={() => setSelectedTask(task)}
              >
                <TaskRow task={task} />
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <Modal title="Add Task" onClose={() => setShowCreate(false)}>
          <TaskForm
            mode="create"
            courses={courses}
            onCancel={() => setShowCreate(false)}
            onSubmit={async (payload) => {
              await addTask(payload);
              setShowCreate(false);
            }}
          />
        </Modal>
      )}

      {showEdit && selectedTask && (
        <Modal title="Edit Task" onClose={() => setShowEdit(false)}>
          <TaskForm
            mode="edit"
            initialValues={selectedTask}
            courses={courses}
            onCancel={() => setShowEdit(false)}
            onSubmit={async (payload) => {
              await editTask(selectedTask.taskId, payload);
              setShowEdit(false);
            }}
          />
        </Modal>
      )}

      {showDelete && selectedTask && (
        <ConfirmDialog
          title="Delete task?"
          message={selectedTask.title}
          onClose={() => setShowDelete(false)}
          onConfirm={async () => {
            await removeTask(selectedTask.taskId);
            setSelectedTask(null);
            setShowDelete(false);
          }}
        />
      )}
    </div>
  );
}