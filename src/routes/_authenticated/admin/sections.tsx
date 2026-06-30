// Drag-and-drop section reorder + visibility toggles.
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { updateSiteSettings } from "@/lib/admin.functions";
import { Button, Card, PageHeader, useToast } from "@/components/admin/ui";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/sections")({
  component: SectionsAdmin,
});

const ALL_SECTIONS: Record<string, string> = {
  about: "About",
  education: "Education",
  experience: "Experience",
  skills: "Skills",
  research: "Research",
  publications: "Publications",
  projects: "Projects",
  writings: "Writing",
  awards: "Awards",
  organizations: "Organizations",
  contact: "Contact",
};

function SectionsAdmin() {
  const qc = useQueryClient();
  const update = useServerFn(updateSiteSettings);
  const { toast, view } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("data").eq("id", "global").maybeSingle();
      if (error) throw error;
      return (data?.data ?? {}) as Record<string, any>;
    },
  });
  const [order, setOrder] = useState<string[]>([]);
  const [visible, setVisible] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!data) return;
    const known = Object.keys(ALL_SECTIONS);
    const fromDb: string[] = Array.isArray(data.sectionOrder) ? data.sectionOrder : known;
    const merged = [...fromDb.filter((s) => known.includes(s)), ...known.filter((s) => !fromDb.includes(s))];
    setOrder(merged);
    setVisible(new Set(Array.isArray(data.visibleSections) ? data.visibleSections : known));
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const save = useMutation({
    mutationFn: () => update({
      data: { data: { ...(data ?? {}), sectionOrder: order, visibleSections: Array.from(visible) } },
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "settings"] }); toast("ok", "Saved"); },
    onError: (e) => toast("err", (e as Error).message),
  });

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(String(active.id));
    const newIndex = order.indexOf(String(over.id));
    setOrder(arrayMove(order, oldIndex, newIndex));
  }

  function toggle(id: string) {
    const next = new Set(visible);
    if (next.has(id)) next.delete(id); else next.add(id);
    setVisible(next);
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <>
      <PageHeader title="Section order" description="Drag to reorder. Toggle visibility per section."
        action={<Button onClick={() => save.mutate()} loading={save.isPending}>Save changes</Button>} />
      <Card>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            <ul className="space-y-2">
              {order.map((id) => (
                <SectionRow key={id} id={id} visible={visible.has(id)} onToggle={() => toggle(id)} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </Card>
      {view}
    </>
  );
}

function SectionRow({ id, visible, onToggle }: { id: string; visible: boolean; onToggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };
  return (
    <li ref={setNodeRef} style={style} className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
      <button {...attributes} {...listeners} aria-label="Reorder" className="cursor-grab rounded-md p-1.5 text-muted-foreground hover:bg-accent active:cursor-grabbing">
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="flex-1 text-sm font-semibold text-foreground">{ALL_SECTIONS[id] ?? id}</span>
      <button
        type="button"
        onClick={onToggle}
        aria-label={visible ? "Hide section" : "Show section"}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
          visible ? "border-brand/40 text-foreground" : "border-border text-muted-foreground"
        }`}
      >
        {visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        {visible ? "Visible" : "Hidden"}
      </button>
    </li>
  );
}
