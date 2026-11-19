import { Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Accent, Container } from "@/components/ui/layout";

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-mesh-warm py-[clamp(5rem,4rem+6vw,10rem)]">
      <div className="absolute inset-0 -z-10 bg-grid-faint [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]" aria-hidden="true" />
      <Container className="max-w-2xl text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-900 text-sun-300 shadow-xl">
          <Compass className="h-10 w-10 animate-spin-slow" aria-hidden="true" />
        </span>
        <h1 className="text-display mt-8 font-display font-semibold text-brand-900">
          Page <Accent>not found</Accent>
        </h1>
        <p className="text-lead mt-4 text-muted">The page you&apos;re looking for has moved or doesn&apos;t exist.</p>
        <div className="mt-9 flex flex-col justify-center gap-3 min-[420px]:flex-row">
          <ButtonLink href="/" variant="dark">
            Go to the home page
          </ButtonLink>
          <ButtonLink href="/donate">Donate</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
