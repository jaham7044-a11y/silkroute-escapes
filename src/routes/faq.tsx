import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionLabel } from "@/components/SectionLabel";
import { Plus, Minus } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Luxury China Travels" },
      { name: "description", content: "Answers to common questions about visas, flights, customization, payments, and private tours." },
      { property: "og:title", content: "FAQ — Luxury China Travels" },
      { property: "og:description", content: "Common questions about traveling with Luxury China Travels." },
    ],
  }),
  component: FaqPage,
});

const QA = [
  { q: "Do you arrange visas?", a: "Yes. Every booking includes complimentary visa advisory and document review. For an additional fee we'll handle the entire process end-to-end." },
  { q: "Are flights included?", a: "International flights are quoted separately so you retain full control of class, miles, and routing. We're happy to book on your behalf at preferred rates." },
  { q: "Can packages be customized?", a: "Absolutely — every itinerary is a starting point. Add private chefs, helicopter transfers, additional cities, or extend your stay. Just ask." },
  { q: "What payment methods are accepted?", a: "All major credit cards, ACH, and wire transfer. A 25% deposit secures your dates; the balance is due 45 days before departure." },
  { q: "Do you offer private tours?", a: "All Luxury China Travels journeys are private by default. You'll have a dedicated guide and driver for the duration of your trip." },
  { q: "Can families travel together?", a: "Yes. We design multi-generational journeys with family-friendly hotels, kid-engaging guides, and flexible pacing." },
];

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="pt-32 pb-32">
      <section className="mx-auto max-w-4xl px-6">
        <SectionLabel>Frequently Asked</SectionLabel>
        <h1 className="mt-4 font-display text-6xl md:text-7xl text-ivory leading-tight">
          Everything you'd <span className="italic text-gold-gradient">like to know</span>
        </h1>

        <div className="mt-16 space-y-4">
          {QA.map((item, i) => (
            <div key={i} className={`glass rounded-2xl overflow-hidden transition-all ${open === i ? "border-gold/50" : ""}`}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-6 p-6 text-left"
              >
                <span className="font-display text-xl md:text-2xl text-ivory">{item.q}</span>
                {open === i ? <Minus className="h-5 w-5 text-gold flex-shrink-0" /> : <Plus className="h-5 w-5 text-gold flex-shrink-0" />}
              </button>
              {open === i && (
                <div className="px-6 pb-6 text-ivory/70 leading-relaxed animate-fade-up">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}