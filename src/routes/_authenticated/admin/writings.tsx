import { createFileRoute } from "@tanstack/react-router";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { PageHeader } from "@/components/admin/ui";

export const Route = createFileRoute("/_authenticated/admin/writings")({
  component: WritingsAdmin,
});

function WritingsAdmin() {
  return (
    <>
      <PageHeader title="Writing" description="Essays, field notes, and poetry that appear in the Writing section." />
      <CollectionEditor
        table="writings"
        emptyRow={{ title: "", kind: "essay", summary: "", body: "", tags: [], date: "", url: "" }}
        itemLabel={(r) => r.title}
        fields={[
          { name: "title", label: "Title", kind: "text" },
          { name: "kind", label: "Kind (essay, poetry, note)", kind: "text", placeholder: "essay" },
          { name: "date", label: "Date label (e.g. 2024)", kind: "text" },
          { name: "summary", label: "Summary (1–2 lines)", kind: "textarea" },
          { name: "body", label: "Body / excerpt", kind: "textarea" },
          { name: "tags", label: "Tags", kind: "tags" },
          { name: "url", label: "External URL (optional)", kind: "text" },
        ]}
      />
    </>
  );
}
