import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SectionHeader from "../../../components/ui/SectionHeader";
import EmptyState from "../../../components/ui/EmptyState";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { useTasks } from "../hooks/useTasks";
import { useCourses } from "../../courses/hooks/useCourses";
import TaskRow from "../components/TaskRow";
import TaskFilterBar from "../components/TaskFilterBar";
import TaskForm from "../components/TaskForm";
import styles from "./TasksPage.module.css";

export default function TasksPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "all";

  const { tasks, loading, error, addTask } = useTasks();
  const { courses } = useCourses();

  const [showCreate, setShowCreate] = useState(false);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const week = new Date(today);
  week.setDate(today.getDate() + 7);

  function handleFilterChange(nextFilter) {
    if (nextFilter === "all") {
      setSearchParams({});
      return;
    }

    setSearchParams({ filter: nextFilter });
  }

  const filteredTasks = useMemo(() => {
    const sortedTasks = [...tasks].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    return sortedTasks.filter((task) => {
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
  }, [tasks, filter, today, week]);

  useEffect(() => {
  function handleLeftAction(event) {
    if (event.detail?.section === "tasks" && event.detail?.action === "add") {
      setShowCreate(true);
    }
  }

  window.addEventListener("classmate:left-action", handleLeftAction);

  return () => {
    window.removeEventListener("classmate:left-action", handleLeftAction);
  };
}, []);


  return (
    <div className={styles.page}>
      <SectionHeader
        title="Tasks"
        breadcrumbs={[
          { label: "Home", to: "/dashboard/courses" },
          { label: "Tasks" },
        ]}
        actions={
          <Button variant="tasks" onClick={() => setShowCreate(true)}>
            Add Task
          </Button>
        }
      />

      <div className={styles.body}>
        <TaskFilterBar filter={filter} onFilterChange={handleFilterChange} />

        {loading && <EmptyState title="Loading" message="Loading tasks..." />}
        {!loading && error && <EmptyState title="Error" message={error} />}
        {!loading && !error && filteredTasks.length === 0 && (
          <EmptyState title="No tasks" message="No tasks match this filter." />
        )}

        {!loading && !error && filteredTasks.length > 0 && (
          <div className={styles.stack}>
            {filteredTasks.map((task) => (
              <div
                key={task.taskId}
                className={styles.selectable}
                onClick={() => navigate(`/dashboard/tasks/${task.taskId}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/dashboard/tasks/${task.taskId}`);
                  }
                }}
              >
                <TaskRow task={task} />
              </div>
            ))}
          </div>
        )}
        <div className={styles.bottomAction}>
          <Button variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Back to Top
          </Button>
        </div>
      </div>

      {showCreate && (
        <Modal title="Add Task" onClose={() => setShowCreate(false)}>
          <TaskForm
            mode="create"
            courses={courses}
            onCancel={() => setShowCreate(false)}
            onSubmit={async (payload) => {
              const created = await addTask(payload);
              setShowCreate(false);
              if (created?.taskId != null) {
                navigate(`/dashboard/tasks/${created.taskId}`);
              }
            }}
          />
        </Modal>
      )}
    </div>
  );
}