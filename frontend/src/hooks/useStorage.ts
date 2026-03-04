"use client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── kept for pages that haven't migrated yet ─────────────────────────────
export interface HistoryEntry {
  id: string;
  date: string;
  symptoms: string[];
  severity: string;
  duration: string;
  risk: "mild" | "moderate" | "emergency";
  risk_score: number;
  recommendation: string;
}

// Legacy localStorage stubs — kept so old imports don't break at build time
// but the real data now comes from the API via fetchHistory / fetchStats
export function getHistory(_userId: string): HistoryEntry[] { return []; }
export function saveHistoryEntry(_userId: string, _entry: HistoryEntry) {}

export interface MedEntry { id: string; name: string; dose: string; freq: string; time: string; }
const MED_KEY = "ma_meds";
export function getMeds(userId: string): MedEntry[] {
  try { const a = JSON.parse(localStorage.getItem(MED_KEY) || "{}"); return a[userId] || []; } catch { return []; }
}
export function saveMed(userId: string, med: MedEntry) {
  try { const a = JSON.parse(localStorage.getItem(MED_KEY) || "{}"); a[userId] = [med, ...(a[userId] || [])]; localStorage.setItem(MED_KEY, JSON.stringify(a)); } catch {}
}
export function deleteMed(userId: string, id: string) {
  try { const a = JSON.parse(localStorage.getItem(MED_KEY) || "{}"); a[userId] = (a[userId] || []).filter((m: MedEntry) => m.id !== id); localStorage.setItem(MED_KEY, JSON.stringify(a)); } catch {}
}

export interface AppointmentEntry { id: string; doctor: string; specialty: string; date: string; time: string; notes: string; status: "scheduled" | "completed" | "cancelled"; }
// Legacy stubs
export function getAppointments(_userId: string): AppointmentEntry[] { return []; }
export function saveAppointment(_userId: string, _a: AppointmentEntry) {}
export function updateAppointmentStatus(_userId: string, _id: string, _status: AppointmentEntry["status"]) {}

// ─── Real API functions ────────────────────────────────────────────────────
async function apiFetch(path: string, token: string, opts: RequestInit = {}) {
  return fetch(`${API}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(opts.headers || {}),
    },
  });
}

// History
export async function fetchHistory(token: string): Promise<any[]> {
  try {
    const res = await apiFetch("/api/history/", token);
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((h: any) => ({
      ...h,
      symptoms: (() => { try { return JSON.parse(h.symptoms); } catch { return [h.symptoms]; } })(),
      risk: h.risk_level?.toLowerCase() || "mild",
      recommendation: h.ai_recommendation || "",
    }));
  } catch { return []; }
}

export async function fetchStats(token: string): Promise<any> {
  try {
    const res = await apiFetch("/api/history/stats", token);
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

// Symptoms
export async function analyzeWithBackend(token: string, payload: {
  symptoms: string[];
  severity: string;
  duration?: string;
  temperature?: number | null;
}): Promise<any> {
  const res = await apiFetch("/api/symptoms/analyze", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).detail || "Analysis failed");
  }
  return res.json();
}

// Appointments
export async function fetchAppointments(token: string): Promise<any[]> {
  try {
    const res = await apiFetch("/api/appointments/", token);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function createAppointment(token: string, data: any): Promise<any> {
  const res = await apiFetch("/api/appointments/", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).detail || "Failed to create appointment");
  }
  return res.json();
}

export async function updateAppointment(token: string, id: string, data: any): Promise<any> {
  const res = await apiFetch(`/api/appointments/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update appointment");
  return res.json();
}

// Profile
export async function fetchProfile(token: string): Promise<any> {
  try {
    const res = await apiFetch("/api/users/profile", token);
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function saveProfile(token: string, data: any): Promise<any> {
  let res = await apiFetch("/api/users/profile", token, { method: "PUT", body: JSON.stringify(data) });
  if (!res.ok) res = await apiFetch("/api/users/profile", token, { method: "POST", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to save profile");
  return res.json();
}
