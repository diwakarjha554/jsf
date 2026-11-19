"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { buttonClass } from "../ui/button";
import { WhatsAppIcon } from "../ui/social-icons";

/** Bottom "Donate" bar on phones (hidden on the donate pages themselves) + WhatsApp button. */
export function FloatingActions() {
  const pathname = usePathname();
  const onDonate = pathname?.startsWith("/donate");
  const whatsapp = site.contact.whatsapp;

  return (
    <>
      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hello ${site.name}, I'd like to know more.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className={cn(
            "group fixed right-4 z-30 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-xl shadow-black/20 transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 sm:bottom-6",
            onDonate ? "bottom-6" : "bottom-24",
          )}
        >
          <span className="absolute inset-0 animate-pulse-ring rounded-2xl bg-[#25D366]" aria-hidden="true" />
          <WhatsAppIcon className="relative h-7 w-7" />
        </a>
      )}
      {!onDonate && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sand-dark/80 bg-cream/90 p-3 backdrop-blur-xl sm:hidden">
          <Link href="/donate" className={buttonClass("primary", "md", "w-full")}>
            <Heart className="h-4 w-4" fill="currentColor" aria-hidden="true" />
            Donate now
          </Link>
        </div>
      )}
    </>
  );
}
