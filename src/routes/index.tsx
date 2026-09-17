import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Section, MoreButton } from "@/components/site/Section";
import { ShirtSection } from "@/components/site/ShirtSection";
import {
  experiencesQuery,
  formatDate,
  galleryQuery,
  leadersQuery,
  newsQuery,
  siteContentQuery,
  testimonialsQuery,
  versesQuery,
} from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Peregrinos da Fé | Caminho Jesus das Santas Chagas" },
      {
        name: "description",
        content:
          "Site oficial dos Peregrinos da Fé, do Caminho Jesus das Santas Chagas em Ibiporã (PR): notícias, experiências, galeria, camiseta oficial e inscrições.",
      },
      { property: "og:title", content: "Peregrinos da Fé | Caminho Jesus das Santas Chagas" },
      {
        property: "og:description",
        content:
          "Peregrinação católica em Ibiporã (PR). Conheça o grupo, veja relatos, fotos e garanta a camiseta oficial.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const content = useQuery(siteContentQuery).data ?? {};
  const news = useQuery(newsQuery).data ?? [];
  const experiences = useQuery(experiencesQuery).data ?? [];
  const gallery = useQuery(galleryQuery).data ?? [];
  const testimonials = useQuery(testimonialsQuery).data ?? [];
  const verses = useQuery(versesQuery).data ?? [];
  const leaders = useQuery(leadersQuery).data ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <Section
        id="quem-somos"
        eyebrow="Nossa missão"
        title={content["about_title"] ?? "Quem somos e o que fazemos"}
      >
        <div className="grid gap-8 md:grid-cols-[1.3fr_0.7fr] md:items-start">
          <p className="text-lg leading-relaxed text-muted-foreground">{content["about_text"]}</p>
          <div className="rounded-2xl border border-border bg-card p-6 card-lift">
            <p className="font-display text-2xl text-primary">18 km de oração</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Da Paróquia São Rafael ao Pico do Guarani, passando por capelas, chácaras e a ponte do
              Rio Ribeirão Jacutinga.
            </p>
            <div className="mt-6">
              <MoreButton to="/quem-somos">Ver mais sobre</MoreButton>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="noticias"
        eyebrow="Acontece no caminho"
        title="Notícias"
        description="Reportagens resumidas sobre a caminhada e a vida do grupo."
        tone="muted"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {news.map((item) => (
            <article
              key={item.id}
              className="card-lift hover:card-lift-hover flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
            >
              <img
                src={item.image_url}
                alt={item.title}
                loading="lazy"
                className="h-44 w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-5">
                <time className="text-xs uppercase tracking-widest text-muted-foreground">
                  {formatDate(item.published_at)}
                </time>
                <h3 className="mt-2 text-xl leading-snug">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{item.summary}</p>
                <Link
                  to="/noticias/$id"
                  params={{ id: item.id }}
                  className="mt-5 text-sm font-semibold text-primary hover:underline"
                >
                  Saber mais →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="experiencias"
        eyebrow="Vivências"
        title="Experiências de quem caminha"
      >
        <div className="grid gap-8 md:grid-cols-3">
          {experiences.map((item) => (
            <article key={item.id} className="card-lift overflow-hidden rounded-2xl border border-border bg-card">
              <img
                src={item.image_url}
                alt={item.title}
                loading="lazy"
                className="h-72 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl">{item.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10">
          <MoreButton to="/experiencias">Ver mais experiências</MoreButton>
        </div>
      </Section>

      <ShirtSection content={content} />

      <Section id="galeria" eyebrow="Memórias" title="Galeria de fotos">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {gallery.map((item) => (
            <img
              key={item.id}
              src={item.image_url}
              alt={item.title || "Foto da peregrinação"}
              loading="lazy"
              className="h-56 w-full rounded-2xl object-cover"
            />
          ))}
        </div>
        <div className="mt-10">
          <MoreButton to="/galeria">Ver mais sobre</MoreButton>
        </div>
      </Section>

      <Section
        id="relatos"
        eyebrow="Testemunhos"
        title="Relatos de membros"
        tone="muted"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.slice(0, 6).map((item) => (
            <blockquote
              key={item.id}
              className="rounded-2xl border border-border bg-card p-6 card-lift"
            >
              <p className="text-sm leading-relaxed text-muted-foreground">“{item.message}”</p>
              <footer className="mt-4">
                <p className="font-display text-lg text-primary">{item.author}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {item.role}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </Section>

      <Section
        id="versiculos"
        eyebrow="Palavra de Deus"
        title="Seis versículos para a caminhada"
        tone="deep"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {verses.slice(0, 6).map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/20 bg-white/5 p-6">
              <p className="text-sm leading-relaxed opacity-90">“{item.text}”</p>
              <p className="mt-4 font-display text-gold">{item.reference}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="coordenacao"
        eyebrow="Nossa equipe"
        title="Quem coordena a caminhada"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {leaders.map((item) => (
            <article
              key={item.id}
              className="card-lift overflow-hidden rounded-2xl border border-border bg-card text-center"
            >
              <img
                src={item.image_url}
                alt={item.name}
                loading="lazy"
                className="h-56 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="text-lg">{item.name}</h3>
                <p className="text-xs uppercase tracking-widest text-gold">{item.role}</p>
                <p className="mt-3 text-sm text-muted-foreground">{item.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="inscricao"
        eyebrow="Participe"
        title="Formulário de inscrição"
        description="As inscrições são feitas pelo formulário oficial do grupo. Leva menos de 3 minutos."
        tone="muted"
      >
        <a
          href={content["form_url"] ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full items-center justify-center rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 sm:w-auto"
        >
          Fazer minha inscrição
        </a>
      </Section>

      <Footer />
    </div>
  );
}
