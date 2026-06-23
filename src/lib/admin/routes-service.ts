import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AdminRoute } from "./storage";

const COL = "routes";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function normalize(id: string, data: Record<string, unknown>): AdminRoute {
  const toIso = (v: unknown): string => {
    if (!v) return new Date().toISOString();
    // Firestore Timestamp has toDate()
    if (typeof v === "object" && v !== null && "toDate" in (v as object)) {
      try {
        return (v as { toDate: () => Date }).toDate().toISOString();
      } catch {
        return new Date().toISOString();
      }
    }
    if (typeof v === "string") return v;
    return new Date().toISOString();
  };
  const d = data as Partial<AdminRoute> & Record<string, unknown>;
  return {
    id,
    routeName: d.routeName ?? "",
    departureCity: d.departureCity ?? "",
    destinationCity: d.destinationCity ?? "",
    duration: d.duration ?? "",
    startingPrice: Number(d.startingPrice ?? 0),
    shortDescription: d.shortDescription ?? "",
    fullDescription: d.fullDescription ?? "",
    highlights: d.highlights ?? [],
    includedItems: d.includedItems ?? [],
    coverImageUrl: d.coverImageUrl ?? "",
    galleryImages: d.galleryImages ?? [],
    youtubeVideos: d.youtubeVideos ?? [],
    journeyVideos: (d as { journeyVideos?: unknown }).journeyVideos as AdminRoute["journeyVideos"] ?? [],
    activities: d.activities ?? [],
    itinerary: d.itinerary ?? [],
    isFeatured: !!d.isFeatured,
    isActive: d.isActive !== false,
    displayOrder: Number(d.displayOrder ?? 0),
    travelType: (d.travelType as AdminRoute["travelType"]) ?? "City",
    createdAt: toIso(d.createdAt),
    updatedAt: toIso(d.updatedAt),
  };
}

export const routesService = {
  async list(): Promise<AdminRoute[]> {
    const snap = await getDocs(query(collection(db, COL), orderBy("displayOrder", "asc")));
    return snap.docs.map((d) => normalize(d.id, d.data()));
  },
  async get(id: string): Promise<AdminRoute | null> {
    const ref = doc(db, COL, id);
    const s = await getDoc(ref);
    if (!s.exists()) return null;
    return normalize(s.id, s.data());
  },
  async create(input: Omit<AdminRoute, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<string> {
    const id = (input.id?.trim() || slugify(input.routeName) || `route-${Date.now()}`);
    const { id: _drop, createdAt: _c, updatedAt: _u, ...rest } = input as AdminRoute;
    void _drop; void _c; void _u;
    await setDoc(doc(db, COL, id), {
      ...rest,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return id;
  },
  async update(id: string, patch: Partial<AdminRoute>): Promise<void> {
    const { id: _i, createdAt: _c, updatedAt: _u, ...rest } = patch as AdminRoute;
    void _i; void _c; void _u;
    await updateDoc(doc(db, COL, id), { ...rest, updatedAt: serverTimestamp() });
  },
  async remove(id: string): Promise<void> {
    await deleteDoc(doc(db, COL, id));
  },
};