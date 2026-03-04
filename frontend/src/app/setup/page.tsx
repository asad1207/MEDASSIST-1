"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Toast, { toast } from "@/components/Toast";
import { saveProfile } from "@/hooks/useStorage";

const CONDITIONS = ["Diabetes","Hypertension","Asthma","Heart Disease","Thyroid","Arthritis","Kidney Disease","None"];
const BLOOD = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

export default function SetupPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [conditions, setConditions] = useState<string[]>([]);
  const [customCond, setCustomCond] = useState("");
  const [allergies, setAllergies] = useState("");
  const [meds, setMeds] = useState("");
  const [sleep, setSleep] = useState("");
  const [occupation, setOccupation] = useState("");
  const [smoking, setSmoking] = useState("");
  const [exercise, setExercise] = useState("");
  const [diet, setDiet] = useState("");
  const [alcohol, setAlcohol] = useState("");
  const [blood, setBlood] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => { if (!user) router.push("/login"); }, [user]);

  const toggleCond = (c: string) => setConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const addCustomCond = () => {
    if (!customCond.trim()) return;
    if (conditions.some(c => c.toLowerCase() === customCond.trim().toLowerCase())) { toast("⚠️ Already listed"); return; }
    setConditions(prev => [...prev, customCond.trim()]);
    setCustomCond("");
    toast("✅ Added!");
  };

  const finishSetup = async () => {
    try {
      if (token) {
        await saveProfile(token, {
          blood_group: blood || null,
          height_cm: height ? parseFloat(height) : null,
          weight_kg: weight ? parseFloat(weight) : null,
          medical_conditions: [...conditions, customCond].filter(Boolean).join(", ") || null,
          allergies: allergies || null,
          current_medications: meds || null,
          exercise_frequency: exercise || null,
        });
      }
    } catch { /* optional */ }
    toast("✅ Profile saved! Welcome to MedAssist 🎉");
    setTimeout(() => router.push("/dashboard"), 800);
  };

  const stepDone = (n: number) => step > n;
  const stepCur  = (n: number) => step === n;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Toast />
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#042f2e,#0d9488)", color: "#fff", textAlign: "center", padding: "36px 24px 28px" }}>
        <div style={{ fontSize: "2rem", marginBottom: 10 }}>🏥</div>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 6 }}>Complete Your Health Profile</h2>
        <p style={{ opacity: .75, fontSize: ".88rem" }}>Helps MedAssist give you personalized guidance</p>

        {/* Step indicators */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginTop: 24 }}>
          {[1,2].map((n, i) => (
            <div key={n} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".84rem", fontWeight: 700, transition: "all .3s",
                  background: stepDone(n) ? "rgba(255,255,255,.9)" : stepCur(n) ? "#fff" : "rgba(255,255,255,.2)",
                  color: stepDone(n) || stepCur(n) ? "var(--td)" : "rgba(255,255,255,.6)",
                  boxShadow: stepCur(n) ? "0 0 0 4px rgba(255,255,255,.3)" : "none" }}>
                  {stepDone(n) ? "✓" : n}
                </div>
                <span style={{ fontSize: ".7rem", marginTop: 4, color: "rgba(255,255,255,.7)", fontWeight: 500 }}>{["Medical","Lifestyle"][n-1]}</span>
              </div>
              {i < 1 && <div style={{ width: 60, height: 2, margin: "0 4px 20px", background: stepDone(n) ? "rgba(255,255,255,.6)" : "rgba(255,255,255,.2)" }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "36px 24px 64px" }}>

        {/* Step 1 - Medical */}
        {step === 1 && (
          <div className="card">
            <h3 style={{ color: "var(--th)", marginBottom: 18, fontSize: "1rem" }}>🩺 Medical History</h3>

            <div className="fld">
              <label className="L">Blood Group</label>
              <div className="stags">
                {BLOOD.map(b => <span key={b} className={`stag ${blood === b ? "sel" : ""}`} onClick={() => setBlood(b)}>{b}</span>)}
              </div>
            </div>

            <div className="g2" style={{ marginBottom: 15 }}>
              <div className="fld" style={{ marginBottom: 0 }}>
                <label className="L">Height (cm)</label>
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="170" />
              </div>
              <div className="fld" style={{ marginBottom: 0 }}>
                <label className="L">Weight (kg)</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="65" />
              </div>
            </div>

            <div className="fld">
              <label className="L">Medical Conditions</label>
              <div className="stags">
                {CONDITIONS.map(c => <span key={c} className={`stag ${conditions.includes(c) ? "sel" : ""}`} onClick={() => toggleCond(c)}>{c}</span>)}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: ".85rem", opacity: .45 }}>✏️</span>
                  <input type="text" value={customCond} onChange={e => setCustomCond(e.target.value)} onKeyDown={e => e.key === "Enter" && addCustomCond()} placeholder="Type your condition and press Add..." style={{ paddingLeft: 34 }} />
                </div>
                <button onClick={addCustomCond} className="btn btn-sm" style={{ whiteSpace: "nowrap" }}>+ Add</button>
              </div>
              <p style={{ fontSize: ".72rem", color: "var(--tm)", marginTop: 6 }}>💡 Can't find your condition? Type it above and click <strong>Add</strong>.</p>
            </div>

            <div className="fld">
              <label className="L">Known Allergies</label>
              <input type="text" value={allergies} onChange={e => setAllergies(e.target.value)} placeholder="e.g. Penicillin, Peanuts, Latex" />
            </div>
            <div className="fld">
              <label className="L">Current Medications</label>
              <input type="text" value={meds} onChange={e => setMeds(e.target.value)} placeholder="e.g. Metformin 500mg, Amlodipine 5mg" />
            </div>

            <button className="btn" onClick={() => setStep(2)} style={{ marginTop: 6 }}>Next: Lifestyle →</button>
          </div>
        )}

        {/* Step 2 - Lifestyle */}
        {step === 2 && (
          <div className="card">
            <h3 style={{ color: "var(--th)", marginBottom: 18, fontSize: "1rem" }}>🌱 Lifestyle & Habits</h3>

            {[
              { label: "Smoking",   opts: ["🚭 Non-Smoker","🚬 Smoker","💨 Ex-Smoker"], val: smoking,  set: setSmoking  },
              { label: "Exercise",  opts: ["🏃 Daily","🚶 3-4x/week","🪑 Rarely","😴 Sedentary"],  val: exercise, set: setExercise },
              { label: "Diet",      opts: ["🥗 Vegetarian","🥩 Non-Veg","🌱 Vegan","🐟 Pescatarian"], val: diet, set: setDiet },
              { label: "Alcohol",   opts: ["✅ None","🍷 Occasional","🍺 Regular"], val: alcohol, set: setAlcohol },
            ].map(({ label, opts, val, set }) => (
              <div key={label} className="fld">
                <label className="L">{label}</label>
                <div className="stags">
                  {opts.map(o => <span key={o} className={`stag ${val === o ? "sel" : ""}`} onClick={() => set(o)}>{o}</span>)}
                </div>
              </div>
            ))}

            <div className="fld">
              <label className="L">Average Sleep</label>
              <select value={sleep} onChange={e => setSleep(e.target.value)}>
                <option value="">Select</option>
                {["Less than 5 hours","5-6 hours","7-8 hours (recommended)","More than 8 hours"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="fld">
              <label className="L">Occupation</label>
              <input type="text" value={occupation} onChange={e => setOccupation(e.target.value)} placeholder="e.g. Doctor, Engineer, Teacher..." />
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
              <button className="btn btn-o" onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</button>
              <button className="btn" onClick={finishSetup} style={{ flex: 2 }}>✅ Finish & Enter Dashboard →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
