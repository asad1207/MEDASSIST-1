"use client";
import { useState } from "react";
import Protected from "@/components/Protected";

const TRIAGE_CONTENT = {
  home: { cls: "ag", icon: "🏠", title: "Home Care Recommended", msg: "Your symptoms appear manageable at home. Rest, stay hydrated, and use OTC medication as needed. If symptoms worsen after 48 hours, consult a doctor." },
  doctor: { cls: "aa", icon: "👨‍⚕️", title: "Doctor Visit Recommended", msg: "Your symptoms need professional attention. Please schedule an appointment within 24 hours or visit an urgent care clinic. Bring your medication list." },
  emergency: { cls: "ar", icon: "🚨", title: "EMERGENCY — Act Now!", msg: "Call 112 or 911 immediately. Do not drive yourself. Stay calm, have someone with you, and follow emergency services' instructions. This app cannot handle emergencies." },
};

export default function TriagePage() {
  const [result, setResult] = useState<keyof typeof TRIAGE_CONTENT | null>(null);

  const r = result ? TRIAGE_CONTENT[result] : null;

  return (
    <Protected>
      <div className="wrap" style={{ paddingTop: 36 }}>
        <div className="sec"><h2>🚑 Medical <span>Triage</span></h2><p>Quickly assess the level of care you need</p></div>

        <div className="alert ar" style={{ marginBottom: 28 }}>
          <span className="ai-icon">🚨</span>
          <div><strong>Emergency?</strong> Chest pain, difficulty breathing, loss of consciousness — call <strong>112 / 911 immediately.</strong></div>
        </div>

        <div className="g3" style={{ marginBottom: 28 }}>
          {[
            { key: "home",      color: "var(--grn)", emoji: "🏠", title: "Home Care",     desc: "Mild symptoms, manageable at home.",                      bdg: "bg", bdgLabel: "Self-treatable"   },
            { key: "doctor",    color: "var(--amb)", emoji: "👨‍⚕️", title: "Doctor Visit", desc: "Needs professional evaluation within 24-48 hours.",       bdg: "ba", bdgLabel: "Needs attention"  },
            { key: "emergency", color: "var(--red)", emoji: "🏥", title: "Emergency",     desc: "Critical — go to ER or call emergency services now.",     bdg: "br", bdgLabel: "Urgent!"           },
          ].map(({ key, color, emoji, title, desc, bdg, bdgLabel }) => (
            <div key={key} className="card card-hover" style={{ borderTop: `4px solid ${color}`, textAlign: "center", cursor: "pointer" }}
              onClick={() => { setResult(key as any); setTimeout(() => document.getElementById("triageResult")?.scrollIntoView({ behavior: "smooth" }), 100); }}>
              <div style={{ fontSize: "2.4rem", marginBottom: 10 }}>{emoji}</div>
              <h3 style={{ color: "var(--th)" }}>{title}</h3>
              <p style={{ fontSize: ".83rem", margin: "8px 0" }}>{desc}</p>
              <span className={`bdg ${bdg}`}>{bdgLabel}</span>
            </div>
          ))}
        </div>

        {/* Triage Result */}
        {r && (
          <div id="triageResult">
            <div className={`alert ${r.cls}`} style={{ padding: 20, borderRadius: 14 }}>
              <span style={{ fontSize: "1.5rem" }}>{r.icon}</span>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{r.title}</div>
                <div style={{ lineHeight: 1.6 }}>{r.msg}</div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed triage questionnaire */}
        <div className="card" style={{ marginTop: 28 }}>
          <h3 style={{ color: "var(--th)", marginBottom: 16, fontSize: ".95rem" }}>🩺 Guided Triage Questionnaire</h3>
          <p style={{ fontSize: ".85rem", color: "var(--tm)", marginBottom: 16 }}>Answer these quick questions for a more accurate assessment.</p>

          {[
            { q: "Are you experiencing chest pain or pressure?", levels: ["No", "Mild", "Severe — call 911"] },
            { q: "Do you have difficulty breathing?",            levels: ["No", "Slightly", "Cannot breathe normally"] },
            { q: "Have you lost consciousness or feel faint?",   levels: ["No", "Briefly", "Yes, currently"] },
            { q: "Is there uncontrolled bleeding?",              levels: ["No", "Minor", "Yes, significant"] },
            { q: "Current level of pain (0-10)?",               levels: ["0-3", "4-6", "7-10"] },
          ].map(({ q, levels }) => (
            <div key={q} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid rgba(13,148,136,.1)" }}>
              <p style={{ fontSize: ".87rem", fontWeight: 500, color: "var(--th)", marginBottom: 10 }}>{q}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {levels.map((l, i) => (
                  <button key={l} className="stag" onClick={e => { (e.target as HTMLElement).classList.toggle("sel"); }}
                    style={{ borderColor: i === 2 ? "rgba(239,68,68,.3)" : i === 1 ? "rgba(245,158,11,.3)" : undefined }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="alert ab" style={{ marginTop: 20 }}>
          <span className="ai-icon">ℹ️</span>
          <div>This triage tool provides general guidance only. It cannot diagnose medical conditions. In doubt, always seek professional medical care immediately.</div>
        </div>
      </div>
    </Protected>
  );
}
