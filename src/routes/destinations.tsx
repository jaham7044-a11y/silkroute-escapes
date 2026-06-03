import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DESTINATIONS } from "@/data/routes";
import { SectionLabel } from "@/components/SectionLabel";

export const Route = createFileRoute("/destinations")({
  head: () => ({
    meta: [
      { title: "Destinations — Silk Route Escapes" },
      { name: "description", content: "Explore China's most extraordinary cities, landscapes, and cultural sites." },
      { property: "og:title", content: "Destinations — Silk Route Escapes" },
      { property: "og:description", content: "Explore China's most extraordinary destinations." },
    ],
  }),
  component: DestinationsPage,
});

const CATS = ["All", "Cities", "Nature", "Historical Sites", "Luxury Experiences"];

function DestinationsPage() {
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? DESTINATIONS : DESTINATIONS.filter((d) => d.category === cat);

  return (
    <div className="pt-32">
      <section className="mx-auto max-w-7xl px-6">
        <SectionLabel>Where We Travel</SectionLabel>
        <h1 className="mt-4 font-display text-6xl md:text-7xl text-ivory max-w-3xl leading-tight">
          A nation of <span className="italic text-gold-gradient">a thousand worlds</span>
        </h1>
        <p className="mt-6 text-ivory/65 max-w-2xl text-lg">
          From the futuristic skylines of Shanghai to the misty karst peaks of Guilin, China offers a breadth of experience few countries can match.
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-5 py-2 text-sm tracking-wide border transition ${
                cat === c
                  ? "gold-gradient text-navy-deep border-transparent"
                  : "border-gold/30 text-ivory/70 hover:border-gold hover:text-gold"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((d) => (
          <article key={d.name} className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-gold/15">
            <img src={d.image} alt={d.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <div className="text-xs uppercase tracking-[0.3em] text-gold">{d.category}</div>
              <h3 className="mt-2 font-display text-4xl text-ivory">{d.name}</h3>
              <p className="mt-2 text-sm text-ivory/75">{d.blurb}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}