"use client";

import { CircleCheck, Link2, Mail, Search, Share2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { site } from "@/content/site";
import { DONATION_REF_PATTERN } from "@/lib/upi";
import { formatINR } from "@/lib/utils";
import { ButtonLink } from "../ui/button";
import { WhatsAppIcon } from "../ui/social-icons";

export function ThankYou() {
  const params = useSearchParams();
  const ref = params.get("ref") ?? "";
  const amount = Number(params.get("amount")) || 0;
  const validRef = DONATION_REF_PATTERN.test(ref);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${site.url}/donate`;
  const shareText = `I just supported ${site.name}, which works for education, healthcare and communities across India. You can give by UPI in under a minute: ${shareUrl}`;

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: site.name, text: shareText, url: shareUrl });
        return;
      } catch {
        /* cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/30"><CircleCheck className="h-10 w-10" aria-hidden="true" /></span>
      <h1 className="text-display mt-6 font-display font-semibold text-brand-900">Thank <span className="text-accent">you!</span></h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        {amount > 0 ? (
          <>
            Your gift of <b className="text-brand-900">{formatINR(amount)}</b> means a great deal to us.
          </>
        ) : (
          "Your gift means a great deal to us."
        )}{" "}
        {validRef && (
          <>
            Your reference is <b className="font-mono text-brand-900">{ref}</b>.
          </>
        )}
      </p>

      <ol className="mt-10 grid gap-4 text-left sm:grid-cols-3">
        {[
          { icon: Mail, title: "Check your inbox", text: "We've emailed you the details of your payment." },
          { icon: Search, title: "We verify", text: "Our team matches your payment with our bank statement." },
          {
            icon: CircleCheck,
            title: "Receipt follows",
            text: `Your receipt arrives by email within ${site.donation.confirmationDays} working days.`,
          },
        ].map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="rounded-3xl border border-sand-dark bg-white p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-3 font-semibold text-brand-900">
              {i + 1}. {title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
          </li>
        ))}
      </ol>

      <div className="grain relative mt-10 overflow-hidden rounded-4xl bg-mesh-dark p-6 text-white md:p-10">
        <Share2 className="mx-auto h-8 w-8 text-sun-300" aria-hidden="true" />
        <h2 className="mt-3 font-display text-2xl font-semibold">Double your impact</h2>
        <p className="mt-2 text-brand-100">Tell friends and family. Every share helps us reach someone new.</p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 font-semibold text-white hover:brightness-95"
          >
            <WhatsAppIcon className="h-5 w-5" /> Share on WhatsApp
          </a>
          <button
            type="button"
            onClick={share}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 font-semibold text-white hover:bg-white/10"
          >
            <Link2 className="h-5 w-5" aria-hidden="true" /> {copied ? "Link copied" : "Share link"}
          </button>
        </div>
      </div>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/get-involved/volunteer" variant="outline">
          Volunteer with us
        </ButtonLink>
        <ButtonLink href="/stories" variant="ghost">
          Read our stories
        </ButtonLink>
      </div>
    </div>
  );
}
