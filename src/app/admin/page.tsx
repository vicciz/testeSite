'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  id: number;
  nome: string;
  email: string;
  role: string;
}

export default function AdminHome() {

  const [user, setUser] = useState<User | null>(null);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("user");

    if (u) {
      setUser(JSON.parse(u));
    }

    setCarregado(true);
  }, []);

  if (!carregado) return <p>Carregando...</p>;

  // 🔐 BLOQUEIO PRINCIPAL
  if (!user || user.role !== "admin") {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl mb-4">Acesso negado</h1>
        <p>Você não tem permissão para acessar esta área.</p>

        <Link href="/" className="text-indigo-400">
          Voltar para o site
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">

      {/* MENU LATERAL */}
      <aside className="w-64 bg-black/40 p-6 border-r border-white/10">

        <h2 className="text-xl font-bold mb-6">
          Painel Admin
        </h2>

        <nav className="flex flex-col gap-4">

          <Link href="/admin/produtos/cadastrar"
            className="hover:text-indigo-400">
            ➕ Cadastrar Produto
          </Link>

          <Link href="/admin/produtos"
            className="hover:text-indigo-400">
            📦 Produtos
          </Link>

          <Link href="/admin/pedidos"
            className="hover:text-indigo-400">
            🧾 Pedidos
          </Link>

          <Link href="/admin/usuarios"
            className="hover:text-indigo-400">
            👤 Usuários
          </Link>

        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-10">

        <h1 className="text-3xl font-bold mb-2">
          Bem-vindo, {user.nome}
        </h1>

        <p className="text-gray-400 mb-8">
          Área administrativa do sistema
        </p>

        <div className="grid grid-cols-3 gap-6">

          <div className="bg-black/40 p-6 rounded">
            <h3 className="text-lg mb-2">Produtos</h3>
            
            <Link href="/admin/produtos/catalogo">
              <p className="text-sm text-gray-400 hover:text-indigo-400 cursor-pointer">
                Gerenciar catálogo
              </p>
            </Link>

          </div>

          <div className="bg-black/40 p-6 rounded">
            <h3 className="text-lg mb-2">Pedidos</h3>
            <p className="text-sm text-gray-400">
              Ver compras
            </p>
          </div>

          <div className="bg-black/40 p-6 rounded">
            <h3 className="text-lg mb-2">Usuários</h3>
            <Link href="/admin/usuarios/gerenciar-usuarios">
              <p className="text-sm text-gray-400 hover:text-indigo-400 cursor-pointer">
                Controle de contas
              </p>
            </Link>
          </div>

        </div>

      </main>
    </div>
  );
}
