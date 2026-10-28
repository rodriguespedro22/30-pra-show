export type Shape = "sun" | "waves" | "grid" | "rings" | "tri" | "bars";

export interface Sector {
  id: string;
  name: string;
  note: string;
  price: number;
  capacity: number;
}

export interface Show {
  id: string;
  artist: string;
  tour: string;
  genre: string;
  city: string;
  state: string;
  venue: string;
  date: string; // ISO local, sem fuso
  doors: string;
  shape: Shape;
  colors: { bg: string; fg: string; accent: string };
  about: string;
  sectors: Sector[];
}

const setores = (pista: number, cadeira: number, camarote: number, cap = 1): Sector[] => [
  { id: "pista", name: "Pista", note: "Em pé, perto do palco", price: pista, capacity: Math.round(900 * cap) },
  { id: "cadeira", name: "Cadeira", note: "Lugar marcado, visão ampla", price: cadeira, capacity: Math.round(500 * cap) },
  { id: "camarote", name: "Camarote", note: "Bar exclusivo e entrada rápida", price: camarote, capacity: Math.round(120 * cap) },
];

// Artistas, turnês e locais são fictícios.
export const SHOWS: Show[] = [
  {
    id: "mare-alta", artist: "Maré Alta", tour: "Turnê Ressaca", genre: "Pop", city: "Porto Alegre", state: "RS",
    venue: "Arena Bela Vista", date: "2026-11-21T21:00", doors: "19h", shape: "waves",
    colors: { bg: "#2438ff", fg: "#f5f5f0", accent: "#ffd84d" },
    about: "Synths quentes, refrões grandes e um palco que parece o mar subindo. A banda abre a turnê Ressaca em casa, com repertório dos três álbuns e participações surpresa.",
    sectors: setores(180, 320, 540),
  },
  {
    id: "dona-vertigem", artist: "Dona Vertigem", tour: "Ao Vivo no Escuro", genre: "Rock", city: "Caxias do Sul", state: "RS",
    venue: "Pavilhão da Serra", date: "2026-11-28T22:00", doors: "20h", shape: "tri",
    colors: { bg: "#0e0e12", fg: "#f5f5f0", accent: "#ff5a36" },
    about: "Guitarras sujas e luz de emergência. Um show inteiro no escuro, iluminado só pelo que a banda toca.",
    sectors: setores(140, 260, 420),
  },
  {
    id: "coletivo-neon-sul", artist: "Coletivo Neon Sul", tour: "Noite Elétrica", genre: "Eletrônica", city: "Florianópolis", state: "SC",
    venue: "Galpão 7", date: "2026-12-05T23:00", doors: "21h", shape: "grid",
    colors: { bg: "#7a2bff", fg: "#f5f5f0", accent: "#7dffb2" },
    about: "Seis horas de pista com cinco DJs e uma cenografia de luz que muda a cada set. Chegue cedo para o pôr do sol no deque.",
    sectors: setores(160, 300, 600),
  },
  {
    id: "rui-cardoso-trio", artist: "Rui Cardoso Trio", tour: "Noites de Jazz", genre: "Jazz", city: "Pelotas", state: "RS",
    venue: "Teatro Aurora", date: "2026-12-12T20:30", doors: "19h30", shape: "bars",
    colors: { bg: "#f2c744", fg: "#0e0e12", accent: "#0e0e12" },
    about: "Piano, baixo acústico e bateria de vassourinhas. Clássicos reinventados em um teatro de 600 lugares, sem pressa.",
    sectors: setores(110, 200, 340, 0.5),
  },
  {
    id: "luz-de-agosto", artist: "Luz de Agosto", tour: "Casa Cheia", genre: "MPB", city: "Curitiba", state: "PR",
    venue: "Ópera Praça Verde", date: "2027-01-16T20:00", doors: "18h30", shape: "sun",
    colors: { bg: "#ff7a3d", fg: "#0e0e12", accent: "#f5f5f0" },
    about: "Violões, vozes e histórias de quem canta a própria rua. Um show para cantar junto do começo ao fim.",
    sectors: setores(130, 240, 380),
  },
  {
    id: "pampa-eletrica", artist: "Pampa Elétrica", tour: "Cerro Abaixo", genre: "Rock", city: "Porto Alegre", state: "RS",
    venue: "Auditório Rio Manso", date: "2027-01-30T21:30", doors: "20h", shape: "tri",
    colors: { bg: "#17a34a", fg: "#f5f5f0", accent: "#f5f5f0" },
    about: "Rock gaúcho de gaita e distorção, com a banda completa e um coro de vinte pessoas no bis.",
    sectors: setores(120, 220, 360),
  },
  {
    id: "nina-bravo", artist: "Nina Bravo", tour: "Todas as Cores", genre: "Pop", city: "São Paulo", state: "SP",
    venue: "Espaço Vale do Sol", date: "2027-02-13T21:00", doors: "19h", shape: "rings",
    colors: { bg: "#ff4fa3", fg: "#0e0e12", accent: "#f5f5f0" },
    about: "Coreografia, figurino trocado a cada música e um telão que vira pintura. O show de estreia do álbum mais colorido do ano.",
    sectors: setores(220, 380, 700, 1.5),
  },
  {
    id: "orquestra-do-cais", artist: "Orquestra do Cais", tour: "Trilhas ao Vivo", genre: "Orquestra", city: "Porto Alegre", state: "RS",
    venue: "Teatro Aurora", date: "2027-03-06T19:30", doors: "18h30", shape: "sun",
    colors: { bg: "#10243f", fg: "#f5f5f0", accent: "#ffd84d" },
    about: "Cinquenta músicos tocando trilhas de cinema e jogos sob um céu de projeções. Para ouvir de olhos abertos.",
    sectors: setores(150, 280, 450, 0.7),
  },
];

export const CITIES = [...new Set(SHOWS.map((s) => s.city))].sort((a, b) => a.localeCompare(b, "pt-BR"));
export const GENRES = [...new Set(SHOWS.map((s) => s.genre))].sort((a, b) => a.localeCompare(b, "pt-BR"));
