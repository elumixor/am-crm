"use client";

import type { AppType } from "@am-crm/api";
import { hc } from "hono/client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "react-use";
import { env } from "services/env";
import { validJsonInternal } from "services/http";
import { Token } from "./token";

interface AuthState {
  userId?: string;
  loaded: boolean;
  client: ReturnType<typeof hc<AppType>>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string, password: string) => Promise<void>;
}

const AuthCtx = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [tokenValue, setTokenValue, removeToken] = useLocalStorage<string>("token");
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [loaded, setLoaded] = useState(false);

  // Validate and refresh token against backend to avoid front/back mismatch
  useEffect(() => {
    if (!tokenValue) {
      setUserId(undefined);
      setLoaded(true);
      return;
    }

    void (async () => {
      setUserId(undefined);

      try {
        const token = new Token(tokenValue);
        await token.validateAndRefresh();

        setTokenValue(token.value);
        setUserId(token.userId);
      } catch (error) {
        console.warn("Token validation error:", error);
        // On error, clear tokens to be safe
        setTokenValue(undefined);
        setUserId(undefined);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Callbacks to be used in the app

  // Login
  const login = useCallback(async (email: string, password: string) => {
    const response = await client.auth.login.$post({ json: { email, password } });
    const { token: tokenValue } = await validJsonInternal(response);
    const token = new Token(tokenValue);
    setTokenValue(token.value);
    setUserId(token.userId);
  }, []);

  // Register
  const register = useCallback(async (email: string, password: string) => {
    const response = await client.auth.register.$post({ json: { email, password } });
    const { token: tokenValue } = await validJsonInternal(response);
    const token = new Token(tokenValue);
    setTokenValue(token.value);
    setUserId(token.userId);
  }, []);

  // Logout (we don't need to make an api call - just clear local data for the token)
  const logout = useCallback(() => {
    setTokenValue(undefined);
    removeToken();
    setUserId(undefined);
  }, []);

  // Reset password
  const resetPassword = useCallback(async (email: string, password: string) => {
    const response = await client.auth.reset.$post({ json: { email, password } });
    await validJsonInternal(response);

    // Logout user after password reset for security reasons
    logout();
  }, []);

  const client = useMemo(
    () =>
      hc<AppType>(
        env.NEXT_PUBLIC_API_BASE_URL,
        tokenValue ? { headers: { authorization: `Bearer ${tokenValue}` } } : {},
      ),
    [tokenValue],
  );

  return (
    <AuthCtx.Provider
      value={{
        client,
        userId,
        loaded,
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
