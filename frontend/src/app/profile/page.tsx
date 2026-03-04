"use client";
import { useState } from "react";
import Protected from "@/components/Protected";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/Toast";
import { saveProfile } from "@/hooks/useStorage";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, updateUser, logout, token } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"info"|"medical"|"ai">("info");
  const [editPersonal, setEditPersonal] = useState(false);
  const [editMedical, setEditMedical] = useState(false);

  // Personal edit state
  const [pForm, setPForm] = useState({ full_name: user?.full_name||"", age: user?.age||"", gender: user?.gender||"", blood_group: user?.blood_group||"", height: user?.height||"", weight: user?.weight||"", phone: user?.phone||"", emergency: user?.emergency||"", occupation: user?.occupation||"" });
  // Medical edit state
  const [mAllerg, setMAllerg] = useState(user?.allergies||"");
  const [mMeds, setMMeds]     = useState(user?.medications||"");
  const [mSleep, setMSleep]   = useState(user?.sleep||"");

  if (!user) return null;

  const initials = user.full_name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) || "?";

  const savePersonal = async () => {
    updateUser(pForm); // update local cache
    try {
      if (token) await saveProfile(token, {
        age: pForm.age ? parseInt(pForm.age) : null,
        gender: pForm.gender || null,
        blood_group: pForm.blood_group || null,
        height_cm: pForm.height ? parseFloat(pForm.height) : null,
        weight_kg: pForm.weight ? parseFloat(pForm.weight) : null,
        emergency_contact_name: pForm.emergency || null,
      });
    } catch {}
    setEditPersonal(false);
    toast("✅ Personal info saved!");
  };

  const saveMedical = async () => {
    updateUser({ allergies: mAllerg, medications: mMeds, sleep: mSleep });
    try {
      if (token) await saveProfile(token, {
        allergies: mAllerg || null,
        current_medications: mMeds || null,
      });
    } catch {}
    setEditMedical(false);
    toast("✅ Medical info saved!");
  };

  const InfoItem = ({ label, value }: { label: string; value?: string }) => (
    <div className="ii">
      <div className="iil">{label}</div>
      <div className="iiv">{value || <span style={{ color: "var(--tm)", fontWeight: 400 }}>—</span>}</div>
    </div>
  );

  return (
    <Protected>
      <div className="wrap" style={{ paddingTop: 36 }}>
        {/* Profile header */}
        <div className="card" style={{ textAlign: "center", marginBottom: 24, padding: "32px 28px" }}>
          <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg,var(--tl),var(--td))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", color: "#fff", fontWeight: 700, boxShadow: "0 8px 24px rgba(13,148,136,.3)", margin: "0 auto 12px" }}>
            {initials}
          </div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--th)", marginBottom: 4 }}>{user.full_name}</h2>
          <p style={{ color: "var(--tm)", fontSize: ".88rem", marginBottom: 14 }}>{user.email}</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {user.age    && <span className="bdg bt">Age: {user.age}</span>}
            {user.gender && <span className="bdg bb">{user.gender}</span>}
            {user.blood_group && <span className="bdg br">Blood: {user.blood_group}</span>}
            {user.occupation && <span className="bdg bp">{user.occupation}</span>}
          </div>
        </div>

        {/* Tabs */}
        <div className="ptabs">
          {(["info","medical","ai"] as const).map(t => (
            <button key={t} className={`pt ${tab === t ? "on" : ""}`} onClick={() => setTab(t)}>
              {t === "info" ? "👤 Personal" : t === "medical" ? "🩺 Medical" : "🤖 AI Analysis"}
            </button>
          ))}
        </div>

        {/* Personal Tab */}
        {tab === "info" && (
          <div>
            {!editPersonal ? (
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <h3 style={{ fontSize: ".95rem", fontWeight: 600, color: "var(--th)" }}>Personal Information</h3>
                  <button className="btn btn-o btn-sm" onClick={() => setEditPersonal(true)}>✏️ Edit</button>
                </div>
                <div className="ig">
                  <InfoItem label="Full Name"        value={user.full_name} />
                  <InfoItem label="Age"              value={user.age ? `${user.age} years` : undefined} />
                  <InfoItem label="Gender"           value={user.gender} />
                  <InfoItem label="Blood Group"      value={user.blood_group} />
                  <InfoItem label="Height"           value={user.height ? `${user.height} cm` : undefined} />
                  <InfoItem label="Weight"           value={user.weight ? `${user.weight} kg` : undefined} />
                  <InfoItem label="Phone"            value={user.phone} />
                  <InfoItem label="Emergency Contact"value={user.emergency} />
                  <InfoItem label="Occupation"       value={user.occupation} />
                </div>
              </div>
            ) : (
              <div className="card">
                <h3 style={{ fontSize: ".95rem", fontWeight: 600, color: "var(--th)", marginBottom: 18 }}>Edit Personal Info</h3>
                <div className="g2">
                  {([["full_name","Full Name","text"],["age","Age","number"],["gender","Gender","text"],["blood_group","Blood Group","text"],["height","Height (cm)","number"],["weight","Weight (kg)","number"],["phone","Phone","text"],["emergency","Emergency Contact","text"],["occupation","Occupation","text"]] as [string,string,string][]).map(([k,lbl,type]) => (
                    <div key={k} className="fld" style={{ marginBottom: 12 }}>
                      <label className="L">{lbl}</label>
                      <input type={type} value={(pForm as any)[k]} onChange={e => setPForm(f => ({ ...f, [k]: e.target.value }))} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn btn-o btn-sm" onClick={() => setEditPersonal(false)}>Cancel</button>
                  <button className="btn btn-sm" onClick={savePersonal}>✅ Save</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Medical Tab */}
        {tab === "medical" && (
          <div>
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ fontSize: ".95rem", fontWeight: 600, color: "var(--th)" }}>Medical History</h3>
                <button className="btn btn-o btn-sm" onClick={() => setEditMedical(!editMedical)}>{editMedical ? "Cancel" : "✏️ Edit"}</button>
              </div>

              {!editMedical ? (
                <div>
                  <div className="ig" style={{ marginBottom: 16 }}>
                    <InfoItem label="Conditions"  value={user.conditions?.filter(c => c !== "None").join(", ") || "None reported"} />
                    <InfoItem label="Allergies"   value={user.allergies || "None reported"} />
                    <InfoItem label="Medications" value={user.medications || "None reported"} />
                    <InfoItem label="Sleep"       value={user.sleep} />
                  </div>
                  <div>
                    <div className="iil" style={{ marginBottom: 8 }}>Lifestyle</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {user.lifestyle?.filter(Boolean).map(l => <span key={l} className="bdg bt">{l}</span>) || <span style={{ color: "var(--tm)", fontSize: ".85rem" }}>Not set</span>}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="fld">
                    <label className="L">Allergies</label>
                    <input type="text" value={mAllerg} onChange={e => setMAllerg(e.target.value)} placeholder="e.g. Penicillin, Peanuts" />
                  </div>
                  <div className="fld">
                    <label className="L">Current Medications</label>
                    <input type="text" value={mMeds} onChange={e => setMMeds(e.target.value)} placeholder="e.g. Metformin 500mg" />
                  </div>
                  <div className="fld">
                    <label className="L">Average Sleep</label>
                    <select value={mSleep} onChange={e => setMSleep(e.target.value)}>
                      <option value="">Select</option>
                      {["Less than 5 hours","5-6 hours","7-8 hours (recommended)","More than 8 hours"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <button className="btn btn-sm" onClick={saveMedical}>✅ Save Medical Info</button>
                </div>
              )}
            </div>

            <div className="card" style={{ marginTop: 20 }}>
              <h3 style={{ fontSize: ".93rem", fontWeight: 600, color: "var(--th)", marginBottom: 14 }}>⚠️ Medical Alert</h3>
              <div className="alert aa">
                <span className="ai-icon">💊</span>
                <div>Always inform your healthcare provider about all conditions, allergies, and medications listed here during consultations.</div>
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Tab */}
        {tab === "ai" && (
          <div>
            <div className="card">
              <h3 style={{ fontSize: ".95rem", fontWeight: 600, color: "var(--th)", marginBottom: 16 }}>🤖 AI Health Insights</h3>
              <div style={{ background: "linear-gradient(135deg,rgba(139,92,246,.08),rgba(99,102,241,.04))", border: "1.5px solid rgba(139,92,246,.22)", borderRadius: 13, padding: "18px 20px", marginBottom: 16 }}>
                <div style={{ fontSize: ".8rem", fontWeight: 700, color: "#4c1d95", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 10 }}>🤖 Profile Analysis</div>
                <p style={{ fontSize: ".85rem", color: "#4c1d95", lineHeight: 1.7 }}>
                  Based on your profile, MedAssist has generated personalized health insights. These are AI-generated recommendations only and should not replace professional medical advice.
                </p>
              </div>

              {user.conditions && user.conditions.filter(c => c !== "None").length > 0 && (
                <div className="alert aa" style={{ marginBottom: 12 }}>
                  <span className="ai-icon">🔔</span>
                  <div>You have listed <strong>{user.conditions.filter(c => c !== "None").join(", ")}</strong>. Regular monitoring and check-ups are recommended.</div>
                </div>
              )}

              {user.lifestyle?.includes("🚬 Smoker") && (
                <div className="alert ar" style={{ marginBottom: 12 }}>
                  <span className="ai-icon">🚬</span>
                  <div>Smoking significantly increases cardiovascular and respiratory risks. Consider consulting a healthcare provider for cessation support.</div>
                </div>
              )}

              <div className="alert ag">
                <span className="ai-icon">✅</span>
                <div>Your profile is {user.setupDone ? "complete" : "incomplete"}. {!user.setupDone && <><a href="/setup" style={{ color: "var(--grn)", fontWeight: 600 }}>Complete setup →</a> for better AI insights.</>}</div>
              </div>
            </div>

            <div className="card" style={{ marginTop: 20 }}>
              <h3 style={{ fontSize: ".93rem", fontWeight: 600, color: "var(--th)", marginBottom: 14 }}>🔐 Account</h3>
              <button className="btn btn-o btn-sm" onClick={logout} style={{ color: "var(--red)", borderColor: "var(--red)" }}>Sign Out of MedAssist</button>
            </div>
          </div>
        )}
      </div>
    </Protected>
  );
}
