import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/queryClient";

export type AuthUser = {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (data: { username: string; password: string }) => Promise<void>;
  register: (data: { username: string; password: string; name: string; email: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await apiRequest("GET", "/api/auth/me");
      const data = (await res.json()) as AuthUser;
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (data: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/login", data);
      const me = (await res.json()) as AuthUser;
      setUser(me);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { username: string; password: string; name: string; email: string }) => {
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/register", data);
      const me = (await res.json()) as AuthUser;
      setUser(me);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiRequest("POST", "/api/auth/logout");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, register, logout, refresh }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
