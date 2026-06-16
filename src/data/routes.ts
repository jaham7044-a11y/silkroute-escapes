import shanghai from "@/assets/route-shanghai.jpg";
import beijing from "@/assets/route-beijing.jpg";
import zhangjiajie from "@/assets/route-zhangjiajie.jpg";
import guangzhou from "@/assets/route-guangzhou.jpg";
import guilin from "@/assets/route-guilin.jpg";
import xian from "@/assets/route-xian.jpg";

export type TourRoute = {
  id: string;
  from: string;
  to: string;
  title: string;
  duration: string;
  days: number;
  price: number;
  description: string;
  image: string;
  activity: "Culture" | "Adventure" | "City" | "Nature";
  highlights: string[];
  included: string[];
  itinerary: { day: number; title: string; detail: string }[];
  videos?: { title: string; youtubeUrl: string; description?: string; duration?: string }[];
};

const DEFAULT_VIDEOS = [
  { title: "Shanghai City Highlights", description: "A cinematic tour of the Bund, Pudong and beyond.", duration: "8:42", youtubeUrl: "https://youtu.be/LhAf2Xe8US8?si=kdckmXyr0m0x4wuO" },
  { title: "Exploring Beijing", description: "Imperial palaces, hutongs, and the Great Wall.", duration: "12:15", youtubeUrl: "https://youtu.be/ll_8Hsxa7Qg?si=XC_6_sQvn4ssjagQ" },
  { title: "Hidden Gems of China", description: "Off-the-beaten-path discoveries across the country.", duration: "10:03", youtubeUrl: "https://youtu.be/17e_19if6Io?si=9dzF60DtglyH3yzS" },
];

