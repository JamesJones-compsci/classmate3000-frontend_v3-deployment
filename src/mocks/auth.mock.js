export function getMockUser(email = "dev@classmate.local") {
  return {
    token: "dev-token",
    firstName: "Dev",
    lastName: "User",
    email,
  };
}