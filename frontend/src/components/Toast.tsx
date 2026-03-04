"use client";
import { useEffect, useState } from "react";

let toastFn: ((msg: string) => void) | null = null;
export function toast(msg: string) { toastFn?.(msg); }

export default function Toast() {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    toastFn = (m: string) => {
      setMsg(m); setShow(true);
      setTimeout(() => setShow(false), 2600);
    };
    return () => { toastFn = null; };
  }, []);

  return <div className={`toast ${show ? "show" : ""}`}>{msg}</div>;
}
