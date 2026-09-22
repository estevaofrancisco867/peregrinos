import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { AdminCrud } from "@/components/site/AdminCrud";
import { claimAdminRole } from "@/lib/admin.functions";
import { ordersQuery, siteContentQuery } from "@/lib/site-data";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel da coordenação | Peregrinos da Fé" },
      {
        name: "description",
        content:
          "Painel interno dos Peregrinos da Fé para atualizar o conteúdo do site e acompanhar os pedidos de camiseta.",
      },
      { property: "og:title", content: "Painel da coordenação | Peregrinos da Fé" },
      {
        property: "og:description",
        content: "Painel interno dos Peregrinos da Fé.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const claim = useServerFn(claimAdminRole);
  const [status, setStatus] = useState<"checking" | "admin" | "denied">("checking");

  useEffect(() => {
    let active = true;
    claim()
      .then((result) => {
        if (active) setStatus(result.isAdmin ? "admin" : "denied");
      })
      .catch(() => {
        if (active) setStatus("denied");
      });
    return () => {
      active = false;
    };
  }, [claim]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="hero-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Peregrinos da Fé</p>
            <h1 className="mt-1 text-2xl">Painel da coordenação</h1>
          </div>
          <div className="flex gap-3 text-sm">
            <a href="/" className="rounded-full border border-white/40 px-4 py-2">
              Ver o site
            </a>
            <button
              type="button"
              onClick={signOut}
              className="rounded-full bg-gold px-4 py-2 font-semibold text-gold-foreground"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-5 py-10">
        {status === "checking" ? <p className="text-sm text-muted-foreground">Carregando...</p> : null}

        {status === "denied" ? (
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl">Acesso não liberado</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Esta conta ainda não tem permissão de coordenação. Peça a liberação para o responsável
              pelo site.
            </p>
          </div>
        ) : null}

        {status === "admin" ? <AdminContent /> : null}
      </main>
    </div>
  );
}

function AdminContent() {
  return (
    <div className="space-y-6">
      <OrdersPanel />
      <SiteContentPanel />

      <AdminCrud
        table="news"
        queryKey="news"
        title="Notícias"
        description="Novidades exibidas na página inicial."
        fields={[
          { name: "title", label: "Título" },
          { name: "summary", label: "Resumo" },
          { name: "body", label: "Texto completo", type: "textarea" },
          { name: "image_url", label: "Link da imagem" },
          { name: "published_at", label: "Data", type: "date" },
          { name: "sort_order", label: "Ordem", type: "number" },
        ]}
      />

      <AdminCrud
        table="experiences"
        queryKey="experiences"
        title="Experiências"
        fields={[
          { name: "title", label: "Título" },
          { name: "description", label: "Descrição", type: "textarea" },
          { name: "image_url", label: "Link da imagem" },
          { name: "sort_order", label: "Ordem", type: "number" },
        ]}
      />

      <AdminCrud
        table="gallery"
        queryKey="gallery"
        title="Galeria"
        fields={[
          { name: "title", label: "Legenda" },
          { name: "image_url", label: "Link da imagem" },
          { name: "sort_order", label: "Ordem", type: "number" },
        ]}
      />

      <AdminCrud
        table="testimonials"
        queryKey="testimonials"
        title="Relatos"
        fields={[
          { name: "author", label: "Nome" },
          { name: "role", label: "Função" },
          { name: "message", label: "Relato", type: "textarea" },
          { name: "sort_order", label: "Ordem", type: "number" },
        ]}
      />

      <AdminCrud
        table="verses"
        queryKey="verses"
        title="Versículos"
        fields={[
          { name: "reference", label: "Referência" },
          { name: "text", label: "Texto", type: "textarea" },
          { name: "sort_order", label: "Ordem", type: "number" },
        ]}
      />

      <AdminCrud
        table="leaders"
        queryKey="leaders"
        title="Coordenação"
        fields={[
          { name: "name", label: "Nome" },
          { name: "role", label: "Função" },
          { name: "bio", label: "Sobre", type: "textarea" },
          { name: "image_url", label: "Link da foto" },
          { name: "sort_order", label: "Ordem", type: "number" },
        ]}
      />
    </div>
  );
}


const CONTENT_LABELS: Record<string, string> = {
  about_title: 'Título da seção "Quem somos"',
  about_text: 'Resumo de "Quem somos"',
  about_long: 'Texto completo de "Quem somos"',
  form_url: "Link do formulário de inscrição",
  shirt_subtitle: "Descrição da camiseta",
  hero_title: "Título principal do site",
  hero_subtitle: "Frase de apoio do título principal",
  whatsapp: "WhatsApp de contato",
};

function contentLabel(key: string) {
  return CONTENT_LABELS[key] ?? key;
}

function OrdersPanel() {
  const queryClient = useQueryClient();
  const { data: orders = [] } = useQuery(ordersQuery);

  async function updateStatus(id: string, status: string) {
    await supabase.from("shirt_orders").update({ status }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["shirt_orders"] });
  }

  async function remove(id: string) {
    if (!window.confirm("Excluir este pedido?")) return;
    await supabase.from("shirt_orders").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["shirt_orders"] });
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-xl">Pedidos de camiseta</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {orders.length} pedido(s) recebido(s) pelo site.
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
         
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="py-2">{order.full_name}</td>
                <td className="py-2">{order.size}</td>
                <td className="py-2">{order.quantity}</td>
                <td className="py-2">
                  <a
                    href={`https://wa.me/55${order.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline"
                  >
                    {order.whatsapp}
                  </a>
                </td>
                <td className="py-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    aria-label="Situação do pedido"
                    className="rounded-lg border border-border bg-background px-2 py-1"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 text-right">
                  <button
                    type="button"
                    onClick={() => remove(order.id)}
                    className="text-destructive underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td className="py-3 text-muted-foreground" colSpan={6}>
                  Nenhum pedido até agora.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}


function SiteContentPanel() {
  const queryClient = useQueryClient();
  const { data: content = {} } = useQuery(siteContentQuery);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const values = { ...content, ...draft };

  async function save(key: string) {
    await supabase.from("site_content").update({ value: values[key] ?? "" }).eq("key", key);
    await queryClient.invalidateQueries({ queryKey: ["site_content"] });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-xl">Textos do site</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Ajuste títulos, textos, preços e links exibidos nas páginas.
      </p>
      {saved ? <p className="mt-2 text-sm text-primary">Alteração salva.</p> : null}

      <div className="mt-5 space-y-4">
        {Object.keys(content)
          .sort()
          .map((key) => (
            <div key={key} className="grid gap-2 md:grid-cols-[220px_1fr_auto] md:items-start">
              <label className="pt-2 text-sm font-medium" htmlFor={`content-${key}`}>
                {contentLabel(key)}
              </label>
              <textarea
                id={`content-${key}`}
                rows={2}
                value={values[key] ?? ""}
                onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
              />
              <button
                type="button"
                onClick={() => save(key)}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Salvar
              </button>
            </div>
          ))}
      </div>
    </section>
  );
}
