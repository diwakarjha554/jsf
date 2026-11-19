import { Heart, Mail } from "lucide-react";
import { NewsletterForm } from "../forms/newsletter-form";
import { ButtonLink } from "../ui/button";
import { Accent, Container } from "../ui/layout";

/** Big sunrise-gradient call to action with slowly turning rings. */
export function DonateBand({
  title = (
    <>
      Your support <Accent>changes lives</Accent>
    </>
  ),
  text = "Give by UPI in under a minute. No gateway fees, and a receipt for every rupee.",
  cause,
}: {
  title?: React.ReactNode;
  text?: string;
  cause?: string;
}) {
  return (
    <section className="bg-cream py-[clamp(2.5rem,2rem+2vw,4.5rem)]">
      <Container>
        <div
          data-reveal="scale"
          className="grain relative isolate overflow-hidden rounded-[2rem] bg-[linear-gradient(120deg,var(--color-sun-200),var(--color-sun-400)_40%,var(--color-ember-400))] px-6 py-10 text-brand-950 sm:rounded-[2.5rem] sm:px-10 md:px-14 md:py-14 xl:px-16"
        >
          <div
            className="absolute -right-24 -top-24 -z-10 aspect-square w-[28rem] animate-spin-slow opacity-60"
            style={{ backgroundImage: "repeating-radial-gradient(circle, transparent 0 30px, rgb(255 255 255 / 0.55) 30px 31.5px)" }}
            aria-hidden="true"
          />
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-title font-display font-semibold text-balance [&_.text-accent]:[background-image:linear-gradient(100deg,var(--color-brand-800),var(--color-ember-700))]">
                {title}
              </h2>
              <p className="text-lead mt-4 max-w-2xl text-brand-950/80">{text}</p>
            </div>
            <div className="flex flex-col gap-3 min-[420px]:flex-row">
              <ButtonLink href={cause ? `/donate?cause=${cause}` : "/donate"} variant="dark" size="lg">
                <Heart className="h-5 w-5 text-sun-400" fill="currentColor" aria-hidden="true" />
                Donate now
              </ButtonLink>
              <ButtonLink href="/get-involved/volunteer" variant="outline" size="lg" className="border-brand-950/20 bg-white/40">
                Volunteer
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function NewsletterBand() {
  return (
    <section className="bg-cream pb-[clamp(2.5rem,2rem+2vw,4.5rem)]">
      <Container>
        <div
          data-reveal
          className="grid grid-cols-1 items-center gap-8 rounded-[2rem] border border-sand-dark bg-white p-5 shadow-[0_30px_60px_-45px_rgb(36_22_69/0.5)] min-[400px]:p-6 sm:p-10 lg:grid-cols-2 lg:p-14"
        >
          <div className="flex items-start gap-5">
            <span className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-900 text-sun-300 sm:flex">
              <Mail className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.4rem)] font-semibold leading-tight text-brand-900">
                News from the ground, <Accent>once a month</Accent>
              </h2>
              <p className="mt-3 leading-relaxed text-muted">
                Programme updates, upcoming events like Ram Leela and health camps, and simple ways to help.
              </p>
            </div>
          </div>
          <NewsletterForm source="newsletter-band" className="w-full lg:max-w-lg lg:justify-self-end" />
        </div>
      </Container>
    </section>
  );
}
