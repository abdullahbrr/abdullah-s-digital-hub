import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/ui";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export const Route = createFileRoute("/_authenticated/admin/publications")({
  component: () => (
    <>
      <PageHeader title="Publications" description="Peer-reviewed papers and articles." />
      <CollectionEditor
        table="publications"
        itemLabel={(r) => r.title}
        emptyRow={{ title: "New publication", venue: "", date: "", doi: "", url: "" }}
        fields={[
          { name: "title", label: "Title", kind: "text" },
          { name: "venue", label: "Venue", kind: "text" },
          { name: "date", label: "Date", kind: "text", placeholder: "Mar 2026" },
          { name: "doi", label: "DOI", kind: "text" },
          { name: "url", label: "URL", kind: "text" },
        ]}
      />
    </>
  ),
});
