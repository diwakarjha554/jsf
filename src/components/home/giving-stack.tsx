import { BadgeCheck, CircleCheck, Heart, Receipt, Smartphone } from "lucide-react";
import { causes, generalCause } from "@/content/causes";
import { site } from "@/content/site";
import { cn, formatINR } from "@/lib/utils";
import { PhoneMockup } from "../sections/giving";
import { toneStyles } from "../ui/tones";
import { StickyStack } from "../vendor/skiper/sticky-stack";

function StepCard({
  title,
  text,
  icon: Icon,
  tone,
  visual,
}: {
  title: string;
  text: string;
  icon: typeof Heart;
  tone: "light" | "dark" | "sun";
  visual: React.ReactNode;
}) {
  return (
    <article
      className={cn(
        "grain relative grid overflow-hidden rounded-[2rem] p-6 shadow-[0_40px_100px_-50px_rgb(22_13_45/0.7)] sm:rounded-[2.5rem] sm:p-10 md:min-h-[min(72vh,34rem)] md:grid-cols-[1fr_1fr] md:items-center md:gap-10 lg:p-12",
        tone === "light" && "border border-sand-dark bg-white text-brand-900",
        tone === "dark" && "bg-mesh-dark text-white",
        tone === "sun" && "bg-[linear-gradient(125deg,var(--color-sun-200),var(--color-sun-400)_45%,var(--color-ember-400))] text-brand-950",
      )}
    >
      <div className="relative z-[1]">
        <div className="flex items-center gap-4">
          <span
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl",
              tone === "dark" ? "bg-sun-400 text-brand-950" : "bg-brand-900 text-sun-300",
            )}
          >
            <Icon className="h-7 w-7" aria-hidden="true" />
          </span>
        </div>
        <h3 className="mt-6 font-display text-[clamp(2.1rem,1.4rem+3vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.04em]">{title}</h3>
        <p className={cn("text-lead mt-5 max-w-md", tone === "dark" ? "text-brand-100/85" : "opacity-80")}>{text}</p>
      </div>
      <div className="relative z-[1] mt-8 pb-5 md:mt-0">{visual}</div>
    </article>
  );
}

function ChooseVisual() {
  const list = [generalCause, ...causes];
  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-sand-dark bg-cream p-4 shadow-xl sm:p-5" aria-hidden="true">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {list.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={c.slug}
              className={cn(
                "flex items-center gap-2 rounded-xl border bg-white p-2.5 text-xs font-semibold",
                i === 1 ? "border-brand-700 bg-brand-50" : "border-sand-dark",
              )}
            >
              <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", toneStyles[c.tone].chip)}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="truncate">{c.shortTitle}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {site.donation.presets.slice(0, 3).map((p, i) => (
          <div key={p} className={cn("rounded-xl border-2 py-3 text-center text-sm font-bold", i === 1 ? "border-sun-500 bg-sun-50" : "border-sand-dark bg-white")}>
            {formatINR(p)}
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-[linear-gradient(110deg,var(--color-sun-300),var(--color-sun-500))] py-3 text-center text-sm font-bold text-brand-950">
        Continue with ₹1,100
      </div>
    </div>
  );
}

function ReceiptVisual() {
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
      <div className="rotate-[-3deg] rounded-3xl bg-white p-6 text-brand-900 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold">Donation receipt</span>
          <Receipt className="h-6 w-6 text-ember-600" />
        </div>
        <dl className="mt-5 space-y-3 text-sm">
          {[
            ["Receipt no.", "JSF/2026-27/00042"],
            ["Amount", "₹1,100"],
            ["In words", "One Thousand One Hundred"],
            ["Mode", "Electronic (UPI)"],
            ["Purpose", "Education & Skills"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-dashed border-sand-dark pb-2">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="absolute -bottom-5 -right-2 flex rotate-[4deg] items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-xl sm:-right-6">
        <CircleCheck className="h-5 w-5" /> Emailed to you
      </div>
    </div>
  );
}

/** How giving works, as cards that stack while you scroll (Skiper UI 16). */
export function GivingStack() {
  return (
    <StickyStack
      cards={[
        <StepCard
          key="1"
          tone="light"
          icon={Heart}
          title="Choose a cause."
          text="Pick where your gift goes and how much. It takes under a minute, and you'll see exactly what it can do."
          visual={<ChooseVisual />}
        />,
        <StepCard
          key="2"
          tone="dark"
          icon={Smartphone}
          title="Pay by UPI."
          text="Scan the QR or tap to open your UPI app. The money goes straight into our bank account: no card details, no gateway fees."
          visual={<PhoneMockup />}
        />,
        <StepCard
          key="3"
          tone="sun"
          icon={BadgeCheck}
          title="Get your receipt."
          text={`We match your payment with our bank statement and email a numbered receipt within ${site.donation.confirmationDays} working days.`}
          visual={<ReceiptVisual />}
        />,
      ]}
    />
  );
}
