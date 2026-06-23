import { createFileRoute } from "@tanstack/react-router";
import { SectionLabel } from "@/components/SectionLabel";
import heroImg from "@/assets/route-beijing.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Luxury China Travels" },
      { name: "description", content: "Travel experts connecting America & China. Meet the team behind Luxury China Travels." },
      { property: "og:title", content: "About — Luxury China Travels" },
      { property: "og:description", content: "Travel experts connecting America & China." },
    ],
  }),
  component: AboutPage,
});

const TEAM = [
  { name: "Daniel Liang", role: "Founder & CEO", bio: "20 years between New York and Shanghai. Former Four Seasons concierge." },
  { name: "Sophie Chen", role: "Head of Travel Design", bio: "Architect-turned-itinerary-curator. Lives between Hangzhou and LA." },
  { name: "Marcus Hayes", role: "Senior Destination Specialist", bio: "Mandarin-fluent guide, fifteen years across the Yangtze region." },
  { name: "Yuki Tanaka", role: "Customer Success Lead", bio: "Always-on concierge, fluent in five languages." },
];

function AboutPage() {
  return (
    <div>
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover ken-burns" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/60 via-navy-deep/50 to-background" />
        <div className="relative z-10 mx-auto h-full max-w-7xl px-6 flex flex-col justify-end pb-20">
          <SectionLabel>About Us</SectionLabel>
          <h1 className="mt-6 font-display text-6xl md:text-7xl text-ivory leading-tight max-w-3xl">
            Travel experts connecting <span className="italic text-gold-gradient">America & China</span>
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <SectionLabel><span className="mx-auto">Our Story</span></SectionLabel>
        <p className="mt-10 font-display text-3xl md:text-4xl text-ivory leading-snug">
          For fifteen years, we've built a bridge between American travelers and the cultural treasures of China —
          <span className="text-gold-gradient italic"> not as a tour operator, but as your personal travel atelier.</span>
        </p>
        <p className="mt-8 text-ivory/65 leading-relaxed">
          Luxury China Travels was founded on a simple belief: travel between America and China should be effortless, immersive, and unmistakably luxurious. We work only with vetted 5★ properties, licensed expert guides, and trusted ground partners. Every journey is privately concierge-led from your first inquiry to your return flight.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 grid gap-6 md:grid-cols-3">
        {[
          ["15+", "Years of operation"],
          ["50+", "Curated routes operated"],
          ["98%", "Client satisfaction score"],
        ].map(([v, l]) => (
          <div key={l} className="glass rounded-2xl p-10 text-center">
            <div className="font-display text-6xl text-gold-gradient">{v}</div>
            <div className="mt-3 text-xs uppercase tracking-[0.3em] text-ivory/60">{l}</div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionLabel>The Team</SectionLabel>
        <h2 className="mt-4 font-display text-5xl md:text-6xl text-ivory">People who make it happen</h2>
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m) => (
            <div key={m.name} className="group">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-navy to-navy-deep border border-gold/20 grid place-items-center">
                <div className="font-display text-7xl text-gold-gradient">
                  {m.name.split(" ").map((s) => s[0]).join("")}
                </div>
              </div>
              <h3 className="mt-5 font-display text-2xl text-ivory">{m.name}</h3>
              <div className="text-xs uppercase tracking-[0.25em] text-gold mt-1">{m.role}</div>
              <p className="mt-3 text-sm text-ivory/65">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}