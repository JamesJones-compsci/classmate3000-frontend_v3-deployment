const STORAGE_KEY = "classmate-mock-profile";

export async function getProfile() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function updateProfile(payload) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return payload;
}