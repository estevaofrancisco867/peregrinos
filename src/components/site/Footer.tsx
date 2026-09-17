import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="hero-surface mt-20">
      <div className="gold-rule h-1 w-full" />
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-10 text-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg tracking-[0.2em] uppercase">Peregrinos da Fé</p>
          <p className="opacity-80">Caminho Jesus das Santas Chagas — Ibiporã, PR</p>
        </div>
        <Link to="/admin" className="opacity-70 transition-opacity hover:opacity-100">
          Área da coordenação
        </Link>
      </div>
    </footer>
  );
}
