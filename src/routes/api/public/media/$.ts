// Public media proxy: streams private bucket files using service role.
// Aggressive caching since uploaded filenames include a timestamp.
import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const splat = (params as { _splat?: string })._splat ?? "";
        if (!splat) return new Response("Not found", { status: 404 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("media").download(splat);
        if (error || !data) return new Response("Not found", { status: 404 });

        const buf = await data.arrayBuffer();
        const ext = splat.split(".").pop()?.toLowerCase() ?? "";
        const ct =
          ext === "png" ? "image/png" :
          ext === "jpg" || ext === "jpeg" ? "image/jpeg" :
          ext === "webp" ? "image/webp" :
          ext === "gif" ? "image/gif" :
          ext === "svg" ? "image/svg+xml" :
          ext === "pdf" ? "application/pdf" :
          data.type || "application/octet-stream";

        return new Response(buf, {
          headers: {
            "Content-Type": ct,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
