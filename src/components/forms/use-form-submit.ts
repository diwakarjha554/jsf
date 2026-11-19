"use client";

import { useRef, useState } from "react";
import type { z } from "zod";
import { fieldErrors } from "@/lib/schemas";

type Status = "idle" | "submitting" | "success" | "error";

/** Shared submit logic: validate in the browser, POST JSON, map server errors back to fields. */
export function useFormSubmit<T = unknown>(endpoint: string, schema: z.ZodType) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const startedAt = useRef<number>(0);

  function markStarted() {
    if (!startedAt.current) startedAt.current = Date.now();
  }

  function focusFirstError(errs: Record<string, string>, form: HTMLFormElement | null) {
    const first = Object.keys(errs)[0];
    if (!first || !form) return;
    requestAnimationFrame(() => {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    });
  }

  async function submit(values: Record<string, unknown>, extra: Record<string, unknown> = {}): Promise<T | null> {
    const form = (document.activeElement as HTMLElement | null)?.closest("form") ?? null;
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      setMessage("Please check the highlighted fields.");
      setStatus("error");
      focusFirstError(errs, form);
      return null;
    }
    setErrors({});
    setMessage("");
    setStatus("submitting");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          ...extra,
          elapsedMs: startedAt.current ? Date.now() - startedAt.current : undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; errors?: Record<string, string> } & T;
      if (res.ok && data.ok) {
        setStatus("success");
        return data;
      }
      const errs = data.errors ?? {};
      setErrors(errs);
      setMessage(data.message || "Something went wrong. Please try again.");
      setStatus("error");
      focusFirstError(errs, form);
      return null;
    } catch {
      setMessage("We couldn't reach the server. Please check your internet connection and try again.");
      setStatus("error");
      return null;
    }
  }

  return { status, errors, message, submit, markStarted, setStatus };
}

export function formValues(form: HTMLFormElement, multi: string[] = [], booleans: string[] = []) {
  const fd = new FormData(form);
  const out: Record<string, unknown> = {};
  for (const [key, value] of fd.entries()) {
    if (multi.includes(key) || booleans.includes(key) || key === "homepage" || key === "cf-turnstile-response") continue;
    out[key] = typeof value === "string" ? value : "";
  }
  for (const key of multi) out[key] = fd.getAll(key).map(String);
  for (const key of booleans) out[key] = fd.get(key) === "on";
  return { values: out, honeypot: String(fd.get("homepage") ?? "") };
}
