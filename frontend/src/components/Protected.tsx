"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Toast from "./Toast";

export default function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user && !user.setupDone) router.push("/setup");
  }, [user, loading]);

  if (loading || !user) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "var(--bg)" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <>
      <Toast />
      <Navbar />
      {children}
    </>
  );
}
