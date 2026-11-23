'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

type Mode = 'signup' | 'signin' | 'forgot' | 'update';

export default function AuthForm({ initialMode = 'signup' }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const titles = {
    signup: 'Rejoignez KONGO CONNECT', signin: 'Connectez-vous',
    forgot: 'Mot de passe oublié', update: 'Choisissez votre nouveau mot de passe',
  };
  const labels = {
    signup: 'Créer mon compte gratuit', signin: 'Me connecter',
    forgot: 'Recevoir le lien', update: 'Enregistrer mon mot de passe',
  };
  function changeMode(next: Mode) {
    setMode(next); setMessage(''); setPassword(''); setConfirmation(''); setFailed(false);
  }
  function callback(next = '/espace-membre') {
    const url = new URL('/auth/callback', window.location.origin);
    url.searchParams.set('next', next);
    return url.toString();
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setMessage(''); setFailed(false);
    if (mode === 'update' && password !== confirmation) {
      setFailed(true); setMessage('Les deux mots de passe doivent être identiques.'); return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(), password, options: { emailRedirectTo: callback() },
        });
        if (error) throw error;
        if (data.session) window.location.assign('/espace-membre');
        else setMessage('Si votre inscription peut être traitée, un e-mail de confirmation vous sera envoyé. Consultez aussi les courriers indésirables.');
      } else if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        window.location.assign('/espace-membre');
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: callback('/nouveau-mot-de-passe'),
        });
        if (error) throw error;
        setMessage('Si un compte correspond à cette adresse, un lien de réinitialisation vous sera envoyé. Ouvrez-le dans ce même navigateur.');
      } else {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setPassword(''); setConfirmation('');
        setMessage('Votre mot de passe a été enregistré. Vous pouvez rejoindre votre espace membre.');
      }
    } catch {
      setFailed(true);
      setMessage('La demande n’a pas abouti. Vérifiez vos informations, la confirmation de votre adresse et réessayez. Un lien expiré doit être redemandé.');
    } finally { setLoading(false); }
  }
  async function resend() {
    if (loading || !email.trim()) { setMessage('Saisissez d’abord votre adresse e-mail.'); return; }
    setLoading(true); setFailed(false); setMessage('');
    try {
      const { error } = await createClient().auth.resend({
        type: 'signup', email: email.trim(), options: { emailRedirectTo: callback() },
      });
      if (error) throw error;
      setMessage('Si votre compte attend une confirmation, un nouvel e-mail vous sera envoyé.');
    } catch { setFailed(true); setMessage('Envoi impossible pour le moment. Patientez avant de réessayer.'); }
    finally { setLoading(false); }
  }
  const inputStyle = 'w-full rounded-xl border border-white/20 bg-[#071426] p-3 text-white';
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#071426] px-6 py-12 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#10243c] p-8">
        <Link href="/" className="text-sm text-[#e5bb64]">← Retour à l’accueil</Link>
        <h1 className="mt-8 text-3xl font-bold">{titles[mode]}</h1>
        <p className="mt-3 text-slate-300">Un espace pour unir les entrepreneurs.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <fieldset disabled={loading} className="space-y-5">
            {mode !== 'update' && <div>
              <label htmlFor="email" className="mb-2 block">Adresse e-mail</label>
              <input id="email" type="email" autoComplete="email" required value={email}
                onChange={e => setEmail(e.target.value)} className={inputStyle} />
            </div>}
            {mode !== 'forgot' && <div>
              <label htmlFor="password" className="mb-2 block">Mot de passe</label>
              <input id="password" type="password" required value={password}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                minLength={mode === 'signin' ? undefined : 8}
                onChange={e => setPassword(e.target.value)} className={inputStyle} />
              {mode !== 'signin' && <p className="mt-2 text-sm text-slate-400">Au moins 8 caractères.</p>}
            </div>}
            {mode === 'update' && <div>
              <label htmlFor="confirmation" className="mb-2 block">Confirmez le mot de passe</label>
              <input id="confirmation" type="password" autoComplete="new-password" required minLength={8}
                value={confirmation} onChange={e => setConfirmation(e.target.value)} className={inputStyle} />
            </div>}
            <button type="submit" className="w-full rounded-xl bg-[#e5bb64] p-3 font-semibold text-[#071426] disabled:opacity-50">
              {loading ? 'Veuillez patienter…' : labels[mode]}
            </button>
          </fieldset>
        </form>
        {message && <p role={failed ? 'alert' : 'status'} className="mt-5 rounded-xl bg-white/10 p-4">{message}</p>}
        <div className="mt-6 flex flex-col items-start gap-4 text-sm text-[#e5bb64]">
          {mode !== 'update' && <button type="button" disabled={loading}
            onClick={() => changeMode(mode === 'signin' ? 'signup' : 'signin')}>
            {mode === 'signin' ? 'Pas encore de compte ? S’inscrire' : 'Déjà un compte ? Se connecter'}
          </button>}
          {mode === 'signin' && <button type="button" disabled={loading} onClick={() => changeMode('forgot')}>Mot de passe oublié ?</button>}
          {(mode === 'signin' || mode === 'signup') && <button type="button" disabled={loading} onClick={resend}>Renvoyer l’e-mail de confirmation</button>}
          {mode === 'update' && <Link href="/espace-membre" prefetch={false}>Rejoindre mon espace membre</Link>}
        </div>
      </div>
    </main>
  );
}
