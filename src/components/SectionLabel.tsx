export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-gold">
      <span className="h-px w-10 bg-gold" />
      {children}
    </div>
  );
}