import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center text-white">
        
        <span className="inline-block mb-4 px-4 py-1 text-sm rounded-full bg-white/10">
          🚀 Plataforma Web
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Bem-vindo ao <span className="text-indigo-400">Prod</span>
        </h1>

        <p className="text-gray-300 mb-10 text-lg">
          Uma plataforma moderna, rápida e segura para você gerenciar tudo em um só lugar.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-4 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition font-semibold"
          >
            Entrar
          </Link>

          <Link
            href="/cadastro"
            className="px-8 py-4 rounded-lg border border-white/20 hover:bg-white/10 transition font-semibold"
          >
            Criar conta
          </Link>
          <Link
            href="/inicio"
            className="px-8 py-4 rounded-lg border border-white/20 hover:bg-white/10 transition font-semibold"
          >
            Início
          </Link>
        </div>

      </div>
    </main>
  );
}
