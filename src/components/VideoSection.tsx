import { useEffect, useRef, useState } from "react";
import { Play, ChevronLeft, ChevronRight, Youtube, X } from "lucide-react";
import { SectionLabel } from "@/components/SectionLabel";

export type TravelVideo = {
  title: string;
  youtubeUrl: string;
  description?: string;
  duration?: string;
};

function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("/")[0] || null;
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => ["embed", "shorts", "v"].includes(p));
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    return null;
  } catch {
    return null;
  }
}

function getEmbedUrl(url: string, autoplay = false): string {
  const id = getYouTubeId(url);
  if (!id) return url;
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    cc_load_policy: "1",
    ...(autoplay ? { autoplay: "1" } : {}),
  });
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

function getThumbnail(url: string): string {
  const id = getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}

function VideoCard({ video, onPlay }: { video: TravelVideo; onPlay: () => void }) {
  const id = getYouTubeId(video.youtubeUrl);

  return (
    <div className="group glass-strong rounded-3xl overflow-hidden border border-gold/15 shadow-luxe transition hover:-translate-y-1 hover:border-gold/40">
      <div className="relative w-full aspect-video bg-navy-deep overflow-hidden">
        <button
          type="button"
          onClick={onPlay}
          aria-label={`Play ${video.title}`}
          className="absolute inset-0 group/btn"
        >
          <img
            src={getThumbnail(video.youtubeUrl)}
            alt={video.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover/btn:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy-deep/20 to-transparent" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid h-16 w-16 md:h-20 md:w-20 place-items-center rounded-full gold-gradient shadow-luxe transition transform group-hover/btn:scale-110">
              <Play className="h-7 w-7 md:h-8 md:w-8 text-navy-deep fill-navy-deep ml-1" />
            </div>
          </div>
          {video.duration && (
            <span className="absolute bottom-3 right-3 glass rounded-md px-2 py-0.5 text-[11px] font-medium text-ivory">
              {video.duration}
            </span>
          )}
        </button>
      </div>
      <div className="p-5 md:p-6">
        <h3 className="font-display text-xl text-ivory leading-snug">{video.title}</h3>
        {video.description && (
          <p className="mt-2 text-sm text-ivory/60 leading-relaxed">{video.description}</p>
        )}
        <a
          href={id ? `https://www.youtube.com/watch?v=${id}` : video.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:text-ivory transition"
        >
          <Youtube className="h-4 w-4" /> Watch on YouTube
        </a>
      </div>
    </div>
  );
}

function VideoModal({
  videos,
  activeIndex,
  onClose,
  onChange,
}: {
  videos: TravelVideo[];
  activeIndex: number;
  onClose: () => void;
  onChange: (idx: number) => void;
}) {
  const video = videos[activeIndex];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && activeIndex < videos.length - 1) onChange(activeIndex + 1);
      else if (e.key === "ArrowLeft" && activeIndex > 0) onChange(activeIndex - 1);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeIndex, videos.length, onClose, onChange]);

  if (!video) return null;
  const id = getYouTubeId(video.youtubeUrl);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      onClick={onClose}
      className="fixed inset-0 z-[100] grid place-items-center p-4 md:p-8 bg-navy-deep/85 backdrop-blur-md animate-fade-in"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="absolute top-5 right-5 z-10 grid h-12 w-12 place-items-center rounded-full glass-strong border border-ivory/20 text-ivory hover:text-gold hover:border-gold/60 transition"
      >
        <X className="h-5 w-5" />
      </button>

      {activeIndex > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange(activeIndex - 1);
          }}
          aria-label="Previous video"
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 grid h-12 w-12 md:h-14 md:w-14 place-items-center rounded-full glass-strong border border-ivory/20 text-ivory hover:text-gold hover:border-gold/60 transition"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      )}
      {activeIndex < videos.length - 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange(activeIndex + 1);
          }}
          aria-label="Next video"
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 grid h-12 w-12 md:h-14 md:w-14 place-items-center rounded-full glass-strong border border-ivory/20 text-ivory hover:text-gold hover:border-gold/60 transition"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[95%] md:w-[90%] max-w-[1200px] animate-scale-in"
      >
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold/80">
              Video {activeIndex + 1} of {videos.length}
            </p>
            <h3 className="mt-1 font-display text-2xl md:text-3xl text-ivory leading-tight">
              {video.title}
            </h3>
          </div>
        </div>
        <div className="relative w-full aspect-video overflow-hidden rounded-2xl md:rounded-3xl border border-ivory/10 shadow-luxe bg-black">
          <iframe
            key={video.youtubeUrl}
            src={getEmbedUrl(video.youtubeUrl, true)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          {video.description ? (
            <p className="text-sm text-ivory/60 max-w-2xl">{video.description}</p>
          ) : <span />}
          <a
            href={id ? `https://www.youtube.com/watch?v=${id}` : video.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full glass-strong border border-gold/30 px-5 py-2.5 text-xs uppercase tracking-widest text-gold hover:text-ivory hover:border-gold/60 transition"
          >
            <Youtube className="h-4 w-4" /> Watch on YouTube
          </a>
        </div>
      </div>
    </div>
  );
}

export function VideoSection({ videos }: { videos: TravelVideo[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  if (!videos?.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <SectionLabel>Travel Videos</SectionLabel>
        <h2 className="mt-4 font-display text-4xl md:text-5xl text-ivory leading-tight">Experience this journey before you even arrive.</h2>
      </div>
      <div className="mt-14 grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v, i) => (
          <VideoCard key={i} video={v} onPlay={() => setActiveIndex(i)} />
        ))}
      </div>
      {activeIndex !== null && (
        <VideoModal
          videos={videos}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          onChange={setActiveIndex}
        />
      )}
    </section>
  );
}

export function VideoCarousel({ videos }: { videos: TravelVideo[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  if (!videos?.length) return null;

  const scrollTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(videos.length - 1, idx));
    setActive(clamped);
    const el = scrollerRef.current?.querySelector<HTMLElement>(`[data-idx="${clamped}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <SectionLabel>Journey Through Video</SectionLabel>
          <h2 className="mt-4 font-display text-3xl md:text-4xl text-ivory">An immersive scroll through the trip</h2>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => scrollTo(active - 1)}
            aria-label="Previous video"
            className="grid h-12 w-12 place-items-center rounded-full glass-strong border border-gold/20 text-ivory hover:text-gold hover:border-gold/60 transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollTo(active + 1)}
            aria-label="Next video"
            className="grid h-12 w-12 place-items-center rounded-full glass-strong border border-gold/20 text-ivory hover:text-gold hover:border-gold/60 transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className="mt-10 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 -mx-6 px-6 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((v, i) => (
          <div
            key={i}
            data-idx={i}
            className={`snap-center shrink-0 transition-all duration-500 ${
              i === active ? "w-[88%] md:w-[70%] scale-100 opacity-100" : "w-[70%] md:w-[55%] scale-95 opacity-60"
            }`}
            onClick={() => setActive(i)}
          >
            <VideoCard video={v} onPlay={() => setModalIndex(i)} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {videos.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to video ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={`h-1.5 rounded-full transition-all ${i === active ? "w-8 gold-gradient" : "w-3 bg-ivory/20"}`}
          />
        ))}
      </div>
      {modalIndex !== null && (
        <VideoModal
          videos={videos}
          activeIndex={modalIndex}
          onClose={() => setModalIndex(null)}
          onChange={setModalIndex}
        />
      )}
    </section>
  );
}