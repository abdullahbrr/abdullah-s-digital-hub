import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/ui";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export const Route = createFileRoute("/_authenticated/admin/awards")({
  component: () => (
    <>
      <PageHeader title="Awards" description="Recognitions and fellowships." />
      <CollectionEditor
        table="awards"
        itemLabel={(r) => r.title}
        emptyRow={{ title: "New award", org: "", prize: "" }}
        fields={[
          { name: "title", label: "Title", kind: "text" },
          { name: "org", label: "Organisation", kind: "text" },
          { name: "prize", label: "Prize / Cohort", kind: "text" },
        ]}
      />
    </>
  ),
});
