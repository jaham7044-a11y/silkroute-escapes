// Public-facing adapter for Firebase routes.
// Fetches admin/Firestore routes and maps them into the public TourRoute shape
// so they can render alongside the existing static ROUTES. Failures are
// swallowed so the public site keeps working even if Firebase is unreachable.

import type { TourRoute } from "@/data/routes";
import type { AdminRoute } from "@/lib/admin/storage";
import { routesService } from "@/lib/admin/routes-service";
import fallbackImg from "@/assets/route-shanghai.jpg";

export type PublicRoute = TourRoute & {
  source: "static" | "firebase";
  isFeatured?: boolean;
  displayOrder?: number;
  galleryImages?: string[];
  shortDescription?: string;
  fullDescription?: string;
  journeyVideos?: { title: string; youtubeUrl: string; description?: string }[];
  activities?: { title: string; description: string; imageUrl: string; dayNumber: number; displayOrder: number }[];
};

function resolveActivity(a: AdminRoute): TourRoute["activity"] {
  if (a.travelType) return a.travelType;
  const hay = `${a.routeName} ${a.shortDescription} ${a.fullDescription}`.toLowerCase();
  if (/(adventure|hike|trek|climb)/.test(hay)) return "Adventure";
  if (/(nature|mountain|river|forest|garden)/.test(hay)) return "Nature";
  if (/(culture|historic|imperial|temple|dynasty)/.test(hay)) return "Culture";
  return "City";
}

function parseDays(duration: string): number {
  const m = duration.match(/(\d+)\s*day/i);
  return m ? Number(m[1]) : 7;
}

export function adminToPublic(a: AdminRoute): PublicRoute {
  const image = a.coverImageUrl?.trim() || a.galleryImages?.[0] || fallbackImg;
  return {
    id: a.id,
    from: a.departureCity || "—",
    to: a.destinationCity || "—",
    title: a.routeName || "Untitled Route",
    duration: a.duration || `${parseDays(a.duration)} Days`,
    days: parseDays(a.duration),
    price: Number(a.startingPrice || 0),
    description: a.shortDescription || a.fullDescription || "",
    image,
    activity: resolveActivity(a),
    highlights: a.highlights?.length ? a.highlights : [],
    included: a.includedItems?.length
      ? a.includedItems
      : ["Hotel", "Airport Transfers", "Guided Tours", "Transportation", "Breakfast", "24/7 Support"],
    itinerary: (a.itinerary ?? []).map((d) => ({
      day: d.dayNumber,
      title: d.title,
      detail: d.description,
    })),
    videos: (a.youtubeVideos ?? []).map((v) => ({
      title: v.title,
      youtubeUrl: v.youtubeUrl,
      description: v.description,
    })),
    journeyVideos: (a.journeyVideos ?? []).map((v) => ({
      title: v.title,
      youtubeUrl: v.youtubeUrl,
      description: v.description,
    })),
    source: "firebase",
    isFeatured: !!a.isFeatured,
    displayOrder: Number(a.displayOrder ?? 0),
    galleryImages: a.galleryImages,
    shortDescription: a.shortDescription,
    fullDescription: a.fullDescription,
    activities: (a.activities ?? [])
      .slice()
      .sort((x, y) => Number(x.displayOrder ?? 0) - Number(y.displayOrder ?? 0)),
  };
}

// Session-scoped cache so we hit Firestore once per page session.
let cachePromise: Promise<PublicRoute[]> | null = null;

export function loadFirebaseRoutes(): Promise<PublicRoute[]> {
  if (cachePromise) return cachePromise;
  cachePromise = (async () => {
    try {
      const all = await routesService.list();
      return all
        .filter((r) => r.isActive !== false)
        .sort((a, b) => Number(a.displayOrder ?? 0) - Number(b.displayOrder ?? 0))
        .map(adminToPublic);
    } catch (err) {
      // Gracefully degrade — public site still works on static data.
      console.warn("[firebase-routes] failed to load, falling back to static only", err);
      return [];
    }
  })();
  return cachePromise;
}

export function invalidateFirebaseRoutesCache() {
  cachePromise = null;
}