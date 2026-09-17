import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { formatDate, newsQuery } from "@/lib/site-data";

export const Route = createFileRoute("/noticias/$id")({
  head: () => ({
    meta: [
      { title: "Reportagem | Peregrinos da Fé" },
      {
        name: "description",
        content: "Reportagem completa sobre a caminhada dos Peregrinos da Fé em Ibiporã (PR).",
      },
      { property: "og:title", content: "Reportagem | Peregrinos da Fé" },
      {
        property: "og:description",
        content: "Reportagem completa sobre a caminhada dos Peregrinos da Fé em Ibiporã (PR).",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewsArticle,
});

function NewsArticle() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery(newsQuery);
  const item = data?.find((n) => n.id === id);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-16">
        {isLoading ? (
          <p className="text-muted-foreground">Carregando reportagem...</p>
        ) : !item ? (
          <p className="text-muted-foreground">Reportagem não encontrada.</p>
        ) : (
          <article>
            <Link to="/" hash="noticias" className="text-sm text-primary hover:underline">
              ← Voltar para as notícias
            </Link>
            <time className="mt-6 block text-xs uppercase tracking-widest text-muted-foreground">
              {formatDate(item.published_at)}
            </time>
            <h1 className="mt-3 text-3xl leading-tight md:text-4xl">{item.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{item.summary}</p>
            <img
              src={item.image_url}
              alt={item.title}
              className="mt-8 w-full rounded-2xl object-cover"
            />
            <div className="mt-8 space-y-5 leading-relaxed">
              {item.body.split("\n").filter(Boolean).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
