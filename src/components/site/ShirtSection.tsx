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
          <div className="grid grid-cols-2 gap-3 sm:gap-4">

            {/* FRENTE */}
            <div className="text-center">

              <div className="flex h-56 items-center justify-center sm:h-72">
                <img
                  src={camisetaFrente}
                  alt="Frente"
                  className="h-full w-full object-contain"
                />
              </div>

              <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Frente
              </p>

            </div>

            {/* VERSO */}
            <div className="text-center">

              <div className="flex h-56 items-center justify-center sm:h-72">
                <img
                  src={camisetaVerso}
                  alt="Verso"
                  className="h-full w-full object-contain"
                />
              </div>

              <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Verso
              </p>

            </div>

          </div>

          {/* TEXTO */}
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
