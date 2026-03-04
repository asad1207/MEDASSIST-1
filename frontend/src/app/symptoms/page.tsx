"use client";
import { useState } from "react";
import Protected from "@/components/Protected";
import { toast } from "@/components/Toast";
import { useAuth } from "@/hooks/useAuth";
import { analyzeWithBackend } from "@/hooks/useStorage";
import { useRouter } from "next/navigation";

const SYMPTOM_TAGS = [
  "🤒 Fever","🤕 Headache","😮‍💨 Shortness of Breath","🤧 Runny Nose",
  "😴 Fatigue","🤢 Nausea","😵 Dizziness","💔 Chest Pain",
  "🦴 Body Aches","🤮 Vomiting","🤧 Sore Throat","🫁 Cough",
  "😰 Sweating","🧠 Confusion","🦷 Toothache","🤸 Joint Pain",
  "🩸 Bleeding","👁️ Blurred Vision","👂 Ear Pain","🫀 Palpitations",
];

export default function SymptomsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [customText, setCustomText] = useState("");
  const [severity, setSeverity] = useState<"Mild"|"Moderate"|"Severe">("Moderate");
  const [duration, setDuration] = useState("");
  const [temp, setTemp] = useState("");
  const [exposure, setExposure] = useState("");
  const [medInput, setMedInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [allSymptoms, setAllSymptoms] = useState<string[]>([]);

  const tog = (t: string) => setSelected(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const symNext = () => {
    if (selected.length === 0 && !customText.trim()) { toast("⚠️ Please select or describe at least one symptom"); return; }
    setStep(2);
  };

  const symAnalyze = async () => {
    setStep(0); // loading
    setLoading(true);
    const syms = [...selected.map(s => s.replace(/^[^\w]*/,"").trim()), ...(customText.trim() ? [customText.trim()] : [])];
    setAllSymptoms(syms);
    try {
      const r = await analyzeWithBackend(token!, {
        symptoms: syms,
        severity,
        duration: duration || undefined,
        temperature: temp ? parseFloat(temp) : null,
      });
      // normalise backend response to match what the UI expects
      setResult({
        risk: r.risk_level?.toLowerCase() || "mild",
        risk_score: r.risk_score || 0,
        guidance: r.ai_recommendation || "",
      });
      setStep(3);
    } catch {
      toast("Analysis failed. Please try again.");
      setStep(1);
    }
    setLoading(false);
  };

  const saveHist = () => {
    // Backend already saved this when analyze was called
    toast("✅ Saved to history!");
    setTimeout(() => router.push("/history"), 900);
  };

  const symReset = () => { setStep(1); setSelected([]); setCustomText(""); setSeverity("Moderate"); setDuration(""); setTemp(""); setResult(null); };

  const ss = (n: number) => step > n ? "done" : step === n ? "cur" : "idle";

  return (
    <Protected>
      <div className="wrap" style={{ paddingTop: 36 }}>
        <div className="sec"><h2>🔍 AI <span>Symptom Checker</span></h2><p>Describe your symptoms and receive AI-guided health insights</p></div>

        <div className="alert aa"><span className="ai-icon">⚠️</span><div><strong>Important:</strong> AI guidance only — not a substitute for professional medical advice. Consult a doctor for proper diagnosis.</div></div>

        {/* Step indicator */}
        <div className="ssteps">
          {[1,2,3].map((n, i) => (
            <div key={n} style={{ display: "flex", alignItems: "center" }}>
              <div className="scol">
                <div className={`scirc ${ss(n)}`}>{step > n ? "✓" : n}</div>
                <span className="sclabel">{["Symptoms","Details","Results"][n-1]}</span>
              </div>
              {i < 2 && <div className={`sln ${step > n ? "done" : "idle"}`} />}
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {/* Step 1 */}
          {step === 1 && (
            <div className="card">
              <h3 style={{ color: "var(--th)", marginBottom: 5 }}>Step 1 — Select Symptoms</h3>
              <p style={{ fontSize: ".83rem", color: "var(--tm)", marginBottom: 14 }}>Tap all that apply. You can also type below.</p>
              <div className="stags">
                {SYMPTOM_TAGS.map(t => <span key={t} className={`stag ${selected.includes(t) ? "sel" : ""}`} onClick={() => tog(t)}>{t}</span>)}
              </div>
              <div className="fld" style={{ marginTop: 14 }}>
                <label className="L">Or describe in your own words</label>
                <textarea value={customText} onChange={e => setCustomText(e.target.value)} placeholder="e.g. Sharp pain in lower back for 2 days..." style={{ minHeight: 80 }} />
              </div>
              <button className="btn" onClick={symNext} style={{ marginTop: 6 }}>Next: Add Details →</button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="card">
              <h3 style={{ color: "var(--th)", marginBottom: 14 }}>Step 2 — Additional Details</h3>
              <div className="fld">
                <label className="L">Severity</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["Mild","Moderate","Severe"] as const).map(s => (
                    <button key={s} className={`sevbtn ${s.toLowerCase()} ${severity === s ? "on" : ""}`} onClick={() => setSeverity(s)}>
                      {s === "Mild" ? "😊" : s === "Moderate" ? "😟" : "😰"} {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="g2">
                <div className="fld">
                  <label className="L">Duration</label>
                  <select value={duration} onChange={e => setDuration(e.target.value)}>
                    <option value="">Select</option>
                    {["Less than 24 hours","1-3 days","4-7 days","1-2 weeks","More than 2 weeks"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="fld">
                  <label className="L">Temperature (°C)</label>
                  <input type="number" value={temp} onChange={e => setTemp(e.target.value)} placeholder="38.5" step="0.1" min="34" max="42" />
                </div>
              </div>
              <div className="fld">
                <label className="L">Recent travel or exposure?</label>
                <input type="text" value={exposure} onChange={e => setExposure(e.target.value)} placeholder="e.g. Travel abroad, contact with sick person..." />
              </div>
              <div className="fld">
                <label className="L">Current medications?</label>
                <input type="text" value={medInput} onChange={e => setMedInput(e.target.value)} placeholder="e.g. Paracetamol, Metformin..." />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                <button className="btn btn-o" onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</button>
                <button className="btn" onClick={symAnalyze} style={{ flex: 2 }}>Analyze with AI 🤖</button>
              </div>
            </div>
          )}

          {/* Loading */}
          {step === 0 && (
            <div className="card" style={{ textAlign: "center", padding: 48 }}>
              <div className="spinner" style={{ marginBottom: 18 }} />
              <p style={{ color: "var(--tm)" }}>🤖 AI is analyzing your symptoms...<br /><small>Checking risk factors · Generating guidance</small></p>
            </div>
          )}

          {/* Step 3 - Results */}
          {step === 3 && result && (
            <div>
              <div className={`rcard ${result.cls}`}>
                <div className="rlevel" style={{ color: result.color }}>{result.level_label}</div>
                <div className="rtitle">Assessment Results</div>
                <p style={{ fontSize: ".9rem", lineHeight: 1.7, color: "var(--tb)", marginBottom: 14 }}>{result.guidance}</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
                  <span className="bdg bt">Symptoms: {allSymptoms.slice(0,2).join(", ")}{allSymptoms.length > 2 ? ` +${allSymptoms.length-2}` : ""}</span>
                  <span className="bdg ba">Severity: {severity}</span>
                  {duration && <span className="bdg bb">Duration: {duration}</span>}
                  {temp && <span className="bdg br">Temp: {temp}°C</span>}
                </div>
                <ul className="rsugg">
                  {result.suggestions.map(s => <li key={s}>{s}</li>)}
                </ul>

                {/* AI Review box */}
                <div className="airbox">
                  <div className="airhdr">
                    <div className="airtitle">🤖 AI Guidance</div>
                    <span className="airpend">⏳ Pending Human Review</span>
                  </div>
                  <p style={{ fontSize: ".83rem", color: "#4c1d95", lineHeight: 1.6 }}>
                    This analysis was generated by MedAssist AI based on your symptoms and health profile.
                    <strong> It has not yet been reviewed by a licensed physician.</strong> A qualified healthcare professional will validate this guidance before it is marked as approved.
                  </p>
                </div>
              </div>

              <div className="card" style={{ textAlign: "center", marginTop: 16 }}>
                <p style={{ fontSize: ".84rem", color: "var(--tm)", marginBottom: 14 }}>What would you like to do next?</p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="btn btn-sm" onClick={saveHist}>💾 Save to History</button>
                  <button className="btn btn-o btn-sm" onClick={() => router.push("/history")}>📊 View History</button>
                  <button className="btn btn-o btn-sm" onClick={symReset}>🔄 Check Again</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Protected>
  );
}
