"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { client } from "services/http";
import { useLocalStorage } from "react-use";

interface AuthState {
  token: string | null;
  userId: string | null;
  loading: boolean;
  header: { authorization: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string, password: string) => Promise<void>;
}

const AuthCtx = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useLocalStorage<string | null>("token", null);
  const [userId, setUserId] = useLocalStorage<string | null>("userId", null);
  const [loading, setLoading] = useState(true);

  // Validate token against backend to avoid front/back mismatch
  useEffect(() => {
    if (!token) return setLoading(false);

    (async () => {
      if (!token) return;

      setLoading(true);

      const valid = await client.auth.validate.$post({ json: { token } });
      if (!valid) {
        // Session expired on backend; clear local copy
        setToken(null);
        setUserId(null);
      }

      setLoading(false);
    })();
  }, [token, setToken, setUserId]);

  // Callbacks to be used in the app

  // Login
  const login = useCallback(
    async (email: string, password: string) => {
      const data = await client.auth.login.$post({ json: { email, password } });
      if (!data) return false;

      const { token, userId } = await data.json();
      setToken(token);
      setUserId(userId);

      return true;
    },
    [setToken, setUserId],
  );

  // Register
  const register = useCallback(
    async (email: string, password: string) => {
      const data = await client.auth.register.$post({ json: { email, password } });
      if (!data) return false;

      const { token, userId } = await data.json();
      setToken(token);
      setUserId(userId);

      return true;
    },
    [setToken, setUserId],
  );

  // Logout (we don't need to make an api call - just clear local data for the token)
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
  }, [setToken, setUserId]);

  // Reset password
  const resetPassword = useCallback(async (email: string, password: string) => {
    const response = await client.auth.reset.$post({ json: { email, password } });
    if (!response.ok) throw new Error(`Failed to reset password: ${await response.text()}`);
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        token: token ?? null,
        userId: userId ?? null,
        loading,
        header: token ? { authorization: `Bearer ${token}` } : null,
        login,
        register,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
