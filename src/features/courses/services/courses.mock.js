let courses = [
  {
    courseId: 1,
    code: "COMP3059",
    title: "Capstone I",
    instructor: "Prof. Laily Ajellu",
    gradeGoal: 75,
    startWeek: "2026-01-06",
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
    startWeek: "2026-01-06",
    meetings: [
      { dayOfWeek: 4, startTime: "13:00:00", endTime: "15:00:00" },
    ],
  },
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