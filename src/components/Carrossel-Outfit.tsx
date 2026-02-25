'use client';
import { useState, useEffect } from 'react';
import Link from "next/link";
import { Filtro } from "./functions/filtros/filtrar-cosmestico";
import { FiltroOutfit } from "./functions/filtros/filtrar-outfit";
import { Produto } from '../services/produtos';

export default function CarrosselProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);

  // Carrega os produtos do backend com os parâmetros de filtro
  useEffect(() => {
    async function fetchProdutos(categoria?: string, tipo?: string) {
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/filtrar-outfit.php`);
        if (categoria) url.searchParams.append('categoria', categoria);
        if (tipo) url.searchParams.append('tipo_cosmetico', tipo);

        const response = await fetch(url.toString());

        const data = await response.json();

        if (data.status === 'ok') {
          setProdutos(data.produtos);
          setProdutosFiltrados(data.produtos);
        } else {
          setProdutos([]);
          setProdutosFiltrados([]);
        }
      } catch (err) {
        console.error('Erro ao listar produtos:', err);
        setProdutos([]);
        setProdutosFiltrados([]);
      }
    }

    // Chama a API sem filtros inicialmente
    fetchProdutos();
  }, []);

  // Filtra os produtos por categoria e tipo_cosmetico
  const handleFiltroChange = async (categoria: string, tipo: string) => {
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/filtrar-outfit.php`);
      if (categoria) url.searchParams.append('categoria', categoria);
      if (tipo) url.searchParams.append('tipo_cosmetico', tipo);

      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.status === 'ok') {
        setProdutosFiltrados(data.produtos);
      } else {
        setProdutosFiltrados([]);
      }
    } catch (err) {
      console.error('Erro ao buscar produtos filtrados:', err);
      setProdutosFiltrados([]);
    }
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
              ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${p.image}`
              : `${process.env.NEXT_PUBLIC_API_URL}/uploads/placeholder.png`;

            return (
              <Link
                key={p.id}
                href={`/produto/${p.id}`}
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
              ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${p.image}`
              : `${process.env.NEXT_PUBLIC_API_URL}/uploads/placeholder.png`;

            return (
              <Link
                key={p.id}
                href={`/produto/${p.id}`}
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
