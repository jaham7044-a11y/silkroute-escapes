import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import heroImg from "@/assets/hero-greatwall.jpg";
import teaImg from "@/assets/gallery-tea.jpg";
import lanternImg from "@/assets/gallery-lantern.jpg";
import trainImg from "@/assets/gallery-train.jpg";
import zjjImg from "@/assets/route-zhangjiajie.jpg";
import beijingImg from "@/assets/route-beijing.jpg";
import shanghaiImg from "@/assets/route-shanghai.jpg";
import guilinImg from "@/assets/route-guilin.jpg";
import { ROUTES } from "@/data/routes";
import { RouteCard } from "@/components/RouteCard";
import { SectionLabel } from "@/components/SectionLabel";
import { useFirebaseRoutes } from "@/hooks/use-firebase-routes";
import { ArrowRight, Award, Headphones, Hotel, MapPin, ShieldCheck, Sparkles, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luxury China Travels — Luxury China Travel from the USA" },
      { name: "description", content: "Concierge-led luxury travel packages from American cities to Beijing, Shanghai, Xi'an and beyond. 5★ hotels, private guides, unforgettable journeys." },
      { property: "og:title", content: "Luxury China Travels — Luxury China Travel" },
      { property: "og:description", content: "Concierge-led luxury journeys from the USA to China." },
    ],
  }),
  component: HomePage,
});

const STATS = [
  { value: 5000, suffix: "+", label: "Happy Travelers" },
  { value: 50, suffix: "+", label: "Premium Routes" },
  { value: 15, suffix: "+", label: "Years Experience" },
  { value: 98, suffix: "%", label: "Satisfaction" },
];

const WHY = [
  { icon: Sparkles, title: "Handpicked Experiences", text: "Every itinerary curated by China-based experts who live what they sell." },
  { icon: MapPin, title: "Local Expert Guides", text: "Licensed historians and storytellers — not scripts." },
  { icon: Hotel, title: "Luxury Accommodations", text: "Forbes 5★ properties and boutique heritage stays." },
  { icon: Award, title: "Flexible Packages", text: "Tailor every day. Private or small-group." },
  { icon: ShieldCheck, title: "Secure Booking", text: "Bonded, insured, and ATOL-equivalent protected." },
  { icon: Headphones, title: "24/7 Concierge", text: "A real human on the ground, around the clock." },
];

const TESTIMONIALS = [
  { name: "Eleanor & James W.", trip: "NYC → Beijing", quote: "The most thoughtfully orchestrated trip of our lives. Our guide felt like a friend by day three." },
  { name: "Marcus T.", trip: "LA → Beijing", quote: "Sunrise on the Great Wall, alone with our private guide. I will never forget it." },
  { name: "The Chen Family", trip: "SF → Shanghai", quote: "They handled visas, dietary needs, even our daughter's birthday surprise. Flawless." },
];

function useCounter(target: number, start: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    const dur = 1600;
    const t0 = performance.now();
    let r = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      setN(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) r = requestAnimationFrame(tick);
    };
    r = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(r);
  }, [target, start]);
  return n;
}

