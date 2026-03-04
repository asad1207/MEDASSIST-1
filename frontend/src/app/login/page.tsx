"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, register } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("login");

  // Login form
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup form
  const [rForm, setRForm] = useState({ full_name: "", phone: "", email: "", age: "", gender: "", password: "" });
  const [signupErr, setSignupErr] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  const doLogin = async () => {
    setLoginErr(""); setLoginLoading(true);
    try {
      await login(email, pass);
      router.push("/dashboard");
    } catch (e: any) { setLoginErr(e.message); }
    finally { setLoginLoading(false); }
  };

  const doSignup = async () => {
    if (!rForm.full_name || !rForm.email || !rForm.password) { setSignupErr("Please fill required fields"); return; }
    setSignupErr(""); setSignupLoading(true);
    try {
      await register({ full_name: rForm.full_name, email: rForm.email, password: rForm.password, age: rForm.age, gender: rForm.gender });
      router.push("/setup");
    } catch (e: any) { setSignupErr(e.message); }
    finally { setSignupLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ position: "fixed", inset: 0, background: "linear-gradient(135deg,#042f2e 0%,#065f46 40%,#0d9488 80%,#134e4a 100%)", zIndex: 0 }} />
      <div style={{ position: "fixed", inset: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 48px,rgba(255,255,255,.03) 48px,rgba(255,255,255,.03) 50px),repeating-linear-gradient(90deg,transparent,transparent 48px,rgba(255,255,255,.03) 48px,rgba(255,255,255,.03) 50px)", zIndex: 0 }} />

      {/* Orbs */}
      <div style={{ position: "fixed", width: 450, height: 450, background: "#14b8a6", borderRadius: "50%", filter: "blur(80px)", opacity: .3, top: -120, right: -80, zIndex: 0, animation: "drift 8s ease-in-out infinite alternate" }} />
      <div style={{ position: "fixed", width: 320, height: 320, background: "#059669", borderRadius: "50%", filter: "blur(80px)", opacity: .3, bottom: -90, left: -70, zIndex: 0, animation: "drift 8s ease-in-out infinite alternate", animationDelay: "3s" }} />

      {/* Floating crosses */}
      {["5%|10%|0s|1.4rem","88%|18%|2s|2.3rem","14%|80%|4s|1.1rem","74%|72%|1s|2rem","50%|6%|3s|1.7rem"].map((c, i) => {
        const [l, t, d, fs] = c.split("|");
        return <div key={i} style={{ position: "fixed", left: l, top: t, fontSize: fs, opacity: .06, color: "#fff", animation: `floatX 12s ease-in-out infinite`, animationDelay: d, zIndex: 0, pointerEvents: "none" }}>✚</div>;
      })}

      {/* Card */}
      <div style={{ position: "relative", zIndex: 10, width: 440, background: "rgba(255,255,255,.12)", backdropFilter: "blur(28px)", border: "1px solid rgba(255,255,255,.22)", borderRadius: 24, padding: "40px 38px", boxShadow: "0 32px 64px rgba(0,0,0,.4)", animation: "fadeUp .6s ease both" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 5 }}>
          <div style={{ width: 42, height: 42, background: "linear-gradient(135deg,var(--tl),var(--td))", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", boxShadow: "0 4px 16px rgba(13,148,136,.5)" }}>🩺</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", fontWeight: 700, color: "#fff" }}>Med<span style={{ color: "var(--tl)" }}>Assist</span></div>
        </div>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,.6)", fontSize: ".8rem", fontWeight: 300, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 24 }}>Your trusted AI healthcare companion</p>

        {/* Tabs */}
        <div style={{ display: "flex", background: "rgba(255,255,255,.1)", borderRadius: 10, padding: 4, marginBottom: 20, gap: 4 }}>
          {(["login", "signup"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: 9, border: "none", borderRadius: 7, fontSize: ".84rem", fontWeight: 500, cursor: "pointer", transition: "all .25s", background: tab === t ? "rgba(255,255,255,.9)" : "transparent", color: tab === t ? "var(--td)" : "rgba(255,255,255,.65)" }}>
              {t === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {/* Login Form */}
        {tab === "login" && (
          <div>
            {loginErr && <div style={{ background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.4)", color: "#fca5a5", borderRadius: 9, padding: "8px 14px", fontSize: ".81rem", textAlign: "center", marginBottom: 12 }}>{loginErr}</div>}
            {[["email","✉️","Email","you@hospital.com","email"],["password","🔒","Password","••••••••","password"]].map(([id, ico, lbl, ph, type]) => (
              <div key={id} style={{ marginBottom: 13 }}>
                <label style={{ display: "block", fontSize: ".73rem", fontWeight: 600, color: "rgba(255,255,255,.5)", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 5 }}>{lbl}</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: ".88rem", opacity: .4, pointerEvents: "none" }}>{ico}</span>
                  <input type={type} value={id === "email" ? email : pass} onChange={e => id === "email" ? setEmail(e.target.value) : setPass(e.target.value)}
                    placeholder={ph} onKeyDown={e => e.key === "Enter" && doLogin()}
                    style={{ width: "100%", padding: "11px 14px 11px 36px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 11, color: "#fff", fontSize: ".91rem", outline: "none" }} />
                </div>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "4px 0 18px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: ".79rem", color: "rgba(255,255,255,.55)", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ accentColor: "var(--tl)", width: 14, height: 14 }} /> Remember me
              </label>
              <a href="#" style={{ fontSize: ".79rem", color: "var(--tl)", fontWeight: 500 }}>Forgot password?</a>
            </div>
            <button onClick={doLogin} disabled={loginLoading} style={{ width: "100%", padding: 13, background: "linear-gradient(135deg,var(--tl),var(--td))", border: "none", borderRadius: 11, color: "#fff", fontSize: ".94rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 20px rgba(13,148,136,.45)", transition: "all .2s", marginBottom: 4 }}>
              {loginLoading ? "Signing in…" : "Sign In Securely →"}
            </button>
            <p style={{ textAlign: "center", marginTop: 10, fontSize: ".76rem", color: "rgba(255,255,255,.35)" }}>Demo: demo@medassist.ai / demo123</p>
          </div>
        )}

        {/* Signup Form */}
        {tab === "signup" && (
          <div>
            {signupErr && <div style={{ background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.4)", color: "#fca5a5", borderRadius: 9, padding: "8px 14px", fontSize: ".81rem", textAlign: "center", marginBottom: 12 }}>{signupErr}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 13 }}>
              {[["full_name","👤","Full Name *","e.g. Riya Sharma","text"],["phone","📱","Phone","+91 98765...","text"]].map(([k, ico, lbl, ph, type]) => (
                <div key={k}>
                  <label style={{ display: "block", fontSize: ".73rem", fontWeight: 600, color: "rgba(255,255,255,.5)", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 5 }}>{lbl}</label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: ".88rem", opacity: .4, pointerEvents: "none" }}>{ico}</span>
                    <input type={type} value={(rForm as any)[k]} onChange={e => setRForm(f => ({ ...f, [k]: e.target.value }))} placeholder={ph}
                      style={{ width: "100%", padding: "11px 14px 11px 36px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 11, color: "#fff", fontSize: ".91rem", outline: "none" }} />
                  </div>
                </div>
              ))}
            </div>
            {[["email","✉️","Email *","you@hospital.com","email"]].map(([k, ico, lbl, ph, type]) => (
              <div key={k} style={{ marginBottom: 13 }}>
                <label style={{ display: "block", fontSize: ".73rem", fontWeight: 600, color: "rgba(255,255,255,.5)", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 5 }}>{lbl}</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: ".88rem", opacity: .4, pointerEvents: "none" }}>{ico}</span>
                  <input type={type} value={(rForm as any)[k]} onChange={e => setRForm(f => ({ ...f, [k]: e.target.value }))} placeholder={ph}
                    style={{ width: "100%", padding: "11px 14px 11px 36px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 11, color: "#fff", fontSize: ".91rem", outline: "none" }} />
                </div>
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 13 }}>
              <div>
                <label style={{ display: "block", fontSize: ".73rem", fontWeight: 600, color: "rgba(255,255,255,.5)", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 5 }}>Age *</label>
                <input type="number" value={rForm.age} onChange={e => setRForm(f => ({ ...f, age: e.target.value }))} placeholder="28"
                  style={{ width: "100%", padding: "10px 13px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 11, color: "#fff", fontSize: ".88rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: ".73rem", fontWeight: 600, color: "rgba(255,255,255,.5)", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 5 }}>Gender *</label>
                <select value={rForm.gender} onChange={e => setRForm(f => ({ ...f, gender: e.target.value }))}
                  style={{ width: "100%", padding: "10px 13px", background: "rgba(10,50,46,.75)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 11, color: "rgba(255,255,255,.85)", fontSize: ".88rem", outline: "none" }}>
                  <option value="">Select</option>
                  {["Male","Female","Non-binary","Prefer not to say"].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 13 }}>
              <label style={{ display: "block", fontSize: ".73rem", fontWeight: 600, color: "rgba(255,255,255,.5)", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 5 }}>Password *</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: ".88rem", opacity: .4, pointerEvents: "none" }}>🔒</span>
                <input type="password" value={rForm.password} onChange={e => setRForm(f => ({ ...f, password: e.target.value }))} placeholder="Min. 6 characters"
                  style={{ width: "100%", padding: "11px 14px 11px 36px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 11, color: "#fff", fontSize: ".91rem", outline: "none" }} />
              </div>
            </div>
            <button onClick={doSignup} disabled={signupLoading} style={{ width: "100%", padding: 13, background: "linear-gradient(135deg,var(--tl),var(--td))", border: "none", borderRadius: 11, color: "#fff", fontSize: ".94rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 20px rgba(13,148,136,.45)", transition: "all .2s" }}>
              {signupLoading ? "Creating…" : "Next: Complete Health Profile →"}
            </button>
          </div>
        )}

        {/* Trust badges */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,.1)" }}>
          {["🔐 HIPAA","🛡️ SSL","✅ ISO 27001"].map(b => (
            <span key={b} style={{ fontSize: ".69rem", color: "rgba(255,255,255,.32)", display: "flex", alignItems: "center", gap: 4 }}>{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
