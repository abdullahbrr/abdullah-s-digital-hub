// Edit hero/about/contact/social/highlights JSON in site_settings.
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { updateSiteSettings } from "@/lib/admin.functions";
import { Button, Card, Field, PageHeader, TextArea, TextInput, useToast } from "@/components/admin/ui";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/profile")({
  component: ProfileAdmin,
});

function ProfileAdmin() {
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

  const saveMut = useMutation({
    mutationFn: () => update({ data: { data: draft } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "settings"] }); toast("ok", "Saved"); },
    onError: (e) => toast("err", (e as Error).message),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const profile = draft.profile ?? {};
  const about = draft.about ?? {};
  const social = draft.social ?? {};
  const highlights: Array<{ label: string; value: string }> = about.highlights ?? [];
  const paragraphs: string[] = about.paragraphs ?? [];

  function setProfile(patch: Record<string, any>) { setDraft({ ...draft, profile: { ...profile, ...patch } }); }
  function setSocial(patch: Record<string, any>) { setDraft({ ...draft, social: { ...social, ...patch } }); }
  function setAbout(patch: Record<string, any>) { setDraft({ ...draft, about: { ...about, ...patch } }); }

  return (
    <>
      <PageHeader title="Hero & About" description="Name, roles, tagline, contact, social, and the about section."
        action={<Button onClick={() => saveMut.mutate()} loading={saveMut.isPending}>Save changes</Button>} />

      <div className="space-y-5">
        <Card>
          <h2 className="mb-4 font-display text-lg font-bold">Identity</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name"><TextInput value={profile.name ?? ""} onChange={(e) => setProfile({ name: e.target.value })} /></Field>
            <Field label="Initials (logo monogram)"><TextInput value={profile.initials ?? ""} onChange={(e) => setProfile({ initials: e.target.value })} /></Field>
            <Field label="Status badge"><TextInput value={profile.status ?? ""} onChange={(e) => setProfile({ status: e.target.value })} /></Field>
            <Field label="Roles (comma-separated)"><TextInput
              value={Array.isArray(profile.roles) ? profile.roles.join(", ") : ""}
              onChange={(e) => setProfile({ roles: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })} /></Field>
            <Field label="Tagline" hint="Shown under the name in the hero."><TextArea value={profile.tagline ?? ""} onChange={(e) => setProfile({ tagline: e.target.value })} /></Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-display text-lg font-bold">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email"><TextInput type="email" value={profile.email ?? ""} onChange={(e) => setProfile({ email: e.target.value })} /></Field>
            <Field label="Phone"><TextInput value={profile.phone ?? ""} onChange={(e) => setProfile({ phone: e.target.value })} /></Field>
            <Field label="Location"><TextInput value={profile.location ?? ""} onChange={(e) => setProfile({ location: e.target.value })} /></Field>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-display text-lg font-bold">Social links</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="LinkedIn URL"><TextInput value={social.linkedin ?? ""} onChange={(e) => setSocial({ linkedin: e.target.value })} /></Field>
            <Field label="GitHub URL"><TextInput value={social.github ?? ""} onChange={(e) => setSocial({ github: e.target.value })} /></Field>
            <Field label="ORCID URL"><TextInput value={social.orcid ?? ""} onChange={(e) => setSocial({ orcid: e.target.value })} /></Field>
            <Field label="Twitter / X URL"><TextInput value={social.twitter ?? ""} onChange={(e) => setSocial({ twitter: e.target.value })} /></Field>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">About paragraphs</h2>
            <Button variant="ghost" onClick={() => setAbout({ paragraphs: [...paragraphs, ""] })}><Plus className="h-4 w-4" /> Add paragraph</Button>
          </div>
          <div className="space-y-3">
            {paragraphs.map((p, i) => (
              <div key={i} className="flex gap-2">
                <TextArea value={p} onChange={(e) => {
                  const next = [...paragraphs]; next[i] = e.target.value;
                  setAbout({ paragraphs: next });
                }} />
                <Button variant="danger" onClick={() => setAbout({ paragraphs: paragraphs.filter((_, j) => j !== i) })}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Highlight stats</h2>
            <Button variant="ghost" onClick={() => setAbout({ highlights: [...highlights, { label: "", value: "" }] })}><Plus className="h-4 w-4" /> Add stat</Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {highlights.map((h, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <TextInput placeholder="Label" value={h.label} onChange={(e) => { const next = [...highlights]; next[i] = { ...h, label: e.target.value }; setAbout({ highlights: next }); }} />
                <TextInput placeholder="Value" value={h.value} onChange={(e) => { const next = [...highlights]; next[i] = { ...h, value: e.target.value }; setAbout({ highlights: next }); }} />
                <Button variant="danger" onClick={() => setAbout({ highlights: highlights.filter((_, j) => j !== i) })}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {view}
    </>
  );
}
