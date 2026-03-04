'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { listarProdutos, excluirProduto } from "@/src/services/produtos";
import { supabase } from '@/supabaseClient';

interface Produto {
  id: number;
  nome: string;
  preco: string;
  categoria_id?: number | null;
  categorias?: { nome: string } | null;
  image: File | string;
  rating: string;
}

interface User {
  role: string;
}

export default function CatalogoAdmin() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    carregar();
  }, []);

  async function carregar() {
    const res = await listarProdutos();
    if (res.status === "ok") setProdutos(res.produtos);
  }

  async function handleExcluir(id: number) {
    if (!confirm("Deseja realmente excluir este produto?")) return;

    const res = await excluirProduto(id);
    if (res.status === "ok") {
      alert("Produto excluído!");
      setProdutos(produtos.filter(p => p.id !== id)); // atualiza sem reload
    } else {
      alert("Erro ao excluir");
    }
  }

  // 🔐 proteção
  if (!user || user.role !== "admin") return <p className="p-10">Acesso negado</p>;

  return (
    <div className="p-10 text-zinc-900">

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <h1 className="text-2xl">Catálogo de Produtos</h1>

        <div className="flex gap-4 flex-wrap">
          <Link
            href="/admin/produtos/cadastrar"
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            + Novo Produto
          </Link>

          <input
            type="text"
            placeholder="Buscar produto..."
            className="bg-white border border-black/10 rounded px-4 py-2 text-zinc-900"
          />
        </div>
      </div>

      <table className="w-full bg-white rounded overflow-hidden border border-black/10">
        <thead>
          <tr className="text-left border-b border-black/10">
            <th className="p-2">Imagem</th>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {produtos.map(p => (
            <tr key={p.id} className="border-b border-black/5">

              <td className="p-2">
                
                {p.image ? (
                  <img
                    src={supabase.storage.from('produtos').getPublicUrl(p.image as string).data.publicUrl}
                    alt={p.nome}
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-20 h-20 bg-slate-100 border border-black/10 flex items-center justify-center rounded text-sm">
                    Sem imagem
                  </div>
                )}
              </td>

              <td>{p.nome}</td>
              <td>{p.categorias?.nome ?? p.categoria_id ?? '-'}</td>

              <td className="flex gap-3">
                <Link
                  href={`/admin/produtos/editar/${p.id}`}
                  className="text-indigo-600"
                >
                  Editar
                </Link>

                <button
                  className="text-red-500"
                  onClick={() => handleExcluir(p.id)}
                >
                  Excluir
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
