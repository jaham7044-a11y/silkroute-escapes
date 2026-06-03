import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ROUTES } from "@/data/routes";
import { SectionLabel } from "@/components/SectionLabel";
import { ArrowRight, Calendar, Check, Map as MapIcon, MapPin, Plane } from "lucide-react";

export const Route = createFileRoute("/routes/$id")({
  head: ({ params }) => {
    const r = ROUTES.find((x) => x.id === params.id);
    return {
      meta: [
        { title: r ? `${r.title} — Silk Route Escapes` : "Route — Silk Route Escapes" },
        { name: "description", content: r?.description ?? "Premium guided China tour route." },
        { property: "og:title", content: r?.title ?? "Route" },
        { property: "og:description", content: r?.description ?? "" },
        ...(r ? [{ property: "og:image", content: r.image }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const r = ROUTES.find((x) => x.id === params.id);
    if (!r) throw notFound();
    return r;
  },
  component: RouteDetailPage,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center text-ivory">
      <div className="text-center">
        <h1 className="font-display text-4xl mb-4">Route not found</h1>
        <Link to="/routes" className="text-gold">← Back to all routes</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center text-ivory">
      <p>{error.message}</p>
    </div>
  ),
});

function RouteDetailPage() {
  const r = Route.useLoaderData();

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
        <img src={r.image} alt={r.title} className="absolute inset-0 h-full w-full object-cover ken-burns" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/60 via-navy-deep/40 to-background" />
        <div className="relative z-10 mx-auto h-full max-w-7xl px-6 flex flex-col justify-end pb-24">
          <SectionLabel>{r.activity} Journey</SectionLabel>
          <h1 className="mt-6 font-display text-5xl md:text-7xl text-ivory leading-tight max-w-4xl">{r.title}</h1>
          <div className="mt-8 flex flex-wrap gap-6 text-ivory">
            <Pill icon={<Plane className="h-4 w-4 text-gold" />}>{r.from} → {r.to}</Pill>
            <Pill icon={<Calendar className="h-4 w-4 text-gold" />}>{r.duration}</Pill>
            <Pill icon={<MapPin className="h-4 w-4 text-gold" />}>Private Tour</Pill>
            <div className="ml-auto glass-strong rounded-full px-6 py-2.5">
              <span className="text-xs text-ivory/60 mr-2">From</span>
              <span className="font-display text-2xl text-gold-gradient">${r.price.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* OVERVIEW + INCLUDED */}
      <section className="mx-auto max-w-7xl px-6 py-24 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionLabel>Overview</SectionLabel>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-ivory leading-tight">A bespoke journey, in your own time.</h2>
          <p className="mt-6 text-ivory/70 leading-relaxed text-lg">{r.description}</p>

          <h3 className="mt-12 font-display text-2xl text-gold">Highlights</h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {r.highlights.map((h) => (
              <div key={h} className="flex items-center gap-3 glass rounded-xl px-4 py-3 text-ivory/85">
                <span className="h-1.5 w-1.5 rounded-full gold-gradient" />
                {h}
              </div>
            ))}
          </div>
        </div>
        <aside className="lg:sticky lg:top-28 h-fit">
          <div className="glass-strong rounded-2xl p-8">
            <h3 className="font-display text-2xl text-gold mb-6">What's Included</h3>
            <ul className="space-y-4">
              {r.included.map((i) => (
                <li key={i} className="flex items-center gap-3 text-ivory/85 text-sm">
                  <Check className="h-4 w-4 text-gold" /> {i}
                </li>
              ))}
            </ul>
            <Link to="/contact" className="mt-8 w-full inline-flex justify-center items-center gap-3 rounded-full gold-gradient px-6 py-3.5 text-sm font-medium text-navy-deep">
              Request a Quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </section>

      {/* ITINERARY */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <SectionLabel>Day by Day</SectionLabel>
        <h2 className="mt-4 font-display text-4xl md:text-5xl text-ivory leading-tight">Your interactive itinerary</h2>
        <div className="mt-12 relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
          <div className="space-y-8">
            {r.itinerary.map((d, i) => (
              <div key={d.day} className={`relative md:grid md:grid-cols-2 md:gap-12 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div className={`pl-12 md:pl-0 ${i % 2 ? "md:text-left" : "md:text-right"}`}>
                  <div className="glass rounded-2xl p-6 inline-block">
                    <div className="text-xs uppercase tracking-[0.3em] text-gold">Day {d.day}</div>
                    <h3 className="mt-2 font-display text-2xl text-ivory">{d.title}</h3>
                    <p className="mt-2 text-sm text-ivory/65">{d.detail}</p>
                  </div>
                </div>
                <div className="hidden md:block" />
                <div className="absolute left-2 md:left-1/2 top-6 -translate-x-1/2 grid h-5 w-5 place-items-center rounded-full gold-gradient ring-4 ring-background">
                  <span className="text-[10px] font-bold text-navy-deep">{d.day}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP / CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="glass-strong rounded-3xl p-10 md:p-16 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <SectionLabel>Your Route</SectionLabel>
            <h2 className="mt-4 font-display text-4xl md:text-5xl text-ivory leading-tight">
              {r.from} <span className="text-gold">→</span> {r.to}
            </h2>
            <p className="mt-4 text-ivory/70">A direct, premium pathway designed by our team — fly-in, transfer, and we handle the rest.</p>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gold/20 grid place-items-center bg-navy-deep">
            <MapIcon className="h-16 w-16 text-gold/40" />
            <div className="absolute bottom-4 left-4 right-4 glass rounded-xl px-4 py-3 text-ivory text-sm flex justify-between">
              <span>{r.from}, USA</span>
              <span className="text-gold">✈</span>
              <span>{r.to}, China</span>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="font-display text-4xl text-ivory">Interested in this route?</h3>
          <p className="mt-3 text-ivory/65">Tell us your dates and we'll craft a tailored quote within 24 hours.</p>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-3 rounded-full gold-gradient px-8 py-4 text-sm font-medium text-navy-deep shadow-luxe">
            Request Quote <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function Pill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="glass rounded-full px-5 py-2 flex items-center gap-2 text-sm">
      {icon} {children}
    </div>
  );
}