'use client';

import { useEffect, useState } from 'react';
import Footer from '@/src/components/Footer';
import CarrosselProdutos from '@/src/components/Carrossel-Cosmeticos';
import CarrosselOutfit from '@/src/components/Carrossel-Outfit';
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
  const [dbStatus, setDbStatus] = useState<'ok' | 'error' | 'loading'>('loading');
  const [dbMessage, setDbMessage] = useState<string>('');

  useEffect(() => {
    async function carregar() {
      const res = await listarProdutos();
      if (res.status === 'ok') {
        setProdutos(res.produtos);
        setDbStatus('ok');
        setDbMessage(`Supabase OK • ${res.produtos.length} produtos`);
      } else {
        setDbStatus('error');
        setDbMessage('Supabase erro ao listar produtos');
      }
    }
    carregar();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white relative">
      {/* Fundo Mesh Gradient Animado */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 opacity-15 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-pink-600 opacity-15 blur-3xl rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-600 opacity-12 blur-3xl rounded-full animate-pulse animation-delay-4000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600 opacity-10 blur-3xl rounded-full animate-pulse animation-delay-3000"></div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
        }
        .animate-pulse { animation: pulse-slow 8s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>

      {/* STATUS */}
      <div className="fixed top-4 right-4 z-50">
        <span
          className={`text-xs px-3 py-1 rounded-full border ${
            dbStatus === 'ok'
              ? 'border-green-500 text-green-300 bg-green-500/10'
              : dbStatus === 'error'
              ? 'border-red-500 text-red-300 bg-red-500/10'
              : 'border-yellow-500 text-yellow-300 bg-yellow-500/10'
          }`}
        >
          {dbStatus === 'loading' ? 'Verificando Supabase...' : dbMessage}
        </span>
      </div>

      {/* HERO */}
      <section className="relative z-10 w-full h-[75vh] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-sm" />

        <div className="relative z-10 px-6 max-w-4xl">
          <span className="inline-block mb-6 px-4 py-1 rounded-full border border-white/20 text-sm tracking-widest">
            IMBALÁVEL
          </span>

          <h1 className="text-5xl md:text-7xl font-bold tracking-wide leading-tight bg-gradient-to-r from-white via-rose-100 to-pink-100 bg-clip-text text-transparent">
            Beleza não se explica.<br />Se impõe.
          </h1>

          <p className="mt-6 text-lg md:text-xl text-zinc-300">
            Os melhores perfumes masculinos, cosméticos premium e fragrâncias marcantes disponíveis na web.
          </p>

          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <a
              href="#destaques"
              className="px-8 py-3 rounded-full bg-pink-600 hover:bg-pink-500 transition font-semibold"
            >
              Ver Destaques
            </a>

            <a
              href="#categorias"
              className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition"
            >
              Explorar Coleção
            </a>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section
        id="categorias"
        className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {[
          { title: 'Perfumes Masculinos', desc: 'Fragrâncias intensas, sofisticadas e marcantes' },
          { title: 'Skincare Premium', desc: 'Cuidado diário para homens exigentes' },
          { title: 'Moda Fitnes', desc: 'Presença, identidade e confiança' },
        ].map((c, i) => (
          <div
            key={i}
            className="bg-zinc-900/60 backdrop-blur rounded-2xl p-10 text-center hover:scale-[1.03] transition"
          >
            <h3 className="text-2xl font-semibold mb-4">{c.title}</h3>
            <p className="text-zinc-400">{c.desc}</p>
          </div>
        ))}
      </section>

      {/* DESTAQUES */}
      <section
        id="destaques"
        className="max-w-7xl mx-auto px-6 pb-24"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Destaques IMBALÁVEL
          </h2>

          <p className="text-zinc-400 mt-4">
            Perfumes masculinos mais buscados e bem avaliados
          </p>
        </div>

        <CarrosselCosmeticos />
        <CarrosselOutfit />
        
        
      </section>

      {/* SEO CONTENT */}
      <section className="max-w-5xl mx-auto px-6 pb-24 text-zinc-300 leading-relaxed">
        <h2 className="text-3xl font-bold text-white mb-6">
          Os Melhores Perfumes Masculinos Disponíveis Online
        </h2>

        <p className="mb-6">
          A IMBALÁVEL é uma plataforma especializada em reunir os <strong>melhores perfumes masculinos disponíveis na web</strong>,
          conectando você às fragrâncias mais desejadas, bem avaliadas e com excelente custo-benefício.
        </p>

        <p className="mb-6">
          Nossa curadoria inclui <strong>perfumes masculinos importados</strong>, fragrâncias intensas para a noite,
          aromas frescos para o dia a dia e perfumes com alta fixação e projeção.
          Cada produto é selecionado para homens que buscam presença, elegância e identidade.
        </p>

        <h3 className="text-2xl font-semibold text-white mb-4">
          Por que escolher perfumes através da IMBALÁVEL?
        </h3>

        <ul className="list-disc pl-6 space-y-3">
          <li>Seleção dos perfumes masculinos mais vendidos</li>
          <li>Links diretos para compra online segura</li>
          <li>Produtos com avaliações reais e alto rating</li>
          <li>Curadoria focada em performance, estilo e impacto</li>
        </ul>

        <p className="mt-6">
          Se você procura o <strong>melhor perfume masculino para marcar presença</strong>,
          elevar sua confiança e deixar sua assinatura por onde passar, você está no lugar certo.
        </p>
      </section>

      {/* BENEFÍCIOS */}
      <section className="bg-black/40 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {[
            { title: 'Entrega Rápida', desc: 'Envios para todo o Brasil' },
            { title: 'Pagamento Seguro', desc: 'Pix, cartão e boleto' },
            { title: 'Curadoria Premium', desc: 'Perfumes masculinos selecionados' },
          ].map((b, i) => (
            <div key={i}>
              <h4 className="text-xl font-semibold mb-2">{b.title}</h4>
              <p className="text-zinc-400">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
