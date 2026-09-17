import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  tone = "light",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  tone?: "light" | "muted" | "deep";
}) {
  const toneClass =
    tone === "deep" ? "hero-surface" : tone === "muted" ? "bg-muted" : "bg-background";

  return (
    <section id={id} className={`section-pad ${toneClass}`}>
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="text-xs uppercase tracking-[0.35em] text-gold">{eyebrow}</p>
          ) : null}
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl">{title}</h2>
          {description ? (
            <p
              className={`mt-4 text-base ${tone === "deep" ? "opacity-85" : "text-muted-foreground"}`}
            >
              {description}
            </p>
          ) : null}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

export function MoreButton({ to, children }: { to: string; children: ReactNode }) {
  return (
    <a
      href={to}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:w-auto"
    >
      {children}
      <span aria-hidden>→</span>
    </a>
  );
}
