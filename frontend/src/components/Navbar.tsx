"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const LINKS = [
  { href: "/dashboard",   label: "🏠 Home"     },
  { href: "/symptoms",    label: "🔍 Symptoms"  },
  { href: "/history",     label: "📊 History"   },
  { href: "/triage",      label: "🚑 Triage"    },
  { href: "/profile",     label: "👤 Profile"   },
  { href: "/disclaimer",  label: "⚠️ Safety"    },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const initials = user?.full_name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <nav className="nav">
      <Link href="/dashboard" className="nav-logo">
        <div className="nav-icon">🩺</div>
        <div className="nav-text">Med<span>Assist</span></div>
      </Link>

      <div className="nav-links">
        {LINKS.map(({ href, label }) => (
          <Link key={href} href={href} className={`nav-link ${pathname === href ? "active" : ""}`}>
            {label}
          </Link>
        ))}
      </div>

      <div className="nav-right">
        <div className="nav-badge">
          <span className="dot dg" /> AI Online
        </div>
        <div className="nav-avatar" title={user?.full_name}>{initials}</div>
        <button className="nav-out" onClick={logout}>Sign Out</button>
      </div>
    </nav>
  );
}
