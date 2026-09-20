import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import frente from "@/assets/camiseta-frente.png.asset.json";
import verso from "@/assets/camiseta-verso.png.asset.json";
import type { SiteContent } from "@/lib/site-data";

const sizes = ["PP", "P", "M", "G", "GG", "XG"];

const orderSchema = z.object({
  full_name: z.string().trim().min(3, "Informe seu nome completo").max(120),
  size: z.string().trim().min(1, "Escolha um tamanho").max(4),
  quantity: z.number().int().min(1, "Mínimo 1").max(20, "Máximo 20"),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[0-9()+\-\s]{10,20}$/, "Informe um número de WhatsApp válido"),
});

export function ShirtSection({ content }: { content: SiteContent }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ full_name: "", size: "M", quantity: 1, whatsapp: "" });

  const price = content["shirt_price"] ?? "35";
  const oldPrice = content["shirt_old_price"] ?? "40";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = orderSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Verifique os dados");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("shirt_orders").insert(parsed.data);
    setSending(false);
    if (error) {
      toast.error("Não foi possível enviar seu pedido. Tente novamente.");
      return;
    }
    setDone(true);
  }

  return (
    <section id="camiseta" className="section-pad bg-muted">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { src: frente.url, label: "Frente" },
              { src: verso.url, label: "Verso" },
            ].map((item) => (
              <figure
                key={item.label}
                className="card-lift rounded-2xl border border-border bg-card p-3 text-center sm:p-4"
              >
                <img
                  src={item.src}
                  alt={`Camiseta oficial da peregrinação — ${item.label.toLowerCase()}`}
                  className="mx-auto h-36 w-full object-contain sm:h-56"
                />
                <figcaption className="mt-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  {item.label}
                </figcaption>
              </figure>
            ))}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gold">Loja do peregrino</p>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl">
              Camiseta oficial da peregrinação
            </h2>
            <p className="mt-4 text-muted-foreground">{content["shirt_subtitle"]}</p>

           
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li>• Todos os tamanhos disponíveis (PP ao XG)</li>
              <li>• Estampa frente e verso com o mapa do caminho</li>
              <li>• Retorno pelo WhatsApp em até 48 horas</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
