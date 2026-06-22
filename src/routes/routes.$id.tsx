import { createFileRoute, Link } from "@tanstack/react-router";
import { ROUTES } from "@/data/routes";
import type { TourRoute } from "@/data/routes";
import { DEFAULT_VIDEOS } from "@/data/routes";
import { VideoSection, VideoCarousel } from "@/components/VideoSection";
import { SectionLabel } from "@/components/SectionLabel";
import { ArrowRight, Calendar, Check, MapPin, Plane, DollarSign, Users, Compass, Loader2 } from "lucide-react";
import galleryLantern from "@/assets/gallery-lantern.jpg";
import galleryTea from "@/assets/gallery-tea.jpg";
import galleryTrain from "@/assets/gallery-train.jpg";
import heroGreatwall from "@/assets/hero-greatwall.jpg";
import routeShanghai from "@/assets/route-shanghai.jpg";
import routeBeijing from "@/assets/route-beijing.jpg";
import { useEffect, useState } from "react";
import { loadFirebaseRoutes, type PublicRoute } from "@/lib/public/firebase-routes";

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
  component: RouteDetailPage,
  notFoundComponent: NotFoundView,
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center text-ivory">
      <p>{error.message}</p>
    </div>
  ),
});

function RouteDetailPage() {
  const { id } = Route.useParams();
  const staticRoute = ROUTES.find((x) => x.id === id);
  const [firebaseRoute, setFirebaseRoute] = useState<PublicRoute | null>(null);
  const [status, setStatus] = useState<"resolved" | "loading" | "missing">(
    staticRoute ? "resolved" : "loading"
  );

  useEffect(() => {
    if (staticRoute) {
      setStatus("resolved");
      return;
    }
    let mounted = true;
    loadFirebaseRoutes()
      .then((routes) => {
        if (!mounted) return;
        const match = routes.find((r) => r.id === id);
        if (match) {
          setFirebaseRoute(match);
          setStatus("resolved");
        } else {
          setStatus("missing");
        }
      })
      .catch(() => mounted && setStatus("missing"));
    return () => {
      mounted = false;
    };
  }, [id, staticRoute]);

  if (status === "loading") {
    return (
      <div className="min-h-screen grid place-items-center text-ivory">
        <div className="flex items-center gap-3 text-ivory/70">
          <Loader2 className="h-5 w-5 animate-spin text-gold" /> Loading route…
        </div>
      </div>
    );
  }

  if (status === "missing") return <NotFoundView />;

  const r = (staticRoute ?? firebaseRoute) as TourRoute;
  const pub = firebaseRoute;
  const overviewText = pub?.fullDescription?.trim() || r.description;
  const activities = pub?.activities ?? [];
  const galleryImages = pub?.galleryImages ?? [];

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

      {/* OVERVIEW STATS */}
      <section className="mx-auto max-w-7xl px-6 pt-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 glass-strong rounded-3xl p-6">
          <Stat icon={<Plane className="h-5 w-5 text-gold" />} label="Departure" value={r.from} />
          <Stat icon={<MapPin className="h-5 w-5 text-gold" />} label="Destination" value={r.to} />
          <Stat icon={<Calendar className="h-5 w-5 text-gold" />} label="Duration" value={r.duration} />
          <Stat icon={<Users className="h-5 w-5 text-gold" />} label="Travel Type" value={`${r.activity} · Private`} />
          <Stat icon={<DollarSign className="h-5 w-5 text-gold" />} label="Starting From" value={`$${r.price.toLocaleString()}`} />
        </div>
      </section>

      {/* OVERVIEW + INCLUDED */}
      <section className="mx-auto max-w-7xl px-6 py-24 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionLabel>Overview</SectionLabel>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-ivory leading-tight">A bespoke journey, in your own time.</h2>
          <p className="mt-6 text-ivory/70 leading-relaxed text-lg whitespace-pre-line">{overviewText}</p>

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

      {/* ACTIVITIES (admin-driven) */}
      {activities.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <SectionLabel>Experiences</SectionLabel>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-ivory leading-tight">Curated activities</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((a, i) => (
              <article key={i} className="group glass rounded-2xl overflow-hidden border border-gold/15">
                {a.imageUrl ? (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={a.imageUrl}
                      alt={a.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy-deep/10 to-transparent" />
                    {a.dayNumber ? (
                      <span className="absolute top-3 left-3 glass rounded-full px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
                        Day {a.dayNumber}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                <div className="p-5">
                  <h3 className="font-display text-xl text-ivory">{a.title}</h3>
                  {a.description && (
                    <p className="mt-2 text-sm text-ivory/65 leading-relaxed">{a.description}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* GALLERY */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionLabel>Activity Gallery</SectionLabel>
        <h2 className="mt-4 font-display text-4xl md:text-5xl text-ivory leading-tight">Moments from the journey</h2>
        <Gallery cover={r.image} extra={[...galleryImages, ...activities.map((a) => a.imageUrl).filter(Boolean)]} />
      </section>

      {/* MAP */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="glass-strong rounded-3xl p-10 md:p-16 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <SectionLabel>Your Route</SectionLabel>
            <h2 className="mt-4 font-display text-4xl md:text-5xl text-ivory leading-tight">
              {r.from} <span className="text-gold">→</span> {r.to}
            </h2>
            <p className="mt-4 text-ivory/70">A direct, premium pathway designed by our team — fly-in, transfer, and we handle the rest. Trans-Pacific flight with onward private transfer in China.</p>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="glass rounded-xl py-3"><div className="font-display text-2xl text-gold">~13h</div><div className="text-[10px] uppercase tracking-widest text-ivory/55 mt-1">Flight</div></div>
              <div className="glass rounded-xl py-3"><div className="font-display text-2xl text-gold">{r.days}</div><div className="text-[10px] uppercase tracking-widest text-ivory/55 mt-1">Days</div></div>
              <div className="glass rounded-xl py-3"><div className="font-display text-2xl text-gold">5★</div><div className="text-[10px] uppercase tracking-widest text-ivory/55 mt-1">Hotels</div></div>
            </div>
          </div>
          <RouteMap from={r.from} to={r.to} />
        </div>
      </section>

      {/* TRAVEL VIDEOS */}
      <VideoSection videos={r.videos ?? DEFAULT_VIDEOS} />

      {/* JOURNEY THROUGH VIDEO — CAROUSEL */}
      <VideoCarousel videos={r.videos ?? DEFAULT_VIDEOS} />

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">

        <div className="glass-strong rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 50% 0%, var(--gold), transparent 60%)" }} />
          <div className="relative">
            <SectionLabel>Ready to Travel</SectionLabel>
            <h3 className="mt-4 font-display text-4xl md:text-5xl text-ivory">Interested in this route?</h3>
            <p className="mt-4 text-ivory/65 max-w-xl mx-auto">Tell us your dates and we'll craft a tailored quote within 24 hours. No obligation, just expert advice from our China specialists.</p>
            <Link to="/contact" className="mt-10 inline-flex items-center gap-3 rounded-full gold-gradient px-10 py-4 text-sm font-medium text-navy-deep shadow-luxe hover:scale-105 transition">
              Request Quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
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

function NotFoundView() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="glass-strong relative max-w-xl w-full rounded-3xl p-12 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 0%, var(--gold), transparent 60%)" }}
        />
        <div className="relative">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/40 text-gold">
            <Compass className="h-7 w-7" />
          </div>
          <SectionLabel><span className="mt-6 inline-block">404 · Off the map</span></SectionLabel>
          <h1 className="mt-4 font-display text-4xl md:text-5xl text-ivory leading-tight">
            This route isn't <span className="italic text-gold-gradient">on our atlas</span>
          </h1>
          <p className="mt-4 text-ivory/65">
            The journey you're looking for may have been retired or never existed. Browse our full collection or speak with a concierge.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/routes" className="inline-flex items-center gap-2 rounded-full gold-gradient px-6 py-3 text-sm font-medium text-navy-deep">
              Browse All Routes <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-ivory/30 px-6 py-3 text-sm text-ivory hover:border-gold hover:text-gold transition">
              Contact a Specialist
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="grid h-10 w-10 place-items-center rounded-full border border-gold/30 shrink-0">{icon}</div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-ivory/50">{label}</div>
        <div className="font-display text-lg text-ivory truncate">{value}</div>
      </div>
    </div>
  );
}

function Gallery({ cover, extra = [] }: { cover: string; extra?: string[] }) {
  const dedupedExtra = Array.from(new Set(extra.filter(Boolean)));
  const images = dedupedExtra.length > 0
    ? [cover, ...dedupedExtra]
    : [cover, galleryLantern, galleryTea, heroGreatwall, galleryTrain, routeShanghai, routeBeijing];
  const [active, setActive] = useState<string | null>(null);
  return (
    <>
      <div className="mt-10 grid gap-4 grid-cols-2 md:grid-cols-4 auto-rows-[180px]">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(src)}
            className={`group relative overflow-hidden rounded-2xl border border-gold/15 ${i === 0 ? "col-span-2 row-span-2" : ""} ${i === 3 ? "md:row-span-2" : ""}`}
          >
            <img src={src} alt="Journey moment" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-navy-deep/20 group-hover:bg-navy-deep/0 transition" />
          </button>
        ))}
      </div>
      {active && (
        <div onClick={() => setActive(null)} className="fixed inset-0 z-50 bg-navy-deep/95 backdrop-blur-lg grid place-items-center p-6 cursor-zoom-out animate-fade-in">
          <img src={active} alt="Expanded" className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-luxe" />
        </div>
      )}
    </>
  );
}

