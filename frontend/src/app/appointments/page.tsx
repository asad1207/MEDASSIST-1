"use client";
import { useState, useEffect } from "react";
import Protected from "@/components/Protected";
import { toast } from "@/components/Toast";
import { useAuth } from "@/hooks/useAuth";
import { fetchAppointments, createAppointment, updateAppointment } from "@/hooks/useStorage";

const SPECIALTIES = ["General Physician","Cardiologist","Neurologist","Orthopedic","Dermatologist","ENT Specialist","Pulmonologist","Gastroenterologist","Endocrinologist","Psychiatrist"];

export default function AppointmentsPage() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) fetchAppointments(token).then(setAppointments);
  }, [token]);

  const book = async () => {
    if (!date || !time) { toast("⚠️ Please select date and time"); return; }
    if (!token) return;
    setLoading(true);
    try {
      const appointment_date = new Date(`${date}T${time}:00`).toISOString();
      const newAppt = await createAppointment(token, {
        doctor_name: doctor || "TBD",
        specialty,
        appointment_date,
        notes: notes || null,
      });
      setAppointments(prev => [newAppt, ...prev]);
      setDate(""); setTime("09:00"); setNotes(""); setDoctor("");
      setShowForm(false);
      toast("✅ Appointment booked!");
    } catch (e: any) {
      toast(e.message || "Failed to book appointment");
    }
    setLoading(false);
  };

  const cancel = async (id: string) => {
    if (!token) return;
    try {
      await updateAppointment(token, id, { status: "cancelled" });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: "cancelled" } : a));
      toast("🗑️ Appointment cancelled");
    } catch {
      toast("Failed to cancel");
    }
  };

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
    catch { return iso; }
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: "1.5px solid rgba(13,148,136,.22)", fontSize: ".9rem",
    outline: "none", background: "#f0fdfa", color: "#134e4a",
    boxSizing: "border-box", fontFamily: "inherit",
  };

  return (
    <Protected>
      <div style={{ minHeight: "100vh", background: "#f0fdfa", padding: "32px 24px", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: "1.7rem", fontWeight: 700, color: "#134e4a", margin: 0 }}>📅 Appointments</h1>
            <p style={{ color: "#6b9e99", fontSize: ".88rem", margin: "4px 0 0" }}>Manage your doctor visits</p>
          </div>
          <button onClick={() => setShowForm(f => !f)} style={{
            padding: "10px 20px", background: "linear-gradient(135deg,#14b8a6,#0f766e)",
            border: "none", borderRadius: 10, color: "#fff", fontWeight: 600,
            cursor: "pointer", fontSize: ".88rem", fontFamily: "inherit",
          }}>
            {showForm ? "✕ Cancel" : "+ Book Appointment"}
          </button>
        </div>

        {showForm && (
          <div style={{ background: "#fff", borderRadius: 16, padding: "24px", marginBottom: 28, boxShadow: "0 4px 20px rgba(13,148,136,.1)", border: "1px solid rgba(13,148,136,.15)" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#134e4a", marginBottom: 18, marginTop: 0 }}>New Appointment</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ display: "block", fontSize: ".72rem", fontWeight: 600, color: "#6b9e99", textTransform: "uppercase" as const, marginBottom: 5 }}>SPECIALTY</label>
                <select value={specialty} onChange={e => setSpecialty(e.target.value)} style={inp}>
                  {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ display: "block", fontSize: ".72rem", fontWeight: 600, color: "#6b9e99", textTransform: "uppercase" as const, marginBottom: 5 }}>DOCTOR NAME (OPTIONAL)</label>
                <input value={doctor} onChange={e => setDoctor(e.target.value)} placeholder="Dr. Smith" style={inp} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: ".72rem", fontWeight: 600, color: "#6b9e99", textTransform: "uppercase" as const, marginBottom: 5 }}>DATE</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} style={inp} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: ".72rem", fontWeight: 600, color: "#6b9e99", textTransform: "uppercase" as const, marginBottom: 5 }}>TIME</label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} style={inp} />
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ display: "block", fontSize: ".72rem", fontWeight: 600, color: "#6b9e99", textTransform: "uppercase" as const, marginBottom: 5 }}>NOTES (OPTIONAL)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Reason for visit..." rows={3} style={{ ...inp, resize: "none" }} />
              </div>
            </div>
            <button onClick={book} disabled={loading || !date} style={{
              marginTop: 18, width: "100%", padding: 13,
              background: "linear-gradient(135deg,#14b8a6,#0f766e)",
              border: "none", borderRadius: 11, color: "#fff",
              fontWeight: 600, fontSize: ".95rem", cursor: "pointer",
              opacity: (loading || !date) ? .6 : 1, fontFamily: "inherit",
            }}>
              {loading ? "Booking…" : "Confirm Appointment →"}
            </button>
          </div>
        )}

        {appointments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b9e99" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📅</div>
            <p style={{ fontWeight: 600, color: "#134e4a" }}>No appointments yet</p>
            <p style={{ fontSize: ".88rem" }}>Click "+ Book Appointment" above to schedule one</p>
          </div>
        ) : appointments.map((a: any) => (
          <div key={a.id} style={{
            background: "#fff", borderRadius: 14, padding: "18px 20px", marginBottom: 12,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            boxShadow: "0 2px 12px rgba(13,148,136,.07)", border: "1px solid rgba(13,148,136,.1)",
          }}>
            <div>
              <div style={{ fontWeight: 700, color: "#134e4a" }}>
                {a.specialty || "General"}
                {(a.doctor_name || a.doctor) && <span style={{ fontWeight: 400, color: "#6b9e99" }}> — {a.doctor_name || a.doctor}</span>}
              </div>
              <div style={{ color: "#6b9e99", fontSize: ".85rem", marginTop: 4 }}>
                📅 {formatDate(a.appointment_date || a.date)}
              </div>
              {a.notes && <div style={{ color: "#4b7a75", fontSize: ".82rem", marginTop: 4, fontStyle: "italic" }}>{a.notes}</div>}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
              <span style={{
                padding: "4px 12px", borderRadius: 20, fontSize: ".78rem", fontWeight: 600,
                background: a.status === "cancelled" ? "rgba(239,68,68,.12)" : "rgba(13,148,136,.12)",
                color: a.status === "cancelled" ? "#ef4444" : "#0d9488",
              }}>{a.status || "scheduled"}</span>
              {(a.status === "scheduled" || a.status === "upcoming" || !a.status) && (
                <button onClick={() => cancel(a.id)} style={{
                  padding: "4px 12px", borderRadius: 8, fontSize: ".78rem",
                  background: "rgba(239,68,68,.1)", color: "#ef4444",
                  border: "none", cursor: "pointer", fontFamily: "inherit",
                }}>Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Protected>
  );
}
