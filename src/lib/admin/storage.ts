// Frontend-only admin storage layer.
// Designed to be swapped out for Firebase later — keep the API surface stable.

export type AdminVideo = {
  title: string;
  youtubeUrl: string;
  description?: string;
};

export type AdminActivity = {
  title: string;
  description: string;
  imageUrl: string;
  dayNumber: number;
  displayOrder: number;
};

export type AdminItineraryDay = {
  dayNumber: number;
  title: string;
  description: string;
};

export type AdminRoute = {
  id: string;
  routeName: string;
  departureCity: string;
  destinationCity: string;
  duration: string;
  startingPrice: number;
  shortDescription: string;
  fullDescription: string;
  highlights: string[];
  includedItems: string[];
  coverImageUrl: string;
  galleryImages: string[];
  youtubeVideos: AdminVideo[];
  activities: AdminActivity[];
  itinerary: AdminItineraryDay[];
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "sre.admin.routes.v1";
const AUTH_KEY = "sre.admin.auth.v1";

export const ADMIN_EMAIL = "admin@travel.com";
export const ADMIN_PASSWORD = "admin123";

function now() {
  return new Date().toISOString();
}

function makeRoute(partial: Partial<AdminRoute> & { id: string; routeName: string; departureCity: string; destinationCity: string }): AdminRoute {
  return {
    duration: "7 Days / 6 Nights",
    startingPrice: 1999,
    shortDescription: "",
    fullDescription: "",
    highlights: [],
    includedItems: ["Hotel", "Airport Transfers", "Guided Tours", "Transportation", "Breakfast", "24/7 Support"],
    coverImageUrl: "",
    galleryImages: [],
    youtubeVideos: [],
    activities: [],
    itinerary: [],
    isFeatured: false,
    isActive: true,
    displayOrder: 0,
    createdAt: now(),
    updatedAt: now(),
    ...partial,
  } as AdminRoute;
}

const SAMPLE_VIDEOS: AdminVideo[] = [
  { title: "Shanghai City Highlights", youtubeUrl: "https://youtu.be/LhAf2Xe8US8", description: "A cinematic tour of the Bund and Pudong." },
  { title: "Exploring Beijing", youtubeUrl: "https://youtu.be/ll_8Hsxa7Qg", description: "Imperial palaces, hutongs, and the Great Wall." },
];

const SAMPLE_ROUTES: AdminRoute[] = [
  makeRoute({
    id: "lasvegas-shanghai",
    routeName: "Neon Skylines: Vegas to Shanghai",
    departureCity: "Las Vegas",
    destinationCity: "Shanghai",
    duration: "7 Days / 6 Nights",
    startingPrice: 1999,
    shortDescription: "Trade the Strip for the Bund — Shanghai's skyline, French Concession, and culinary jewels.",
    fullDescription: "A fast-paced introduction to China's most cosmopolitan city with riverside 5★ stays, private cars, and curated dining.",
    highlights: ["The Bund at Dusk", "Yu Garden", "Xintiandi Dining", "Shanghai Tower", "Tianzifang Lanes", "Maglev Experience"],
    coverImageUrl: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=1600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=1200&q=80",
      "https://images.unsplash.com/photo-1506816561089-5cc37b3aa9b0?w=1200&q=80",
    ],
    youtubeVideos: SAMPLE_VIDEOS,
    itinerary: [
      { dayNumber: 1, title: "Arrival in Shanghai", description: "Private transfer to your 5★ riverside hotel and welcome tea." },
      { dayNumber: 2, title: "The Bund & Old City", description: "Walking tour of colonial architecture and Yu Garden." },
      { dayNumber: 3, title: "Pudong Skyline", description: "Shanghai Tower observation deck and Jin Mao." },
    ],
    isFeatured: true,
    displayOrder: 1,
  }),
  makeRoute({
    id: "la-beijing",
    routeName: "Imperial Discovery: LA to Beijing",
    departureCity: "Los Angeles",
    destinationCity: "Beijing",
    duration: "8 Days / 7 Nights",
    startingPrice: 2299,
    shortDescription: "From the Pacific to the Forbidden City — dynasties, dumplings, and the Great Wall.",
    fullDescription: "An immersive imperial journey with palace tours, hutong cycling, and a sunrise Great Wall hike.",
    highlights: ["Great Wall at Mutianyu", "Forbidden City", "Temple of Heaven", "Summer Palace", "Hutong Cycling", "Peking Duck Dinner"],
    coverImageUrl: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1600&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1200&q=80",
    ],
    youtubeVideos: [SAMPLE_VIDEOS[1]],
    isFeatured: true,
    displayOrder: 2,
  }),
  makeRoute({
    id: "sf-shanghai",
    routeName: "Pacific Gateway: SF to Shanghai",
    departureCity: "San Francisco",
    destinationCity: "Shanghai",
    duration: "9 Days / 8 Nights",
    startingPrice: 2499,
    shortDescription: "Bay to Bund — extended luxury immersion with Suzhou and Hangzhou day trips.",
    coverImageUrl: "https://images.unsplash.com/photo-1535063406830-27d772ad6b4f?w=1600&q=80",
    isFeatured: false,
    displayOrder: 3,
  }),
  makeRoute({
    id: "ny-beijing",
    routeName: "Empire to Empire: NYC to Beijing",
    departureCity: "New York",
    destinationCity: "Beijing",
    duration: "10 Days / 9 Nights",
    startingPrice: 2799,
    shortDescription: "Skyscraper to dynasty — first-class flights and Aman-tier accommodations.",
    coverImageUrl: "https://images.unsplash.com/photo-1584646098378-0874589d76a1?w=1600&q=80",
    isFeatured: true,
    displayOrder: 4,
  }),
  makeRoute({
    id: "chi-shanghai",
    routeName: "Midwest to Metropolis: Chicago to Shanghai",
    departureCity: "Chicago",
    destinationCity: "Shanghai",
    duration: "7 Days / 6 Nights",
    startingPrice: 2099,
    shortDescription: "Architecture lovers' route featuring skyline tours in both cities.",
    coverImageUrl: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=1600&q=80",
    displayOrder: 5,
  }),
  makeRoute({
    id: "hou-guangzhou",
    routeName: "Southern Bridge: Houston to Guangzhou",
    departureCity: "Houston",
    destinationCity: "Guangzhou",
    duration: "8 Days / 7 Nights",
    startingPrice: 2199,
    shortDescription: "Cantonese culinary tour with Pearl River cruises and Hong Kong day trip.",
    coverImageUrl: "https://images.unsplash.com/photo-1551041777-ed7f5b1e1f8e?w=1600&q=80",
    isActive: true,
    displayOrder: 6,
  }),
];

