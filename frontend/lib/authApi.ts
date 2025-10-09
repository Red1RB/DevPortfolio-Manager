import { User, Project } from "./types";
import { mockProjects } from "./mockData";

const USERS_KEY = "devportfolio_users";

function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) {
    const defaultUsers: User[] = [
      {
        id: "1",
        username: "demo",
        email: "demo@example.com",
        password: "demo123",
        projects: mockProjects.map((p) => ({ ...p, userId: "1" })),
      },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(stored);
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const authApi = {
  async login(email: string, password: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    return user;
  },

  async register(username: string, email: string, password: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const users = getUsers();

    if (users.some((u) => u.email === email)) {
      throw new Error("Email already exists");
    }

    if (users.some((u) => u.username === username)) {
      throw new Error("Username already taken");
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      password,
      projects: [],
    };

    users.push(newUser);
    saveUsers(users);

    return newUser;
  },

  async updateUserProjects(userId: string, projects: Project[]): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const users = getUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex !== -1) {
      users[userIndex].projects = projects;
      saveUsers(users);
    }
  },

  getUserProjects(userId: string): Project[] {
    const users = getUsers();
    const user = users.find((u) => u.id === userId);
    return user?.projects || [];
  },
};
