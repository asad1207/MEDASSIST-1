"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  is_active?: boolean;
  created_at?: string;
}

interface AuthCtx {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; full_name: string; password: string }) => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]   = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const t = localStorage.getItem("ma_token");
      const u = localStorage.getItem("ma_user");
      if (t && u) { setToken(t); setUser(JSON.parse(u)); }
    } catch {}
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as any).detail || "Invalid email or password");
    }
    const data = await res.json();
    const accessToken: string = data.access_token;
    const meRes = await fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!meRes.ok) throw new Error("Could not fetch user");
    const me: UserProfile = await meRes.json();
    setToken(accessToken);
    setUser(me);
    localStorage.setItem("ma_token", accessToken);
    localStorage.setItem("ma_user", JSON.stringify(me));
  };

  const register = async (data: { email: string; full_name: string; password: string }) => {
    if (data.password.length > 72) throw new Error("Password must be 72 characters or less");
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as any).detail || "Registration failed");
    }
    await login(data.email, data.password);
  };

  // updateUser kept for compatibility — updates local cache only
  const updateUser = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("ma_user", JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null); setToken(null);
    localStorage.removeItem("ma_token");
    localStorage.removeItem("ma_user");
    window.location.href = "/login";
  };

  return (
    <Ctx.Provider value={{ user, token, loading, login, register, updateUser, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
}
