import type { Order } from "../lib/store";
import type { Show } from "../data/shows";
import { money, parts } from "../lib/format";
import { QR } from "./QR";

export function Ticket({ order, show }: { order: Order; show: Show }) {
  const p = parts(show.date);
  const sector = show.sectors.find((s) => s.id === order.sectorId);
  return (
    <article className="stub print:break-inside-avoid grid overflow-hidden bg-white md:grid-cols-[1fr_auto]" style={{ ["--notch" as string]: "72%" }} aria-label={`Ingresso ${show.artist}`}>
      <div className="p-6 sm:p-8" style={{ background: show.colors.bg, color: show.colors.fg }}>
        <p className="text-xs font-bold tracking-[.14em] uppercase opacity-80">{show.tour}</p>
        <h3 className="display mt-2 text-5xl sm:text-6xl">{show.artist}</h3>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
          <div><dt className="opacity-70">Data</dt><dd className="font-bold">{p.day} {p.month}</dd></div>
          <div><dt className="opacity-70">Hora</dt><dd className="font-bold">{p.time}</dd></div>
          <div><dt className="opacity-70">Setor</dt><dd className="font-bold">{sector?.name}</dd></div>
          <div className="col-span-2"><dt className="opacity-70">Local</dt><dd className="font-bold">{show.venue}, {show.city}</dd></div>
          <div><dt className="opacity-70">Quantidade</dt><dd className="font-bold">{order.qty}</dd></div>
        </dl>
      </div>
      <div className="flex items-center gap-5 border-t-2 border-dashed border-line p-6 md:flex-col md:border-t-0 md:border-l-2 md:px-8">
        <QR code={order.code} />
        <div className="text-center">
          <p className="text-xs text-mute">Código</p>
          <p className="font-mono text-lg font-bold tracking-widest">{order.code}</p>
          <p className="mt-1 text-xs text-mute">Total {money(order.total)}</p>
        </div>
      </div>
    </article>
  );
}
