import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { translateUserMessage } from "@/lib/messages";

export type FieldType = "text" | "textarea" | "number" | "date" | "url" | "image";

export type Field = {
  name: string;
  label: string;
  type?: FieldType;
};

type Row = Record<string, unknown> & { id: string };

// Função auxiliar para converter links do Google Drive em links diretos
function formatGoogleDriveUrl(url: string): string {
  if (!url) return url;
  
  // Suporta formatos como: https://drive.google.com/file/d/1NLbCNx8o6HOtJtV5TrZH4q6I-di5u2DE/view
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  
  if (fileIdMatch && fileIdMatch[1]) {
    const fileId = fileIdMatch[1];
    // Retorna o link de visualização direta otimizado para imagens/arquivos
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  return url;
}

export function AdminCrud({
  table,
  title,
  description,
  fields,
  queryKey,
}: {
  table: string;
  title: string;
  description?: string;
  fields: Field[];
  queryKey: string;
}) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const { data: rows = [] } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data, error: err } = await supabase
        .from(table as never)
        .select("*")
        .order("sort_order", { ascending: true });
      if (err) throw err;
      return (data ?? []) as Row[];
    },
  });

  function reset() {
    setDraft({});
    setEditingId(null);
  }

  function refresh() {
    queryClient.invalidateQueries({ queryKey: [queryKey] });
  }

  function toPayload() {
    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      const value = draft[field.name] ?? "";
      if (field.type === "number") {
        payload[field.name] = Number(value || 0);
      } else if (field.type === "url" || field.type === "image") {
        payload[field.name] = formatGoogleDriveUrl(value);
      } else {
        payload[field.name] = value;
      }
    }
    return payload;
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const payload = toPayload();
      const request = editingId
        ? supabase
            .from(table as never)
            .update(payload as never)
            .eq("id", editingId)
        : supabase.from(table as never).insert(payload as never);
      const { error: err } = await request;
      if (err) throw err;
      reset();
      refresh();
    } catch (err) {
      setError(err instanceof Error ? translateUserMessage(err.message) : "Não foi possível salvar.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Excluir este item?")) return;
    const { error: err } = await supabase
      .from(table as never)
      .delete()
      .eq("id", id);
    if (err) setError(translateUserMessage(err.message));
    refresh();
  }

  function edit(row: Row) {
    const next: Record<string, string> = {};
    for (const field of fields) next[field.name] = String(row[field.name] ?? "");
    setDraft(next);
    setEditingId(row.id);
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-xl">{title}</h3>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}

      <form onSubmit={save} className="mt-5 grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
            <label className="text-sm font-medium" htmlFor={`${table}-${field.name}`}>
              {field.label} {field.type === "image" || field.type === "url" ? <span className="text-xs text-muted-foreground">(Cole o link do Google Drive)</span> : null}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={`${table}-${field.name}`}
                rows={3}
                value={draft[field.name] ?? ""}
                onChange={(e) => setDraft({ ...draft, [field.name]: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
              />
            ) : (
              <input
                id={`${table}-${field.name}`}
                type={
                  field.type === "number"
                    ? "number"
                    : field.type === "date"
                    ? "date"
                    : field.type === "url" || field.type === "image"
                    ? "url"
                    : "text"
                }
                placeholder={field.type === "image" ? "https://drive.google.com/file/d/.../view" : ""}
                value={draft[field.name] ?? ""}
                onChange={(e) => setDraft({ ...draft, [field.name]: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
              />
            )}
          </div>
        ))}
        <div className="flex items-center gap-3 md:col-span-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {editingId ? "Salvar alterações" : "Adicionar"}
          </button>
          {editingId ? (
            <button type="button" onClick={reset} className="text-sm underline">
              Cancelar edição
            </button>
          ) : null}
        </div>
      </form>

      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

      <ul className="mt-6 divide-y divide-border">
        {rows.map((row) => (
          <li key={row.id} className="flex items-start justify-between gap-4 py-3">
            <div className="min-w-0">
              <p className="truncate font-medium">{String(row[fields[0]!.name] ?? "(sem título)")}</p>
              <p className="truncate text-sm text-muted-foreground">
                {String(row[fields[1]?.name ?? ""] ?? "")}
              </p>
            </div>
            <div className="flex shrink-0 gap-3 text-sm">
              <button type="button" onClick={() => edit(row)} className="text-primary underline">
                Editar
              </button>
              <button
                type="button"
                onClick={() => remove(row.id)}
                className="text-destructive underline"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
        {rows.length === 0 ? (
          <li className="py-3 text-sm text-muted-foreground">Nenhum item cadastrado.</li>
        ) : null}
      </ul>
    </section>
  );
}
