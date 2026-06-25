import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import {
  emptyRoute,
  type AdminRoute,
  type AdminActivity,
  type AdminItineraryDay,
  type AdminVideo,
} from "@/lib/admin/storage";
import { routesService } from "@/lib/admin/routes-service";

type Props = { initial?: AdminRoute; mode: "create" | "edit" };

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

export function RouteForm({ initial, mode }: Props) {
  const navigate = useNavigate();
  const [r, setR] = useState<AdminRoute>(initial ?? emptyRoute());
  const [saving, setSaving] = useState(false);

  const patch = <K extends keyof AdminRoute>(key: K, value: AdminRoute[K]) =>
    setR((p) => ({ ...p, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!r.routeName.trim() || !r.departureCity.trim() || !r.destinationCity.trim()) {
      toast.error("Route name, departure and destination are required.");
      return;
    }
    setSaving(true);
    try {
      if (mode === "create") {
        await routesService.create(r);
        toast.success("Route created");
      } else {
        await routesService.update(r.id, r);
        toast.success("Route updated");
      }
      navigate({ to: "/admin/routes" });
    } catch (err) {
      console.error(err);
      toast.error("Could not save route");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/admin/routes" })}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to routes
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {mode === "create" ? "Create Route" : "Save Changes"}
        </button>
      </div>

      {/* 1. Basic */}
      <Section title="Basic Information" subtitle="Core details about this tour">
        <Grid cols={2}>
          <Field label="Route name *">
            <Input value={r.routeName} onChange={(v) => patch("routeName", v)} placeholder="e.g. Imperial Discovery" />
          </Field>
          <Field label="Duration">
            <Input value={r.duration} onChange={(v) => patch("duration", v)} placeholder="7 Days / 6 Nights" />
          </Field>
          <Field label="Departure city *">
            <Input value={r.departureCity} onChange={(v) => patch("departureCity", v)} placeholder="Los Angeles" />
          </Field>
          <Field label="Destination city *">
            <Input value={r.destinationCity} onChange={(v) => patch("destinationCity", v)} placeholder="Beijing" />
          </Field>
          <Field label="Starting price (USD)">
            <Input
              type="number"
              value={String(r.startingPrice)}
              onChange={(v) => patch("startingPrice", Number(v) || 0)}
            />
          </Field>
          <Field label="Display order">
            <Input
              type="number"
              value={String(r.displayOrder)}
              onChange={(v) => patch("displayOrder", Number(v) || 0)}
            />
          </Field>
          <Field label="Travel type">
            <select
              value={r.travelType}
              onChange={(e) => patch("travelType", e.target.value as AdminRoute["travelType"])}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="City">City</option>
              <option value="Culture">Culture</option>
              <option value="Adventure">Adventure</option>
              <option value="Nature">Nature</option>
            </select>
          </Field>
        </Grid>
        <Field label="Short description">
          <Input value={r.shortDescription} onChange={(v) => patch("shortDescription", v)} />
        </Field>
        <Field label="Full description">
          <Textarea value={r.fullDescription} onChange={(v) => patch("fullDescription", v)} rows={4} />
        </Field>
        <Grid cols={2}>
          <ListField
            label="Highlights"
            items={r.highlights}
            onChange={(v) => patch("highlights", v)}
            placeholder="The Great Wall"
          />
          <ListField
            label="Included items"
            items={r.includedItems}
            onChange={(v) => patch("includedItems", v)}
            placeholder="5★ Hotel"
          />
        </Grid>
      </Section>

      {/* 2. Images */}
      <Section title="Images" subtitle="Image URLs only — no uploads in this step">
        <Field label="Cover image URL">
          <Input value={r.coverImageUrl} onChange={(v) => patch("coverImageUrl", v)} placeholder="https://…" />
          {r.coverImageUrl && (
            <img src={r.coverImageUrl} alt="" className="mt-3 h-40 w-full rounded-lg object-cover" />
          )}
        </Field>
        <ListField
          label="Gallery image URLs"
          items={r.galleryImages}
          onChange={(v) => patch("galleryImages", v)}
          placeholder="https://…"
          renderPreview={(url) =>
            url ? <img src={url} alt="" className="mt-2 h-20 w-32 rounded-md object-cover" /> : null
          }
        />
        <ListField
          label="Feedback from real clients"
          items={r.feedbackImages}
          onChange={(v) => patch("feedbackImages", v)}
          placeholder="https://…"
          renderPreview={(url) =>
            url ? <img src={url} alt="" className="mt-2 h-20 w-32 rounded-md object-cover" /> : null
          }
        />
      </Section>

      {/* 3. Videos */}
      <Section title="Travel Videos" subtitle="Shown in the 'Travel Videos' grid on the route page">
        <RepeaterList
          items={r.youtubeVideos}
          onChange={(v) => patch("youtubeVideos", v)}
          newItem={(): AdminVideo => ({ title: "", youtubeUrl: "", description: "" })}
          render={(item, update) => {
            const id = getYouTubeId(item.youtubeUrl);
            return (
              <>
                <Grid cols={2}>
                  <Field label="Title">
                    <Input value={item.title} onChange={(v) => update({ ...item, title: v })} />
                  </Field>
                  <Field label="YouTube URL">
                    <Input value={item.youtubeUrl} onChange={(v) => update({ ...item, youtubeUrl: v })} />
                  </Field>
                </Grid>
                <Field label="Description">
                  <Textarea value={item.description ?? ""} onChange={(v) => update({ ...item, description: v })} rows={2} />
                </Field>
                {id && (
                  <img
                    src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                    alt=""
                    className="h-32 w-56 rounded-md object-cover"
                  />
                )}
              </>
            );
          }}
          addLabel="Add travel video"
        />
      </Section>

      <Section title="Journey Through Video" subtitle="Shown in the 'Journey Through Video' carousel on the route page">
        <RepeaterList
          items={r.journeyVideos}
          onChange={(v) => patch("journeyVideos", v)}
          newItem={(): AdminVideo => ({ title: "", youtubeUrl: "", description: "" })}
          render={(item, update) => {
            const id = getYouTubeId(item.youtubeUrl);
            return (
              <>
                <Grid cols={2}>
                  <Field label="Title">
                    <Input value={item.title} onChange={(v) => update({ ...item, title: v })} />
                  </Field>
                  <Field label="YouTube URL">
                    <Input value={item.youtubeUrl} onChange={(v) => update({ ...item, youtubeUrl: v })} />
                  </Field>
                </Grid>
                <Field label="Description">
                  <Textarea value={item.description ?? ""} onChange={(v) => update({ ...item, description: v })} rows={2} />
                </Field>
                {id && (
                  <img
                    src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                    alt=""
                    className="h-32 w-56 rounded-md object-cover"
                  />
                )}
              </>
            );
          }}
          addLabel="Add journey video"
        />
      </Section>

      {/* 4. Activities */}
      <Section title="Activities" subtitle="Day-by-day experiences">
        <RepeaterList
          items={r.activities}
          onChange={(v) => patch("activities", v)}
          newItem={(): AdminActivity => ({
            title: "",
            description: "",
            imageUrl: "",
            dayNumber: r.activities.length + 1,
            displayOrder: r.activities.length + 1,
          })}
          render={(item, update) => (
            <>
              <Grid cols={3}>
                <Field label="Title">
                  <Input value={item.title} onChange={(v) => update({ ...item, title: v })} />
                </Field>
                <Field label="Day">
                  <Input
                    type="number"
                    value={String(item.dayNumber)}
                    onChange={(v) => update({ ...item, dayNumber: Number(v) || 1 })}
                  />
                </Field>
                <Field label="Order">
                  <Input
                    type="number"
                    value={String(item.displayOrder)}
                    onChange={(v) => update({ ...item, displayOrder: Number(v) || 1 })}
                  />
                </Field>
              </Grid>
              <Field label="Description">
                <Textarea value={item.description} onChange={(v) => update({ ...item, description: v })} rows={2} />
              </Field>
              <Field label="Image URL">
                <Input value={item.imageUrl} onChange={(v) => update({ ...item, imageUrl: v })} />
                {item.imageUrl && <img src={item.imageUrl} alt="" className="mt-2 h-20 w-32 rounded-md object-cover" />}
              </Field>
            </>
          )}
          addLabel="Add activity"
        />
      </Section>

      {/* 5. Itinerary */}
      <Section title="Itinerary" subtitle="Day-by-day plan">
        <RepeaterList
          items={r.itinerary}
          onChange={(v) => patch("itinerary", v)}
          newItem={(): AdminItineraryDay => ({
            dayNumber: r.itinerary.length + 1,
            title: "",
            description: "",
          })}
          render={(item, update) => (
            <>
              <Grid cols={3}>
                <Field label="Day">
                  <Input
                    type="number"
                    value={String(item.dayNumber)}
                    onChange={(v) => update({ ...item, dayNumber: Number(v) || 1 })}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Title">
                    <Input value={item.title} onChange={(v) => update({ ...item, title: v })} />
                  </Field>
                </div>
              </Grid>
              <Field label="Description">
                <Textarea value={item.description} onChange={(v) => update({ ...item, description: v })} rows={2} />
              </Field>
            </>
          )}
          addLabel="Add itinerary day"
        />
      </Section>

      {/* 6. Settings */}
      <Section title="Settings" subtitle="Visibility and ordering">
        <div className="space-y-3">
          <Toggle label="Active" value={r.isActive} onChange={(v) => patch("isActive", v)} />
          <Toggle label="Featured route" value={r.isFeatured} onChange={(v) => patch("isFeatured", v)} />
        </div>
      </Section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {mode === "create" ? "Create Route" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

// ---------- atoms ----------

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <header className="mb-4 border-b border-slate-100 pb-3">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Grid({ cols, children }: { cols: 2 | 3; children: React.ReactNode }) {
  const cls = cols === 3 ? "grid gap-4 sm:grid-cols-3" : "grid gap-4 sm:grid-cols-2";
  return <div className={cls}>{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
    />
  );
}

function Textarea({
  value,
  onChange,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
    />
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 rounded-full transition ${value ? "bg-emerald-500" : "bg-slate-300"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            value ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}

function ListField({
  label,
  items,
  onChange,
  placeholder,
  renderPreview,
}: {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  renderPreview?: (item: string) => React.ReactNode;
}) {
  return (
    <Field label={label}>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i}>
            <div className="flex gap-2">
              <Input
                value={it}
                onChange={(v) => {
                  const next = [...items];
                  next[i] = v;
                  onChange(next);
                }}
                placeholder={placeholder}
              />
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="rounded-md p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {renderPreview?.(it)}
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
    </Field>
  );
}

function RepeaterList<T>({
  items,
  onChange,
  newItem,
  render,
  addLabel,
}: {
  items: T[];
  onChange: (v: T[]) => void;
  newItem: () => T;
  render: (item: T, update: (next: T) => void) => React.ReactNode;
  addLabel: string;
}) {
  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div key={i} className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">#{i + 1}</span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="rounded-md p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {render(it, (next) => {
              const arr = [...items];
              arr[i] = next;
              onChange(arr);
            })}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, newItem()])}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 hover:border-slate-400 hover:text-slate-900"
      >
        <Plus className="h-3.5 w-3.5" /> {addLabel}
      </button>
    </div>
  );
}