function RouteMap({ from, to }: { from: string; to: string }) {
  return (
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gold/20 bg-[oklch(0.12_0.03_260)]">
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="arc" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.13 75)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="oklch(0.78 0.13 75)" stopOpacity="1" />
            <stop offset="100%" stopColor="oklch(0.78 0.13 75)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {[...Array(8)].map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} stroke="oklch(0.78 0.13 75)" strokeOpacity="0.06" />
        ))}
        {[...Array(11)].map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="300" stroke="oklch(0.78 0.13 75)" strokeOpacity="0.06" />
        ))}
        {/* USA blob */}
        <ellipse cx="80" cy="160" rx="70" ry="50" fill="oklch(0.78 0.13 75)" fillOpacity="0.08" />
        {/* China blob */}
        <ellipse cx="320" cy="140" rx="65" ry="55" fill="oklch(0.78 0.13 75)" fillOpacity="0.08" />
        {/* Arc */}
        <path d="M 80 160 Q 200 20 320 140" stroke="url(#arc)" strokeWidth="2.5" fill="none" strokeDasharray="6 6">
          <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.5s" repeatCount="indefinite" />
        </path>
        {/* Plane */}
        <circle cx="200" cy="60" r="5" fill="oklch(0.78 0.13 75)">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Points */}
        <circle cx="80" cy="160" r="7" fill="oklch(0.78 0.13 75)" />
        <circle cx="80" cy="160" r="14" fill="oklch(0.78 0.13 75)" fillOpacity="0.2" />
        <circle cx="320" cy="140" r="7" fill="oklch(0.78 0.13 75)" />
        <circle cx="320" cy="140" r="14" fill="oklch(0.78 0.13 75)" fillOpacity="0.2" />
      </svg>
      <div className="absolute top-4 left-4 glass rounded-lg px-3 py-1.5 text-xs text-ivory">{from} <span className="text-ivory/40">USA</span></div>
      <div className="absolute top-4 right-4 glass rounded-lg px-3 py-1.5 text-xs text-ivory">{to} <span className="text-ivory/40">CHN</span></div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass rounded-full px-4 py-1.5 text-[10px] uppercase tracking-widest text-gold">Trans-Pacific Route</div>
    </div>
  );
}