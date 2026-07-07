// Edit homepage quotes (rotating band) and the story-timeline chapters.
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { updateSiteSettings, uploadMedia } from "@/lib/admin.functions";
import { Button, Card, Field, PageHeader, TextArea, TextInput, useToast } from "@/components/admin/ui";
import { MediaImage } from "@/components/MediaImage";
import { fileToBase64, prepareImageFile } from "@/lib/media-upload";

export const Route = createFileRoute("/_authenticated/admin/story")({
  component: StoryAdmin,
});

type Quote = { text: string; author?: string };
type Chapter = { year: string; title: string; body: string; image_url?: string };


function StoryAdmin() {
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

  const quotes: Quote[] = Array.isArray(draft.quotes) ? draft.quotes : [];
  const story = draft.story ?? {};
  const chapters: Chapter[] = Array.isArray(story.chapters) ? story.chapters : [];

  function setQuotes(next: Quote[]) { setDraft({ ...draft, quotes: next }); }
  function setStory(patch: Record<string, any>) { setDraft({ ...draft, story: { ...story, ...patch } }); }

  return (
    <>
      <PageHeader
        title="Story & Quotes"
        description="Pull-quotes that rotate through the page and the timeline of how you got here."
        action={<Button onClick={() => save.mutate()} loading={save.isPending}>Save changes</Button>}
      />

      <div className="space-y-5">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Quotes</h2>
            <Button variant="ghost" onClick={() => setQuotes([...quotes, { text: "", author: "" }])}>
              <Plus className="h-4 w-4" /> Add quote
            </Button>
          </div>
          <div className="space-y-3">
            {quotes.map((q, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[1fr_220px_auto]">
                <TextArea
                  placeholder="Quote text"
                  value={q.text}
                  onChange={(e) => { const next = [...quotes]; next[i] = { ...q, text: e.target.value }; setQuotes(next); }}
                />
                <TextInput
                  placeholder="Author (optional)"
                  value={q.author ?? ""}
                  onChange={(e) => { const next = [...quotes]; next[i] = { ...q, author: e.target.value }; setQuotes(next); }}
                />
                <Button variant="danger" onClick={() => setQuotes(quotes.filter((_, j) => j !== i))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {quotes.length === 0 && <p className="text-sm text-muted-foreground">No quotes yet.</p>}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-display text-lg font-bold">Story intro</h2>
          <Field label="One-line intro under the section title">
            <TextArea value={story.intro ?? ""} onChange={(e) => setStory({ intro: e.target.value })} />
          </Field>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Story chapters</h2>
            <Button variant="ghost" onClick={() => setStory({ chapters: [...chapters, { year: "", title: "", body: "" }] })}>
              <Plus className="h-4 w-4" /> Add chapter
            </Button>
          </div>
          <div className="space-y-5">
            {chapters.map((c, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface p-4">
                <div className="grid gap-2 sm:grid-cols-[120px_1fr_auto]">
                  <TextInput placeholder="Year"
                    value={c.year}
                    onChange={(e) => { const next = [...chapters]; next[i] = { ...c, year: e.target.value }; setStory({ chapters: next }); }} />
                  <div className="grid gap-2">
                    <TextInput placeholder="Chapter title"
                      value={c.title}
                      onChange={(e) => { const next = [...chapters]; next[i] = { ...c, title: e.target.value }; setStory({ chapters: next }); }} />
                    <TextArea placeholder="Chapter body"
                      value={c.body}
                      onChange={(e) => { const next = [...chapters]; next[i] = { ...c, body: e.target.value }; setStory({ chapters: next }); }} />
                  </div>
                  <Button variant="danger" onClick={() => setStory({ chapters: chapters.filter((_, j) => j !== i) })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <ChapterImage
                  value={c.image_url ?? ""}
                  onChange={(v) => { const next = [...chapters]; next[i] = { ...c, image_url: v }; setStory({ chapters: next }); }}
                />
              </div>
            ))}
          </div>

        </Card>
      </div>
      {view}
    </>
  );
}

function ChapterImage({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const upload = useServerFn(uploadMedia);
  const { toast } = useToast();
  async function pick(file: File) {
    try {
      const readyFile = await prepareImageFile(file);
      const base64 = await fileToBase64(readyFile);
      const res = await upload({ data: { filename: readyFile.name, contentType: readyFile.type, base64, pathPrefix: "story" } });
      onChange(res.url);
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }
  return (
    <div className="mt-3 space-y-2">
      {value && <MediaImage src={value} alt="" className="aspect-[16/9] w-full max-w-sm rounded-lg object-cover" />}
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground">
          <Upload className="h-3 w-3" /> Chapter image
          <input type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) pick(f); e.currentTarget.value = ""; }} />
        </label>
        <TextInput value={value} placeholder="or paste image URL" onChange={(e) => onChange(e.target.value)} />
        {value && <Button variant="ghost" onClick={() => onChange("")}>Remove</Button>}
      </div>
    </div>
  );
}

