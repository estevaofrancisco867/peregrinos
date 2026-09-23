import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import camisetaFrente from "../../assets/camiseta-frente.png";
import camisetaVerso from "../../assets/camiseta-verso.png";

import asset2 from "../../data/assets2.json";
import asset3 from "../../data/assets3.json";

import type { SiteContent } from "@/lib/site-data";

const sizes = ["PP", "P", "M", "G", "GG", "XG"];

const orderSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo")
    .max(120),

  size: z
    .string()
    .trim()
    .min(1, "Escolha um tamanho")
    .max(4),

  quantity: z
    .number()
    .int()
    .min(1, "Mínimo 1")
    .max(20, "Máximo 20"),

  whatsapp: z
    .string()
    .trim()
    .regex(
      /^[0-9()+\-\s]{10,20}$/,
      "Informe um número de WhatsApp válido"
    ),
});

export function ShirtSection({
  content,
}: {
  content: SiteContent;
}) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    size: "M",
    quantity: 1,
    whatsapp: "",
  });

  const price = content["shirt_price"] ?? "35";
  const oldPrice = content["shirt_old_price"] ?? "40";

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    const parsed = orderSchema.safeParse(form);

    if (!parsed.success) {
      toast.error(
        parsed.error.issues[0]?.message ?? "Verifique os dados"
      );
      return;
    }

    setSending(true);

    const { error } = await supabase
      .from("shirt_orders")
      .insert(parsed.data);

    setSending(false);

    if (error) {
      toast.error(
        "Não foi possível enviar seu pedido. Tente novamente."
      );
      return;
    }

    setDone(true);
  }

  return (
    <section id="camiseta" className="section-pad bg-muted">
      <div className="mx-auto max-w-6xl px-5">

        <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">

          {/* IMAGENS */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">

            {[
              {
                src: camisetaFrente,
                label: asset2.original_filename,
              },

              {
                src: camisetaVerso,
                label: asset3.original_filename,
              },
            ].map((item) => (
              <figure
                key={item.label}
                className="card-lift rounded-2xl border border-border bg-card p-3 text-center sm:p-4"
              >
                <img
                  src={item.src}
                  alt={`Camiseta oficial da peregrinação — ${item.label}`}
                  className="mx-auto h-36 w-full object-contain sm:h-56"
                />

                <figcaption className="mt-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  {item.label}
                </figcaption>
              </figure>
            ))}

          </div>

          {/* INFORMAÇÕES */}
          <div>

            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Camiseta oficial
            </p>

            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl">
              Camiseta oficial da peregrinação
            </h2>

            <p className="mt-4 text-muted-foreground">
              {content["shirt_subtitle"]}
            </p>

            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li>• Todos os tamanhos disponíveis (PP ao XG)</li>
              <li>• Estampa frente e verso com o mapa do caminho</li>
              <li>• Tecido leve e confortável</li>
            </ul>

            {/* PREÇO */}
            <div className="mt-6">
              <span className="text-sm text-muted-foreground line-through">
                R$ {oldPrice}
              </span>

              <div className="text-3xl font-bold">
                R$ {price}
              </div>
            </div>

            {/* BOTÃO */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-6 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90"
            >
              Pedir camiseta
            </button>

          </div>

        </div>

        {/* FORMULÁRIO */}
        {open && (
          <div className="mt-10 rounded-2xl border border-border bg-card p-6">

            {!done ? (
              <form onSubmit={submit} className="space-y-5">

                <h3 className="text-xl font-semibold">
                  Pedido da camiseta
                </h3>

                {/* NOME */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Nome completo
                  </label>

                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        full_name: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                    placeholder="Digite seu nome"
                  />
                </div>

                {/* TAMANHO */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Tamanho
                  </label>

                  <select
                    value={form.size}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        size: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                  >
                    {sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                {/* QUANTIDADE */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Quantidade
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        quantity: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                  />
                </div>

                {/* WHATSAPP */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    WhatsApp
                  </label>

                  <input
                    type="text"
                    value={form.whatsapp}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        whatsapp: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-4 py-3"
                    placeholder="(43) 99999-9999"
                  />
                </div>

                {/* BOTÃO ENVIAR */}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
                >
                  {sending
                    ? "Enviando..."
                    : "Enviar pedido"}
                </button>

              </form>
            ) : (
              <div className="text-center">

                <h3 className="text-xl font-semibold">
                  Pedido enviado!
                </h3>

                <p className="mt-2 text-muted-foreground">
                  Seu pedido foi registrado com sucesso.
                </p>

              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
