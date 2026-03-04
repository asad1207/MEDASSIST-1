"use client";
import { useEffect, useState } from "react";
import Protected from "@/components/Protected";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { fetchStats } from "@/hooks/useStorage";

const CARDS = [
  { icon: "🔍", title: "AI Symptom Checker",    desc: "Analyze symptoms and get AI-driven health insights.",       meta: "Last used: Today",          dot: "dg", href: "/symptoms",     cta: "Check Symptoms →",   delay: ".08s" },
  { icon: "🚑", title: "Medical Triage",         desc: "Know whether home care, doctor visit, or emergency needed.", meta: "1 pending review",         dot: "da", href: "/triage",       cta: "Start Triage →",     delay: ".15s" },
  { icon: "💊", title: "Medication Reminders",   desc: "Never miss medicines with smart reminders.",               meta: "Next dose: 6:00 PM",        dot: "da", href: "/medications",  cta: "Manage Meds →",      delay: ".22s" },
  { icon: "📅", title: "Appointments",           desc: "Book and manage your doctor consultations.",               meta: "View schedule",             dot: "dg", href: "/appointments", cta: "Book Now →",         delay: ".29s" },
];

export default function DashboardPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, mild: 0, moderate: 0, emergency: 0 });

  useEffect(() => {
    if (!token) return;
    fetchStats(token).then(s => {
      if (s) setStats({
        total: s.total_checks || 0,
        mild: s.mild || 0,
        moderate: s.moderate || 0,
        emergency: s.emergency || 0,
      });
    });
  }, [token]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Protected>
      <div className="dhero" style={{ paddingTop: 48 }}>
        <h1>MEDASSIST <span>AI</span></h1>
        <p style={{ color: "var(--tm)" }}>{greeting()}, {user?.full_name?.split(" ")[0]} — AI-powered healthcare at your fingertips</p>
      </div>

      {/* Status bar */}
      <div className="sbar">
        <div className="sp"><span className="dot dg" /><strong>{stats.total}</strong> Total Checks</div>
        <div className="sp"><span className="dot dg" /><strong>{stats.mild}</strong> Mild</div>
        <div className="sp"><span className="dot da" /><strong>{stats.moderate}</strong> Moderate</div>
        {stats.emergency > 0 && <div className="sp"><span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)", display: "inline-block" }} /><strong>{stats.emergency}</strong> Emergency</div>}
        <div className="sp"><span className="dot dg" /> AI <strong>Online</strong></div>
      </div>

      {/* Feature cards */}
      <div className="dcards" style={{ maxWidth: 1060, margin: "0 auto", padding: "0 28px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 18 }}>
          {CARDS.map(({ icon, title, desc, meta, dot, href, cta, delay }) => (
            <div key={href} className="dc" style={{ animationDelay: delay }} onClick={() => router.push(href)}>
              <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
              <div className="dcm"><span className={`dot ${dot}`} /> {meta}</div>
              <button className="dca">{cta}</button>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="dc" style={{ width: 290, animationDelay: ".36s" }} onClick={() => router.push("/profile")}>
            <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>👤</div>
            <h3>Health Profile</h3>
            <p>View and update your health information and preferences.</p>
            <div className="dcm"><span className="dot dg" /> Profile {user?.setupDone ? "complete" : "setup needed"}</div>
            <button className="dca">View Profile →</button>
          </div>
        </div>
      </div>

      <footer>&copy; 2025 <span>MedAssist</span> · HIPAA Secure · SSL Encrypted · Not a medical diagnosis tool</footer>
    </Protected>
  );
}
