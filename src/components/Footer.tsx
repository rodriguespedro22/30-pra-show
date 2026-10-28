import { Link } from "react-router-dom";
import { Logo } from "./Nav";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="[&_span]:text-paper"><Logo /></div>
          <p className="mt-4 max-w-sm text-sm text-paper/70">
            Projeto de demonstração. Os shows, artistas e locais são fictícios e nenhuma compra é real.
          </p>
        </div>
        <nav aria-label="Rodapé" className="flex flex-col gap-2 text-sm">
          <Link className="hover:underline" to="/shows">Todos os shows</Link>
          <Link className="hover:underline" to="/ingressos">Meus ingressos</Link>
          <Link className="hover:underline" to="/entrar">Entrar ou criar conta</Link>
        </nav>
        <p className="text-sm text-paper/70">
          Remaster do projeto acadêmico original (PHP e MySQL), refeito em React, TypeScript e Tailwind.
          <br />
          <a className="mt-2 inline-block font-semibold text-paper underline decoration-sun underline-offset-4" href="https://github.com/rodriguespedro22">Pedro Rodrigues da Cunha</a>
        </p>
      </div>
    </footer>
  );
}
