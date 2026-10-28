import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Poster } from "../components/Poster";
import { money, parts } from "../lib/format";
import { allShows, orderActions, sold, useStore } from "../lib/store";
import NotFound from "./NotFound";

export default function ShowDetail() {
  const { id } = useParams();
  const custom = useStore((s) => s.custom);
  const orders = useStore((s) => s.orders);
  const user = useStore((s) => s.user);
  const nav = useNavigate();
  const show = useMemo(() => allShows(custom).find((s) => s.id === id), [custom, id]);
  const [sectorId, setSectorId] = useState("pista");
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState<string | null>(null);

  if (!show) return <NotFound />;
  const p = parts(show.date);
  const sector = show.sectors.find((s) => s.id === sectorId) ?? show.sectors[0];
  const left = (s: typeof sector) => Math.max(0, s.capacity - sold(orders, show.id, s.id));
  const max = Math.min(6, left(sector));
  const total = sector.price * qty;

  const pick = (sid: string) => { setSectorId(sid); setQty(1); };

  const buy = () => {
    if (!user) { nav("/entrar", { state: { from: `/shows/${show.id}` } }); return; }
    orderActions.create({ showId: show.id, sectorId: sector.id, qty, total });
    setDone(sector.name);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pb-10 pt-8 sm:px-8">
      <Link to="/shows" className="inline-flex items-center gap-2 text-sm font-bold text-ink-2 hover:text-ink">← Todos os shows</Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,.9fr)_1.1fr]">
        <motion.div className="lg:sticky lg:top-24 lg:self-start" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Poster show={show} size="lg" />
        </motion.div>

        <div>
          <p className="text-sm font-bold tracking-[.14em] text-blue uppercase">{show.tour} · {show.genre}</p>
          <h1 className="display mt-2 text-[clamp(3.5rem,8vw,6.5rem)]">{show.artist}</h1>

          <dl className="mt-6 grid gap-4 rounded-3xl bg-white p-6 sm:grid-cols-3">
            <div><dt className="text-sm text-mute">Data</dt><dd className="block font-bold first-letter:uppercase">{p.weekday}, {p.day} de {p.monthLong}</dd></div>
            <div><dt className="text-sm text-mute">Horário</dt><dd className="font-bold">{p.time} · portões {show.doors}</dd></div>
            <div><dt className="text-sm text-mute">Local</dt><dd className="font-bold">{show.venue}, {show.city}/{show.state}</dd></div>
          </dl>

          <p className="mt-6 max-w-xl text-lg text-ink-2">{show.about}</p>

          <fieldset className="mt-10">
            <legend className="display text-4xl">Escolha o setor</legend>
            <div className="mt-4 grid gap-3">
              {show.sectors.map((s) => {
                const l = left(s);
                const active = s.id === sector.id;
                return (
                  <label key={s.id} className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-2 bg-white p-5 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-blue ${active ? "border-blue" : "border-line hover:border-ink"} ${l === 0 ? "pointer-events-none opacity-50" : ""}`}>
                    <input type="radio" name="setor" className="sr-only" checked={active} onChange={() => pick(s.id)} disabled={l === 0} />
                    <span>
                      <span className="block text-lg font-extrabold">{s.name}</span>
                      <span className="block text-sm text-mute">{s.note}</span>
                      <span className={`mt-1 block text-xs font-bold ${l === 0 ? "text-ink" : l < 60 ? "text-[#c2410c]" : "text-mute"}`}>
                        {l === 0 ? "Esgotado" : l < 60 ? `Últimos ${l} ingressos` : "Disponível"}
                      </span>
                    </span>
                    <span className="text-xl font-extrabold">{money(s.price)}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-ink p-6 text-paper">
            <div className="flex items-center gap-4">
              <span className="text-sm text-paper/70" id="qtd">Quantidade</span>
              <div className="flex items-center gap-1 rounded-full bg-paper/10 p-1" role="group" aria-labelledby="qtd">
                <button className="grid size-10 place-items-center rounded-full text-xl hover:bg-paper/15 disabled:opacity-30" aria-label="Diminuir" disabled={qty <= 1} onClick={() => setQty(qty - 1)}>−</button>
                <output className="w-8 text-center text-lg font-extrabold" aria-live="polite">{qty}</output>
                <button className="grid size-10 place-items-center rounded-full text-xl hover:bg-paper/15 disabled:opacity-30" aria-label="Aumentar" disabled={qty >= max} onClick={() => setQty(qty + 1)}>+</button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-paper/70">Total</p>
              <p className="display text-5xl">{money(total)}</p>
            </div>
            <button className="btn bg-sun text-ink hover:bg-white w-full sm:w-auto" onClick={buy} disabled={max === 0}>
              {user ? "Confirmar compra" : "Entrar para comprar"}
            </button>
          </div>
          <p className="mt-3 text-sm text-mute">Demonstração: nenhuma cobrança é feita e o ingresso fica salvo só neste navegador.</p>
        </div>
      </div>

      <AnimatePresence>
        {done && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-5 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="ok-titulo">
            <motion.div className="stub w-full max-w-md bg-white p-8 text-center" style={{ ["--notch" as string]: "62%" }} initial={{ y: -80, rotate: -4, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 160, damping: 16 }}>
              <p className="display text-6xl text-blue" id="ok-titulo">Garantido!</p>
              <p className="mt-3 text-ink-2">{qty} {qty === 1 ? "ingresso" : "ingressos"} de {done} para <b>{show.artist}</b> {qty === 1 ? "já está" : "já estão"} em Meus ingressos.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link to="/ingressos" className="btn btn-primary">Ver meus ingressos</Link>
                <button className="btn btn-ghost" onClick={() => setDone(null)}>Continuar aqui</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
