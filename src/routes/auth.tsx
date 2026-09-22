import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { translateUserMessage } from "@/lib/messages";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Área da coordenação | Peregrinos da Fé" },
      {
        name: "description",
        content:
          "Acesso restrito da coordenação dos Peregrinos da Fé para atualizar o conteúdo do site.",
      },
      { property: "og:title", content: "Área da coordenação | Peregrinos da Fé" },
      {
        property: "og:description",
        content: "Acesso restrito da coordenação dos Peregrinos da Fé.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/admin" });
    } catch (error) {
      setMessage(error instanceof Error ? translateUserMessage(error.message) : "Não foi possível concluir.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto w-full max-w-md px-5 py-16">
        <h1 className="text-3xl">Área da coordenação</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Acesso restrito para atualizar o site.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2"
            />
          </div>
          {message ? <p className="text-sm text-destructive">{message}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {loading ? "Aguarde..." : "Entrar"}
          </button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          O acesso é exclusivo da conta da coordenação. Não há criação de novas contas.
        </p>

      </main>
      <Footer />
    </div>
  );
}
