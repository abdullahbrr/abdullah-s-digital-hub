// Admin-only server functions. Every writer asserts the caller is the
// hardcoded admin email, then uses the authenticated Supabase client from
// the auth middleware (context.supabase) to write through RLS policies.
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isAdminEmail } from "./admin-config";

type ServerCtx = {
  userId: string;
  claims: { email?: string } & Record<string, any>;
  supabase: import("@supabase/supabase-js").SupabaseClient;
};

function getAdminClient(context: ServerCtx) {
  const email = (context.claims?.email ?? "") as string;
  if (!isAdminEmail(email)) {
    throw new Error("Forbidden: not an admin");
  }
  return context.supabase;
}

// ---------- Settings (singleton) ----------
export const updateSiteSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { data: Record<string, any> }) => d)
  .handler(async ({ data, context }) => {
    const admin = getAdminClient(context as any);
    const { error } = await admin
      .from("site_settings")
      .upsert({ id: "global", data: data.data }, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Generic collection CRUD ----------
type Table =
  | "publications"
  | "projects"
  | "experiences"
  | "educations"
  | "awards"
  | "organizations"
  | "skill_groups"
  | "writings"
  | "blog_posts";


export const upsertCollectionItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { table: Table; row: Record<string, any> }) => d)
  .handler(async ({ data, context }) => {
    const admin = getAdminClient(context as any);
    const { error, data: out } = await admin
      .from(data.table as any)
      .upsert(data.row, { onConflict: "id" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return out;
  });

export const deleteCollectionItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { table: Table; id: string }) => d)
  .handler(async ({ data, context }) => {
    const admin = getAdminClient(context as any);
    const { error } = await admin.from(data.table as any).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderCollection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { table: Table; ids: string[] }) => d)
  .handler(async ({ data, context }) => {
    const admin = getAdminClient(context as any);
    for (let i = 0; i < data.ids.length; i++) {
      const { error } = await admin
        .from(data.table as any)
        .update({ sort_order: i })
        .eq("id", data.ids[i]);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// ---------- Media upload ----------
// Accept base64-encoded file body (small portrait, logo, CV PDF). We upload
// to the private "media" bucket and return the storage path, which the public
// proxy route at /api/public/media/$ streams.
export const uploadMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (d: { filename: string; contentType: string; base64: string; pathPrefix?: string }) => d,
  )
  .handler(async ({ data, context }) => {
    const admin = getAdminClient(context as any);
    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    const safeName = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${data.pathPrefix ?? "uploads"}/${Date.now()}-${safeName}`;
    const { error } = await admin.storage.from("media").upload(path, bytes, {
      contentType: data.contentType,
      upsert: false,
    });
    if (error) throw new Error(error.message);
    return { path, url: `/api/public/media/${path}` };
  });

// ---------- Auth helper: am I the admin? ----------
export const whoAmI = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = ((context as any).claims?.email ?? "") as string;
    return { email, isAdmin: isAdminEmail(email) };
  });
