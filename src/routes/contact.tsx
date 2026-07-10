import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionLabel } from "@/components/SectionLabel";
import { ROUTES } from "@/data/routes";
import { submitContactEnquiry } from "@/lib/api/contact.functions";
import { Check, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";

const CONTACT_DEBUG_VERSION = "contact-debug-ui-v3-2026-07-10";

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<unknown>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs: Record<string, string> = {};

    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();

    if (!name) errs.name = "Required";
    if (!email) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email";

    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const destinations = selected
        .map((id) => ROUTES.find((r) => r.id === id))
        .filter((route): route is (typeof ROUTES)[number] => route != null)
        .map((route) => `${route.from} → ${route.to}`)
        .join(" · ");

      const travelersRaw = String(fd.get("travelers") ?? "").trim();
      setDebugInfo({
        version: CONTACT_DEBUG_VERSION,
        stage: "client-before-server-call",
        submittedAt: new Date().toISOString(),
        payload: {
          hasName: Boolean(name),
          email,
          hasPhone: Boolean(String(fd.get("phone") ?? "").trim()),
          hasCountry: Boolean(String(fd.get("country") ?? "").trim()),
          hasDates: Boolean(String(fd.get("dates") ?? "").trim()),
          travelers: travelersRaw || null,
          destinations: destinations || null,
          hasMessage: Boolean(String(fd.get("message") ?? "").trim()),
        },
      });

      const result = await submitContactEnquiry({
        data: {
          name,
          email,
          phone: String(fd.get("phone") ?? "").trim() || undefined,
          country: String(fd.get("country") ?? "").trim() || undefined,
          dates: String(fd.get("dates") ?? "").trim() || undefined,
          travelers: travelersRaw ? Number(travelersRaw) : undefined,
          destinations: destinations || undefined,
          budget: String(fd.get("budget") ?? "").trim() || undefined,
          message: String(fd.get("message") ?? "").trim() || undefined,
        },
      });

      if (!result.success) {
        setSubmitError(`DEBUG ${CONTACT_DEBUG_VERSION}: ${result.message}`);
        setDebugInfo({
          version: CONTACT_DEBUG_VERSION,
          stage: "client-server-returned-failure",
          serverResult: result,
        });
        return;
      }

      setSent(true);
    } catch (error) {
      setSubmitError(`DEBUG ${CONTACT_DEBUG_VERSION}: Unable to send your message. Please try again.`);
      setDebugInfo({
        version: CONTACT_DEBUG_VERSION,
        stage: "client-catch",
        note: "Request failed before a normal server response was received.",
        error:
          error instanceof Error
            ? { name: error.name, message: error.message, stack: error.stack }
            : { message: String(error) },
      });
    } finally {
      setIsSubmitting(false);
    }
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
                <Field label="Full Name" name="name" required error={errors.name} disabled={isSubmitting} />
                <Field label="Email" name="email" type="email" required error={errors.email} disabled={isSubmitting} />
                <Field label="Phone" name="phone" type="tel" disabled={isSubmitting} />
                <Field label="Country" name="country" disabled={isSubmitting} />
                <Field label="Preferred Travel Dates" name="dates" placeholder="e.g. October 2026" disabled={isSubmitting} />
                <Field label="Number of Travelers" name="travelers" type="number" defaultValue={2} min={1} disabled={isSubmitting} />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-gold">Interested Routes</label>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {ROUTES.map((r) => (
                    <label key={r.id} className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer border transition ${
                      selected.includes(r.id) ? "border-gold bg-gold/10" : "border-gold/20 hover:border-gold/50"
                    } ${isSubmitting ? "opacity-60 pointer-events-none" : ""}`}>
                      <input
                        type="checkbox"
                        className="accent-[color:var(--gold)]"
                        checked={selected.includes(r.id)}
                        onChange={() => toggle(r.id)}
                        disabled={isSubmitting}
                      />
                      <span className="text-sm text-ivory">{r.from} → {r.to}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-gold">Travel Budget</label>
                <select name="budget" disabled={isSubmitting} className="mt-2 w-full bg-transparent border-b border-gold/30 text-ivory py-3 focus:outline-none focus:border-gold disabled:opacity-60">
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
                  disabled={isSubmitting}
                  className="mt-2 w-full bg-transparent border-b border-gold/30 text-ivory py-3 focus:outline-none focus:border-gold resize-none disabled:opacity-60"
                  placeholder="Anything you'd love to experience…"
                />
              </div>

              <div className="rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 text-xs text-gold/80">
                Temporary contact debug build active: <span className="font-mono">{CONTACT_DEBUG_VERSION}</span>
              </div>

              {submitError && (
                <div className="space-y-3" role="alert">
                  <p className="text-sm text-destructive">{submitError}</p>
                  {debugInfo != null && (
                    <pre className="overflow-x-auto rounded-xl border border-destructive/40 bg-navy-deep/80 p-4 text-left text-[11px] leading-relaxed text-ivory/85 whitespace-pre-wrap break-words">
                      {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-3 rounded-full gold-gradient px-8 py-4 text-sm font-medium text-navy-deep shadow-luxe disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Request Quote
                    </>
                  )}
                </button>
                <button type="button" disabled={isSubmitting} className="inline-flex items-center gap-3 rounded-full border border-gold/40 px-8 py-4 text-sm text-gold hover:bg-gold/10 disabled:opacity-60 disabled:cursor-not-allowed">
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
        className="mt-2 w-full bg-transparent border-b border-gold/30 text-ivory py-3 focus:outline-none focus:border-gold placeholder:text-ivory/30 disabled:opacity-60"
      />
      {error && <div className="mt-1 text-xs text-destructive">{error}</div>}
    </div>
  );
}
