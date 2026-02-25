'use client';

import { useEffect, useState } from 'react';
import Footer from '@/src/components/Footer';
import CarrosselProdutos from '@/src/components/Carrossel-Cosmeticos';
import { listarProdutos } from '@/src/services/api';
import CarrosselCosmeticos from '@/src/components/Carrossel-Cosmeticos';

interface Produto {
  id: number;
  nome: string;
  preco: string;
  originalPreco: string;
  rating: number | null;
  reviews: number | null;
  image: string | null;
  categoria: string | null;
  descricao: string;
  detalhes: string;
  imagem1: string;
  imagem2: string;
  imagem3: string;
}

export default function Page() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    async function carregar() {
      const res = await listarProdutos();

      if (res.status === 'ok') {
        setProdutos(res.produtos);
      }
    }

    carregar();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="w-full">
        <h1 className="text-4xl font-bold text-center my-8">
          Produtos em Destaque
        </h1>

        <h2 className="text-2xl font-semibold text-center my-4">
          Confira nossos produtos mais vendidos
        </h2>

        <h3 className="text-lg text-center mb-8 px-4">
          Explore nossa seleção de produtos{' '}
          <span className="text-yellow-400">populares</span>
        </h3>
        <span className="mb-16 block flex align-center justify-center text-center">
        <CarrosselCosmeticos />
        </span>
      </section>

      <Footer />
    </main>
  );
}
