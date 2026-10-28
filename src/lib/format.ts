const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const money = (v: number) => brl.format(v);

export const parts = (iso: string) => {
  const d = new Date(iso);
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase(),
    monthLong: d.toLocaleDateString("pt-BR", { month: "long" }),
    weekday: d.toLocaleDateString("pt-BR", { weekday: "long" }),
    time: d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }).replace(":", "h"),
    full: d.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" }),
    monthKey: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
  };
};

export const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};
