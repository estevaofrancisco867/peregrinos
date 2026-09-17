import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { experiencesQuery } from "@/lib/site-data";

export const Route = createFileRoute("/experiencias")({
  head: () => ({
    meta: [
      { title: "Experiências dos peregrinos | Peregrinos da Fé" },
      {
        name: "description",
        content:
          "Vivências e experiências de quem caminha no Caminho Jesus das Santas Chagas, em Ibiporã (PR).",
      },
      { property: "og:title", content: "Experiências dos peregrinos" },
      {
        property: "og:description",
        content: "Vivências de quem caminha no Caminho Jesus das Santas Chagas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExperiencesPage,
});

function ExperiencesPage() {
  const items = useQuery(experiencesQuery).data ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="text-3xl md:text-4xl">Todas as experiências</h1>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="card-lift overflow-hidden rounded-2xl border border-border bg-card">
              <img src={item.image_url} alt={item.title} loading="lazy" className="h-80 w-full object-cover" />
              <div className="p-6">
                <h2 className="text-xl">{item.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
