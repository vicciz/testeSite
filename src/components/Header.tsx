'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  nome: string;
  role: 'admin' | 'user';
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-white">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          IMBALÁVEL
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-6">
          <Link href="/inicio" className="text-lg font-medium hover:underline">
            Produtos
          </Link>
          <Link href="/rastrear" className="text-lg font-medium hover:underline">
            Rastrear
          </Link>
          {user?.role === 'admin' && (
            <Link href="/admin" className="text-lg font-medium text-indigo-400 hover:underline">
              Administração
            </Link>
          )}
        </div>

        {/* Desktop actions */}
        <nav className="hidden md:flex gap-3 text-sm">
          {!user ? (
            <>
              <Link href="/login" className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600">
                Entrar
              </Link>
              <Link href="/cadastro" className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600">
                Criar conta
              </Link>
            </>
          ) : (
            <Link href="/perfil" className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600">
              Perfil
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded border border-white/20"
          aria-label="Abrir menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="block w-5 h-0.5 bg-white mb-1" />
          <span className="block w-5 h-0.5 bg-white mb-1" />
          <span className="block w-5 h-0.5 bg-white" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 sm:px-6 pb-4 text-white border-t border-white/10">
          <div className="flex flex-col gap-3 pt-3">
            <Link href="/inicio" className="text-base font-medium hover:underline" onClick={() => setMenuOpen(false)}>
              Produtos
            </Link>
            <Link href="/rastrear" className="text-base font-medium hover:underline" onClick={() => setMenuOpen(false)}>
              Rastrear
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-base font-medium text-indigo-400 hover:underline" onClick={() => setMenuOpen(false)}>
                Administração
              </Link>
            )}
            <div className="flex gap-3 pt-2">
              {!user ? (
                <>
                  <Link href="/login" className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600" onClick={() => setMenuOpen(false)}>
                    Entrar
                  </Link>
                  <Link href="/cadastro" className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600" onClick={() => setMenuOpen(false)}>
                    Criar conta
                  </Link>
                </>
              ) : (
                <Link href="/perfil" className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600" onClick={() => setMenuOpen(false)}>
                  Perfil
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
