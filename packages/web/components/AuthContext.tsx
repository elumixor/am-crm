"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";

interface AuthState {
  token: string | null;
  userId: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthCtx = createContext<AuthState | undefined>(undefined);

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!apiBase) throw new Error("API_BASE_URL is not defined");

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("session") : null;
    if (stored) {
      const parsed = JSON.parse(stored) as { token: string; userId: string };
      setToken(parsed.token);
      setUserId(parsed.userId);
    }

    setLoading(false);
  }, []);

  // Validate token against backend to avoid front/back mismatch
  useEffect(() => {
    (async () => {
      if (!token) return;

      const res = await fetch(`${apiBase}/me`, { headers: { authorization: `Bearer ${token}` } });
      if (res.status === 401) {
        // Session expired on backend; clear local copy
        setToken(null);
        setUserId(null);
        localStorage.removeItem("session");
      }
    })();
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${apiBase}/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { token: string; userId: string };
    setToken(data.token);
    setUserId(data.userId);
    localStorage.setItem("session", JSON.stringify({ token: data.token, userId: data.userId }));
    return true;
  }, []); // state setters stable; localStorage side-effect fine

  const register = useCallback(
    async (email: string, password: string) => {
      const res = await fetch(`${apiBase}/auth/register`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      // Auto login after register
      return login(email, password);
    },
    [login],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("session");
  }, []);

  return <AuthCtx.Provider value={{ token, userId, loading, login, register, logout }}>{children}</AuthCtx.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
