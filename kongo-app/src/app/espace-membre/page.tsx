import { Suspense } from 'react';
import { requireUser } from '@/lib/auth-server';
import LogoutButton from '@/components/logout-button';



async function MemberPageContent() {
  const user = await requireUser();
  return <main className="min-h-screen bg-[#071426] p-8 text-white">
    <h1 className="text-3xl font-bold">Votre espace KONGO CONNECT</h1>
    <p className="mt-4">Vous êtes connecté avec une adresse e-mail confirmée.</p>
    <p className="mt-2">{user.email}</p>
    <LogoutButton />
  </main>;
}

export default function MemberPage() {
  return <Suspense fallback={<p>Vérification de votre connexion…</p>}><MemberPageContent /></Suspense>;
}
