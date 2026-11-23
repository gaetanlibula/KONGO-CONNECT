'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  async function logout() {
    if (loading) return;
    setLoading(true); setMessage('');
    try {
      const { error } = await createClient().auth.signOut({ scope: 'local' });
      if (error) throw error;
      window.location.replace('/connexion');
    } catch { setMessage('Déconnexion impossible. Réessayez.'); setLoading(false); }
  }
  return <div>
    <button type="button" disabled={loading} onClick={logout} className="mt-6 rounded-xl bg-[#e5bb64] px-5 py-3 text-[#071426] disabled:opacity-50">
      {loading ? 'Veuillez patienter…' : 'Me déconnecter'}
    </button>
    {message && <p role="alert">{message}</p>}
  </div>;
}
