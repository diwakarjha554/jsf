"use client";

import { Building2Fallback } from "./icons";
import { Smartphone } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { isPlaceholder, site } from "@/content/site";
import { buildUpiUri, donationNote } from "@/lib/upi";
import { cn, formatINR } from "@/lib/utils";
import { buttonClass } from "../ui/button";
import { CopyButton } from "../ui/client-bits";

export type PayMethod = "UPI" | "Bank transfer";

function Row({ label, value, copy = true }: { label: string; value: string; copy?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</dt>
        <dd className="truncate font-mono text-[15px] font-semibold text-brand-900">{value}</dd>
      </div>
      {copy && <CopyButton value={value} label="Copy" className="shrink-0" />}
    </div>
  );
}

export function UpiPay({
  amount,
  refCode,
  method,
  onMethodChange,
}: {
  amount: number;
  refCode: string;
  method: PayMethod;
  onMethodChange: (m: PayMethod) => void;
}) {
  const d = site.donation;
  const upiUri = buildUpiUri({ upiId: d.upiId, payeeName: d.payeeName, amount, note: donationNote(refCode) });
  const [qr, setQr] = useState("");
  const configured = !isPlaceholder(d.upiId);

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(upiUri, {
      width: 560,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#0f3a39", light: "#ffffff" },
    })
      .then((url) => alive && setQr(url))
      .catch(() => alive && setQr(""));
    return () => {
      alive = false;
    };
  }, [upiUri]);

  const tab = (m: PayMethod, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={method === m}
      onClick={() => onMethodChange(m)}
      className={cn(
        "flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200",
        method === m ? "bg-white text-brand-900 shadow-sm" : "text-muted hover:text-brand-900",
      )}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div role="tablist" aria-label="Payment method" className="flex gap-1 rounded-xl bg-sand p-1">
        {tab("UPI", "UPI (recommended)")}
        {tab("Bank transfer", "Bank transfer")}
      </div>

      {method === "UPI" ? (
        <div className="mt-6 grid items-start gap-6 md:grid-cols-[15rem_1fr]">
          <div className="mx-auto w-full max-w-[15rem]">
            <div className="rounded-3xl border border-sand-dark bg-white p-3 shadow-[0_24px_50px_-30px_rgb(36_22_69/0.5)]">
              {qr ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qr}
                  width={560}
                  height={560}
                  alt={`UPI QR code to pay ${formatINR(amount)} to ${d.payeeName}`}
                  className="aspect-square w-full"
                />
              ) : (
                <div className="aspect-square w-full animate-pulse rounded-2xl bg-sand" />
              )}
            </div>
            <p className="mt-2 text-center text-xs text-muted">Scan with Google Pay, PhonePe, Paytm, BHIM or any bank app</p>
          </div>

          <div>
            <a href={upiUri} className={buttonClass("primary", "lg", "w-full md:hidden")}>
              <Smartphone className="h-5 w-5" aria-hidden="true" />
              Pay {formatINR(amount)} with UPI app
            </a>
            <p className="mt-3 text-sm text-muted md:mt-0">
              <span className="md:hidden">Or pay manually: open</span>
              <span className="hidden md:inline">Open</span> your UPI app, choose <b>Pay to UPI ID</b> and use these details.
            </p>
            <dl className="mt-3 divide-y divide-sand-dark rounded-2xl border border-sand-dark bg-cream px-4">
              <Row label="UPI ID" value={d.upiId} />
              <Row label="Amount" value={String(amount)} />
              <Row label="Note / remarks" value={refCode} />
            </dl>
            <p className="mt-3 rounded-2xl bg-brand-50 p-3 text-sm text-brand-900">
              Before you pay, check that your UPI app shows the payee name <b>{d.payeeName}</b>.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-[15px] text-muted">
            Transfer by NEFT, IMPS or RTGS from your bank or bank app. Put <b className="text-brand-900">{refCode}</b> in the
            remarks so we can match your payment.
          </p>
          <dl className="mt-4 divide-y divide-sand-dark rounded-2xl border border-sand-dark bg-cream px-4">
            <Row label="Account name" value={d.bank.accountName} />
            <Row label="Account number" value={d.bank.accountNumber} />
            <Row label="IFSC" value={d.bank.ifsc} />
            <Row label="Bank and branch" value={`${d.bank.bankName}, ${d.bank.branch}`} copy={false} />
            <Row label="Account type" value={d.bank.accountType} copy={false} />
            <Row label="Amount" value={String(amount)} />
            <Row label="Remarks" value={refCode} />
          </dl>
          <p className="mt-3 flex items-start gap-2 text-sm text-muted">
            <Building2Fallback className="mt-0.5 h-4 w-4 shrink-0" />
            First-time transfers may take a few hours while your bank adds us as a payee.
          </p>
        </div>
      )}

      {!configured && (
        <p className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <b>Setup needed:</b> the foundation&apos;s UPI ID and bank details are placeholders. Add them in{" "}
          <code>src/content/site.ts</code> before launch.
        </p>
      )}
    </div>
  );
}
