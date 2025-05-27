"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  displayName: string;
  emails: { value: string }[];
  photos: { value: string }[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user", {
        withCredentials: true,
      });
      setUser(response.data as User);
      // If user is authenticated and on the home page, redirect to dashboard
      if (response.data && window.location.pathname === "/") {
        router.push("/dashboard");
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  const logout = async () => {
    try {
      await axios.get("http://localhost:5000/api/logout", {
        withCredentials: true,
      });
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
