import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/ui";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export const Route = createFileRoute("/_authenticated/admin/experience")({
  component: () => (
    <>
      <PageHeader title="Experience" description="Professional roles and responsibilities." />
      <CollectionEditor
        table="experiences"
        itemLabel={(r) => `${r.title} — ${r.company}`}
        emptyRow={{ period: "", title: "New role", company: "", description: "" }}
        fields={[
          { name: "period", label: "Period", kind: "text", placeholder: "Jan 2024 – Present" },
          { name: "title", label: "Title", kind: "text" },
          { name: "company", label: "Company", kind: "text" },
          { name: "description", label: "Description", kind: "textarea" },
        ]}
      />
    </>
  ),
});
