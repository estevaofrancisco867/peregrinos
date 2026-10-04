import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { translateUserMessage } from "@/lib/messages";
import { isDriveFolderLink, normalizeImageUrl } from "@/lib/drive-image";

export type FieldType = "text" | "textarea" | "number" | "date" | "image";

export type Field = {
  name: string;
  label: string;
  type?: FieldType;
};

type Row = Record<string, unknown> & { id: string };

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
      } else if (field.type === "date") {
        // Postgres rejeita "" em coluna date.
        payload[field.name] = value === "" ? null : value;
      } else if (field.type === "image") {
        // Converte links do Google Drive em URL direta de imagem.
        payload[field.name] = normalizeImageUrl(value);
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
      for (const field of fields) {
        if (field.type === "image" && isDriveFolderLink(draft[field.name] ?? "")) {
          throw new Error(
            "Esse é o link de uma pasta do Drive. Abra a imagem, clique em Compartilhar e copie o link do arquivo.",
          );
        }
      }
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
        {fields.map((field) => {
          const id = `${table}-${field.name}`;
          const previewUrl =
            field.type === "image" ? normalizeImageUrl(draft[field.name]) : "";

          return (
            <div key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
              <label className="text-sm font-medium" htmlFor={id}>
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={id}
                  rows={3}
                  value={draft[field.name] ?? ""}
                  onChange={(e) => setDraft({ ...draft, [field.name]: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                />
              ) : (
                <input
                  id={id}
                  type={
                    field.type === "number" ? "number" : field.type === "date" ? "date" : "text"
                  }
                  value={draft[field.name] ?? ""}
                  onChange={(e) => setDraft({ ...draft, [field.name]: e.target.value })}
                  placeholder={
                    field.type === "image" ? "Cole o link do Google Drive ou de qualquer imagem" : undefined
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                />
              )}
              {field.type === "image" ? (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">
                    No Drive, compartilhe como "Qualquer pessoa com o link" e cole o link aqui.
                  </p>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Pré-visualização"
                      referrerPolicy="no-referrer"
                      className="mt-2 h-24 rounded-lg border border-border object-cover"
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
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
        {rows.map((row) => {
          const imageField = fields.find((f) => f.type === "image");
          const thumb = imageField ? normalizeImageUrl(String(row[imageField.name] ?? "")) : "";

          return (
            <li key={row.id} className="flex items-start justify-between gap-4 py-3">
              <div className="flex min-w-0 items-start gap-3">
                {thumb ? (
                  <img
                    src={thumb}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="h-12 w-12 shrink-0 rounded-md object-cover"
                  />
                ) : null}
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {String(row[fields[0]!.name] ?? "(sem título)")}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {String(row[fields[1]?.name ?? ""] ?? "")}
                  </p>
                </div>
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
          );
        })}
        {rows.length === 0 ? (
          <li className="py-3 text-sm text-muted-foreground">Nenhum item cadastrado.</li>
        ) : null}
      </ul>
    </section>
  );
}
