'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiltroOutfit } from './functions/filtros/filtrar-outfit';
import { Produto, listarProdutos } from '../services/produtos';
import { supabase } from '../../supabaseClient';

export default function CarrosselProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);

  // fetch products from Supabase instead of PHP API
  useEffect(() => {
    async function load(categoria?: string, tipo?: string) {
      const { data, error } = await listarProdutos(categoria, tipo);
      if (error) {
        console.error('Erro ao listar produtos:', error);
        setProdutos([]);
        setProdutosFiltrados([]);
        return;
      }
      setProdutos(data || []);
      setProdutosFiltrados(data || []);
    }

    load();
  }, []);

  const handleFiltroChange = async (categoria: string, tipo: string) => {
    const { data, error } = await listarProdutos(categoria, tipo);
    if (error) {
      console.error('Erro ao buscar produtos filtrados:', error);
      setProdutosFiltrados([]);
      return;
    }
    setProdutosFiltrados(data || []);
  };

  return (
    <div className=" relative z-10 px-6 max-w-7xl mx-auto">
      {/* Componente de filtro */}
      <FiltroOutfit
        categorias={[ 'Outfit']}
        tipos={['Unissex', 'Masculino', 'Feminino']}
        onChange={handleFiltroChange}
      />

      {/* Desktop / Tablet */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
        {produtosFiltrados.length > 0 ? (
          produtosFiltrados.map((p) => {
            const imageUrl = p.image
              ? supabase.storage.from('produtos').getPublicUrl(p.image).data.publicUrl
              : '/placeholder.png';

            return (
              <Link
                key={p.id}
                href={`/produto?id=${p.id}`}
                className="bg-gradient-to-b from-zinc-900 to-black
                           rounded-2xl shadow-lg p-4 text-white
                           hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={imageUrl}
                  alt={p.nome}
                  className="w-full h-44 object-cover rounded-xl mb-3"
                />
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{p.nome}</h3>
                <span className="text-green-500 font-bold text-lg">R$ {p.preco}</span>
              </Link>
            );
          })
        ) : (
          <p className="text-center text-zinc-400 col-span-full">
            Nenhum produto encontrado.
          </p>
        )}
      </div>

      {/* Mobile */}
      <div className="md:hidden flex gap-4 overflow-x-auto no-scrollbar py-4">
        {produtosFiltrados.length > 0 ? (
          produtosFiltrados.map((p) => {
            const imageUrl = p.image
              ? supabase.storage.from('produtos').getPublicUrl(p.image).data.publicUrl
              : '/placeholder.png';

            return (
              <Link
                key={p.id}
                href={`/produto?id=${p.id}`}
                className="min-w-[260px] bg-gradient-to-b from-zinc-900 to-black
                           rounded-2xl shadow-lg p-4 text-white"
              >
                <img
                  src={imageUrl}
                  alt={p.nome}
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{p.nome}</h3>
                <span className="text-green-500 font-bold text-lg">R$ {p.preco}</span>
              </Link>
            );
          })
        ) : (
          <p className="text-center text-zinc-400 w-full">Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  );
}
