"use client";

import { ArrowLeft, ArrowRight, Check, Heart, Lock, RotateCcw, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  causes,
  donationCauseLabel,
  generalCause,
  isDonationCause,
  type DonationCause,
} from "@/content/causes";
import { DEDICATION_TYPES, INDIAN_STATES } from "@/content/options";
import { site } from "@/content/site";
import { amountOnlySchema, donationReportSchema, donationStartSchema } from "@/lib/schemas";
import { cn, formatINR } from "@/lib/utils";
import { Checkbox, FormError, Honeypot, inputClass, TextField } from "../forms/fields";
import { Turnstile } from "../forms/turnstile";
import { useFormSubmit } from "../forms/use-form-submit";
import { Button } from "../ui/button";
import { toneStyles } from "../ui/tones";
import { UpiPay, type PayMethod } from "./upi-pay";

type Step = 1 | 2 | 3;
type Donor = {
  name: string;
  email: string;
  phone: string;
  wants80g: boolean;
  pan: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  citizen: boolean;
  consent: boolean;
};
type Saved = {
  v: 1;
  savedAt: number;
  cause: DonationCause;
  amount: number;
  dedicationType: string;
  dedicationName: string;
  donor: Donor;
  ref: string;
};

const STORAGE_KEY = "jsf-donation";
const RESUME_WINDOW_MS = 6 * 60 * 60 * 1000;
const PRESETS = site.donation.presets as readonly number[];
const TAX = site.legal.tax80g.enabled;

const emptyDonor: Donor = {
  name: "",
  email: "",
  phone: "",
  wants80g: false,
  pan: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  citizen: false,
  consent: false,
};

const allCauses = [generalCause, ...causes];

