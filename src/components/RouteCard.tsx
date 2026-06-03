import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Plane } from "lucide-react";
import type { TourRoute } from "@/data/routes";

export function RouteCard({ route }: { route: TourRoute }) {
  return (
    <Link
      to="/routes/$id"
      params={{ id: route.id }}
      className="group relative overflow-hidden rounded-2xl border border-gold/15 bg-card transition duration-500 hover:border-gold/50 hover:-translate-y-1 shadow-luxe block"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={route.image}
          alt={route.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent" />
        <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold">
          {route.activity}
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-ivory text-sm">
          <Plane className="h-4 w-4 text-gold" />
          <span className="font-medium">{route.from}</span>
          <span className="text-gold">→</span>
          <span className="font-medium">{route.to}</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl text-ivory leading-tight">{route.title}</h3>
        <p className="mt-2 text-sm text-ivory/60 line-clamp-2">{route.description}</p>
        <div className="hairline my-5" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-ivory/70">
            <Clock className="h-3.5 w-3.5 text-gold" />
            {route.duration}
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.2em] text-ivory/50">From</div>
            <div className="font-display text-2xl text-gold-gradient">${route.price.toLocaleString()}</div>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-2 text-sm text-gold group-hover:gap-3 transition-all">
          View Details <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}