"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";  

export default function Connexion() {
  const [inscription, setInscription] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function envoyer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (inscription) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        setMessage(
          data.session
            ? "Votre compte est créé et vous êtes connecté."
            : "Consultez votre boîte mail pour confirmer votre inscription."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        setMessage("Vous êtes connecté à KONGO CONNECT.");
      }
    } catch {
      setMessage(
        "La demande n’a pas abouti. Vérifiez vos informations et réessayez."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#071426] px-6 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#10243c] p-8">
        <a href="/" className="text-sm text-[#e5bb64]">
          ← Retour à l’accueil
        </a>

        <h1 className="mt-8 text-3xl font-bold">
          {inscription ? "Rejoignez KONGO CONNECT" : "Connectez-vous"}
        </h1>

        <p className="mt-3 text-slate-300">
          Un espace pour unir les entrepreneurs.
        </p>

        <form onSubmit={envoyer} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-white/20 bg-[#071426] p-3 text-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              autoComplete={inscription ? "new-password" : "current-password"}
              minLength={inscription ? 8 : undefined}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-white/20 bg-[#071426] p-3 text-white"
            />
            {inscription && (
              <p className="mt-2 text-sm text-slate-400">
                Au moins 8 caractères.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#e5bb64] p-3 font-semibold text-[#071426] disabled:opacity-50"
          >
            {loading
              ? "Veuillez patienter…"
              : inscription
                ? "Créer mon compte gratuit"
                : "Me connecter"}
          </button>
        </form>

        {message && (
          <p role="status" className="mt-5 rounded-xl bg-white/10 p-4">
            {message}
          </p>
        )}

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setInscription(!inscription);
            setMessage("");
          }}
          className="mt-6 text-sm text-[#e5bb64] disabled:opacity-50"
        >
          {inscription
            ? "Déjà un compte ? Se connecter"
            : "Pas encore de compte ? S’inscrire"}
        </button>
      </div>
    </main>
  );
}