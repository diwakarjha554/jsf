import type { Metadata } from "next";
import { Suspense } from "react";
import { ThankYou } from "@/components/donate/thank-you";
import { Container } from "@/components/ui/layout";

export const metadata: Metadata = {
  title: "Thank You for Your Donation",
  robots: { index: false, follow: true },
  alternates: { canonical: "/donate/thank-you" },
};

export default function ThankYouPage() {
  return (
    <section className="bg-cream py-16 md:py-24">
      <Container>
        <Suspense fallback={<div className="mx-auto h-96 max-w-2xl animate-pulse rounded-4xl bg-white" aria-hidden="true" />}>
          <ThankYou />
        </Suspense>
      </Container>
    </section>
  );
}
