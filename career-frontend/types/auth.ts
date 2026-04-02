export type UserRole = "student" | "admin";

export type MockSession = {
  email: string;
  role: UserRole;
  name: string;
};