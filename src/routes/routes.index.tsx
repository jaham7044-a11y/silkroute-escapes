import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ROUTES } from "@/data/routes";
import { RouteCard } from "@/components/RouteCard";
import { SectionLabel } from "@/components/SectionLabel";
import heroImg from "@/assets/route-shanghai.jpg";

export const Route = createFileRoute("/routes/")({
  head: () => ({
    meta: [
      { title: "All Routes — Silk Route Escapes" },
      { name: "description", content: "Browse premium guided routes from US cities to Shanghai, Beijing, Guangzhou and beyond." },
      { property: "og:title", content: "All Routes — Silk Route Escapes" },
      { property: "og:description", content: "Premium guided routes from the USA to China." },
    ],
  }),
  component: RoutesPage,
});

const DEPARTURES = ["All", ...Array.from(new Set(ROUTES.map((r) => r.from)))];
const DESTS = ["All", ...Array.from(new Set(ROUTES.map((r) => r.to)))];
const ACTIVITIES = ["All", "Culture", "Adventure", "City", "Nature"];

function RoutesPage() {
  const [from, setFrom] = useState("All");
  const [to, setTo] = useState("All");
  const [budget, setBudget] = useState(5000);
  const [duration, setDuration] = useState("All");
  const [activity, setActivity] = useState("All");

  const filtered = useMemo(
    () =>
      ROUTES.filter(
        (r) =>
          (from === "All" || r.from === from) &&
          (to === "All" || r.to === to) &&
          (activity === "All" || r.activity === activity) &&
          r.price <= budget &&
          (duration === "All" ||
            (duration === "Short" && r.days <= 7) ||
            (duration === "Medium" && r.days > 7 && r.days <= 10) ||
            (duration === "Long" && r.days > 10))
      ),
    [from, to, budget, duration, activity]
  );

  return (
    <div>
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover ken-burns" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy-deep/50 to-background" />
        <div className="relative z-10 mx-auto h-full max-w-7xl px-6 flex flex-col justify-end pb-20">
          <SectionLabel>The Collection</SectionLabel>
          <h1 className="mt-6 font-display text-6xl md:text-7xl text-ivory leading-tight">
            Every <span className="italic text-gold-gradient">route</span>, every dream
          </h1>
          <p className="mt-4 max-w-xl text-ivory/70">Explore our complete catalogue of premium journeys.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 -mt-12 relative z-20">
        <div className="glass-strong rounded-2xl p-6 md:p-8 grid gap-5 md:grid-cols-5">
          <Filter label="Departure" value={from} onChange={setFrom} options={DEPARTURES} />
          <Filter label="Destination" value={to} onChange={setTo} options={DESTS} />
          <Filter label="Duration" value={duration} onChange={setDuration} options={["All", "Short", "Medium", "Long"]} />
          <Filter label="Activity" value={activity} onChange={setActivity} options={ACTIVITIES} />
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.25em] text-gold">Budget · up to ${budget.toLocaleString()}</label>
            <input
              type="range"
              min={1500}
              max={5000}
              step={100}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="accent-[color:var(--gold)]"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-8 text-sm text-ivory/60">{filtered.length} route{filtered.length !== 1 ? "s" : ""} found</div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => <RouteCard key={r.id} route={r} />)}
        </div>
        {filtered.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center text-ivory/70">
            No routes match those filters. Try expanding your search.
          </div>
        )}
      </section>
    </div>
  );
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] uppercase tracking-[0.25em] text-gold">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-b border-gold/30 text-ivory py-2 focus:outline-none focus:border-gold"
      >
        {options.map((o) => <option key={o} value={o} className="bg-navy-deep">{o}</option>)}
      </select>
    </div>
  );
}