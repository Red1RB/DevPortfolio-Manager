import { Project } from "./types";

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "E-Commerce Platform",
    description: "Full-stack online shopping platform with payment integration",
    category: "Web Apps",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
  },
  {
    id: "2",
    name: "Task Management API",
    description: "RESTful API for task management with authentication",
    category: "APIs",
    techStack: ["Spring Boot", "Java", "MySQL", "JWT"],
  },
  {
    id: "3",
    name: "Fitness Tracker",
    description: "Mobile app to track workouts and nutrition",
    category: "Mobile Apps",
    techStack: ["React Native", "TypeScript", "Firebase"],
  },
  {
    id: "4",
    name: "Blog CMS",
    description: "Content management system for bloggers",
    category: "Web Apps",
    techStack: ["Next.js", "MongoDB", "Node.js", "Express"],
  },
  {
    id: "5",
    name: "Weather API Integration",
    description: "Weather data aggregation service",
    category: "APIs",
    techStack: ["Node.js", "Express", "Redis", "Docker"],
  },
  {
    id: "6",
    name: "Social Media App",
    description: "Cross-platform social networking application",
    category: "Mobile Apps",
    techStack: ["Flutter", "Dart", "Firebase", "GraphQL"],
  },
];
