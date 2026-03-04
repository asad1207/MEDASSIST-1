"use client";
import { useEffect, useState } from "react";
import Protected from "@/components/Protected";
import { toast } from "@/components/Toast";
import { useAuth } from "@/hooks/useAuth";
import { getMeds, saveMed, deleteMed, MedEntry } from "@/hooks/useStorage";

const FREQS = ["Once daily","Twice daily","Three times daily","Every 8 hours","Weekly","As needed"];

export default function MedicationsPage() {
  const { user } = useAuth();
  const [meds, setMeds] = useState<MedEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", dose: "", freq: "", time: "" });

  useEffect(() => { if (user) setMeds(getMeds(user.id)); }, [user]);

  const addMed = () => {
    if (!form.name || !form.dose) { toast("⚠️ Enter medicine name and dosage"); return; }
    const entry: MedEntry = { id: crypto.randomUUID(), ...form };
    saveMed(user!.id, entry);
    setMeds(getMeds(user!.id));
    setForm({ name: "", dose: "", freq: "", time: "" });
    setShowForm(false);
    toast("💊 Medication added!");
  };

  const remove = (id: string) => { deleteMed(user!.id, id); setMeds(getMeds(user!.id)); toast("🗑️ Removed"); };

  return (
    <Protected>
      <div className="wrap" style={{ paddingTop: 36 }}>
        <div className="sec"><h2>💊 Medication <span>Reminders</span></h2><p>Track your medicines and never miss a dose</p></div>

        <div className="alert ab" style={{ marginBottom: 24 }}>
          <span className="ai-icon">💡</span>
          <div>Always consult your doctor before starting, stopping, or changing medications.</div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
          <button className="btn btn-sm" onClick={() => setShowForm(!showForm)}>{showForm ? "✕ Cancel" : "+ Add Medication"}</button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: 24, borderColor: "rgba(13,148,136,.2)" }}>
            <h3 style={{ fontSize: ".93rem", fontWeight: 600, color: "var(--th)", marginBottom: 16 }}>New Medication</h3>
            <div className="g2">
              <div className="fld">
                <label className="L">Medicine Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Metformin" />
              </div>
              <div className="fld">
                <label className="L">Dosage *</label>
                <input type="text" value={form.dose} onChange={e => setForm(f => ({ ...f, dose: e.target.value }))} placeholder="e.g. 500mg" />
              </div>
              <div className="fld">
                <label className="L">Frequency</label>
                <select value={form.freq} onChange={e => setForm(f => ({ ...f, freq: e.target.value }))}>
                  <option value="">Select</option>
                  {FREQS.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="fld">
                <label className="L">Time</label>
                <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
              </div>
            </div>
            <button className="btn btn-sm" onClick={addMed}>💊 Add Medication</button>
          </div>
        )}

        {/* Med list */}
        {meds.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--tm)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>💊</div>
            <p>No medications added yet.<br />Click <strong>+ Add Medication</strong> to get started.</p>
          </div>
        ) : (
          <div id="medList">
            {meds.map(m => (
              <div key={m.id} className="hi">
                <div>
                  <div className="hid">{m.freq || "As prescribed"}{m.time ? ` · ${m.time}` : ""}</div>
                  <div className="hit">💊 {m.name} {m.dose}</div>
                  <div className="his">Added to your medication list</div>
                </div>
                <div className="hir">
                  <span className="bdg bb">Active</span>
                  <button onClick={() => remove(m.id)} style={{ background: "none", border: "none", color: "var(--tm)", fontSize: ".75rem", cursor: "pointer", padding: "2px 6px" }}>🗑️ Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Medication tips */}
        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: ".93rem", fontWeight: 600, color: "var(--th)", marginBottom: 14 }}>📋 Medication Safety Tips</h3>
          <div className="tl">
            {["Take medications at the same time every day for consistency.","Store medications in a cool, dry place away from direct sunlight.","Never share prescription medications with others.","Keep a list of all medications when visiting healthcare providers.","Set phone alarms as backup reminders for critical medications."].map(tip => (
              <div key={tip} className="tli">
                <div className="tlt">{tip}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Protected>
  );
}
