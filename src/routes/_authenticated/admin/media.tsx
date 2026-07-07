// Upload portrait, logo, and CV. Files go to the private "media" bucket
// and are streamed publicly through /api/public/media/$.
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { updateSiteSettings, uploadMedia } from "@/lib/admin.functions";
import { Button, Card, Field, PageHeader, TextInput, useToast } from "@/components/admin/ui";
import { Upload } from "lucide-react";
import { MediaImage } from "@/components/MediaImage";
function isHeicFile(file: File) {
  return /\.(heic|heif)$/i.test(file.name) || /image\/(heic|heif)/i.test(file.type);
}

async function prepareImageFile(file: File): Promise<File> {
  if (isHeicFile(file)) {
    throw new Error("HEIC photos are not supported by browsers. Please upload JPG, PNG, WebP, or GIF.");
  }
  return file;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaAdmin,
});

function MediaAdmin() {
  const qc = useQueryClient();
  const update = useServerFn(updateSiteSettings);
  const upload = useServerFn(uploadMedia);
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
  const media = draft.media ?? {};
  function setMedia(patch: Record<string, any>) { setDraft({ ...draft, media: { ...media, ...patch } }); }

  const save = useMutation({
    mutationFn: (next?: Record<string, any>) => update({ data: { data: next ?? draft } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "settings"] }); toast("ok", "Saved"); },
    onError: (e) => toast("err", (e as Error).message),
  });

  async function handleFile(field: "portraitUrl" | "logoUrl" | "cvUrl", file: File) {
    try {
      const readyFile = file.type === "application/pdf" ? file : await prepareImageFile(file);
      const base64 = await fileToBase64(readyFile);
      const result = await upload({ data: { filename: readyFile.name, contentType: readyFile.type, base64, pathPrefix: field } });
      const nextMedia = { ...media, [field]: result.url };
      const nextDraft = { ...draft, media: nextMedia };
      setDraft(nextDraft);
      save.mutate(nextDraft);
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <>
      <PageHeader title="Media & CV" description="Upload your portrait, logo, and CV. Changes save automatically." />
      <div className="space-y-5">
        <Card>
          <h2 className="mb-3 font-display text-lg font-bold">Portrait</h2>
          {media.portraitUrl && <MediaImage src={media.portraitUrl} alt="" className="mb-4 max-h-64 rounded-xl border border-border object-cover" />}
          <FileButton accept="image/*" onPick={(f) => handleFile("portraitUrl", f)} label="Upload portrait" />
          <Field label="Or paste URL"><TextInput value={media.portraitUrl ?? ""} onChange={(e) => setMedia({ portraitUrl: e.target.value })} onBlur={() => save.mutate(undefined)} /></Field>
        </Card>

        <Card>
          <h2 className="mb-3 font-display text-lg font-bold">Logo (optional)</h2>
          {media.logoUrl && <MediaImage src={media.logoUrl} alt="" className="mb-4 max-h-16 rounded border border-border object-contain" />}
          <FileButton accept="image/*" onPick={(f) => handleFile("logoUrl", f)} label="Upload logo" />
          <Field label="Or paste URL"><TextInput value={media.logoUrl ?? ""} onChange={(e) => setMedia({ logoUrl: e.target.value })} onBlur={() => save.mutate(undefined)} /></Field>
        </Card>

        <Card>
          <h2 className="mb-3 font-display text-lg font-bold">CV (PDF)</h2>
          {media.cvUrl && <p className="mb-3 text-sm"><a href={media.cvUrl} target="_blank" rel="noopener noreferrer" className="text-gradient-brand">View current CV →</a></p>}
          <FileButton accept="application/pdf" onPick={(f) => handleFile("cvUrl", f)} label="Upload CV PDF" />
          <Field label="Or paste URL"><TextInput value={media.cvUrl ?? ""} onChange={(e) => setMedia({ cvUrl: e.target.value })} onBlur={() => save.mutate(undefined)} /></Field>
        </Card>
      </div>
      {view}
    </>
  );
}

function FileButton({ accept, label, onPick }: { accept: string; label: string; onPick: (f: File) => void }) {
  return (
    <label className="mb-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/20 hover:opacity-95">
      <Upload className="h-4 w-4" /> {label}
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onPick(f); e.currentTarget.value = ""; }}
      />
    </label>
  );
}

