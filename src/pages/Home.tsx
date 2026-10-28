import { useEffect, useRef, useState, type FormEvent } from "react";
import { animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { Poster } from "../components/Poster";
import { Reveal } from "../components/Reveal";
import { CITIES, GENRES, SHOWS } from "../data/shows";
import { money, parts } from "../lib/format";

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const nav = useNavigate();
  const [city, setCity] = useState("");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const r1 = useTransform(smooth, [0, 1], [-7, -16]);
  const r2 = useTransform(smooth, [0, 1], [3, 0]);
  const r3 = useTransform(smooth, [0, 1], [9, 20]);
  const y1 = useTransform(smooth, [0, 1], [0, 90]);
  const y2 = useTransform(smooth, [0, 1], [0, -40]);
  const y3 = useTransform(smooth, [0, 1], [0, 140]);
  const text = useTransform(smooth, [0, 1], [0, -60]);

  const go = (e: FormEvent) => {
    e.preventDefault();
    nav(city ? `/shows?cidade=${encodeURIComponent(city)}` : "/shows");
  };

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-16">
        <motion.div style={{ y: text }}>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 rounded-full bg-sun px-4 py-1.5 text-sm font-bold">
            <span className="size-2 rounded-full bg-ink" aria-hidden /> {SHOWS.length} shows em {CITIES.length} cidades
          </motion.p>
          <h1 className="display mt-5 text-[clamp(3.4rem,8.2vw,7.2rem)]">
            {["Seu próximo", "show começa", "aqui."].map((line, i) => (
              <span key={line} className="-mb-[.1em] block overflow-hidden whitespace-nowrap pb-[.06em] pt-[.16em]">
                <motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}>
                  {i === 2 ? <span className="text-blue">{line}</span> : line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }} className="mt-6 max-w-md text-lg text-ink-2">
            Encontre o show, escolha o setor e receba o ingresso na hora. Sem fila, sem papel.
          </motion.p>
          <motion.form onSubmit={go} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.6 }} className="mt-8 flex max-w-lg flex-col gap-3 sm:flex-row" aria-label="Buscar shows">
            <label className="sr-only" htmlFor="cidade">Cidade</label>
            <select id="cidade" className="field sm:flex-1" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Todas as cidades</option>
              {CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <button className="btn btn-primary" type="submit">Ver shows</button>
          </motion.form>
        </motion.div>

        <div className="relative mx-auto h-[420px] w-full max-w-[520px] sm:h-[520px]" aria-hidden>
          {[
            { show: SHOWS[0], r: r1, y: y1, cls: "left-0 top-10 w-[52%] z-10" },
            { show: SHOWS[2], r: r2, y: y2, cls: "left-[26%] top-0 w-[52%] z-20" },
            { show: SHOWS[6], r: r3, y: y3, cls: "right-0 top-16 w-[52%] z-30" },
          ].map(({ show, r, y, cls }, i) => (
            <motion.div key={show.id} className={`absolute shadow-2xl shadow-ink/20 ${cls}`} style={{ rotate: r, y }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.15, duration: 0.7 }}>
              <Poster show={show} size="sm" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [...CITIES, ...GENRES];
  return (
    <div className="overflow-hidden border-y-2 border-ink bg-ink py-4 text-paper" aria-hidden>
      <div className="marquee flex w-max gap-10 whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((t, i) => (
          <span key={i} className="display flex items-center gap-10 text-3xl">
            {t} <span className="text-sun">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function useWide() {
  const [wide, setWide] = useState(() => (typeof window === "undefined" ? true : window.matchMedia("(min-width: 900px)").matches));
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const on = () => setWide(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return wide;
}

function Lineup() {
  const wide = useWide();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const measure = () => track.current && setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [wide]);

  const cards = SHOWS.map((s) => {
    const p = parts(s.date);
    return (
      <Link key={s.id} to={`/shows/${s.id}`} className="group block w-[min(78vw,330px)] shrink-0">
        <div className="transition-transform duration-300 group-hover:-translate-y-2"><Poster show={s} size="md" /></div>
        <div className="mt-4 flex items-baseline justify-between gap-3">
          <p className="font-bold">{s.city} · {p.day} {p.month}</p>
          <p className="text-sm text-mute">{money(Math.min(...s.sectors.map((x) => x.price)))}</p>
        </div>
      </Link>
    );
  });

  if (!wide) {
    return (
      <section className="py-16" aria-labelledby="em-cartaz">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 id="em-cartaz" className="display text-6xl">Em cartaz</h2>
        </div>
        <div className="mt-8 flex snap-x gap-5 overflow-x-auto px-5 pb-4 [&>*]:snap-start">{cards}</div>
      </section>
    );
  }

  return (
    <section ref={section} style={{ height: `${100 + dist / 8}vh` }} className="relative" aria-labelledby="em-cartaz">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-8">
          <div className="flex items-end justify-between gap-6">
            <h2 id="em-cartaz" className="display text-[clamp(4rem,9vw,8rem)]">Em cartaz</h2>
            <p className="max-w-xs pb-3 text-ink-2">Role para atravessar a programação. Cada pôster leva ao show completo.</p>
          </div>
        </div>
        <motion.div ref={track} style={{ x }} className="mt-10 flex w-max gap-7 px-[max(2rem,calc((100vw-80rem)/2+2rem))]">{cards}</motion.div>
        <div className="mx-auto mt-10 h-1 w-full max-w-7xl overflow-hidden rounded-full bg-line px-8" aria-hidden>
          <motion.div className="h-full rounded-full bg-blue" style={{ width: bar }} />
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { t: "Escolha o show", d: "Filtre por cidade, gênero e mês. Cada show mostra data, local e a que horas abrem os portões." },
  { t: "Selecione o setor", d: "Pista, cadeira ou camarote. O preço e a disponibilidade aparecem na hora, antes de você decidir." },
  { t: "Receba o ingresso", d: "Ao confirmar, o ingresso com código aparece em Meus ingressos, pronto para mostrar na entrada." },
];

function How() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8" aria-labelledby="como">
      <Reveal><h2 id="como" className="display text-[clamp(3rem,7vw,6rem)]">Três passos até a pista</h2></Reveal>
      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.t}>
            <Reveal delay={i * 0.1}>
              <div className="stub h-full bg-white p-7 pb-10" style={{ ["--notch" as string]: "58%" }}>
                <span className="display text-7xl text-blue">{i + 1}</span>
                <h3 className="mt-3 text-xl font-extrabold">{s.t}</h3>
                <p className="mt-2 text-ink-2">{s.d}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Count({ to, label }: { to: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const v = useMotionValue(0);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(v, to, { duration: 1.4, ease: "easeOut", onUpdate: (x) => setN(Math.round(x)) });
    return () => c.stop();
  }, [inView, to, v]);
  return (
    <div ref={ref}>
      <p className="display text-[clamp(4rem,9vw,7rem)] text-blue" aria-label={`${to} ${label}`}>{n}</p>
      <p className="font-semibold text-ink-2">{label}</p>
    </div>
  );
}

function Numbers() {
  return (
    <section className="bg-paper-2 py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:grid-cols-3 sm:px-8">
        <Count to={SHOWS.length} label="shows na programação" />
        <Count to={CITIES.length} label="cidades" />
        <Count to={GENRES.length} label="gêneros musicais" />
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8">
      <Reveal>
        <div className="stub relative overflow-hidden bg-blue p-8 text-paper sm:p-14" style={{ ["--notch" as string]: "50%", ["--r" as string]: "26px" }}>
          <h2 className="display max-w-3xl text-[clamp(3rem,8vw,7rem)]">Chegou a hora de escolher o seu.</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shows" className="btn bg-sun text-ink hover:bg-white">Ver todos os shows</Link>
            <Link to="/entrar" className="btn border-paper text-paper hover:bg-paper hover:text-blue">Criar conta</Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Lineup />
      <How />
      <Numbers />
      <Cta />
    </>
  );
}
