"use client";

import { ArrowRight, CircleCheck } from "lucide-react";
import { newsletterSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Honeypot } from "./fields";
import { formValues, useFormSubmit } from "./use-form-submit";

export function NewsletterForm({
  source,
  variant = "light",
  className,
}: {
  source: string;
  variant?: "light" | "dark";
  className?: string;
}) {
  const { status, errors, message, submit, markStarted } = useFormSubmit("/api/forms/newsletter", newsletterSchema);
  const dark = variant === "dark";
  const id = `nl-${source}`;

  if (status === "success") {
    return (
      <p role="status" className={cn("flex items-center gap-2 font-semibold", dark ? "text-emerald-300" : "text-emerald-700", className)}>
        <CircleCheck className="h-5 w-5" aria-hidden="true" /> You&apos;re subscribed. Thank you!
      </p>
    );
  }

  const error = errors.email || (status === "error" ? message : "");
  return (
    <form
      noValidate
      onFocus={markStarted}
      onSubmit={(e) => {
        e.preventDefault();
        const { values, honeypot } = formValues(e.currentTarget);
        submit({ ...values, source }, { homepage: honeypot });
      }}
      className={cn("relative", className)}
    >
      <Honeypot />
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div
        className={cn(
          "flex gap-1.5 rounded-2xl border p-1.5 transition focus-within:ring-4",
          dark
            ? "border-white/15 bg-white/10 focus-within:ring-white/15"
            : "border-sand-dark bg-white focus-within:border-brand-400 focus-within:ring-brand-100",
        )}
      >
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "h-11 min-w-0 flex-1 bg-transparent px-3 text-base focus:outline-none",
            dark ? "text-white placeholder:text-brand-200/80" : "text-ink placeholder:text-muted/60",
          )}
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          aria-label="Subscribe"
          className="btn-shine inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-[linear-gradient(110deg,var(--color-sun-300),var(--color-sun-500))] px-4 font-semibold text-brand-950 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun-300/60 disabled:opacity-60"
        >
          <span className="hidden min-[400px]:inline">{status === "submitting" ? "…" : "Subscribe"}</span>
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className={cn("mt-2 text-sm font-medium", dark ? "text-rose-300" : "text-rose-700")}>
          {error}
        </p>
      )}
    </form>
  );
}
