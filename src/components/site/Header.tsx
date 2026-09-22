import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Volume2, VolumeX } from "lucide-react";

import trilha from "../../assets/trilha.png";
import asset from "../../data/assets.json";

const links = [
  { href: "/#quem-somos", label: "Quem somos" },
  { href: "/#noticias", label: "Notícias" },
  { href: "/#experiencias", label: "Experiências" },
  { href: "/#camiseta", label: "Camiseta" },
  { href: "/#galeria", label: "Galeria" },
  { href: "/#relatos", label: "Relatos" },
  { href: "/#coordenacao", label: "Coordenação" },
  { href: "/#inscricao", label: "Inscrição" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <header className="hero-surface relative overflow-hidden">
      {isPlaying && (
        <iframe
          width="0"
          height="0"
          src="https://www.youtube.com/embed/DSMGO7AT2sk?autoplay=1"
          title="Música de fundo"
          allow="autoplay"
          className="hidden"
        />
      )}

      <nav className="relative z-10 mx-auto max-w-6xl px-5 py-4 sm:py-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:flex lg:justify-between">
          <Link
            to="/"
            className="truncate font-display text-base tracking-[0.2em] uppercase sm:text-lg"
          >
            Peregrinos da Fé
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className="shrink-0 rounded-full border border-white/40 p-2 lg:hidden"
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <ul className="hidden items-center gap-x-5 gap-y-2 text-sm lg:flex lg:flex-wrap">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="opacity-85 transition-opacity hover:opacity-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {open ? (
          <ul className="mt-4 grid gap-1 rounded-2xl border border-white/20 bg-white/10 p-3 text-sm lg:hidden">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 transition-colors hover:bg-white/10"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </nav>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 px-5 pb-12 pt-4 sm:pb-16 md:grid-cols-[1.1fr_0.9fr] md:gap-10 md:pb-20 md:pt-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold sm:text-sm sm:tracking-[0.35em]">
            Ibiporã · Paraná
          </p>

          <h1 className="mt-4 text-3xl leading-tight sm:text-4xl md:text-6xl">
            4º Caminho{" "}
            <span className="text-gold">
              Jesus das Santas Chagas
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-base opacity-90 md:mt-5 md:text-lg">
            Uma peregrinação católica de oração, serviço e acolhida. Por suas
            Chagas somos curados.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="/#inscricao"
              className="rounded-full bg-gold px-6 py-3 text-center text-sm font-semibold text-gold-foreground transition-transform hover:-translate-y-0.5"
            >
              Quero peregrinar
            </a>

            <a
              href="/#camiseta"
              className="rounded-full border border-white/40 px-6 py-3 text-center text-sm font-semibold transition-colors hover:bg-white/10"
            >
              Camiseta oficial
            </a>

            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-center text-sm font-semibold text-gold-foreground transition-transform hover:-translate-y-0.5"
            >
              {isPlaying ? (
                <>
                  <VolumeX className="h-4 w-4" />
                  Pausar música
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" />
                  Tocar uma música
                </>
              )}
            </button>
          </div>
        </div>

        <div className="justify-self-center">
          <img
            src={trilha}
            alt={asset.original_filename}
            className="w-full max-w-[16rem] rounded-3xl border border-white/20 object-cover shadow-2xl sm:max-w-sm"
          />
        </div>
      </div>

      <div className="gold-rule h-1 w-full" />
    </header>
  );
}
