import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { siteContentQuery } from "@/lib/site-data";

export const Route = createFileRoute("/quem-somos")({
  head: () => ({
    meta: [
      { title: "Quem somos | Peregrinos da Fé" },
      {
        name: "description",
        content:
          "Conheça a história e a missão dos Peregrinos da Fé, grupo católico do Caminho Jesus das Santas Chagas, em Ibiporã (PR).",
      },
      { property: "og:title", content: "Quem somos | Peregrinos da Fé" },
      {
        property: "og:description",
        content: "A história e a missão do grupo católico Peregrinos da Fé.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const content = useQuery(siteContentQuery).data ?? {};

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-3xl md:text-4xl">{content["about_title"] ?? "Quem somos"}</h1>
        <p className="mt-6 text-lg text-muted-foreground">{content["about_text"]}</p>
        <div className="mt-8 space-y-5 leading-relaxed">
          {(content["about_long"] ?? "")
            .split("\n")
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
