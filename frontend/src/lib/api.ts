const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers: { ...headers, ...(options.headers as any) } });
  if (!res.ok) { const e = await res.json().catch(() => ({ detail: "Error" })); throw new Error(e.detail || `HTTP ${res.status}`); }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const authApi = {
  register: (d: any) => request("/api/auth/register", { method: "POST", body: JSON.stringify(d) }),
  login:    (d: any) => request<{ access_token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify(d) }),
  me:       (t: string) => request("/api/auth/me", {}, t),
};

export const profileApi = {
  get:    (t: string) => request("/api/users/profile", {}, t),
  create: (d: any, t: string) => request("/api/users/profile", { method: "POST", body: JSON.stringify(d) }, t),
  update: (d: any, t: string) => request("/api/users/profile", { method: "PUT", body: JSON.stringify(d) }, t),
};

export const symptomsApi = {
  analyze: (d: any, t: string) => request("/api/symptoms/analyze", { method: "POST", body: JSON.stringify(d) }, t),
};

export const historyApi = {
  list:  (t: string) => request("/api/history/", {}, t),
  stats: (t: string) => request("/api/history/stats", {}, t),
};

export const appointmentsApi = {
  list:   (t: string) => request("/api/appointments/", {}, t),
  create: (d: any, t: string) => request("/api/appointments/", { method: "POST", body: JSON.stringify(d) }, t),
  update: (id: string, d: any, t: string) => request(`/api/appointments/${id}`, { method: "PUT", body: JSON.stringify(d) }, t),
  delete: (id: string, t: string) => request(`/api/appointments/${id}`, { method: "DELETE" }, t),
};
