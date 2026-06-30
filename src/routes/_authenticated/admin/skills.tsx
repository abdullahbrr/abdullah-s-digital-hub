import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/ui";
import { CollectionEditor } from "@/components/admin/CollectionEditor";

export const Route = createFileRoute("/_authenticated/admin/skills")({
  component: () => (
    <>
      <PageHeader title="Skills" description="Skill groups shown as chips on the site." />
      <CollectionEditor
        table="skill_groups"
        itemLabel={(r) => r.group_name}
        emptyRow={{ group_name: "New group", items: [] }}
        fields={[
          { name: "group_name", label: "Group name", kind: "text" },
          { name: "items", label: "Skills", kind: "tags", placeholder: "MATLAB, Simulink, Proteus" },
        ]}
      />
    </>
  ),
});
