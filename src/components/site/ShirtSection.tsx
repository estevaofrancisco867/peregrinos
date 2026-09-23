
import camisetaFrente from "../../assets/camiseta-frente.png";
import camisetaVerso from "../../assets/camiseta-verso.png";

import type { SiteContent } from "@/lib/site-data";

export function ShirtSection({ content }: { content: SiteContent }) {
  return (
    <section id="camiseta" className="section-pad bg-muted">
      <div className="mx-auto max-w-6xl px-5">

        <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">

          {/* IMAGENS DAS CAMISETAS */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">

            {/* FRENTE */}
            <figure className="card-lift rounded-2xl border border-border bg-card p-3 text-center sm:p-4">
              <div className="flex h-36 w-full items-center justify-center sm:h-56">
                <img
                  src={camisetaFrente}
                  alt="Camiseta oficial da peregrinação — frente"
                  className="h-full w-full object-contain"
                />
              </div>

              <figcaption className="mt-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Frente
              </figcaption>
            </figure>

            {/* VERSO */}
            <figure className="card-lift rounded-2xl border border-border bg-card p-3 text-center sm:p-4">
              <div className="flex h-36 w-full items-center justify-center sm:h-56">
                <img
                  src={camisetaVerso}
                  alt="Camiseta oficial da peregrinação — verso"
                  className="h-full w-full object-contain"
                />
              </div>

              <figcaption className="mt-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Verso
              </figcaption>
            </figure>

          </div>

          {/* INFORMAÇÕES */}
          <div>

            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl">
              Camiseta oficial da peregrinação
            </h2>

            <p className="mt-4 text-muted-foreground">
              {content["shirt_subtitle"]}
            </p>

            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li>• Todos os tamanhos disponíveis (PP ao XG)</li>
              <li>• Estampa frente e verso com o mapa do caminho</li>
            </ul>

          </div>

        </div>

      </div>
    </section>
  );
}
```
