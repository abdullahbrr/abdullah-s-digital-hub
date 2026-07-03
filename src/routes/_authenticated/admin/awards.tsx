import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/ui";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export const Route = createFileRoute("/_authenticated/admin/awards")({
  component: () => (
    <>
      <PageHeader
        title="Awards"
        description="Recognitions and fellowships. Each award has its own public page at /awards/<id> with a cover picture."
      />
      <CollectionEditor
        table="awards"
        itemLabel={(r) => r.title}
        emptyRow={{ title: "New award", org: "", prize: "", description: "", image_url: "", date: "" }}
        fields={[
          { name: "title", label: "Title", kind: "text" },
          { name: "org", label: "Organisation", kind: "text" },
          { name: "prize", label: "Prize / Cohort", kind: "text" },
          { name: "date", label: "Date (e.g. 2024)", kind: "text" },
          { name: "image_url", label: "Cover image", kind: "image" },
          { name: "description", label: "The story behind this award", kind: "textarea" },
        ]}
      />
    </>
  ),
});
