const USERS_KEY = "classmate-mock-users";

function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function makeToken(email) {
  return `mock-token-${email}-${Date.now()}`;
}

// LOGIN
export async function login({ email, password }) {
  const users = loadUsers();

  const found = users.find(
    (u) =>
      u.email.toLowerCase() === email.trim().toLowerCase() &&
      u.password === password
  );

  if (!found) {
    const error = new Error("Invalid credentials");
    error.response = { status: 401 };
    throw error;
  }

  return {
    token: makeToken(found.email),
    firstName: found.firstName,
    lastName: found.lastName,
    email: found.email,
  };
}

// REGISTER
export async function register({ firstName, lastName, email, password }) {
  const users = loadUsers();

  const exists = users.some(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (exists) {
    const error = new Error("User already exists");
    error.response = { status: 409 };
    throw error;
  }

  const newUser = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    password,
  };

  saveUsers([...users, newUser]);

  return {
    token: makeToken(newUser.email),
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
  };
}