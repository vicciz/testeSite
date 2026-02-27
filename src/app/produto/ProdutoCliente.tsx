"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ComprarButton } from '@/src/components/button';
import Footer from '@/src/components/Footer';
import { Cronometro } from '@/src/components/cronometro';
import { Produto, buscarProduto } from '@/src/services/produtos';
import { supabase } from '@/supabaseClient';


export default function ProdutoDetalhe() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [produto, setProduto] = useState<Produto | null>(null);
  const [imagemAtiva, setImagemAtiva] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    buscarProduto(Number(id))
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        setProduto(data);
        if (data?.image) {
          const url = supabase.storage.from('produtos').getPublicUrl(data.image).data.publicUrl;
          setImagemAtiva(url);
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!produto) {
    return <p className="text-center mt-20 text-white">Carregando produto...</p>;
  }

  const imagens = [
    produto.image,
 
  ].filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-20 text-white">
      {/* HERO */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        {/* Imagem principal com zoom */}
        <div className="overflow-hidden rounded-2xl border border-gray-700 group">
          <img
            src={imagemAtiva!}
            alt={produto.nome}
            className="w-full h-full object-cover transition-transform duration-700 ease-out
                       group-hover:scale-110 cursor-zoom-in"
          />
        </div>

        {/* Infos */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">{produto.nome}</h1>

          <p className="text-xl text-gray-300">
            <a
              href={produto.link}
              target="_blank"
              className="underline text-yellow-400 hover:text-yellow-300"
            >
              {produto.descricao}
            </a>
          </p>

          <div className="flex items-center gap-4">
            <span className="text-yellow-400 font-bold text-lg">
              ⭐ {produto.rating}
            </span>
            <span className="text-gray-400 text-sm">
              ({produto.reviews} avaliações)
            </span>
          </div>

          <Cronometro />

          <ComprarButton
            productId={produto.id}
            link={produto.link}
            className="w-full py-6 text-2xl font-bold mg-auto block text-center"
          />

          <p className="text-gray-400">⚠️ Estoque limitado</p>
        </div>
      </section>

      {/* GALERIA COM ZOOM */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">
          Detalhes do Produto
        </h2>

        <div className="flex justify-center gap-4 flex-wrap">
          {imagens.map((img, i) => {
            const url = supabase.storage.from('produtos').getPublicUrl(img).data.publicUrl;

            return (
              <div
                key={i}
                onClick={() => setImagemAtiva(url)}
                className="w-24 h-24 md:w-28 md:h-28 rounded-lg overflow-hidden
                           border border-gray-700 cursor-pointer
                           transform transition-all duration-500
                           hover:scale-110 hover:border-yellow-400"
              >
                <img
                  src={url}
                  alt={`${produto.nome} ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700
                             hover:scale-125"
                />
              </div>
            );
          })}
        </div>

        <p className="text-center text-gray-400 text-sm mt-4">
          Passe o mouse para ampliar • Clique para visualizar
        </p>
      </section>

      {/* BENEFÍCIOS */}
      <section className="bg-gray-900 p-10 rounded-2xl shadow-inner text-center space-y-6">
        <h2 className="text-3xl font-bold">
          Por que {produto.nome} é a escolha perfeita
        </h2>

        <ul className="list-disc list-inside text-gray-300 space-y-2 max-w-xl mx-auto">
          <li>
            Fragrância sofisticada e duradoura —{' '}
            <a
              href={produto.link}
              target="_blank"
              className="underline text-yellow-400"
            >
              comprar agora
            </a>
          </li>
          <li>Ideal para ocasiões especiais</li>
          <li>Embalagem premium</li>
          <li>Garantia de autenticidade</li>
        </ul>

        <div className="flex gap-4 justify-center flex-wrap mt-6">
          <span className="bg-green-700 px-6 py-3 rounded-lg font-bold">
            100% Autêntico
          </span>
          <span className="bg-blue-700 px-6 py-3 rounded-lg font-bold">
            Satisfação Garantida
          </span>
          <span className="bg-yellow-600 px-6 py-3 rounded-lg font-bold">
            Entrega Rápida
          </span>
        </div>

        <div className="mt-8 flex justify-center">
          <ComprarButton
            productId={produto.id}
            link={produto.link}
            className="bg-red-600 text-white text-2xl font-bold px-14 py-6 rounded-xl
                       transition-all duration-700 hover:scale-110 hover:brightness-110
                       animate-pulse"
          />
        </div>
      </section>

      {/* TEXTO MÍSTICO */}
      <section className="bg-gray-900 p-10 rounded-2xl text-center space-y-6">
        <h2 className="text-3xl font-bold">A Essência de {produto.nome}</h2>

        <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
          Produzido a partir de um processo artesanal refinado,{' '}
          <strong>{produto.nome}</strong> nasce da combinação entre tradição,
          alquimia e precisão. Cada essência é extraída com técnicas avançadas de
          maceração e destilação, respeitando o tempo exato de maturação para
          alcançar sua potência máxima.
          <br />
          <br />
          O resultado é uma fragrância que transcende o comum, despertando
          presença, mistério e sofisticação em cada nota.
        </p>

        <a
          href={produto.link}
          target="_blank"
          className="inline-block bg-red-600 text-white text-xl font-bold px-12 py-5 rounded-xl
                     transition-all hover:scale-105 hover:brightness-110"
        >
          Adquirir agora
        </a>
      </section>

      {/* CTA FINAL */}
      <section className="text-center bg-gray-900 p-12 rounded-2xl space-y-6">
        <h2 className="text-4xl font-bold">
          Garanta o seu agora mesmo
        </h2>

        <p className="text-gray-300 max-w-xl mx-auto">
          Uma fragrância marcante, exclusiva e inesquecível.{' '}
          <a
            href={produto.link}
            target="_blank"
            className="underline text-yellow-400 with-hover:text-yellow-300"
          >
            Comprar agora
          </a>
        </p>

        <ComprarButton
          productId={produto.id}
          link={produto.link}
          className="w-full py-6 text-2xl font-bold max-w-md mx-auto block text-center"
        />

        <p className="text-yellow-400 font-semibold">
          Promoção por tempo limitado
        </p>
      </section>

      <Footer />
    </div>
  );
}
