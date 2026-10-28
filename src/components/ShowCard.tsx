import { motion } from "motion/react";
import { Link } from "react-router-dom";
import type { Show } from "../data/shows";
import { money } from "../lib/format";
import { Poster } from "./Poster";

export function ShowCard({ show, soldOut = false }: { show: Show; soldOut?: boolean }) {
  const from = Math.min(...show.sectors.map((s) => s.price));
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}>
      <Link to={`/shows/${show.id}`} className="group block" aria-label={`${show.artist}, ${show.city}. Ver detalhes`}>
        <div className="transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-hover:rotate-[-.6deg]">
          <Poster show={show} size="md" />
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <p className="font-bold">{show.venue}</p>
            <p className="text-sm text-mute">{show.genre}</p>
          </div>
          <p className="text-right text-sm">
            {soldOut ? (
              <span className="font-bold text-ink">Esgotado</span>
            ) : (
              <>
                <span className="text-mute">a partir de </span>
                <span className="font-bold">{money(from)}</span>
              </>
            )}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
