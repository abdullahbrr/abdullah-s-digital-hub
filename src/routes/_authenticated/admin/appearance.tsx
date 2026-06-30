// Pick a brand color preset. The choice writes settings.theme.preset and
// the public site applies the matching CSS class on <html>.
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { updateSiteSettings } from "@/lib/admin.functions";
import { Button, Card, PageHeader, useToast } from "@/components/admin/ui";
import { Check } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/appearance")({
  component: AppearanceAdmin,
});

const PRESETS = [
  { id: "cyan",    label: "Cyan → Violet (default)", colors: ["#22d3ee", "#6366f1", "#a855f7"] },
  { id: "emerald", label: "Emerald → Teal",          colors: ["#34d399", "#10b981", "#14b8a6"] },
  { id: "amber",   label: "Amber → Rose",            colors: ["#f59e0b", "#ef4444", "#ec4899"] },
  { id: "rose",    label: "Rose → Indigo",           colors: ["#fb7185", "#a855f7", "#6366f1"] },
];

function AppearanceAdmin() {
  const qc = useQueryClient();
  const update = useServerFn(updateSiteSettings);
  const { toast, view } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("data").eq("id", "global").maybeSingle();
      if (error) throw error;
      return (data?.data ?? {}) as Record<string, any>;
    },
  });
  const [preset, setPreset] = useState<string>("cyan");
  useEffect(() => { if (data?.theme?.preset) setPreset(data.theme.preset); }, [data]);

  const save = useMutation({
    mutationFn: (next: string) => update({ data: { data: { ...(data ?? {}), theme: { preset: next } } } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "settings"] }); toast("ok", "Saved"); },
    onError: (e) => toast("err", (e as Error).message),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <>
      <PageHeader title="Appearance" description="Choose a brand-color preset for the public site." />
      <Card>
        <div className="grid gap-3 sm:grid-cols-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => { setPreset(p.id); save.mutate(p.id); }}
              className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                preset === p.id ? "border-brand bg-accent" : "border-border hover:border-brand/40"
              }`}
            >
              <span
                aria-hidden
                className="h-12 w-20 shrink-0 rounded-lg"
                style={{ backgroundImage: `linear-gradient(135deg, ${p.colors.join(", ")})` }}
              />
              <span className="flex-1">
                <span className="block text-sm font-semibold text-foreground">{p.label}</span>
                <span className="block text-xs text-muted-foreground">{p.colors.join(" · ")}</span>
              </span>
              {preset === p.id && <Check className="h-5 w-5 text-brand" />}
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Tip: more granular color/font customization is in the next phase.</p>
      </Card>
      {view}
    </>
  );
}
