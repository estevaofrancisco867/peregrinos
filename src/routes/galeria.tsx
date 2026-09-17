import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { galleryQuery } from "@/lib/site-data";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria de fotos | Peregrinos da Fé" },
      {
        name: "description",
        content: "Fotos da peregrinação do Caminho Jesus das Santas Chagas em Ibiporã (PR).",
      },
      { property: "og:title", content: "Galeria de fotos | Peregrinos da Fé" },
      {
        property: "og:description",
        content: "Fotos da peregrinação do Caminho Jesus das Santas Chagas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const items = useQuery(galleryQuery).data ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="text-3xl md:text-4xl">Galeria completa</h1>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {items.map((item) => (
            <img
              key={item.id}
              src={item.image_url}
              alt={item.title || "Foto da peregrinação"}
              loading="lazy"
              className="h-64 w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
