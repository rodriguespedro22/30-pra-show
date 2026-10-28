import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSearchParams } from "react-router-dom";
import { ShowCard } from "../components/ShowCard";
import { CITIES, GENRES } from "../data/shows";
import { parts } from "../lib/format";
import { allShows, sold, useStore } from "../lib/store";

export default function Shows() {
  const [params, setParams] = useSearchParams();
  const custom = useStore((s) => s.custom);
  const orders = useStore((s) => s.orders);
  const list = useMemo(() => allShows(custom), [custom]);

  const q = params.get("q") ?? "";
  const city = params.get("cidade") ?? "";
  const genre = params.get("genero") ?? "";
  const month = params.get("mes") ?? "";

  const months = useMemo(() => {
    const m = new Map<string, string>();
    list.forEach((s) => { const p = parts(s.date); m.set(p.monthKey, `${p.monthLong} de ${s.date.slice(0, 4)}`); });
    return [...m.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [list]);

  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    setParams(next, { replace: true });
  };

  const filtered = list
    .filter((s) => (!q || `${s.artist} ${s.tour} ${s.venue}`.toLowerCase().includes(q.toLowerCase())) && (!city || s.city === city) && (!genre || s.genre === genre) && (!month || parts(s.date).monthKey === month))
    .sort((a, b) => a.date.localeCompare(b.date));

  const cities = [...new Set([...CITIES, ...list.map((s) => s.city)])].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const hasFilter = !!(q || city || genre || month);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-8">
      <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="display text-[clamp(3.5rem,9vw,7.5rem)]">Todos os shows</motion.h1>

      <form className="mt-8 grid gap-4 md:grid-cols-[1.4fr_1fr_1fr]" role="search" aria-label="Filtrar shows" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="label" htmlFor="q">Buscar por artista, turnê ou local</label>
          <input id="q" className="field" type="search" value={q} onChange={(e) => set("q", e.target.value)} placeholder="Ex.: Maré Alta" />
        </div>
        <div>
          <label className="label" htmlFor="cidade">Cidade</label>
          <select id="cidade" className="field" value={city} onChange={(e) => set("cidade", e.target.value)}>
            <option value="">Todas</option>
            {cities.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="mes">Mês</label>
          <select id="mes" className="field" value={month} onChange={(e) => set("mes", e.target.value)}>
            <option value="">Qualquer mês</option>
            {months.map(([k, label]) => <option key={k} value={k}>{label}</option>)}
          </select>
        </div>
      </form>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Gênero">
        <button className="chip" aria-pressed={!genre} onClick={() => set("genero", "")}>Todos os gêneros</button>
        {GENRES.map((g) => <button key={g} className="chip" aria-pressed={genre === g} onClick={() => set("genero", genre === g ? "" : g)}>{g}</button>)}
      </div>

      <p className="mt-8 text-sm text-mute" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "show encontrado" : "shows encontrados"}
        {hasFilter && <button className="ml-3 font-bold text-blue underline underline-offset-4" onClick={() => setParams({}, { replace: true })}>Limpar filtros</button>}
      </p>

      <motion.div layout className="mt-6 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((s) => (
            <ShowCard key={s.id} show={s} soldOut={s.sectors.every((x) => sold(orders, s.id, x.id) >= x.capacity)} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-3xl border-2 border-dashed border-line p-10 text-center">
          <p className="display text-4xl">Nenhum show por aqui</p>
          <p className="mt-2 text-ink-2">Tente outra cidade, outro mês ou limpe os filtros.</p>
        </div>
      )}
    </div>
  );
}
