"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types/user";
import { authService } from "@/services/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const user = await authService.getCurrentUser();
        setUser(user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      await authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await authService.login({ email, password });
      setUser(response.user);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Login failed");
        throw error;
      } else {
        setError("Login failed");
        throw new Error("Login failed");
      }
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      const response = await authService.register({ name, email, password });
      setUser(response.user);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Registration failed");
        throw error;
      } else {
        setError("Registration failed");
        throw new Error("Registration failed");
      }
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout }}
    >
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
