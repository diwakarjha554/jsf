"use client";

import { Check, Copy } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

export function CopyButton({ value, label = "Copy", className }: { value: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked; the value is visible to copy manually.
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-lg border border-brand-900/10 bg-white px-3 text-sm font-semibold text-brand-800 transition hover:border-brand-900/25 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200",
        className,
      )}
      aria-label={copied ? "Copied" : `${label}: ${value}`}
    >
      {copied ? <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      {copied ? "Copied" : label}
    </button>
  );
}

const noSubscribe = () => () => {};

/** Current year, read in the browser (prerendered pages cannot read the clock). */
export function CurrentYear({ fallback = "2026" }: { fallback?: string }) {
  const year = useSyncExternalStore(
    noSubscribe,
    () => String(new Date().getFullYear()),
    () => fallback,
  );
  return <span>{year}</span>;
}
