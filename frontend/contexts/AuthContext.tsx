"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/lib/types";
import * as api from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = api.getAuthToken();
        if (!token) {
          setIsLoading(false);
          return;
        }

        const projects = await api.getProjects();
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser({ ...userData, projects });
        }
      } catch (error) {
        localStorage.removeItem("currentUser");
        api.setAuthToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const authResponse = await api.login(email, password);
    const projects = await api.getProjects();

    const userData: User = {
      id: authResponse.user.id,
      username: authResponse.user.username,
      email: authResponse.user.email,
      password: "",
      projects: projects,
    };

    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify({
      id: userData.id,
      username: userData.username,
      email: userData.email,
    }));
  };

  const register = async (username: string, email: string, password: string) => {
    const authResponse = await api.register(username, email, password);
    const projects = await api.getProjects();

    const userData: User = {
      id: authResponse.user.id,
      username: authResponse.user.username,
      email: authResponse.user.email,
      password: "",
      projects: projects,
    };

    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify({
      id: userData.id,
      username: userData.username,
      email: userData.email,
    }));
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("currentUser");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
