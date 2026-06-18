import { routesService } from "./routes-service";
import type { AdminRoute, AdminVideo } from "./storage";

const SAMPLE_VIDEOS: AdminVideo[] = [
  { title: "Shanghai City Highlights", youtubeUrl: "https://youtu.be/LhAf2Xe8US8", description: "A cinematic tour of the Bund and Pudong." },
  { title: "Exploring Beijing", youtubeUrl: "https://youtu.be/ll_8Hsxa7Qg", description: "Imperial palaces, hutongs, and the Great Wall." },
];

type Seed = Omit<AdminRoute, "id" | "createdAt" | "updatedAt"> & { id: string };

function base(over: Partial<Seed> & Pick<Seed, "id" | "routeName" | "departureCity" | "destinationCity">): Seed {
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
    ...over,
  };
}

const SAMPLES: Seed[] = [
  base({
    id: "lasvegas-shanghai",
    routeName: "Neon Skylines: Vegas to Shanghai",
    departureCity: "Las Vegas",
    destinationCity: "Shanghai",
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
  base({
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
    youtubeVideos: [SAMPLE_VIDEOS[1]],
    isFeatured: true,
    displayOrder: 2,
  }),
  base({
    id: "sf-shanghai",
    routeName: "Pacific Gateway: SF to Shanghai",
    departureCity: "San Francisco",
    destinationCity: "Shanghai",
    duration: "9 Days / 8 Nights",
    startingPrice: 2499,
    shortDescription: "Bay to Bund — extended luxury immersion with Suzhou and Hangzhou day trips.",
    coverImageUrl: "https://images.unsplash.com/photo-1535063406830-27d772ad6b4f?w=1600&q=80",
    displayOrder: 3,
  }),
  base({
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
  base({
    id: "chi-shanghai",
    routeName: "Midwest to Metropolis: Chicago to Shanghai",
    departureCity: "Chicago",
    destinationCity: "Shanghai",
    startingPrice: 2099,
    shortDescription: "Architecture lovers' route featuring skyline tours in both cities.",
    coverImageUrl: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=1600&q=80",
    displayOrder: 5,
  }),
  base({
    id: "hou-guangzhou",
    routeName: "Southern Bridge: Houston to Guangzhou",
    departureCity: "Houston",
    destinationCity: "Guangzhou",
    duration: "8 Days / 7 Nights",
    startingPrice: 2199,
    shortDescription: "Cantonese culinary tour with Pearl River cruises and Hong Kong day trip.",
    coverImageUrl: "https://images.unsplash.com/photo-1551041777-ed7f5b1e1f8e?w=1600&q=80",
    displayOrder: 6,
  }),
];

export async function seedSampleRoutes(): Promise<number> {
  const existing = await routesService.list();
  if (existing.length > 0) return 0;
  let count = 0;
  for (const s of SAMPLES) {
    await routesService.create(s);
    count++;
  }
  return count;
}