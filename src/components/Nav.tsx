import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { auth, useStore } from "../lib/store";

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden>
        <rect width="64" height="64" rx="14" fill="#2438ff" />
        <path d="M14 22h36v7a4 4 0 0 0 0 8v7H14v-7a4 4 0 0 0 0-8z" fill="#ffd84d" />
        <path d="M26 28h12M26 36h8" stroke="#0e0e12" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="display text-[1.7rem] leading-none">30 pra Show</span>
    </span>
  );
}

const link = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 text-[.95rem] font-semibold transition-colors ${isActive ? "bg-ink text-paper" : "hover:bg-paper-2"}`;

export function Nav() {
  const user = useStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const close = () => setOpen(false);

  const items = (
    <>
      <NavLink to="/shows" className={link} onClick={close}>Shows</NavLink>
      {user && <NavLink to="/ingressos" className={link} onClick={close}>Meus ingressos</NavLink>}
      {user?.role === "admin" && <NavLink to="/admin" className={link} onClick={close}>Administração</NavLink>}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to="/" aria-label="30 pra Show, página inicial" onClick={close}><Logo /></Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">{items}</nav>
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-ink-2">Olá, <b>{user.name.split(" ")[0]}</b></span>
              <button className="btn btn-ghost !min-h-10" onClick={() => { auth.logout(); nav("/"); }}>Sair</button>
            </>
          ) : (
            <Link to="/entrar" className="btn btn-ink !min-h-10">Entrar</Link>
          )}
        </div>
        <button className="grid size-11 place-items-center rounded-full border-2 border-ink md:hidden" aria-expanded={open} aria-controls="menu-mobile" aria-label={open ? "Fechar menu" : "Abrir menu"} onClick={() => setOpen(!open)}>
          <span className="block h-0.5 w-5 bg-ink before:absolute before:h-0.5 before:w-5 before:-translate-y-1.5 before:bg-ink after:absolute after:h-0.5 after:w-5 after:translate-y-1.5 after:bg-ink" />
        </button>
      </div>
      {open && (
        <div id="menu-mobile" className="border-t border-line bg-paper px-5 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Principal">{items}</nav>
          <div className="mt-4">
            {user ? (
              <button className="btn btn-ghost w-full" onClick={() => { auth.logout(); close(); nav("/"); }}>Sair ({user.name.split(" ")[0]})</button>
            ) : (
              <Link to="/entrar" className="btn btn-ink w-full" onClick={close}>Entrar</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