export const ROUTES: TourRoute[] = [
  {
    id: "lasvegas-shanghai",
    from: "Las Vegas",
    to: "Shanghai",
    title: "Neon Skylines: Vegas to Shanghai",
    duration: "7 Days / 6 Nights",
    days: 7,
    price: 1999,
    description: "Trade the Strip for the Bund — a fast-paced introduction to Shanghai's skyline, French Concession, and culinary jewels.",
    image: shanghai,
    activity: "City",
    highlights: ["The Bund at Dusk", "Yu Garden", "Xintiandi Dining", "Shanghai Tower", "Tianzifang Lanes", "Maglev Experience"],
    included: ["5★ Hotel", "Airport Transfers", "Private Guided Tours", "High-Speed Rail", "Daily Breakfast", "24/7 Concierge"],
    itinerary: [
      { day: 1, title: "Arrival in Shanghai", detail: "Private transfer to your 5★ riverside hotel, welcome tea ceremony." },
      { day: 2, title: "The Bund & Old City", detail: "Walking tour of colonial architecture and Yu Garden." },
      { day: 3, title: "Pudong Skyline", detail: "Shanghai Tower observation deck and Jin Mao." },
      { day: 4, title: "French Concession", detail: "Boutique-lined plane tree avenues and curated lunch." },
      { day: 5, title: "Suzhou Day Trip", detail: "Bullet train to the Venice of the East." },
      { day: 6, title: "Leisure & Shopping", detail: "Nanjing Road, IFC, and a Huangpu river cruise." },
      { day: 7, title: "Departure", detail: "Private airport transfer." },
    ],
  },
  {
    id: "la-beijing",
    from: "Los Angeles",
    to: "Beijing",
    title: "Imperial Beijing from Los Angeles",
    duration: "8 Days / 7 Nights",
    days: 8,
    price: 2299,
    description: "Walk the Great Wall, stand in the Forbidden City, and dine on Peking duck in the heart of imperial China.",
    image: beijing,
    activity: "Culture",
    highlights: ["Great Wall — Mutianyu", "Forbidden City", "Temple of Heaven", "Summer Palace", "Hutong Rickshaw", "Peking Duck Banquet"],
    included: ["5★ Hotel", "Airport Transfers", "Expert Historians", "All Transport", "Daily Breakfast", "Entrance Fees"],
    itinerary: [
      { day: 1, title: "Arrival in Beijing", detail: "Private transfer and welcome dinner." },
      { day: 2, title: "Forbidden City & Tiananmen", detail: "Half-day with imperial historian." },
      { day: 3, title: "The Great Wall", detail: "Private Mutianyu section with cable car." },
      { day: 4, title: "Summer Palace", detail: "Imperial garden walk and Kunming Lake cruise." },
      { day: 5, title: "Hutongs & Tea", detail: "Rickshaw through historic alleys, tea house ceremony." },
      { day: 6, title: "Temple of Heaven", detail: "Sacred architecture and royal park." },
      { day: 7, title: "Shopping & Spa", detail: "Wangfujing and 798 Art District." },
      { day: 8, title: "Departure", detail: "Private airport transfer." },
    ],
  },
  {
    id: "sf-shanghai",
    from: "San Francisco",
    to: "Shanghai",
    title: "Pacific Gateway: SF to Shanghai",
    duration: "10 Days / 9 Nights",
    days: 10,
    price: 2799,
    description: "An extended Shanghai exploration with water town excursions and a curated culinary deep-dive.",
    image: shanghai,
    activity: "City",
    highlights: ["The Bund", "Zhujiajiao Water Town", "Hangzhou West Lake", "Michelin Tasting", "Disneyland Shanghai", "Tea Plantation"],
    included: ["5★ Hotels", "Private Driver", "Michelin Lunches", "All Transfers", "Daily Breakfast", "24/7 Concierge"],
    itinerary: Array.from({ length: 10 }, (_, i) => ({
      day: i + 1,
      title: ["Arrival", "Bund Walk", "Pudong", "Zhujiajiao", "Hangzhou", "West Lake", "Tea Country", "Michelin Tour", "Free Day", "Departure"][i],
      detail: "Curated daily program with private guide.",
    })),
  },
  {
    id: "nyc-beijing",
    from: "New York",
    to: "Beijing",
    title: "Empire to Empire: NYC to Beijing",
    duration: "12 Days / 11 Nights",
    days: 12,
    price: 3199,
    description: "The signature Silk Route experience — Beijing, Xi'an's Terracotta Army, and Shanghai by private bullet train.",
    image: xian,
    activity: "Culture",
    highlights: ["Great Wall", "Terracotta Army", "Forbidden City", "Bullet Train", "Shanghai Bund", "Imperial Banquet"],
    included: ["5★ Hotels", "First-Class Rail", "Private Guides", "All Meals on Tour Days", "Entrance Fees", "Concierge"],
    itinerary: Array.from({ length: 12 }, (_, i) => ({
      day: i + 1,
      title: ["Arrival Beijing", "Forbidden City", "Great Wall", "Hutongs", "Xi'an Flight", "Terracotta Army", "Muslim Quarter", "Bullet Train", "Shanghai Bund", "Yu Garden", "Free Day", "Departure"][i],
      detail: "Signature programming with senior guide.",
    })),
  },
  {
    id: "chicago-shanghai",
    from: "Chicago",
    to: "Shanghai",
    title: "Windy City to the Bund",
    duration: "9 Days / 8 Nights",
    days: 9,
    price: 2499,
    description: "Architecture lovers' paradise — from Chicago's skyline to Shanghai's art deco and futurist towers.",
    image: shanghai,
    activity: "City",
    highlights: ["Bund Architecture Tour", "Power Station of Art", "Long Museum", "Rooftop Bar Series", "Suzhou Gardens", "Shanghai Tower"],
    included: ["Boutique Hotels", "Architecture Historian", "All Transport", "Daily Breakfast", "Cocktail Experiences", "Concierge"],
    itinerary: Array.from({ length: 9 }, (_, i) => ({
      day: i + 1,
      title: ["Arrival", "Bund Tour", "Pudong Towers", "Art Museums", "French Concession", "Suzhou", "Cocktail Crawl", "Free Day", "Departure"][i],
      detail: "Curated architectural and design programming.",
    })),
  },
  {
    id: "houston-guangzhou",
    from: "Houston",
    to: "Guangzhou",
    title: "Southern Gateway: Houston to Guangzhou",
    duration: "8 Days / 7 Nights",
    days: 8,
    price: 2099,
    description: "Discover Cantonese culture, dim sum mastery, and the futuristic Pearl River Delta.",
    image: guangzhou,
    activity: "City",
    highlights: ["Canton Tower", "Shamian Island", "Dim Sum Master Class", "Pearl River Cruise", "Chen Clan Academy", "Foshan Day Trip"],
    included: ["5★ Hotel", "Private Transfers", "Culinary Guides", "All Transport", "Daily Breakfast", "Concierge"],
    itinerary: Array.from({ length: 8 }, (_, i) => ({
      day: i + 1,
      title: ["Arrival", "Old Canton", "Dim Sum Class", "Pearl River", "Shamian Island", "Foshan", "Shopping", "Departure"][i],
      detail: "Hands-on cultural immersion.",
    })),
  },
];

export const DESTINATIONS = [
  { name: "Shanghai", category: "Cities", image: shanghai, blurb: "Futurist skyline meets art deco soul." },
  { name: "Beijing", category: "Historical Sites", image: beijing, blurb: "The imperial capital — six centuries of dynasty." },
  { name: "Xi'an", category: "Historical Sites", image: xian, blurb: "The Terracotta Army and the Silk Road's eastern gate." },
  { name: "Zhangjiajie", category: "Nature", image: zhangjiajie, blurb: "Floating sandstone peaks above a sea of mist." },
  { name: "Guilin", category: "Nature", image: guilin, blurb: "Karst mountains mirrored in the Li River." },
  { name: "Guangzhou", category: "Cities", image: guangzhou, blurb: "Cantonese gastronomy and Pearl River neon." },
  { name: "Shenzhen", category: "Cities", image: shanghai, blurb: "China's silicon valley by the South Sea." },
  { name: "Hangzhou", category: "Luxury Experiences", image: guilin, blurb: "West Lake serenity and Longjing tea estates." },
  { name: "Suzhou", category: "Luxury Experiences", image: guilin, blurb: "Classical gardens and silk mastery." },
  { name: "Chengdu", category: "Nature", image: zhangjiajie, blurb: "Pandas, Sichuan spice, and tea-house culture." },
];