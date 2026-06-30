// Generic admin editor for any collection table (publications, projects,
// experiences, educations, awards, organizations, skill_groups).
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  upsertCollectionItem,
  deleteCollectionItem,
  reorderCollection,
} from "@/lib/admin.functions";
import { Button, Card, Field, TextArea, TextInput, useToast } from "./ui";

type FieldKind = "text" | "textarea" | "tags";
export type FieldDef = { name: string; label: string; kind: FieldKind; placeholder?: string };

type Table =
  | "publications"
  | "projects"
  | "experiences"
  | "educations"
  | "awards"
  | "organizations"
  | "skill_groups"
  | "writings";

export function CollectionEditor({
  table,
  fields,
  emptyRow,
  itemLabel,
}: {
  table: Table;
  fields: FieldDef[];
  emptyRow: Record<string, any>;
  itemLabel: (row: any) => string;
}) {
  const qc = useQueryClient();
  const { toast, view } = useToast();
  const upsert = useServerFn(upsertCollectionItem);
  const del = useServerFn(deleteCollectionItem);
  const reorder = useServerFn(reorderCollection);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table as any)
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as any[];
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const saveMut = useMutation({
    mutationFn: (row: Record<string, any>) => upsert({ data: { table, row } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", table] }); toast("ok", "Saved"); },
    onError: (e) => toast("err", (e as Error).message),
  });
  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { table, id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", table] }); toast("ok", "Deleted"); },
    onError: (e) => toast("err", (e as Error).message),
  });
  const reorderMut = useMutation({
    mutationFn: (ids: string[]) => reorder({ data: { table, ids } }),
    onError: (e) => toast("err", (e as Error).message),
  });

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = rows.findIndex((r) => r.id === active.id);
    const newIndex = rows.findIndex((r) => r.id === over.id);
    const next = arrayMove(rows, oldIndex, newIndex);
    qc.setQueryData(["admin", table], next);
    reorderMut.mutate(next.map((r) => r.id));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => saveMut.mutate({ ...emptyRow, sort_order: rows.length })} loading={saveMut.isPending}>
          <Plus className="h-4 w-4" /> Add new
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <Card><p className="text-sm text-muted-foreground">Nothing yet. Click “Add new” to create the first item.</p></Card>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {rows.map((row) => (
                <SortableRow
                  key={row.id}
                  row={row}
                  fields={fields}
                  itemLabel={itemLabel}
                  onSave={(next) => saveMut.mutate(next)}
                  onDelete={() => delMut.mutate(row.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      {view}
    </div>
  );
}

function SortableRow({
  row,
  fields,
  itemLabel,
  onSave,
  onDelete,
}: {
  row: Record<string, any>;
  fields: FieldDef[];
  itemLabel: (row: any) => string;
  onSave: (next: Record<string, any>) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(row);

  function commit() {
    onSave(draft);
    setOpen(false);
  }

  return (
    <div ref={setNodeRef} style={style} className="surface-card rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          aria-label="Reorder"
          className="cursor-grab rounded-md p-1.5 text-muted-foreground hover:bg-accent active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex-1 min-w-0 text-left"
        >
          <p className="truncate text-sm font-semibold text-foreground">{itemLabel(row) || "(untitled)"}</p>
        </button>
        <Button variant="ghost" onClick={() => setOpen((v) => !v)}>{open ? "Close" : "Edit"}</Button>
        <Button variant="danger" onClick={() => { if (confirm("Delete this item?")) onDelete(); }} aria-label="Delete">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {open && (
        <div className="mt-5 grid gap-4">
          {fields.map((f) => (
            <Field key={f.name} label={f.label}>
              {f.kind === "textarea" ? (
                <TextArea
                  value={draft[f.name] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => setDraft({ ...draft, [f.name]: e.target.value })}
                />
              ) : f.kind === "tags" ? (
                <TextInput
                  value={Array.isArray(draft[f.name]) ? draft[f.name].join(", ") : ""}
                  placeholder="Comma-separated values"
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      [f.name]: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                />
              ) : (
                <TextInput
                  value={draft[f.name] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => setDraft({ ...draft, [f.name]: e.target.value })}
                />
              )}
            </Field>
          ))}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setDraft(row); setOpen(false); }}>Cancel</Button>
            <Button onClick={commit}>Save</Button>
          </div>
        </div>
      )}
    </div>
  );
}
