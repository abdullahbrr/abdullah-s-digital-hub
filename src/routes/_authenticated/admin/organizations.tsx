import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/ui";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export const Route = createFileRoute("/_authenticated/admin/organizations")({
  component: () => (
    <>
      <PageHeader title="Organizations" description="Leadership and community roles." />
      <CollectionEditor
        table="organizations"
        itemLabel={(r) => `${r.role} — ${r.org}`}
        emptyRow={{ role: "New role", org: "", location: "" }}
        fields={[
          { name: "role", label: "Role", kind: "text" },
          { name: "org", label: "Organisation", kind: "text" },
          { name: "location", label: "Location / Period", kind: "text" },
        ]}
      />
    </>
  ),
});
