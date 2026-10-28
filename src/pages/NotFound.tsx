import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <p className="display text-[clamp(6rem,20vw,12rem)] text-blue">404</p>
      <h1 className="display text-5xl">Esse show saiu de cartaz</h1>
      <p className="mt-4 text-ink-2">A página que você procura não existe ou mudou de lugar.</p>
      <Link to="/shows" className="btn btn-primary mt-8">Ver shows em cartaz</Link>
    </div>
  );
}
