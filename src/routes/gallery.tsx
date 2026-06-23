import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionLabel } from "@/components/SectionLabel";
import shanghai from "@/assets/route-shanghai.jpg";
import beijing from "@/assets/route-beijing.jpg";
import zjj from "@/assets/route-zhangjiajie.jpg";
import guangzhou from "@/assets/route-guangzhou.jpg";
import guilin from "@/assets/route-guilin.jpg";
import xian from "@/assets/route-xian.jpg";
import lantern from "@/assets/gallery-lantern.jpg";
import tea from "@/assets/gallery-tea.jpg";
import train from "@/assets/gallery-train.jpg";
import { X } from "lucide-react";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Luxury China Travels" },
      { name: "description", content: "Photography from our China journeys — cities, food, nature, luxury hotels, and culture." },
      { property: "og:title", content: "Gallery — Luxury China Travels" },
      { property: "og:description", content: "Photography from our China journeys." },
    ],
  }),
  component: GalleryPage,
});

const ITEMS = [
  { src: shanghai, cat: "Cities", h: 2 },
  { src: lantern, cat: "Culture", h: 3 },
  { src: tea, cat: "Food", h: 2 },
  { src: zjj, cat: "Nature", h: 3 },
  { src: beijing, cat: "Culture", h: 2 },
  { src: train, cat: "Travelers", h: 2 },
  { src: guangzhou, cat: "Cities", h: 3 },
  { src: guilin, cat: "Nature", h: 2 },
  { src: xian, cat: "Culture", h: 3 },
  { src: tea, cat: "Luxury Hotels", h: 2 },
  { src: lantern, cat: "Culture", h: 2 },
  { src: shanghai, cat: "Cities", h: 3 },
];
const CATS = ["All", "Cities", "Food", "Nature", "Luxury Hotels", "Travelers", "Culture"];

function GalleryPage() {
  const [cat, setCat] = useState("All");
  const [light, setLight] = useState<string | null>(null);
  const filtered = cat === "All" ? ITEMS : ITEMS.filter((i) => i.cat === cat);

  return (
    <div className="pt-32">
      <section className="mx-auto max-w-7xl px-6">
        <SectionLabel>Visual Journey</SectionLabel>
        <h1 className="mt-4 font-display text-6xl md:text-7xl text-ivory leading-tight">
          Through our <span className="italic text-gold-gradient">lens</span>
        </h1>
        <div className="mt-10 flex flex-wrap gap-3">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-5 py-2 text-sm border transition ${
                cat === c ? "gold-gradient text-navy-deep border-transparent" : "border-gold/30 text-ivory/70 hover:border-gold hover:text-gold"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {filtered.map((it, i) => (
          <button
            key={i}
            onClick={() => setLight(it.src)}
            className="block w-full break-inside-avoid overflow-hidden rounded-2xl border border-gold/15 group relative"
            style={{ aspectRatio: it.h === 3 ? "3/4" : "1/1" }}
          >
            <img src={it.src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-navy-deep/0 group-hover:bg-navy-deep/30 transition-colors grid place-items-center">
              <span className="opacity-0 group-hover:opacity-100 text-xs uppercase tracking-[0.3em] text-gold transition">{it.cat}</span>
            </div>
          </button>
        ))}
      </section>

      {light && (
        <div className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-xl grid place-items-center p-6" onClick={() => setLight(null)}>
          <button className="absolute top-6 right-6 text-ivory hover:text-gold"><X /></button>
          <img src={light} alt="" className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-luxe" />
        </div>
      )}
    </div>
  );
}