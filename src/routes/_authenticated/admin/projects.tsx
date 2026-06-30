import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/ui";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export const Route = createFileRoute("/_authenticated/admin/projects")({
  component: () => (
    <>
      <PageHeader title="Projects" description="Selected engineering and research projects." />
      <CollectionEditor
        table="projects"
        itemLabel={(r) => r.title}
        emptyRow={{ title: "New project", summary: "", tags: [] }}
        fields={[
          { name: "title", label: "Title", kind: "text" },
          { name: "summary", label: "Summary", kind: "textarea" },
          { name: "tags", label: "Tags", kind: "tags", placeholder: "Power Electronics, MATLAB" },
        ]}
      />
    </>
  ),
});