/** A donation in progress, saved so a donor can switch to their UPI app and come back. */
function readSaved(): Saved | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Saved;
    if (s.v !== 1 || !s.ref || Date.now() - s.savedAt > RESUME_WINDOW_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

function Stepper({ step }: { step: Step }) {
  const steps = ["Amount", "Your details", "Pay by UPI"];
  return (
    <ol className="flex items-center gap-2" aria-label="Donation steps">
      {steps.map((label, i) => {
        const n = (i + 1) as Step;
        const done = step > n;
        const current = step === n;
        return (
          <li key={label} className="flex flex-1 items-center gap-2" aria-current={current ? "step" : undefined}>
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition",
                done && "bg-brand-700 text-white",
                current && "bg-sun-400 text-brand-950 ring-4 ring-sun-100",
                !done && !current && "bg-sand text-muted",
              )}
            >
              {done ? <Check className="h-4 w-4" aria-hidden="true" /> : n}
            </span>
            <span className={cn("hidden text-sm font-semibold sm:inline", current ? "text-brand-900" : "text-muted")}>
              {label}
            </span>
            {i < steps.length - 1 && <span className="h-px flex-1 bg-sand-dark" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}

export function DonateFlow() {
  const params = useSearchParams();
  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);

  const paramCause = params.get("cause");
  const paramAmount = Number(params.get("amount"));

  // This component renders only in the browser (it sits under a Suspense boundary that reads the URL),
  // so restoring saved progress in the initial state cannot cause a hydration mismatch.
  const [saved] = useState(readSaved);
  const savedIsPreset = saved ? PRESETS.includes(saved.amount) : false;

  const [step, setStep] = useState<Step>(saved ? 3 : 1);
  const [cause, setCause] = useState<DonationCause>(
    saved?.cause ?? (isDonationCause(paramCause) ? paramCause : "general"),
  );
  const [preset, setPreset] = useState<number | null>(() => {
    if (saved) return savedIsPreset ? saved.amount : null;
    if (PRESETS.includes(paramAmount)) return paramAmount;
    return paramAmount > 0 ? null : PRESETS[1];
  });
  const [custom, setCustom] = useState(() => {
    if (saved) return savedIsPreset ? "" : String(saved.amount);
    return paramAmount > 0 && !PRESETS.includes(paramAmount) ? String(paramAmount) : "";
  });
  const [dedicate, setDedicate] = useState(Boolean(saved?.dedicationType));
  const [dedicationType, setDedicationType] = useState<string>(saved?.dedicationType || "honour");
  const [dedicationName, setDedicationName] = useState(saved?.dedicationName ?? "");
  const [donor, setDonor] = useState<Donor>(saved?.donor ?? emptyDonor);
  const [refCode, setRefCode] = useState(saved?.ref ?? "");
  const [amountError, setAmountError] = useState("");
  const [token, setToken] = useState("");
  const [resumed, setResumed] = useState(Boolean(saved));
  const [method, setMethod] = useState<PayMethod>("UPI");
  const [utr, setUtr] = useState("");

  const start = useFormSubmit<{ ref: string }>("/api/donations/start", donationStartSchema);
  const report = useFormSubmit("/api/donations/report", donationReportSchema);

  const amount = custom ? Number(custom.replace(/[^\d]/g, "")) : preset ?? 0;
  const causeInfo = causes.find((c) => c.slug === cause);
  const impactLine = causeInfo && PRESETS.includes(amount) ? causeInfo.impact[amount] : undefined;

  useEffect(() => {
    if (step !== 3 || !refCode) return;
    try {
      const saved: Saved = {
        v: 1,
        savedAt: Date.now(),
        cause,
        amount,
        dedicationType: dedicate ? dedicationType : "",
        dedicationName: dedicate ? dedicationName : "",
        donor,
        ref: refCode,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // Ignore: resuming is a convenience.
    }
  }, [step, refCode, cause, amount, dedicate, dedicationType, dedicationName, donor]);

  function clearSaved() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  function goTo(next: Step) {
    setStep(next);
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function restart() {
    clearSaved();
    setRefCode("");
    setResumed(false);
    setUtr("");
    goTo(1);
  }

  function payload() {
    return {
      amount,
      cause,
      ...donor,
      wants80g: TAX ? donor.wants80g : false,
      pan: TAX && donor.wants80g ? donor.pan : "",
      dedicationType: dedicate ? dedicationType : "",
      dedicationName: dedicate ? dedicationName.trim() : "",
    };
  }

  function continueFromAmount() {
    const r = amountOnlySchema.safeParse(amount);
    if (!r.success) {
      setAmountError(r.error.issues[0]?.message ?? "Enter a valid amount");
      return;
    }
    if (dedicate && !dedicationName.trim()) {
      setAmountError("Add a name or occasion for the dedication, or untick it.");
      return;
    }
    setAmountError("");
    goTo(2);
  }

  async function submitDetails(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const hp = String(new FormData(e.currentTarget).get("homepage") ?? "");
    const res = await start.submit(payload(), { homepage: hp, turnstileToken: token });
    if (res?.ref) {
      setRefCode(res.ref);
      goTo(3);
    }
  }

  async function submitReport(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await report.submit({ ...payload(), ref: refCode, paidVia: method, utr });
    if (res) {
      clearSaved();
      router.push(`/donate/thank-you?ref=${encodeURIComponent(refCode)}&amount=${amount}`);
    }
  }

  const set = <K extends keyof Donor>(key: K) => (value: Donor[K]) => setDonor((d) => ({ ...d, [key]: value }));

  return (
    <div ref={topRef} className="grid scroll-mt-28 gap-8 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="min-w-0 rounded-4xl bg-white p-4 shadow-[0_40px_80px_-50px_rgb(36_22_69/0.55)] ring-1 ring-sand-dark min-[360px]:p-5 sm:p-8">
        <Stepper step={step} />

        {/* ── Step 1: cause and amount ─────────────────────────── */}
        {step === 1 && (
          <div className="mt-8 space-y-8">
            <fieldset>
              <legend className="font-display text-xl font-semibold text-brand-900">Choose a cause</legend>
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {allCauses.map((c) => {
                  const Icon = c.icon;
                  const selected = cause === c.slug;
                  const t = toneStyles[c.tone];
                  return (
                    <label
                      key={c.slug}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-2xl border-2 p-3 text-sm font-semibold transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-100",
                        selected ? "border-brand-700 bg-brand-50 text-brand-900" : "border-sand-dark bg-white text-ink hover:border-brand-300",
                      )}
                    >
                      <input
                        type="radio"
                        name="cause"
                        value={c.slug}
                        checked={selected}
                        onChange={() => setCause(c.slug)}
                        className="sr-only"
                      />
                      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", t.chip)}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="leading-tight">{c.shortTitle}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-display text-xl font-semibold text-brand-900">Choose an amount</legend>
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {PRESETS.map((p) => {
                  const selected = !custom && preset === p;
                  return (
                    <label
                      key={p}
                      className={cn(
                        "flex cursor-pointer items-center justify-center rounded-2xl border-2 px-3 py-4 text-lg font-bold transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-sun-200",
                        selected ? "border-sun-500 bg-sun-50 text-brand-900 shadow-[0_14px_30px_-20px_rgb(230_143_0/0.8)]" : "border-sand-dark bg-white text-ink hover:border-sun-300",
                      )}
                    >
                      <input
                        type="radio"
                        name="amount"
                        value={p}
                        checked={selected}
                        onChange={() => {
                          setPreset(p);
                          setCustom("");
                          setAmountError("");
                        }}
                        className="sr-only"
                      />
                      {formatINR(p)}
                    </label>
                  );
                })}
                <div className="relative">
                  <label htmlFor="f-customAmount" className="sr-only">
                    Other amount in rupees
                  </label>
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted">₹</span>
                  <input
                    id="f-customAmount"
                    inputMode="numeric"
                    placeholder="Other"
                    value={custom}
                    onChange={(e) => {
                      setCustom(e.target.value.replace(/[^\d]/g, "").slice(0, 7));
                      setAmountError("");
                    }}
                    className={cn(
                      "h-full min-h-[3.75rem] w-full rounded-2xl border-2 bg-white pl-9 pr-3 text-lg font-bold text-ink placeholder:font-semibold placeholder:text-muted/60 focus:outline-none focus:ring-4 focus:ring-sun-100",
                      custom ? "border-sun-500" : "border-sand-dark",
                    )}
                  />
                </div>
              </div>
              <p className="mt-3 min-h-6 text-[15px] text-brand-800" aria-live="polite">
                {amount > 0 &&
                  (impactLine ? (
                    <>
                      <b>{formatINR(amount)}</b> {impactLine.charAt(0).toLowerCase() + impactLine.slice(1)}.
                    </>
                  ) : (
                    <>
                      <b>{formatINR(amount)}</b> will go to {cause === "general" ? "wherever it's needed most" : donationCauseLabel(cause).toLowerCase()}.
                    </>
                  ))}
              </p>
            </fieldset>

            <div className="rounded-2xl border border-sand-dark bg-cream p-4">
              <Checkbox name="dedicate" checked={dedicate} onChange={(e) => setDedicate(e.target.checked)}>
                <span className="font-semibold">Dedicate this donation</span>
                <span className="block text-sm text-muted">For a birthday, anniversary, festival or in someone&apos;s memory</span>
              </Checkbox>
              {dedicate && (
                <div className="mt-4 grid gap-3 sm:grid-cols-[12rem_1fr]">
                  <label htmlFor="f-dedicationType" className="sr-only">
                    Dedication type
                  </label>
                  <select
                    id="f-dedicationType"
                    value={dedicationType}
                    onChange={(e) => setDedicationType(e.target.value)}
                    className={inputClass}
                  >
                    {DEDICATION_TYPES.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="f-dedicationName" className="sr-only">
                    Name or occasion
                  </label>
                  <input
                    id="f-dedicationName"
                    value={dedicationName}
                    maxLength={80}
                    onChange={(e) => setDedicationName(e.target.value)}
                    placeholder={dedicationType === "occasion" ? "e.g. Diwali, our wedding anniversary" : "Name"}
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            <FormError message={amountError} />
            <Button size="lg" onClick={continueFromAmount} className="w-full">
              Continue with {amount > 0 ? formatINR(amount) : "your gift"}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        )}

        {/* ── Step 2: donor details ─────────────────────────────── */}
        {step === 2 && (
          <form noValidate onFocus={start.markStarted} onSubmit={submitDetails} className="relative mt-8 space-y-5">
            <Honeypot />
            <h2 className="font-display text-xl font-semibold text-brand-900">Your details</h2>
            <p className="-mt-3 text-[15px] text-muted">We&apos;ll email your receipt to this address.</p>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Full name" name="name" autoComplete="name" required value={donor.name} onChange={(e) => set("name")(e.target.value)} error={start.errors.name} className="sm:col-span-2" />
              <TextField label="Email" name="email" type="email" autoComplete="email" required value={donor.email} onChange={(e) => set("email")(e.target.value)} error={start.errors.email} />
              <TextField label="Mobile number" name="phone" type="tel" inputMode="tel" autoComplete="tel" required value={donor.phone} onChange={(e) => set("phone")(e.target.value)} error={start.errors.phone} />
            </div>

            {TAX && (
              <div className="rounded-2xl border border-sand-dark bg-cream p-4">
                <Checkbox name="wants80g" checked={donor.wants80g} onChange={(e) => set("wants80g")(e.target.checked)}>
                  <span className="font-semibold">I want an 80G tax receipt</span>
                  <span className="block text-sm text-muted">PAN and address are required by the Income Tax Department</span>
                </Checkbox>
                {donor.wants80g && (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <TextField label="PAN" name="pan" required value={donor.pan} onChange={(e) => set("pan")(e.target.value.toUpperCase())} maxLength={10} autoCapitalize="characters" error={start.errors.pan} placeholder="ABCDE1234F" />
                    <TextField label="PIN code" name="pincode" inputMode="numeric" autoComplete="postal-code" required value={donor.pincode} onChange={(e) => set("pincode")(e.target.value)} maxLength={6} error={start.errors.pincode} />
                    <TextField label="Address" name="address" autoComplete="street-address" required value={donor.address} onChange={(e) => set("address")(e.target.value)} error={start.errors.address} className="sm:col-span-2" />
                    <TextField label="City" name="city" autoComplete="address-level2" required value={donor.city} onChange={(e) => set("city")(e.target.value)} error={start.errors.city} />
                    <div>
                      <label htmlFor="f-state" className="mb-1.5 block text-sm font-semibold text-brand-900">
                        State <span className="text-ember-600" aria-hidden="true">*</span>
                      </label>
                      <select id="f-state" name="state" value={donor.state} onChange={(e) => set("state")(e.target.value)} aria-invalid={start.errors.state ? true : undefined} className={inputClass}>
                        <option value="">Choose…</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      {start.errors.state && <p className="mt-1.5 text-sm font-medium text-rose-700">{start.errors.state}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4 rounded-2xl border border-sand-dark p-4">
              <Checkbox name="citizen" checked={donor.citizen} onChange={(e) => set("citizen")(e.target.checked)} error={start.errors.citizen}>
                I am an Indian citizen and this donation is from my own funds.
              </Checkbox>
              <Checkbox name="consent" checked={donor.consent} onChange={(e) => set("consent")(e.target.checked)} error={start.errors.consent}>
                I agree to the{" "}
                <Link href="/terms-and-conditions" className="font-semibold text-brand-700 underline underline-offset-2">
                  Terms
                </Link>{" "}
                and to my details being stored to process this donation, as described in the{" "}
                <Link href="/privacy-policy" className="font-semibold text-brand-700 underline underline-offset-2">
                  Privacy Policy
                </Link>
                .
              </Checkbox>
            </div>

            <Turnstile onToken={setToken} />
            <FormError message={start.status === "error" ? start.message : ""} />
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button variant="ghost" size="lg" onClick={() => goTo(1)}>
                <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Back
              </Button>
              <Button type="submit" size="lg" disabled={start.status === "submitting"} className="flex-1">
                {start.status === "submitting" ? "Preparing payment…" : "Continue to payment"}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </form>
        )}

        {/* ── Step 3: pay and confirm ───────────────────────────── */}
        {step === 3 && (
          <div className="mt-8 space-y-8">
            {resumed && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-brand-50 p-4 text-sm text-brand-900">
                <p>
                  Welcome back! You were donating <b>{formatINR(amount)}</b> (reference <b>{refCode}</b>).
                </p>
                <button type="button" onClick={restart} className="inline-flex items-center gap-1.5 font-semibold text-brand-700 underline underline-offset-2">
                  <RotateCcw className="h-4 w-4" aria-hidden="true" /> Start over
                </button>
              </div>
            )}

            <div>
              <h2 className="font-display text-xl font-semibold text-brand-900">
                1. Pay {formatINR(amount)}
              </h2>
              <p className="mt-1 text-[15px] text-muted">
                Your donation reference is <b className="font-mono text-brand-900">{refCode}</b>. It&apos;s added to the
                payment note automatically.
              </p>
              <div className="mt-5">
                <UpiPay amount={amount} refCode={refCode} method={method} onMethodChange={setMethod} />
              </div>
            </div>

            <form noValidate onSubmit={submitReport} className="space-y-4 border-t border-sand-dark pt-8">
              <h2 className="font-display text-xl font-semibold text-brand-900">2. Confirm your payment</h2>
              <p className="-mt-2 text-[15px] text-muted">
                After paying, enter the transaction ID so we can match it with our bank statement and send your receipt.
              </p>
              <TextField
                label={method === "UPI" ? "UPI transaction ID / UTR" : "Bank transfer UTR / reference"}
                name="utr"
                required
                value={utr}
                onChange={(e) => setUtr(e.target.value.replace(/\s/g, "").toUpperCase())}
                inputMode={method === "UPI" ? "numeric" : "text"}
                autoComplete="off"
                maxLength={30}
                error={report.errors.utr}
                hint={
                  method === "UPI"
                    ? "Usually 12 digits. Find it in your UPI app's payment history, under \"UPI ref\" or \"UTR\"."
                    : "Shown in your bank's confirmation message or transaction details."
                }
              />
              <FormError message={report.status === "error" ? report.message : ""} />
              <Button type="submit" size="lg" disabled={report.status === "submitting"} className="w-full">
                <Heart className="h-5 w-5" fill="currentColor" aria-hidden="true" />
                {report.status === "submitting" ? "Confirming…" : "I've paid. Confirm my donation"}
              </Button>
              <p className="text-center text-sm text-muted">
                Can&apos;t find the transaction ID? Email a screenshot of the payment to{" "}
                <a href={`mailto:${site.contact.email}?subject=Donation ${refCode}`} className="font-semibold text-brand-700 underline underline-offset-2">
                  {site.contact.email}
                </a>{" "}
                with reference {refCode}.
              </p>
              {!resumed && (
                <p className="text-center">
                  <button type="button" onClick={() => goTo(2)} className="text-sm font-semibold text-muted underline underline-offset-2">
                    Back to details
                  </button>
                </p>
              )}
            </form>
          </div>
        )}
      </div>

      {/* ── Summary ─────────────────────────────────────────────── */}
      <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start" aria-label="Donation summary">
        <div className="grain relative overflow-hidden rounded-4xl bg-mesh-dark p-6 text-white sm:p-7">
          <p className="font-display text-[clamp(2.2rem,1.8rem+1.5vw,3rem)] font-semibold">{amount > 0 ? formatINR(amount) : "₹—"}</p>
          <p className="mt-1 text-brand-100">{donationCauseLabel(cause)}</p>
          {dedicate && dedicationName && (
            <p className="mt-3 rounded-xl bg-white/10 px-3 py-2 text-sm">
              {DEDICATION_TYPES.find((d) => d.value === dedicationType)?.label} {dedicationName}
            </p>
          )}
          {refCode && <p className="mt-3 font-mono text-sm text-brand-200">Ref: {refCode}</p>}
        </div>
        <ul className="space-y-3 rounded-4xl border border-sand-dark bg-white p-6 text-[15px]">
          <li className="flex gap-3">
            <Lock className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
            <span>You pay from your own UPI or bank app, straight into our bank account.</span>
          </li>
          <li className="flex gap-3">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
            <span>No payment-gateway fees, so your full gift reaches us.</span>
          </li>
          <li className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
            <span>
              Receipt by email within {site.donation.confirmationDays} working days. {site.legal.shortType}, accounts audited
              every year.
            </span>
          </li>
        </ul>
      </aside>
    </div>
  );
}
