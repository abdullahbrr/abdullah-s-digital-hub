import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/ui";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export const Route = createFileRoute("/_authenticated/admin/education")({
  component: () => (
    <>
      <PageHeader title="Education" description="Degrees, schools, periods, details." />
      <CollectionEditor
        table="educations"
        itemLabel={(r) => `${r.degree} — ${r.institution}`}
        emptyRow={{ period: "", degree: "New degree", institution: "", location: "", details: "" }}
        fields={[
          { name: "period", label: "Period", kind: "text", placeholder: "2025" },
          { name: "degree", label: "Degree", kind: "text" },
          { name: "institution", label: "Institution", kind: "text" },
          { name: "location", label: "Location", kind: "text" },
          { name: "details", label: "Details", kind: "textarea" },
        ]}
      />
    </>
  ),
});
