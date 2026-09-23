```tsx
import camisetaFrente from "../../assets/camiseta-frente.png";
import camisetaVerso from "../../assets/camiseta-verso.png";

import type { SiteContent } from "@/lib/site-data";

export function ShirtSection({ content }: { content: SiteContent }) {
  return (
    <section id="camiseta" className="section-pad bg-muted">
      <div className="mx-auto max-w-6xl px-5">

        <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">

          {/* IMAGENS */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5">

            {/* FRENTE */}
            <figure className="group text-center">

              <div
                className="
                  flex h-56 w-full items-center justify-center
                  overflow-hidden rounded-2xl
                  border border-border
                  bg-card
                  p-4
                  shadow-sm
                  transition-all duration-300
                  group-hover:-translate-y-1
                  group-hover:shadow-lg
                  sm:h-72
                "
              >
                <img
                  src={camisetaFrente}
                  alt="Frente da camiseta oficial da peregrinação"
                  className="
                    h-full w-full
                    object-contain
                    transition-transform duration-300
                    group-hover:scale-105
                  "
                />
              </div>

              <figcaption
                className="
                  mt-4
                  text-sm font-semibold
                  uppercase tracking-[0.25em]
                  text-foreground
                "
              >
                Frente
              </figcaption>

            </figure>

            {/* VERSO */}
            <figure className="group text-center">

              <div
                className="
                  flex h-56 w-full items-center justify-center
                  overflow-hidden rounded-2xl
                  border border-border
                  bg-card
                  p-4
                  shadow-sm
                  transition-all duration-300
                  group-hover:-translate-y-1
                  group-hover:shadow-lg
                  sm:h-72
                "
              >
                <img
                  src={camisetaVerso}
                  alt="Verso da camiseta oficial da peregrinação"
                  className="
                    h-full w-full
                    object-contain
                    transition-transform duration-300
                    group-hover:scale-105
                  "
                />
              </div>

              <figcaption
                className="
                  mt-4
                  text-sm font-semibold
                  uppercase tracking-[0.25em]
                  text-foreground
                "
              >
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
