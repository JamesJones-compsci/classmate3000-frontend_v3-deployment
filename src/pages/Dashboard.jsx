import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [courses, setCourses] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [grades, setGrades] = useState([]);
    const [reminders, setReminders] = useState([]);

    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseRes = await api.get("/api/v1/courses");
                const taskRes = await api.get("/api/v1/tasks");
                const gradeRes = await api.get("/api/v1/grades");
                const reminderRes = await api.get("/api/v1/reminders");

                setCourses(courseRes.data);
                setTasks(taskRes.data);
                setGrades(gradeRes.data);
                setReminders(reminderRes.data);
            } catch (err) {
                console.error("Dashboard fetch error:", err);

                if (err.response?.status === 401) {
                    logout();
                    navigate("/login");
                }
            }
        };

        fetchData();
    }, []);

    // ---------- Create Handlers ----------

    const createCourse = async (courseData) => {
        const res = await api.post("/api/v1/courses", courseData);
        setCourses(prev => [...prev, res.data]);
    };

    const createTask = async (taskData) => {
        const res = await api.post("/api/v1/tasks", taskData);
        setTasks(prev => [...prev, res.data]);
    };

    const createGrade = async (gradeData) => {
        const res = await api.post("/api/v1/grades", gradeData);
        setGrades(prev => [...prev, res.data]);
    };

    const createReminder = async (reminderData) => {
        const res = await api.post("/api/v1/reminders", reminderData);
        setReminders(prev => [...prev, res.data]);
    };

    return (
        <div>
            <h2>Dashboard</h2>

            {/* ---------- Courses ---------- */}
            <h3>Add Course (Test)</h3>
            <button onClick={() => createCourse({
                code: "CS101",
                title: "Intro to CS",
                description: "Basics of Computer Science"
            })}>
                Add Course
            </button>

            <ul>
                {courses.map(course => (
                    <li key={course.id}>{course.title}</li>
                ))}
            </ul>

            {/* ---------- Tasks ---------- */}
            <h3>Add Task (Test)</h3>
            <button onClick={() => createTask({
                code: "TASK-001",
                title: "My First Task",
                description: "Frontend integration task"
            })}>
                Add Task
            </button>

            <ul>
                {tasks.map(task => (
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>

            {/* ---------- Grades ---------- */}
            <h3>Add Grade (Test)</h3>
            <button onClick={() => createGrade({
                courseCode: "CS101",
                courseName: "Introduction to CS",
                type: "Exam",
                grade: 95,
                weight: 30,
                feedback: "Excellent performance"
            })}>
                Add Grade
            </button>

            <ul>
                {grades.map(grade => (
                    <li key={grade.id}>
                        {grade.courseCode} ({grade.type}) – {grade.grade}%
                    </li>
                ))}
            </ul>

            {/* ---------- Reminders ---------- */}
            <h3>Add Reminder (Test)</h3>
            <button onClick={() => createReminder({
                title: "Study for exam",
                dueDate: "2026-02-01"
            })}>
                Add Reminder
            </button>

            <ul>
                {reminders.map(reminder => (
                    <li key={reminder.id}>{reminder.title}</li>
                ))}
            </ul>
        </div>
    );
}