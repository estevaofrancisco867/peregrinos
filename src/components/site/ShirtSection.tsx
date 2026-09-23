import camisetaFrente from "../../assets/camiseta-frente.png";
import camisetaVerso from "../../assets/camiseta-verso.png";

import type { SiteContent } from "@/lib/site-data";

export function ShirtSection({
  content,
}: {
  content: SiteContent;
}) {
  return (
    <section id="camiseta" className="section-pad bg-muted">
      <div className="mx-auto max-w-6xl px-5">

        <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">

          {/* IMAGENS COM CARD, SEM FUNDO E DO MESMO TAMANHO */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">

            {[
              {
                src: camisetaFrente,
                label: "Frente",
              },
              {
                src: camisetaVerso,
                label: "Verso",
              },
            ].map((item) => (
              <figure
                key={item.label}
                className="group relative rounded-3xl border border-border/60 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30 flex flex-col justify-between"
              >
                <div className="flex items-center justify-center h-52 sm:h-64 w-full overflow-hidden py-2">
                  <img
                    src={item.src}
                    alt={`Camiseta oficial da peregrinação - Vista ${item.label}`}
                    className="h-44 w-44 sm:h-56 sm:w-56 object-contain mx-auto transition-transform duration-500 group-hover:scale-105 bg-transparent mix-blend-multiply"
                  />
                </div>

                <figcaption className="mt-4 inline-flex items-center justify-center self-center px-4 py-1.5 rounded-full bg-muted/60 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80 border border-border/40">
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

            <p className="mt-4 text-muted-foreground leading-relaxed">
              {content["shirt_subtitle"]}
            </p>

            <ul className="mt-6 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Todos os tamanhos disponíveis (PP ao XG)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Estampa frente e verso com o mapa do caminho
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Tecido leve e confortável
              </li>
            </ul>

          </div>

        </div>

      </div>
    </section>
  );
}
