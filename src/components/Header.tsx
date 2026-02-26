'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  nome: string;
  role: 'admin' | 'user';
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur border-b border-white/10">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-white" style={{
      flexFlow: 'wrap'
    }}>
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold padding-inherit" >
          IMBALÁVEL
        </Link>

        <div className="flex gap-6 m-4">
          <Link href="/inicio" className="text-lg font-medium hover:underline">
            Produtos
          </Link>
          <Link href="/rastrear" className="text-lg font-medium hover:underline mr-4">
            Rastrear
          </Link>
          {/* 🔐 Só admin vê */}
          {user?.role === 'admin' && (
            <Link href="/admin" className="text-lg font-medium text-indigo-400 hover:underline">
              Administração
            </Link>
          )}
        </div>

        <nav className="flex gap-4 text-sm">
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

      </div>
    </header>
  );
}
