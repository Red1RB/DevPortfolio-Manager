import { Project } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface BackendProject {
  id: string;
  name: string;
  description: string;
  category: string;
  techStack: string[];
  position: number;
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
}

export function getAuthToken(): string | null {
  if (authToken) return authToken;
  if (typeof window !== "undefined") {
    authToken = localStorage.getItem("authToken");
  }
  return authToken;
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
  return data.data;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const authResponse = await handleResponse<AuthResponse>(response);
  setAuthToken(authResponse.token);
  return authResponse;
};

export const register = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  const authResponse = await handleResponse<AuthResponse>(response);
  setAuthToken(authResponse.token);
  return authResponse;
};

export const logout = async (): Promise<void> => {
  setAuthToken(null);
};

export const getProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: "GET",
    headers: getHeaders(),
  });

  const backendProjects = await handleResponse<BackendProject[]>(response);

  return backendProjects.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    techStack: p.techStack,
  }));
};

export const createProject = async (project: Omit<Project, "id">): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      name: project.name,
      description: project.description,
      category: project.category,
      techStack: project.techStack,
    }),
  });

  const backendProject = await handleResponse<BackendProject>(response);

  return {
    id: backendProject.id,
    name: backendProject.name,
    description: backendProject.description,
    category: backendProject.category,
    techStack: backendProject.techStack,
  };
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({
      name: updates.name,
      description: updates.description,
      category: updates.category,
      techStack: updates.techStack,
    }),
  });

  const backendProject = await handleResponse<BackendProject>(response);

  return {
    id: backendProject.id,
    name: backendProject.name,
    description: backendProject.description,
    category: backendProject.category,
    techStack: backendProject.techStack,
  };
};

export const deleteProject = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Delete failed" }));
    throw new Error(errorData.message || "Failed to delete project");
  }
};

export const reorderProjects = async (projects: Project[]): Promise<void> => {
  const projectPositions = projects.map((project, index) => ({
    id: project.id,
    position: index,
  }));

  const response = await fetch(`${API_BASE_URL}/api/projects/reorder`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ projects: projectPositions }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Reorder failed" }));
    throw new Error(errorData.message || "Failed to reorder projects");
  }
};

export const apiService = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
};
