import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-gold/20 bg-[oklch(0.08_0.025_260)]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full border border-gold/40">
                <span className="font-display text-xl text-gold-gradient">S</span>
              </div>
              <div>
                <div className="font-display text-xl text-ivory">Silk Route Escapes</div>
                <div className="text-xs tracking-[0.3em] text-gold uppercase">Luxury Travel · USA → China</div>
              </div>
            </div>
            <p className="mt-6 max-w-md text-sm text-ivory/60 leading-relaxed">
              Curated luxury journeys from American gateway cities to the most breathtaking destinations across China. Concierge-led, expertly guided, unforgettable.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you — you're on the list.");
              }}
              className="mt-8 flex max-w-md gap-2 glass rounded-full p-2"
            >
              <input
                type="email"
                required
                placeholder="Your email for journey updates"
                className="flex-1 bg-transparent px-4 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none"
              />
              <button className="rounded-full gold-gradient px-5 py-2 text-sm font-medium text-navy-deep">
                Subscribe
              </button>
            </form>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Explore</h4>
            <ul className="space-y-3 text-sm text-ivory/70">
              <li><Link to="/routes" className="hover:text-gold">All Routes</Link></li>
              <li><Link to="/destinations" className="hover:text-gold">Destinations</Link></li>
              <li><Link to="/gallery" className="hover:text-gold">Gallery</Link></li>
              <li><Link to="/about" className="hover:text-gold">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-gold">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-ivory/70">
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-gold" /> 1 Park Avenue, NYC</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> +1 (888) 642-7325</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> hello@silkroute.travel</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] text-gold mb-4">Follow</h4>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-ivory/70 hover:text-gold hover:border-gold transition">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="hairline mt-16 mb-6" />
        <div className="flex flex-col gap-3 sm:flex-row justify-between text-xs text-ivory/40">
          <div>© {new Date().getFullYear()} Silk Route Escapes. All journeys reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold">Privacy</a>
            <a href="#" className="hover:text-gold">Terms</a>
            <a href="#" className="hover:text-gold">Press</a>
          </div>
        </div>
      </div>
    </footer>
  );
}