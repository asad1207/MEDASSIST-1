"use client";
import { useEffect, useState } from "react";
import Protected from "@/components/Protected";
import { useAuth } from "@/hooks/useAuth";
import { fetchHistory } from "@/hooks/useStorage";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function HistoryPage() {
  const { user, token } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (token) fetchHistory(token).then(setHistory);
  }, [token]);

  const filtered = filter === "all" ? history : history.filter(h => h.risk === filter);

  const stats = {
    total: history.length,
    mild: history.filter(h => h.risk === "mild").length,
    moderate: history.filter(h => h.risk === "moderate").length,
    emergency: history.filter(h => h.risk === "emergency").length,
  };

  // Monthly counts for chart
  const byMonth = MONTHS.map((m, i) => history.filter(h => h.date?.includes(m)).length);
  const maxMonth = Math.max(...byMonth, 1);

  const riskBadge = (r: HistoryEntry["risk"]) => {
    const map = { mild: "bg", moderate: "ba", emergency: "br" } as const;
    return map[r];
  };

  return (
    <Protected>
      <div className="wrap" style={{ paddingTop: 36 }}>
        <div className="sec"><h2>📊 Symptom <span>History</span></h2><p>Track your health patterns over time</p></div>

        {/* Stats */}
        <div className="g4" style={{ marginBottom: 28 }}>
          {[
            { label: "Total Checks", value: stats.total, bdg: "bt" },
            { label: "Mild",         value: stats.mild,     bdg: "bg" },
            { label: "Moderate",     value: stats.moderate, bdg: "ba" },
            { label: "Emergency",    value: stats.emergency,bdg: "br" },
          ].map(({ label, value, bdg }) => (
            <div key={label} className="card" style={{ textAlign: "center", padding: "20px 16px" }}>
              <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--th)", marginBottom: 4 }}>{value}</div>
              <span className={`bdg ${bdg}`}>{label}</span>
            </div>
          ))}
        </div>

        {/* Monthly bar chart */}
        {history.length > 0 && (
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: ".93rem", fontWeight: 600, color: "var(--th)", marginBottom: 16 }}>Monthly Activity</h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
              {MONTHS.map((m, i) => (
                <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: "100%", background: "linear-gradient(180deg,var(--tl),var(--td))", borderRadius: "4px 4px 0 0", height: byMonth[i] > 0 ? `${(byMonth[i]/maxMonth)*64}px` : "4px", opacity: byMonth[i] > 0 ? 1 : .15, transition: "height .6s ease" }} />
                  <span style={{ fontSize: ".6rem", color: "var(--tm)" }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["all","mild","moderate","emergency"].map(f => (
            <button key={f} className={`stag ${filter === f ? "sel" : ""}`} onClick={() => setFilter(f)} style={{ textTransform: "capitalize" }}>
              {f === "all" ? "🗂 All" : f === "mild" ? "🟢 Mild" : f === "moderate" ? "🟡 Moderate" : "🔴 Emergency"}
            </button>
          ))}
        </div>

        {/* History items */}
        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--tm)" }}>
            {history.length === 0 ? (
              <><div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🩺</div>
              <p>No symptom checks yet.<br /><a href="/symptoms" style={{ color: "var(--teal)", fontWeight: 500 }}>Run your first check →</a></p></>
            ) : <p>No {filter} results found.</p>}
          </div>
        ) : (
          filtered.map(h => (
            <div key={h.id} className="hi">
              <div>
                <div className="hid">{h.date}</div>
                <div className="hit">{h.symptoms.slice(0,2).join(" + ") || "Symptom Entry"}</div>
                <div className="his">Severity: {h.severity}{h.duration ? ` · Duration: ${h.duration}` : ""}</div>
                {h.symptoms.length > 2 && <div className="his">+{h.symptoms.length-2} more symptoms</div>}
              </div>
              <div className="hir">
                <span className={`bdg ${riskBadge(h.risk)}`} style={{ textTransform: "capitalize" }}>{h.risk}</span>
                <span style={{ fontSize: ".72rem", color: "var(--tm)" }}>{(h.risk_score*100).toFixed(0)}% risk</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Protected>
  );
}
