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

  // Função para lidar com o upload/conversão da imagem do computador/celular
  async function handleFileChange(fieldName: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setError(null);

    try {
      // Opção 1: Se você tiver um Bucket no Supabase chamado "images", faça o upload direto:
      /*
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      setDraft((prev) => ({ ...prev, [fieldName]: publicUrlData.publicUrl }));
      */

      // Opção 2 (Mais simples e sem dor de cabeça com Buckets): Converte o arquivo local em Base64 / URL temporária
      const reader = new FileReader();
      reader.onloadend = () => {
        setDraft((prev) => ({ ...prev, [fieldName]: reader.result as string }));
        setBusy(false);
      };
      reader.readAsDataURL(file);

    } catch (err) {
      setError("Não foi possível carregar a imagem do dispositivo.");
      setBusy(false);
    }
  }

  function toPayload() {
    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      const value = draft[field.name] ?? "";
      if (field.type === "number") {
        payload[field.name] = Number(value || 0);
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
              {field.label} {field.type === "image" ? <span className="text-xs text-muted-foreground">(Selecione do computador/celular)</span> : null}
            </label>

            {field.type === "textarea" ? (
              <textarea
                id={`${table}-${field.name}`}
                rows={3}
                value={draft[field.name] ?? ""}
                onChange={(e) => setDraft({ ...draft, [field.name]: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
              />
            ) : field.type === "image" ? (
              <div className="mt-1 flex flex-col gap-2">
                <input
                  id={`${table}-${field.name}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(field.name, e)}
                  className="w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:opacity-90"
                />
                {draft[field.name] ? (
                  <div className="flex items-center gap-3">
                    <img 
                      src={draft[field.name]} 
                      alt="Pré-visualização" 
                      className="h-16 w-16 rounded-lg object-cover border border-border" 
                    />
                    <span className="text-xs text-muted-foreground">Imagem selecionada com sucesso</span>
                  </div>
                ) : null}
              </div>
            ) : (
              <input
                id={`${table}-${field.name}`}
                type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
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
            <div className="min-w-0 flex items-center gap-3">
              {row.image_url ? (
                <img 
                  src={String(row.image_url)} 
                  alt="" 
                  className="h-10 w-10 shrink-0 rounded-md object-cover border border-border" 
                />
              ) : null}
              <div className="min-w-0">
                <p className="truncate font-medium">{String(row[fields[0]!.name] ?? "(sem título)")}</p>
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
        ))}
        {rows.length === 0 ? (
          <li className="py-3 text-sm text-muted-foreground">Nenhum item cadastrado.</li>
        ) : null}
      </ul>
    </section>
  );
}
