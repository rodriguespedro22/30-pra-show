import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Ticket } from "../components/Ticket";
import { allShows, useStore } from "../lib/store";

export default function Tickets() {
  const user = useStore((s) => s.user);
  const orders = useStore((s) => s.orders);
  const custom = useStore((s) => s.custom);

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="display text-6xl">Meus ingressos</h1>
        <p className="mt-4 text-ink-2">Entre na sua conta para ver os ingressos comprados neste navegador.</p>
        <Link to="/entrar" state={{ from: "/ingressos" }} className="btn btn-primary mt-8">Entrar</Link>
      </div>
    );
  }

  const mine = orders.filter((o) => o.owner === user.email);
  const shows = allShows(custom);

  return (
    <div className="mx-auto max-w-4xl px-5 pb-10 pt-12 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-[clamp(3.5rem,9vw,7rem)]">Meus ingressos</h1>
        {mine.length > 0 && <button className="btn btn-ghost print:hidden" onClick={() => window.print()}>Imprimir ou salvar em PDF</button>}
      </div>

      {mine.length === 0 ? (
        <div className="mt-10 rounded-3xl border-2 border-dashed border-line p-10 text-center">
          <p className="display text-4xl">Nenhum ingresso ainda</p>
          <p className="mt-2 text-ink-2">Escolha um show e o seu ingresso aparece aqui.</p>
          <Link to="/shows" className="btn btn-primary mt-6">Ver shows</Link>
        </div>
      ) : (
        <ul className="mt-10 grid gap-8">
          {mine.map((o, i) => {
            const show = shows.find((s) => s.id === o.showId);
            return show ? (
              <motion.li key={o.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.5 }}>
                <Ticket order={o} show={show} />
              </motion.li>
            ) : null;
          })}
        </ul>
      )}
    </div>
  );
}
