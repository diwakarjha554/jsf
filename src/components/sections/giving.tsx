import { CircleCheck, Heart, Receipt, Smartphone } from "lucide-react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

// Fixed pattern for a decorative (non-scannable) QR in the mockup.
const QR_BITS = [
  "1110100101",
  "0101101011",
  "1011010110",
  "0110111001",
  "1101000111",
  "0011101010",
  "1010010111",
  "0111101100",
  "1100110101",
  "0101011011",
];

function FakeQr() {
  const cell = 10;
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={30} height={30} rx={6} fill="#160d2d" />
      <rect x={x + 5} y={y + 5} width={20} height={20} rx={4} fill="#fff" />
      <rect x={x + 9} y={y + 9} width={12} height={12} rx={3} fill="#160d2d" />
    </g>
  );
  return (
    <svg viewBox="0 0 140 140" className="h-full w-full" aria-hidden="true">
      <rect width="140" height="140" rx="14" fill="#fff" />
      {QR_BITS.map((row, y) =>
        row.split("").map((b, x) =>
          b === "1" && !((x < 3 && y < 3) || (x > 6 && y < 3) || (x < 3 && y > 6)) ? (
            <rect key={`${x}-${y}`} x={20 + x * cell} y={20 + y * cell} width={cell - 2} height={cell - 2} rx={2} fill="#241645" />
          ) : null,
        ),
      )}
      {finder(15, 15)}
      {finder(95, 15)}
      {finder(15, 95)}
      <circle cx="70" cy="70" r="11" fill="#ffc233" />
    </svg>
  );
}

/** Illustration of the UPI payment screen (decorative). */
export function PhoneMockup({ className }: { className?: string }) {
  return (
    <div className={cn("relative mx-auto w-full max-w-[19rem]", className)} role="img" aria-label="Illustration: paying ₹1,100 to Jeevansphere Foundation with a UPI app">
      <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(255_194_51/0.45),transparent)] blur-2xl" aria-hidden="true" />
      <div className="rounded-[2.6rem] bg-brand-950 p-2.5 shadow-[0_50px_100px_-40px_rgb(22_13_45/0.8)] ring-1 ring-white/10">
        <div className="relative overflow-hidden rounded-[2.1rem] bg-cream">
          <div className="mx-auto mt-2.5 h-5 w-24 rounded-full bg-brand-950" aria-hidden="true" />
          <div className="px-5 pb-6 pt-4">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Paying to</p>
            <p className="mt-1 text-center font-display text-base font-semibold text-brand-900">{site.donation.payeeName}</p>
            <div className="mx-auto mt-4 aspect-square w-[78%] rounded-2xl bg-white p-2 shadow-sm ring-1 ring-sand-dark">
              <FakeQr />
            </div>
            <p className="mt-4 text-center font-display text-3xl font-semibold text-brand-900">₹1,100</p>
            <p className="mt-1 text-center text-xs text-muted">Note: JSF-261115-7K3Q Donation</p>
            <div className="mt-4 rounded-xl bg-[linear-gradient(110deg,var(--color-sun-300),var(--color-sun-500))] py-3 text-center text-sm font-bold text-brand-950">
              Pay ₹1,100
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -right-4 top-[38%] flex animate-float items-center gap-2.5 rounded-2xl bg-white p-3 pr-4 shadow-xl shadow-brand-950/15 ring-1 ring-sand-dark min-[400px]:-right-16 lg:-right-24">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
          <CircleCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-left">
          <span className="block text-sm font-bold text-brand-900">Payment successful</span>
          <span className="block text-xs text-muted">UPI ref 6123 4567 8901</span>
        </span>
      </div>
      <div className="absolute -bottom-5 -left-4 flex animate-float-delayed items-center gap-2.5 rounded-2xl bg-brand-900 p-3 pr-4 text-white shadow-xl shadow-brand-950/25 min-[400px]:-left-16 lg:-left-24">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sun-400 text-brand-950">
          <Receipt className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-left">
          <span className="block text-sm font-bold">Receipt emailed</span>
          <span className="block text-xs text-brand-200">JSF/2026-27/00042</span>
        </span>
      </div>
    </div>
  );
}

export function GivingSteps() {
  const steps = [
    { icon: Heart, title: "Choose a cause", text: "Pick a cause and an amount. It takes under a minute." },
    { icon: Smartphone, title: "Pay by UPI", text: "Scan the QR, or tap to open your UPI app. Money goes straight to our bank account." },
    {
      icon: Receipt,
      title: "Get your receipt",
      text: `We match your payment with our bank statement and email a receipt within ${site.donation.confirmationDays} working days.`,
    },
  ];
  return (
    <ol className="relative space-y-4">
      <span className="absolute bottom-10 left-[1.95rem] top-10 w-px bg-linear-to-b from-sun-400 via-ember-400 to-brand-400 sm:left-[2.2rem]" aria-hidden="true" />
      {steps.map(({ icon: Icon, title, text }, i) => (
        <li
          key={title}
          data-reveal="left"
          style={{ "--d": `${i * 120}ms` } as React.CSSProperties}
          className="group relative flex gap-4 rounded-3xl border border-sand-dark bg-white/80 p-4 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-white hover:shadow-[0_24px_50px_-30px_rgb(36_22_69/0.45)] sm:gap-5 sm:p-5"
        >
          <span className="relative z-[1] flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-900 text-sun-300 transition group-hover:bg-sun-400 group-hover:text-brand-950 sm:h-14 sm:w-14">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-xl font-semibold text-brand-900">{title}</h3>
            <p className="mt-1.5 leading-relaxed text-muted">{text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
