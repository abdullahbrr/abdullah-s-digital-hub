// Research section editor (stored in settings.research JSON).
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { updateSiteSettings } from "@/lib/admin.functions";
import { Button, Card, Field, PageHeader, TextArea, TextInput, useToast } from "@/components/admin/ui";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/research")({
  component: ResearchAdmin,
});

function ResearchAdmin() {
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
  const [draft, setDraft] = useState<Record<string, any>>({});
  useEffect(() => { if (data) setDraft(data); }, [data]);

  const save = useMutation({
    mutationFn: () => update({ data: { data: draft } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "settings"] }); toast("ok", "Saved"); },
    onError: (e) => toast("err", (e as Error).message),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const research = draft.research ?? {};
  const interests: string[] = research.interests ?? [];
  const projects: Array<{ title: string; funder: string; period: string }> = research.projects ?? [];
  const ass = research.assistantship ?? { role: "", supervisor: "", responsibilities: "" };
  function setResearch(patch: Record<string, any>) { setDraft({ ...draft, research: { ...research, ...patch } }); }

  return (
    <>
      <PageHeader title="Research" description="Interests, assistantship, and funded projects."
        action={<Button onClick={() => save.mutate()} loading={save.isPending}>Save changes</Button>} />
      <div className="space-y-5">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Interests</h2>
            <Button variant="ghost" onClick={() => setResearch({ interests: [...interests, ""] })}><Plus className="h-4 w-4" /> Add</Button>
          </div>
          <div className="space-y-2">
            {interests.map((it, i) => (
              <div key={i} className="flex gap-2">
                <TextInput value={it} onChange={(e) => { const n = [...interests]; n[i] = e.target.value; setResearch({ interests: n }); }} />
                <Button variant="danger" onClick={() => setResearch({ interests: interests.filter((_, j) => j !== i) })}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 font-display text-lg font-bold">Research assistantship</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Role"><TextInput value={ass.role ?? ""} onChange={(e) => setResearch({ assistantship: { ...ass, role: e.target.value } })} /></Field>
            <Field label="Supervisor"><TextInput value={ass.supervisor ?? ""} onChange={(e) => setResearch({ assistantship: { ...ass, supervisor: e.target.value } })} /></Field>
            <Field label="Responsibilities"><TextArea value={ass.responsibilities ?? ""} onChange={(e) => setResearch({ assistantship: { ...ass, responsibilities: e.target.value } })} /></Field>
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Funded research projects</h2>
            <Button variant="ghost" onClick={() => setResearch({ projects: [...projects, { title: "", funder: "", period: "" }] })}><Plus className="h-4 w-4" /> Add</Button>
          </div>
          <div className="space-y-3">
            {projects.map((p, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_180px_auto]">
                <TextInput placeholder="Title" value={p.title} onChange={(e) => { const n = [...projects]; n[i] = { ...p, title: e.target.value }; setResearch({ projects: n }); }} />
                <TextInput placeholder="Funder" value={p.funder} onChange={(e) => { const n = [...projects]; n[i] = { ...p, funder: e.target.value }; setResearch({ projects: n }); }} />
                <TextInput placeholder="Period" value={p.period} onChange={(e) => { const n = [...projects]; n[i] = { ...p, period: e.target.value }; setResearch({ projects: n }); }} />
                <Button variant="danger" onClick={() => setResearch({ projects: projects.filter((_, j) => j !== i) })}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {view}
    </>
  );
}
