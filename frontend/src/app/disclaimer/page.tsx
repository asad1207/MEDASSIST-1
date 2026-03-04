"use client";
import Protected from "@/components/Protected";

const SECTIONS = [
  {
    icon: "⚕️", title: "Medical Disclaimer",
    content: "MedAssist is an AI-powered tool designed to provide general health information and preliminary symptom assessment. It is NOT a licensed medical device, and the information provided does NOT constitute professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider.",
  },
  {
    icon: "🤖", title: "AI Limitations",
    content: "Our AI model is trained on general medical knowledge and cannot account for individual medical history, physical examination findings, or laboratory results. AI-generated assessments may be inaccurate and should be used only as a starting point for conversation with a healthcare professional.",
  },
  {
    icon: "🚨", title: "Emergency Situations",
    content: "MedAssist is NOT suitable for emergency medical situations. If you are experiencing a medical emergency — including chest pain, difficulty breathing, loss of consciousness, severe bleeding, or stroke symptoms — call emergency services (112 or 911) immediately. Do not use this app in place of emergency care.",
  },
  {
    icon: "🔒", title: "Data Privacy",
    content: "Your health data is stored locally and encrypted. We do not sell your personal health information to third parties. By using MedAssist, you consent to the collection and processing of your health information for the purpose of providing AI-guided health insights.",
  },
  {
    icon: "📋", title: "Intended Use",
    content: "MedAssist is intended for informational and educational purposes only. It may help you identify symptoms that warrant medical attention, track your health history, and prepare for healthcare visits. It is not a replacement for clinical care.",
  },
  {
    icon: "👥", title: "Not For Children",
    content: "MedAssist is intended for adults aged 18 and above. The symptom checker and health assessments are calibrated for adult medical profiles. For pediatric health concerns, always consult a qualified pediatrician.",
  },
];

export default function DisclaimerPage() {
  return (
    <Protected>
      <div className="wrap" style={{ paddingTop: 36 }}>
        <div className="dhbanner">
          <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>⚠️</div>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 10 }}>Important Safety Information</h2>
          <p style={{ opacity: .85, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            Please read these important notices before using MedAssist. Your safety and health are our top priorities.
          </p>
        </div>

        <div className="alert ar" style={{ marginBottom: 28 }}>
          <span className="ai-icon">🚨</span>
          <div><strong>If you are experiencing a medical emergency, call 112 or 911 immediately.</strong> Do not use this app in emergency situations.</div>
        </div>

        {SECTIONS.map(({ icon, title, content }) => (
          <div key={title} className="dsec">
            <h3 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: ".97rem", fontWeight: 700, color: "var(--th)", marginBottom: 10 }}>
              <span>{icon}</span> {title}
            </h3>
            <p style={{ fontSize: ".88rem", color: "var(--tb)", lineHeight: 1.7 }}>{content}</p>
          </div>
        ))}

        <div className="card" style={{ marginTop: 8, background: "linear-gradient(135deg,rgba(13,148,136,.04),rgba(20,184,166,.04))", borderColor: "rgba(13,148,136,.2)" }}>
          <h3 style={{ fontSize: ".93rem", fontWeight: 700, color: "var(--th)", marginBottom: 10 }}>✅ By Using MedAssist, You Acknowledge</h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "MedAssist does not replace professional medical advice",
              "AI assessments are informational only and may be inaccurate",
              "You will consult a qualified healthcare provider for medical decisions",
              "In emergencies, you will contact emergency services immediately",
              "You are responsible for your own health decisions",
            ].map(item => (
              <li key={item} style={{ display: "flex", gap: 10, fontSize: ".87rem", color: "var(--tb)" }}>
                <span style={{ color: "var(--teal)", fontWeight: 700 }}>✓</span> {item}
              </li>
            ))}
          </ul>
        </div>

        <p style={{ textAlign: "center", color: "var(--tm)", fontSize: ".78rem", marginTop: 28 }}>
          Last updated: March 2025 · MedAssist v1.0 · <span style={{ color: "var(--teal)" }}>Not FDA Approved</span> · For informational use only
        </p>
      </div>
    </Protected>
  );
}
