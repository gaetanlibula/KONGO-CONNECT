import Link from 'next/link';
export default function AuthError() {
  return <main className="min-h-screen bg-[#071426] p-8 text-white">
    <h1 className="text-3xl font-bold">Le lien n’a pas pu être validé</h1>
    <p className="mt-4">Il peut être expiré, déjà utilisé ou ouvert dans un autre navigateur.</p>
    <Link className="mt-6 inline-block text-[#e5bb64]" href="/connexion">Redemander un lien ou me connecter</Link>
  </main>;
}
