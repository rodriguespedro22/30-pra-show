import type { Show } from "../data/shows";
import { parts } from "../lib/format";

// Pôster gerado em SVG: cada show tem cor e forma próprias, sem fotos de terceiros.
function Art({ shape, accent, fg }: { shape: Show["shape"]; accent: string; fg: string }) {
  switch (shape) {
    case "sun":
      return (
        <g>
          <circle cx="300" cy="170" r="120" fill={accent} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x="150" y={190 + i * 22} width="300" height={4 + i * 3} fill="var(--poster-bg)" />
          ))}
        </g>
      );
    case "waves":
      return (
        <g fill="none" stroke={accent} strokeWidth="14" strokeLinecap="round">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M-20 ${120 + i * 44} q 55 -40 110 0 t 110 0 t 110 0 t 110 0`} opacity={1 - i * 0.12} />
          ))}
        </g>
      );
    case "grid":
      return (
        <g fill={accent}>
          {Array.from({ length: 6 }).flatMap((_, r) =>
            Array.from({ length: 5 }).map((_, c) => (
              <rect key={`${r}-${c}`} x={40 + c * 72} y={60 + r * 56} width={(r + c) % 3 === 0 ? 52 : 20} height="30" rx="15" opacity={0.35 + ((r * 5 + c) % 4) * 0.2} />
            )),
          )}
        </g>
      );
    case "rings":
      return (
        <g fill="none" stroke={accent} strokeWidth="12">
          {[40, 80, 120, 160].map((r, i) => (
            <circle key={r} cx="280" cy="170" r={r} opacity={1 - i * 0.18} />
          ))}
        </g>
      );
    case "tri":
      return (
        <g>
          <path d="M60 300 L210 40 L360 300 Z" fill={accent} />
          <path d="M120 300 L210 140 L300 300 Z" fill="var(--poster-bg)" />
          <path d="M170 300 L210 220 L250 300 Z" fill={fg} />
        </g>
      );
    case "bars":
      return (
        <g fill={accent}>
          {[70, 130, 100, 190, 150, 230, 120, 170].map((h, i) => (
            <rect key={i} x={30 + i * 44} y={300 - h} width="26" height={h} rx="13" />
          ))}
        </g>
      );
  }
}

export function Poster({ show, size = "md", className = "" }: { show: Show; size?: "sm" | "md" | "lg"; className?: string }) {
  const p = parts(show.date);
  const title = size === "lg" ? "text-[clamp(3rem,7vw,5.5rem)]" : size === "md" ? "text-[clamp(2rem,4.4vw,3rem)]" : "text-2xl";
  return (
    <div
      className={`relative aspect-[4/5] w-full overflow-hidden rounded-[22px] ${className}`}
      style={{ background: show.colors.bg, color: show.colors.fg, ["--poster-bg" as string]: show.colors.bg }}
      role="img"
      aria-label={`Pôster do show ${show.artist}, ${show.tour}`}
    >
      <svg viewBox="0 0 400 320" className="absolute inset-x-0 top-0 h-[62%] w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <Art shape={show.shape} accent={show.colors.accent} fg={show.colors.fg} />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 sm:p-6">
        <span className="text-xs font-bold tracking-[.14em] uppercase opacity-80">{show.tour}</span>
        <span className={`display ${title}`}>{show.artist}</span>
        <span className="text-sm font-semibold opacity-90">
          {p.day} {p.month} · {show.city}, {show.state}
        </span>
      </div>
    </div>
  );
}
