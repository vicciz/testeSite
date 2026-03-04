'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Filtro } from './functions/filtros/filtrar-cosmestico';
import { Produto, listarProdutos } from '../services/produtos';
import { supabase } from '../../supabaseClient';


export default function CarrosselCosmeticos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);

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

  const produtosVisiveis = mostrarTodos ? produtosFiltrados : produtosFiltrados.slice(0, 3);

  return (
    <div className=" relative z-10 px-6 max-w-7xl mx-auto">
      {/* Componente de filtro */}
      <Filtro
        categorias={['Cosmético']}
        tipos={['Unissex', 'Masculino', 'Feminino']}
        onChange={handleFiltroChange}
      />

      {/* Desktop / Tablet */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
        {produtosVisiveis.length > 0 ? (
          produtosVisiveis.map((p) => {
            const imageUrl = p.image
              ? supabase.storage.from('produtos').getPublicUrl(p.image).data.publicUrl
              : '/placeholder.png';

            return (
              <Link
                key={p.id}
                href={`/produto?id=${p.id}`}
                className="bg-white border border-slate-200
                           rounded-2xl shadow-lg p-4 text-slate-900
                           hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={imageUrl}
                  alt={p.nome}
                  className="w-full h-44 object-cover rounded-xl mb-3"
                />
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{p.nome}</h3>
                
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
        {produtosVisiveis.length > 0 ? (
          produtosVisiveis.map((p) => {
            const imageUrl = p.image
              ? supabase.storage.from('produtos').getPublicUrl(p.image).data.publicUrl
              : '/placeholder.png';

            return (
              <Link
                key={p.id}
                href={`/produto?id=${p.id}`}
                className="min-w-[260px] bg-white border border-slate-200
                           rounded-2xl shadow-lg p-4 text-slate-900"
              >
                <img
                  src={imageUrl}
                  alt={p.nome}
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{p.nome}</h3>
                
              </Link>
            );
          })
        ) : (
          <p className="text-center text-zinc-400 w-full">Nenhum produto encontrado.</p>
        )}
      </div>

      {produtosFiltrados.length > 3 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setMostrarTodos(!mostrarTodos)}
            className="px-6 py-2 rounded-full bg-[#2f61b9] text-white font-semibold shadow-lg shadow-blue-600/30 hover:bg-[#244e96] transition"
          >
            {mostrarTodos ? 'Ver menos' : 'Ver mais'}
          </button>
        </div>
      )}
    </div>
  );
}
