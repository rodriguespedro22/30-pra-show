import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ADMIN_EMAIL, auth } from "../lib/store";

// Autenticação de demonstração: valida o formato, mas não guarda senha nem fala com servidor.
export default function Auth() {
  const [mode, setMode] = useState<"entrar" | "criar">("entrar");
  const [error, setError] = useState("");
  const nav = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? "/shows";

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "");
    const pass = String(f.get("senha") ?? "");
    const name = String(f.get("nome") ?? "");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Informe um e-mail válido.");
    if (pass.length < 6) return setError("A senha precisa ter ao menos 6 caracteres.");
    if (mode === "criar" && name.trim().length < 2) return setError("Informe o seu nome.");
    auth.login(email, name);
    nav(email.trim().toLowerCase() === ADMIN_EMAIL ? "/admin" : from, { replace: true });
  };

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-14 sm:px-8 md:grid-cols-2">
      <div>
        <h1 className="display text-[clamp(3.5rem,9vw,6.5rem)]">{mode === "entrar" ? "Bem-vindo de volta" : "Crie a sua conta"}</h1>
        <p className="mt-4 max-w-sm text-ink-2">Com a conta, os seus ingressos ficam reunidos em um só lugar.</p>
        <p className="mt-6 rounded-2xl bg-sun/60 p-4 text-sm">
          <b>Demonstração.</b> Use qualquer e-mail com uma senha de 6 caracteres. Para ver a área administrativa, entre com <code className="font-bold">{ADMIN_EMAIL}</code>.
        </p>
      </div>

      <form onSubmit={submit} className="rounded-3xl bg-white p-7 sm:p-9" noValidate>
        <div className="mb-6 grid grid-cols-2 rounded-full bg-paper-2 p-1" role="tablist" aria-label="Acesso">
          {(["entrar", "criar"] as const).map((m) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} className={`rounded-full py-2.5 text-sm font-bold transition-colors ${mode === m ? "bg-ink text-paper" : "text-ink-2"}`} onClick={() => { setMode(m); setError(""); }}>
              {m === "entrar" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>

        {mode === "criar" && (
          <div className="mb-4">
            <label className="label" htmlFor="nome">Nome</label>
            <input id="nome" name="nome" className="field" autoComplete="name" />
          </div>
        )}
        <div className="mb-4">
          <label className="label" htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" className="field" autoComplete="email" />
        </div>
        <div className="mb-5">
          <label className="label" htmlFor="senha">Senha</label>
          <input id="senha" name="senha" type="password" className="field" autoComplete={mode === "entrar" ? "current-password" : "new-password"} />
        </div>

        {error && <p role="alert" className="mb-4 rounded-xl bg-[#ffe3dc] px-4 py-3 text-sm font-semibold text-[#9a2c0e]">{error}</p>}
        <button className="btn btn-primary w-full" type="submit">{mode === "entrar" ? "Entrar" : "Criar conta"}</button>
        <p className="mt-4 text-center text-sm text-mute">Ou <Link className="font-bold text-blue underline underline-offset-4" to="/shows">continue navegando</Link>.</p>
      </form>
    </div>
  );
}
