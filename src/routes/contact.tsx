import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionLabel } from "@/components/SectionLabel";
import { ROUTES } from "@/data/routes";
import { Check, Mail, MapPin, Phone, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Luxury China Travels" },
      { name: "description", content: "Request a personalized quote or schedule a consultation with our travel experts." },
      { property: "og:title", content: "Contact — Luxury China Travels" },
      { property: "og:description", content: "Plan your bespoke China journey." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs: Record<string, string> = {};
    if (!String(fd.get("name") ?? "").trim()) errs.name = "Required";
    if (!String(fd.get("email") ?? "").trim()) errs.email = "Required";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSent(true);
  }

  return (
    <div className="pt-32">
      <section className="mx-auto max-w-7xl px-6">
        <SectionLabel>Begin Your Journey</SectionLabel>
        <h1 className="mt-4 font-display text-6xl md:text-7xl text-ivory leading-tight max-w-3xl">
          Let's design something <span className="italic text-gold-gradient">extraordinary</span>
        </h1>
        <p className="mt-6 text-ivory/65 max-w-2xl text-lg">
          Share a few details and a senior travel designer will reach out within 24 hours with a tailored proposal.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 glass-strong rounded-3xl p-8 md:p-12">
          {sent ? (
            <div className="text-center py-20">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full gold-gradient text-navy-deep">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="mt-6 font-display text-4xl text-ivory">Thank you</h2>
              <p className="mt-3 text-ivory/65">Your inquiry has been received. A travel designer will reach out within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Full Name" name="name" required error={errors.name} />
                <Field label="Email" name="email" type="email" required error={errors.email} />
                <Field label="Phone" name="phone" type="tel" />
                <Field label="Country" name="country" />
                <Field label="Preferred Travel Dates" name="dates" placeholder="e.g. October 2026" />
                <Field label="Number of Travelers" name="travelers" type="number" defaultValue={2} min={1} />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-gold">Interested Routes</label>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {ROUTES.map((r) => (
                    <label key={r.id} className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer border transition ${
                      selected.includes(r.id) ? "border-gold bg-gold/10" : "border-gold/20 hover:border-gold/50"
                    }`}>
                      <input
                        type="checkbox"
                        className="accent-[color:var(--gold)]"
                        checked={selected.includes(r.id)}
                        onChange={() => toggle(r.id)}
                      />
                      <span className="text-sm text-ivory">{r.from} → {r.to}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-gold">Travel Budget</label>
                <select name="budget" className="mt-2 w-full bg-transparent border-b border-gold/30 text-ivory py-3 focus:outline-none focus:border-gold">
                  <option className="bg-navy-deep">$2,000 — $3,000</option>
                  <option className="bg-navy-deep">$3,000 — $5,000</option>
                  <option className="bg-navy-deep">$5,000 — $10,000</option>
                  <option className="bg-navy-deep">$10,000+</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-gold">Tell us about your dream trip</label>
                <textarea
                  name="message"
                  rows={5}
                  maxLength={1000}
                  className="mt-2 w-full bg-transparent border-b border-gold/30 text-ivory py-3 focus:outline-none focus:border-gold resize-none"
                  placeholder="Anything you'd love to experience…"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <button type="submit" className="inline-flex items-center gap-3 rounded-full gold-gradient px-8 py-4 text-sm font-medium text-navy-deep shadow-luxe">
                  <Send className="h-4 w-4" /> Request Quote
                </button>
                <button type="button" className="inline-flex items-center gap-3 rounded-full border border-gold/40 px-8 py-4 text-sm text-gold hover:bg-gold/10">
                  Schedule Consultation
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="space-y-6">
          <div className="glass rounded-2xl p-8">
            <h3 className="font-display text-2xl text-gold mb-5">Reach Us Directly</h3>
            <ul className="space-y-4 text-ivory/85 text-sm">
              <li className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-0.5 text-gold" /> 1 Park Avenue, NYC<br />Shanghai · Beijing · LA</li>
              <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-gold" /> +1 (888) 642-7325</li>
              <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-gold" /> hello@silkroute.travel</li>
            </ul>
          </div>
          <div className="glass rounded-2xl p-8">
            <h3 className="font-display text-2xl text-gold mb-3">Concierge Hours</h3>
            <p className="text-sm text-ivory/70">We're available 24/7 for active travelers. For new inquiries, expect a reply within 24 hours.</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Field({ label, name, error, ...props }: { label: string; name: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.25em] text-gold">{label}</label>
      <input
        name={name}
        {...props}
        className="mt-2 w-full bg-transparent border-b border-gold/30 text-ivory py-3 focus:outline-none focus:border-gold placeholder:text-ivory/30"
      />
      {error && <div className="mt-1 text-xs text-destructive">{error}</div>}
    </div>
  );
}