import { useSyncExternalStore } from "react";
import { SHOWS, type Show, type Shape } from "../data/shows";
import { hash } from "./format";

// Demonstração: tudo fica no localStorage do navegador. Não há servidor nem senha real.
export interface User {
  name: string;
  email: string;
  role: "cliente" | "admin";
}
export interface Order {
  id: string;
  showId: string;
  sectorId: string;
  qty: number;
  total: number;
  createdAt: string;
  code: string;
  owner: string;
}
interface State {
  user: User | null;
  orders: Order[];
  custom: Show[];
}

const KEY = "30prashow:v2";
const empty: State = { user: null, orders: [], custom: [] };

const load = (): State => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
};

let state: State = load();
const listeners = new Set<() => void>();
const set = (next: State) => {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* modo privado: segue só em memória */
  }
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const useStore = <T,>(pick: (s: State) => T): T => useSyncExternalStore(subscribe, () => pick(state));

export const ADMIN_EMAIL = "admin@30prashow.demo";

export const auth = {
  login(email: string, name?: string) {
    const clean = email.trim().toLowerCase();
    const admin = clean === ADMIN_EMAIL;
    set({
      ...state,
      user: { email: clean, name: name?.trim() || (admin ? "Administrador" : clean.split("@")[0]), role: admin ? "admin" : "cliente" },
    });
  },
  logout() {
    set({ ...state, user: null });
  },
};

export const allShows = (custom: Show[]): Show[] => [...SHOWS, ...custom];

export const showActions = {
  add(s: { artist: string; tour: string; genre: string; city: string; state: string; venue: string; date: string; price: number }) {
    const shapes: Shape[] = ["sun", "waves", "grid", "rings", "tri", "bars"];
    const palettes = [
      { bg: "#2438ff", fg: "#f5f5f0", accent: "#ffd84d" },
      { bg: "#ff4fa3", fg: "#0e0e12", accent: "#f5f5f0" },
      { bg: "#17a34a", fg: "#f5f5f0", accent: "#f5f5f0" },
      { bg: "#ff7a3d", fg: "#0e0e12", accent: "#f5f5f0" },
    ];
    const h = hash(s.artist + s.date);
    const { price, ...rest } = s;
    const show: Show = {
      ...rest,
      id: `novo-${h.toString(36)}`,
      doors: "1h antes",
      shape: shapes[h % shapes.length],
      colors: palettes[h % palettes.length],
      about: "Show cadastrado pela área administrativa.",
      sectors: [
        { id: "pista", name: "Pista", note: "Em pé, perto do palco", price, capacity: 600 },
        { id: "cadeira", name: "Cadeira", note: "Lugar marcado", price: Math.round(price * 1.7), capacity: 300 },
        { id: "camarote", name: "Camarote", note: "Bar exclusivo", price: Math.round(price * 3), capacity: 80 },
      ],
    };
    set({ ...state, custom: [...state.custom, show] });
    return show;
  },
  remove(id: string) {
    set({ ...state, custom: state.custom.filter((s) => s.id !== id) });
  },
};

export const sold = (all: Order[], showId: string, sectorId?: string) =>
  all.filter((o) => o.showId === showId && (!sectorId || o.sectorId === sectorId)).reduce((n, o) => n + o.qty, 0);

export const orderActions = {
  create(o: Pick<Order, "showId" | "sectorId" | "qty" | "total">) {
    if (!state.user) throw new Error("Entre na sua conta para comprar.");
    const id = crypto.randomUUID();
    const code = hash(id).toString(36).toUpperCase().padStart(7, "0").slice(0, 7);
    const order: Order = { ...o, id, code, owner: state.user.email, createdAt: new Date().toISOString() };
    set({ ...state, orders: [order, ...state.orders] });
    return order;
  },
};
