import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { API_BASE } from "../utils/apiBase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const establishSession = useCallback((userData) => {
    if (userData?._id && userData?.name) {
      setUser(userData);
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, { credentials: "include" });
      if (res.status === 401) {
        setUser(null);
        return null;
      }
      if (!res.ok) return null;
      const data = await res.json();
      setUser(data);
      return data;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, { credentials: "include" });
    } catch {
      // Clear local state even if the request fails
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, refreshAuth, establishSession, setUser, logout }),
    [user, loading, refreshAuth, establishSession, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
