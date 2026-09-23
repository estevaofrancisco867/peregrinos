import camisetaFrente from "../../assets/camiseta-frente.png";
import camisetaVerso from "../../assets/camiseta-verso.png";

import asset2 from "../../data/assets2.json";
import asset3 from "../../data/assets3.json";

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
                className="card-lift rounded-2xl border border-border bg-white p-3 text-center sm:p-4 flex flex-col justify-between"
              >
                <div className="flex items-center justify-center h-48 sm:h-64 w-full">
                  <img
                    src={item.src}
                    alt={`Camiseta oficial da peregrinação — ${item.label}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

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

          </div>

        </div>

      </div>
    </section>
  );
}
