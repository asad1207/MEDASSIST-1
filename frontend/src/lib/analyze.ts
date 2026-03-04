const EMERGENCY = ["chest pain","difficulty breathing","shortness of breath","loss of consciousness","severe bleeding","stroke","paralysis","seizure","heart attack","anaphylaxis","coughing blood","severe abdominal pain","confusion","unconscious"];
const MODERATE  = ["fever","vomiting","diarrhea","persistent cough","dizziness","severe headache","joint pain","rash","swelling","fatigue","nausea","blurred vision","ear pain","sore throat","back pain","urinary pain","muscle weakness","palpitations","sweating","body aches"];

export interface AnalysisResult {
  risk: "mild" | "moderate" | "emergency";
  risk_score: number;
  level_label: string;
  guidance: string;
  suggestions: string[];
  color: string;
  cls: string;
}

export function analyzeSymptoms(symptoms: string[], severity: string, temp?: string): AnalysisResult {
  const lower = symptoms.map(s => s.toLowerCase());
  const emCount = lower.filter(s => EMERGENCY.some(e => s.includes(e))).length;
  const moCount = lower.filter(s => MODERATE.some(m => s.includes(m))).length;
  const tempNum = parseFloat(temp || "0");
  const isSevere = severity === "Severe";
  const isModerate = severity === "Moderate";

  if (emCount > 0 || isSevere || tempNum >= 40) {
    return {
      risk: "emergency", risk_score: 0.85, cls: "rc-em",
      level_label: "🔴 EMERGENCY — Seek Immediate Care",
      color: "#991b1b",
      guidance: "Your symptoms indicate a potentially life-threatening condition. Call emergency services (112/911) immediately or go to the nearest emergency room. Do NOT wait or drive yourself.",
      suggestions: ["Call emergency services immediately (112/911)", "Do not drive yourself to the hospital", "Have someone stay with you", "Bring list of current medications", "Do not eat or drink until evaluated"],
    };
  }
  if (moCount >= 2 || isModerate || tempNum >= 38.5) {
    return {
      risk: "moderate", risk_score: 0.55, cls: "rc-mo",
      level_label: "🟡 MODERATE — Doctor Visit Recommended",
      color: "#92400e",
      guidance: "Your symptoms indicate a condition that needs professional medical attention within the next 24-48 hours. Schedule an appointment with your doctor or visit a clinic.",
      suggestions: ["Schedule a doctor appointment within 24-48 hours", "Rest and stay hydrated", "Monitor your temperature regularly", "Take OTC medication for symptom relief if applicable", "Avoid strenuous activity"],
    };
  }
  return {
    risk: "mild", risk_score: 0.2, cls: "rc-mi",
    level_label: "🟢 MILD — Home Care Advised",
    color: "#065f46",
    guidance: "Your symptoms appear mild and manageable at home. Rest, hydration, and over-the-counter medications should help. Monitor for any worsening.",
    suggestions: ["Rest and get adequate sleep", "Stay well hydrated (8+ glasses of water)", "Take OTC medication as needed (Paracetamol/Ibuprofen)", "Monitor symptoms for the next 24-48 hours", "See a doctor if symptoms worsen or persist beyond 7 days"],
  };
}
