import { apiRequest } from "./queryClient";
import { type User } from "@shared/schema";

export async function login(username: string, password: string): Promise<User> {
  const res = await apiRequest("POST", "/api/auth/login", { username, password });
  const data = await res.json();
  return data.user;
}

export async function register(userData: {
  username: string;
  password: string;
  fullName: string;
  email: string;
  avatar?: string;
}): Promise<User> {
  const res = await apiRequest("POST", "/api/auth/register", userData);
  return res.json();
}

export async function logout(): Promise<void> {
  await apiRequest("POST", "/api/auth/logout");
}
