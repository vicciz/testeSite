import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-white">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          Prod
        </Link>

        {/* Navegação */}
        <nav className="flex gap-6 text-sm">
          <Link href="/login" className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600 transition">
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600 transition"
          >
            Criar conta
          </Link>
        </nav>
      </div>
    </header>
  );
}
