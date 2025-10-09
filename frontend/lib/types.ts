export interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  techStack: string[];
  userId?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  projects: Project[];
}

export const categories = [
  "All Projects",
  "Web Apps",
  "Mobile Apps",
  "APIs",
] as const;

export type Category = typeof categories[number];
