"use client";

import { CircleCheck, CircleX } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "block w-full min-w-0 rounded-xl border border-sand-dark bg-white px-4 py-3 text-base text-ink shadow-[inset_0_1px_2px_rgb(22_13_45/0.04)] transition placeholder:text-muted/55 hover:border-brand-200 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 aria-[invalid=true]:border-rose-500 aria-[invalid=true]:focus:ring-rose-100";

type Base = { label: ReactNode; name: string; error?: string; hint?: ReactNode; required?: boolean; className?: string };

function describedBy(name: string, error?: string, hint?: ReactNode) {
  return [error ? `${name}-error` : "", hint ? `${name}-hint` : ""].filter(Boolean).join(" ") || undefined;
}

function Label({ name, label, required }: { name: string; label: ReactNode; required?: boolean }) {
  return (
    <label htmlFor={`f-${name}`} className="mb-1.5 block text-sm font-semibold text-brand-900">
      {label}
      {required ? (
        <span className="text-ember-600" aria-hidden="true">
          {" "}
          *
        </span>
      ) : (
        <span className="font-normal text-muted"> (optional)</span>
      )}
    </label>
  );
}

function Help({ name, error, hint }: { name: string; error?: string; hint?: ReactNode }) {
  return (
    <>
      {hint && !error && (
        <p id={`${name}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm font-medium text-rose-700">
          {error}
        </p>
      )}
    </>
  );
}

export function TextField({ label, name, error, hint, required, className, ...props }: Base & ComponentProps<"input">) {
  return (
    <div className={cn("min-w-0", className)}>
      <Label name={name} label={label} required={required} />
      <input
        id={`f-${name}`}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        className={inputClass}
        {...props}
      />
      <Help name={name} error={error} hint={hint} />
    </div>
  );
}

export function TextArea({ label, name, error, hint, required, className, ...props }: Base & ComponentProps<"textarea">) {
  return (
    <div className={cn("min-w-0", className)}>
      <Label name={name} label={label} required={required} />
      <textarea
        id={`f-${name}`}
        name={name}
        required={required}
        rows={5}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        className={cn(inputClass, "resize-y")}
        {...props}
      />
      <Help name={name} error={error} hint={hint} />
    </div>
  );
}

const selectArrow =
  "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%235b5570%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:1.25rem] bg-[right_0.9rem_center] bg-no-repeat pr-10";

export function SelectField({
  label,
  name,
  error,
  hint,
  required,
  className,
  options,
  placeholder = "Choose…",
  ...props
}: Base & ComponentProps<"select"> & { options: readonly string[]; placeholder?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <Label name={name} label={label} required={required} />
      <select
        id={`f-${name}`}
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        className={cn(inputClass, selectArrow)}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <Help name={name} error={error} hint={hint} />
    </div>
  );
}

export { selectArrow };

export function Checkbox({
  name,
  children,
  error,
  className,
  ...props
}: { name: string; children: ReactNode; error?: string; className?: string } & ComponentProps<"input">) {
  return (
    <div className={className}>
      <label className="flex cursor-pointer items-start gap-3 text-[15px] leading-snug text-ink">
        <input
          type="checkbox"
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-md border-sand-dark accent-brand-700"
          {...props}
        />
        <span className="min-w-0">{children}</span>
      </label>
      {error && (
        <p id={`${name}-error`} className="mt-1.5 pl-8 text-sm font-medium text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}

/** Multi-select shown as tappable tiles (squared corners, not pills). */
export function CheckboxGroup({
  legend,
  name,
  options,
  error,
  required,
  className,
}: {
  legend: string;
  name: string;
  options: readonly string[];
  error?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <fieldset className={className} aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-2 text-sm font-semibold text-brand-900">
        {legend}
        {required && (
          <span className="text-ember-600" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </legend>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,9.5rem),1fr))] gap-2">
        {options.map((o) => (
          <label
            key={o}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-sand-dark bg-white px-3 py-2.5 text-sm font-medium text-ink transition hover:border-brand-200 has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-900 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-100"
          >
            <input type="checkbox" name={name} value={o} className="h-4 w-4 shrink-0 rounded accent-brand-700" />
            <span className="min-w-0">{o}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm font-medium text-rose-700">
          {error}
        </p>
      )}
    </fieldset>
  );
}

/** Hidden field that only bots fill in. */
export function Honeypot() {
  return (
    <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
      <label>
        Leave this empty
        <input type="text" name="homepage" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-[15px] text-rose-800">
      <CircleX className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

export function FormSuccess({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div role="status" className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-linear-to-br from-emerald-50 to-white p-6 md:p-8">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
        <CircleCheck className="h-8 w-8" aria-hidden="true" />
      </span>
      <h3 className="mt-5 font-display text-2xl font-semibold text-brand-900">{title}</h3>
      <div className="mt-2 leading-relaxed text-muted">{children}</div>
    </div>
  );
}
