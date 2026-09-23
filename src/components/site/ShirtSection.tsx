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

          {/* IMAGENS SEM FUNDO */}
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
                className="group flex flex-col items-center justify-between text-center p-2"
              >
                <div className="flex items-center justify-center h-48 sm:h-64 w-full overflow-hidden py-2">
                  <img
                    src={item.src}
                    alt={`Camiseta oficial da peregrinação - Vista ${item.label}`}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
                  />
                </div>

                <figcaption className="mt-4 inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-background/80 backdrop-blur-sm text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80 border border-border/40 shadow-sm">
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

            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
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
