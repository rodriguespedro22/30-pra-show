import { hash } from "../lib/format";

// Código visual de demonstração (não é um QR Code real): padrão determinístico gerado a partir do código do pedido.
export function QR({ code, size = 112 }: { code: string; size?: number }) {
  const n = 21;
  const cells: boolean[] = [];
  let seed = hash(code);
  for (let i = 0; i < n * n; i++) {
    seed = Math.imul(seed ^ (seed >>> 15), 2246822519) >>> 0;
    cells.push(seed % 100 < 48);
  }
  const finder = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7" height="7" fill="#0e0e12" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill="#0e0e12" />
    </g>
  );
  const inFinder = (c: number, r: number) => (c < 8 && r < 8) || (c > n - 9 && r < 8) || (c < 8 && r > n - 9);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${n} ${n}`} role="img" aria-label={`Código do ingresso ${code}`} shapeRendering="crispEdges">
      <rect width={n} height={n} fill="#fff" />
      {cells.map((on, i) => {
        const c = i % n;
        const r = Math.floor(i / n);
        return on && !inFinder(c, r) ? <rect key={i} x={c} y={r} width="1" height="1" fill="#0e0e12" /> : null;
      })}
      {finder(0, 0)}
      {finder(n - 7, 0)}
      {finder(0, n - 7)}
    </svg>
  );
}
