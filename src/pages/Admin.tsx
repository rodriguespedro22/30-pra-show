import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { money, parts } from "../lib/format";
import { allShows, showActions, sold, useStore } from "../lib/store";

export default function Admin() {
  const user = useStore((s) => s.user);
  const custom = useStore((s) => s.custom);
  const orders = useStore((s) => s.orders);
  const list = useMemo(() => allShows(custom).sort((a, b) => a.date.localeCompare(b.date)), [custom]);
  const [error, setError] = useState("");

  if (user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="display text-6xl">Área restrita</h1>
        <p className="mt-4 text-ink-2">Esta página é só para administradores. Na demonstração, entre com o e-mail indicado na tela de login.</p>
        <Link to="/entrar" state={{ from: "/admin" }} className="btn btn-primary mt-8">Entrar</Link>
      </div>
    );
  }

  const tickets = orders.reduce((n, o) => n + o.qty, 0);
  const revenue = orders.reduce((n, o) => n + o.total, 0);

  const add = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const price = Number(get("preco"));
    if (!get("artista") || !get("cidade") || !get("local") || !get("data")) return setError("Preencha artista, cidade, local e data.");
    if (!(price > 0)) return setError("Informe um preço maior que zero.");
    showActions.add({ artist: get("artista"), tour: get("turne") || "Show único", genre: get("genero") || "Outros", city: get("cidade"), state: get("uf").toUpperCase() || "RS", venue: get("local"), date: get("data"), price });
    setError("");
    e.currentTarget.reset();
  };

  const csv = () => {
    const rows = [["artista", "cidade", "data", "vendidos", "capacidade"], ...list.map((s) => [s.artist, s.city, s.date, String(sold(orders, s.id)), String(s.sectors.reduce((n, x) => n + x.capacity, 0))])];
    const blob = new Blob([rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(";")).join("\n")], { type: "text/csv;charset=utf-8" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "shows.csv" });
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pb-10 pt-12 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-[clamp(3.5rem,9vw,7rem)]">Administração</h1>
        <div className="flex gap-3 print:hidden">
          <button className="btn btn-ghost" onClick={csv}>Exportar CSV</button>
          <button className="btn btn-ghost" onClick={() => window.print()}>Imprimir relatório</button>
        </div>
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        {[["Shows cadastrados", String(list.length)], ["Ingressos vendidos", String(tickets)], ["Receita da demonstração", money(revenue)]].map(([k, v]) => (
          <div key={k} className="rounded-3xl bg-white p-6">
            <dt className="text-sm text-mute">{k}</dt>
            <dd className="display mt-1 text-6xl text-blue">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <section aria-labelledby="lista" className="min-w-0">
          <h2 id="lista" className="display text-4xl">Shows e vendas</h2>
          <div className="mt-4 overflow-x-auto rounded-3xl bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line text-mute">
                <tr><th className="p-4 font-semibold">Show</th><th className="p-4 font-semibold">Data</th><th className="p-4 font-semibold">Ocupação</th><th className="p-4" /></tr>
              </thead>
              <tbody>
                {list.map((s) => {
                  const cap = s.sectors.reduce((n, x) => n + x.capacity, 0);
                  const v = sold(orders, s.id);
                  const p = parts(s.date);
                  return (
                    <tr key={s.id} className="border-b border-line/60 last:border-0">
                      <td className="p-4"><b>{s.artist}</b><br /><span className="text-mute">{s.city}, {s.state}</span></td>
                      <td className="p-4">{p.day} {p.month}</td>
                      <td className="p-4">
                        <div className="h-2 w-40 overflow-hidden rounded-full bg-paper-2" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={cap} aria-label={`Ocupação de ${s.artist}`}>
                          <div className="h-full rounded-full bg-blue" style={{ width: `${Math.max(2, (v / cap) * 100)}%` }} />
                        </div>
                        <span className="mt-1 block text-xs text-mute">{v} de {cap}</span>
                      </td>
                      <td className="p-4 text-right">
                        {s.id.startsWith("novo-") && <button className="font-bold text-[#9a2c0e] underline underline-offset-4" onClick={() => showActions.remove(s.id)}>Remover</button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="novo" className="min-w-0">
          <h2 id="novo" className="display text-4xl">Novo show</h2>
          <form onSubmit={add} className="mt-4 grid gap-4 rounded-3xl bg-white p-6" noValidate>
            <div><label className="label" htmlFor="artista">Artista</label><input id="artista" name="artista" className="field" /></div>
            <div><label className="label" htmlFor="turne">Turnê</label><input id="turne" name="turne" className="field" /></div>
            <div className="grid grid-cols-[1fr_5rem] gap-3">
              <div><label className="label" htmlFor="cidade">Cidade</label><input id="cidade" name="cidade" className="field" /></div>
              <div><label className="label" htmlFor="uf">UF</label><input id="uf" name="uf" maxLength={2} className="field uppercase" /></div>
            </div>
            <div><label className="label" htmlFor="local">Local</label><input id="local" name="local" className="field" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label" htmlFor="data">Data e hora</label><input id="data" name="data" type="datetime-local" className="field" /></div>
              <div><label className="label" htmlFor="preco">Preço da pista (R$)</label><input id="preco" name="preco" type="number" min="1" step="1" className="field" /></div>
            </div>
            <div><label className="label" htmlFor="genero">Gênero</label><input id="genero" name="genero" className="field" /></div>
            {error && <p role="alert" className="rounded-xl bg-[#ffe3dc] px-4 py-3 text-sm font-semibold text-[#9a2c0e]">{error}</p>}
            <button className="btn btn-primary" type="submit">Cadastrar show</button>
          </form>
        </section>
      </div>
    </div>
  );
}
