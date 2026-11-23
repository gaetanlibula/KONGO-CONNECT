import { Suspense } from 'react';
import { requireUser } from '@/lib/auth-server';
import AuthForm from '@/components/auth-form';



async function PasswordPageContent() {
  await requireUser();
  return <AuthForm initialMode="update" />;
}

export default function PasswordPage() {
  return <Suspense fallback={<p>Vérification de votre connexion…</p>}><PasswordPageContent /></Suspense>;
}
