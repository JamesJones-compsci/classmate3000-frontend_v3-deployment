let courses = [
  {
    courseId: 1,
    code: "COMP3059",
    title: "Capstone I",
    instructor: "Prof. Laily Ajellu",
    gradeGoal: 75,
    startWeek: "2026-01-19",
    meetings: [
      { dayOfWeek: 2, startTime: "10:00:00", endTime: "12:00:00" },
    ],
  },
  {
    courseId: 2,
    code: "COMP3134",
    title: "Network Security",
    instructor: "Prof. Smith",
    gradeGoal: 80,
    startWeek: "2026-01-19",
    meetings: [
      { dayOfWeek: 4, startTime: "13:00:00", endTime: "15:00:00" },
    ],
  },
  {
    courseId: 3,
    code: "COMP3095",
    title: "Full Stack Development",
    instructor: "Prof. James Carter",
    gradeGoal: 85,
    startWeek: "2026-01-19",
    meetings: [
      { dayOfWeek: 1, startTime: "09:00:00", endTime: "11:00:00" },
      { dayOfWeek: 3, startTime: "09:00:00", endTime: "11:00:00" },
    ],
  },
  {
    courseId: 4,
    code: "COMP3074",
    title: "Mobile Application Development",
    instructor: "Prof. Emily Chen",
    gradeGoal: 78,
    startWeek: "2026-01-19",
    meetings: [
      { dayOfWeek: 2, startTime: "14:00:00", endTime: "16:00:00" },
    ],
  },
  {
    courseId: 5,
    code: "COMP3034",
    title: "Database Systems",
    instructor: "Prof. Raj Patel",
    gradeGoal: 82,
    startWeek: "2026-01-19",
    meetings: [
      { dayOfWeek: 1, startTime: "12:00:00", endTime: "14:00:00" },
      { dayOfWeek: 4, startTime: "12:00:00", endTime: "14:00:00" },
    ],
  },
  {
    courseId: 6,
    code: "COMP3023",
    title: "Web Application Development",
    instructor: "Prof. Sarah Nguyen",
    gradeGoal: 88,
    startWeek: "2026-01-19",
    meetings: [
      { dayOfWeek: 3, startTime: "15:00:00", endTime: "17:00:00" },
    ],
  },
  {
    courseId: 7,
    code: "COMP3044",
    title: "Artificial Intelligence",
    instructor: "Prof. David Brown",
    gradeGoal: 90,
    startWeek: "2026-01-19",
    meetings: [
      { dayOfWeek: 2, startTime: "08:00:00", endTime: "10:00:00" },
      { dayOfWeek: 5, startTime: "08:00:00", endTime: "10:00:00" },
    ],
  }
];

function nextId() {
  return courses.length ? Math.max(...courses.map((c) => Number(c.courseId))) + 1 : 1;
}

export async function getCourses() {
  return structuredClone(courses);
}

export async function createCourse(payload) {
  const newCourse = {
    ...payload,
    courseId: nextId(),
  };
  courses = [...courses, newCourse];
  return structuredClone(newCourse);
}

export async function updateCourse(id, payload) {
  const numericId = Number(id);
  const existing = courses.find((c) => Number(c.courseId) === numericId);
  const updated = { ...existing, ...payload, courseId: numericId };

  courses = courses.map((c) =>
    Number(c.courseId) === numericId ? updated : c
  );

  return structuredClone(updated);
}

export async function deleteCourse(id) {
  const numericId = Number(id);
  courses = courses.filter((c) => Number(c.courseId) !== numericId);
  return true;
}