function Stat({ value, suffix, label, visible }: { value: number; suffix: string; label: string; visible: boolean }) {
  const n = useCounter(value, visible);
  return (
    <div className="text-center">
      <div className="font-display text-5xl md:text-6xl text-gold-gradient">
        {n.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-xs uppercase tracking-[0.3em] text-ivory/60">{label}</div>
    </div>
  );
}

function HomePage() {
  const statRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setStatsVisible(true)), { threshold: 0.3 });
    if (statRef.current) obs.observe(statRef.current);
    return () => obs.disconnect();
  }, []);

  const { routes: firebaseRoutes } = useFirebaseRoutes();
  const staticFeatured = ROUTES.slice(0, 6);
  const firebaseFeatured = firebaseRoutes.filter((r) => r.isFeatured);
  const featured = [...staticFeatured, ...firebaseFeatured];

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      {/* HERO */}
      <section className="relative h-screen min-h-[720px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Great Wall of China at sunrise" width={1920} height={1080} className="h-full w-full object-cover ken-burns" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy-deep/40 to-navy-deep" />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6">
          <div className="max-w-3xl animate-fade-up">
            <SectionLabel>Luxury Travel · USA → China</SectionLabel>
            <h1 className="mt-6 font-display text-6xl md:text-8xl leading-[1.02] text-ivory">
              Discover China <br />
              <span className="italic text-gold-gradient">Like Never Before</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-ivory/75 leading-relaxed">
              Luxury travel experiences from the United States to China's most breathtaking destinations — concierge-led, expertly guided, unforgettable.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/routes" className="group inline-flex items-center gap-3 rounded-full gold-gradient px-8 py-4 text-sm font-medium tracking-wide text-navy-deep transition hover:scale-[1.03] shadow-luxe">
                Explore Routes <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-3 rounded-full border border-ivory/40 px-8 py-4 text-sm tracking-wide text-ivory transition hover:border-gold hover:text-gold">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-ivory/60 text-xs tracking-[0.3em] uppercase animate-bounce">
          Scroll
        </div>
      </section>

      {/* STATS */}
      <section ref={statRef} className="relative -mt-16 z-20 mx-auto max-w-6xl px-6">
        <div className="glass-strong rounded-3xl px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} visible={statsVisible} />
          ))}
        </div>
      </section>

      {/* FEATURED ROUTES */}
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <SectionLabel>Featured Journeys</SectionLabel>
            <h2 className="mt-4 font-display text-5xl md:text-6xl text-ivory max-w-2xl leading-tight">
              Signature routes, <span className="italic text-gold-gradient">expertly crafted</span>
            </h2>
          </div>
          <Link to="/routes" className="inline-flex items-center gap-2 text-gold hover:gap-3 transition-all">
            View All Routes <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((r) => <RouteCard key={r.id} route={r} />)}
        </div>
      </section>

      {/* WHY US */}
      <section className="relative py-32">
        <div className="absolute inset-0 opacity-30">
          <img src={zjjImg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-navy-deep/85" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <SectionLabel>Why Travel With Us</SectionLabel>
            <h2 className="mt-4 font-display text-5xl md:text-6xl text-ivory leading-tight">
              The Luxury China Travels <span className="italic text-gold-gradient">difference</span>
            </h2>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WHY.map(({ icon: Icon, title, text }) => (
              <div key={title} className="glass rounded-2xl p-8 transition hover:-translate-y-1 hover:border-gold/40">
                <div className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 text-gold">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl text-ivory">{title}</h3>
                <p className="mt-2 text-sm text-ivory/65 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="text-center max-w-2xl mx-auto">
          <SectionLabel><span className="mx-auto">Traveler Stories</span></SectionLabel>
          <h2 className="mt-4 font-display text-5xl md:text-6xl text-ivory leading-tight">
            Voices from the <span className="italic text-gold-gradient">journey</span>
          </h2>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="glass rounded-2xl p-8 flex flex-col">
              <div className="flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="mt-6 font-display text-xl text-ivory leading-relaxed italic">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-auto pt-6 border-t border-gold/20">
                <div className="text-ivory font-medium">{t.name}</div>
                <div className="text-xs text-gold tracking-wider uppercase">{t.trip}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="flex items-end justify-between mb-10">
          <div>
            <SectionLabel>Through Our Lens</SectionLabel>
            <h2 className="mt-4 font-display text-4xl md:text-5xl text-ivory">A glimpse of China</h2>
          </div>
          <Link to="/gallery" className="text-gold hover:text-gold-soft inline-flex items-center gap-2">
            Full Gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px] md:auto-rows-[220px]">
          <div className="row-span-2 overflow-hidden rounded-2xl">
            <img src={lanternImg} alt="Lantern" loading="lazy" className="h-full w-full object-cover hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="overflow-hidden rounded-2xl col-span-2">
            <img src={shanghaiImg} alt="Shanghai" loading="lazy" className="h-full w-full object-cover hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="overflow-hidden rounded-2xl">
            <img src={teaImg} alt="Tea" loading="lazy" className="h-full w-full object-cover hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="overflow-hidden rounded-2xl">
            <img src={beijingImg} alt="Beijing" loading="lazy" className="h-full w-full object-cover hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="overflow-hidden rounded-2xl col-span-2">
            <img src={trainImg} alt="Train" loading="lazy" className="h-full w-full object-cover hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="overflow-hidden rounded-2xl">
            <img src={guilinImg} alt="Guilin" loading="lazy" className="h-full w-full object-cover hover:scale-110 transition-transform duration-700" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-32">
        <div className="relative overflow-hidden rounded-3xl">
          <img src={beijingImg} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy-deep/40" />
          <div className="relative px-8 md:px-16 py-20 md:py-28 max-w-3xl">
            <SectionLabel>Begin Your Story</SectionLabel>
            <h2 className="mt-6 font-display text-5xl md:text-6xl text-ivory leading-tight">
              Ready for your next <span className="italic text-gold-gradient">adventure?</span>
            </h2>
            <p className="mt-6 text-ivory/75 text-lg max-w-xl">
              Tell us when, where, and how you dream of traveling. We'll design something extraordinary — just for you.
            </p>
            <Link to="/contact" className="mt-10 inline-flex items-center gap-3 rounded-full gold-gradient px-8 py-4 text-sm font-medium text-navy-deep shadow-luxe hover:scale-[1.03] transition">
              Get Custom Travel Plan <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