function isBrowser() {
  return typeof window !== "undefined";
}

function read(): AdminRoute[] {
  if (!isBrowser()) return SAMPLE_ROUTES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_ROUTES));
      return SAMPLE_ROUTES;
    }
    return JSON.parse(raw) as AdminRoute[];
  } catch {
    return SAMPLE_ROUTES;
  }
}

function write(routes: AdminRoute[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
}

export const adminRoutesStore = {
  list(): AdminRoute[] {
    return read().sort((a, b) => a.displayOrder - b.displayOrder);
  },
  get(id: string): AdminRoute | undefined {
    return read().find((r) => r.id === id);
  },
  create(input: Omit<AdminRoute, "id" | "createdAt" | "updatedAt"> & { id?: string }): AdminRoute {
    const all = read();
    const id = input.id?.trim() || slugify(input.routeName) || `route-${Date.now()}`;
    const route: AdminRoute = {
      ...input,
      id,
      createdAt: now(),
      updatedAt: now(),
    } as AdminRoute;
    write([...all.filter((r) => r.id !== id), route]);
    return route;
  },
  update(id: string, patch: Partial<AdminRoute>): AdminRoute | undefined {
    const all = read();
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) return undefined;
    const next = { ...all[idx], ...patch, id, updatedAt: now() };
    all[idx] = next;
    write(all);
    return next;
  },
  remove(id: string) {
    write(read().filter((r) => r.id !== id));
  },
  reset() {
    write(SAMPLE_ROUTES);
  },
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

// --- Auth (frontend-only placeholder) ---

export function adminLogin(email: string, password: string): boolean {
  if (email.trim().toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) return false;
  if (isBrowser()) {
    window.localStorage.setItem(AUTH_KEY, JSON.stringify({ email, at: now() }));
  }
  return true;
}

export function adminLogout() {
  if (isBrowser()) window.localStorage.removeItem(AUTH_KEY);
}

export function isAdminLoggedIn(): boolean {
  if (!isBrowser()) return false;
  return !!window.localStorage.getItem(AUTH_KEY);
}

export function emptyRoute(): AdminRoute {
  return makeRoute({ id: "", routeName: "", departureCity: "", destinationCity: "" });
}