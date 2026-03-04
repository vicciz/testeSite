"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ComprarButton } from '@/src/components/button';
import CarrosselCosmeticos from '@/src/components/Carrossel-Cosmeticos';
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
    return <p className="text-center mt-20 text-zinc-900">Carregando produto...</p>;
  }

  const maskedLink = (() => {
    if (!produto.link) return "link protegido";
    try {
      const url = new URL(produto.link);
      return `${url.host}/•••`;
    } catch {
      return produto.link.replace(/^https?:\/\//, "").replace(/\/.*/, "/•••");
    }
  })();

  const imagens = [
    produto.image,
 
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#e3eef9] text-[#1f2f4a]">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-14">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white/70 border border-[#c9d9f2] rounded-3xl p-8 shadow-xl">
            <span className="text-xs tracking-widest uppercase text-[#4f6b9b]">IMBALÁVEL</span>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold">
              {produto.nome}
            </h1>
            <p className="mt-3 text-lg text-[#4b6386]">
              {produto.descricao}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="bg-[#cfe2ff] text-[#1f3a5f] px-3 py-1 rounded-full text-sm font-semibold">
                ⭐ {produto.rating || '5.0'}
              </span>
              <span className="text-sm text-[#56719a]">({produto.reviews || 128} avaliações)</span>
              <span className="bg-white border border-[#c9d9f2] text-[#2f61b9] px-3 py-1 rounded-full text-xs font-semibold shadow-sm inline-flex items-center gap-1">
                🛡️ Selo de Garantia
              </span>
            </div>

            <div className="mt-6 flex">
              <ComprarButton
                productId={produto.id}
                link={produto.link}
                className="w-full sm:w-auto px-10 py-4 text-lg font-semibold bg-[#2f61b9] text-white rounded-full shadow-lg shadow-blue-600/30 hover:bg-[#244e96] hover:shadow-blue-700/40 transition animate-pulseGlowBlue"
              />
            </div>

            <p className="mt-4 text-sm text-[#56719a]">⚠️ Estoque limitado</p>
            <p className="mt-2 text-xs text-[#6b84ab]">Link protegido: {maskedLink}</p>
          </div>

          <div className="bg-[#a9c3e6] rounded-3xl p-8 shadow-2xl">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={imagemAtiva!}
                alt={produto.nome}
                className="w-full h-[360px] object-cover"
              />
            </div>
            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              {imagens.map((img, i) => {
                const url = supabase.storage.from('produtos').getPublicUrl(img).data.publicUrl;

                return (
                  <button
                    key={i}
                    onClick={() => setImagemAtiva(url)}
                    className="w-16 h-16 rounded-xl overflow-hidden border border-[#c9d9f2] bg-white/80 hover:scale-105 transition"
                  >
                    <img
                      src={url}
                      alt={`${produto.nome} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF (LOGOS) */}
      <section className="py-10 bg-white/70 border-y border-[#c9d9f2]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-[#56719a] text-sm mb-6">
            Recomendado por publicações e marcas parceiras
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center text-center text-[#6b84ab] text-sm">
            <div>GQ</div>
            <div>Esquire</div>
            <div>Men’s Health</div>
            <div>Elle</div>
            <div>Forbes</div>
          </div>
        </div>
      </section>

      {/* MAIS VENDIDOS */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center">Mais Vendidos</h2>
          <p className="text-center text-[#56719a] mt-2">Top escolhas da curadoria</p>
          <div className="mt-8">
            <CarrosselCosmeticos />
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="py-14 bg-white/70 border-y border-[#c9d9f2]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center">Categorias</h2>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Perfumes', 'Skincare', 'Outfit', 'Acessórios'].map((c) => (
              <div key={c} className="bg-white rounded-2xl p-6 border border-[#dbe6f7] text-center shadow-lg">
                <div className="text-2xl mb-2">★</div>
                <p className="font-semibold">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESCRIÇÃO */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center">Descrição do Produto</h2>
          <div className="mt-8 bg-white rounded-2xl p-8 border border-[#dbe6f7] shadow-lg">
            <p className="text-[#56719a] text-lg leading-relaxed">
              {produto.detalhes || produto.descricao}
            </p>
          </div>
        </div>
      </section>

      {/* BRAND BENEFITS */}
      <section className="py-14 bg-white/70 border-y border-[#c9d9f2]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div className="bg-white rounded-2xl p-6 border border-[#dbe6f7] shadow-lg">
            <img src={imagemAtiva!} alt={produto.nome} className="w-full h-60 object-cover rounded-xl" />
          </div>
          <div>
            <h2 className="text-3xl font-semibold">Por que escolher a IMBALÁVEL</h2>
            <ul className="mt-4 space-y-3 text-[#56719a]">
              <li>✔️ Curadoria com foco em performance real</li>
              <li>✔️ Produtos originais e certificados</li>
              <li>✔️ Atendimento humano e rápido</li>
            </ul>
            <div className="mt-6 flex">
              <ComprarButton
                productId={produto.id}
                link={produto.link}
                className="w-full sm:w-auto px-10 py-3 rounded-full bg-[#2f61b9] text-white font-semibold shadow-lg shadow-blue-600/25 hover:bg-[#244e96] transition"
              />
            </div>
          </div>
        </div>
      </section>

      {/* QUEM COMPROU DIZ */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center">Quem comprou diz</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              'Chegou rápido e a fragrância é marcante. Recomendo!',
              'Fixação excelente, recebi vários elogios.',
              'Produto original e muito bem embalado.',
            ].map((texto, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#dbe6f7] p-6 shadow-lg">
                <p className="text-[#56719a]">“{texto}”</p>
                <p className="mt-4 text-xs text-[#6b84ab]">Compra verificada</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-14 bg-white/70 border-y border-[#c9d9f2]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-semibold">Sobre a marca</h2>
            <p className="mt-3 text-[#56719a]">
              A IMBALÁVEL nasceu para homens que exigem presença, estilo e autenticidade. Cada produto é selecionado por
              especialistas em fragrâncias.
            </p>
            <a
              href={produto.link}
              target="_blank"
              className="inline-block mt-6 bg-white text-[#23446d] px-6 py-3 rounded-full font-semibold shadow-md shadow-blue-900/10 hover:bg-[#f3f7ff] transition"
            >
              Conhecer coleção
            </a>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#dbe6f7] shadow-lg">
            <img src={imagemAtiva!} alt={produto.nome} className="w-full h-60 object-cover rounded-xl" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center">Perguntas frequentes</h2>
          <div className="mt-8 space-y-4">
            {[
              { q: 'Os produtos são originais?', a: 'Sim. Trabalhamos apenas com fornecedores certificados.' },
              { q: 'Qual o prazo de entrega?', a: 'Capitais: até 48h. Demais regiões: 3 a 7 dias úteis.' },
              { q: 'Posso trocar se não gostar?', a: 'Sim, seguimos o prazo legal de arrependimento.' },
            ].map((item) => (
              <details key={item.q} className="bg-white rounded-2xl p-5 border border-[#dbe6f7] shadow-lg cursor-pointer">
                <summary className="font-semibold text-[#1f2f4a]">{item.q}</summary>
                <p className="text-[#56719a] mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-14 bg-[#a9c3e6]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold">Escolha sua próxima assinatura</h2>
          <p className="text-[#3f5b86] mt-3">Finalize agora e receba em casa com total segurança.</p>
          <div className="mt-6 flex justify-center">
            <ComprarButton
              productId={produto.id}
              link={produto.link}
              className="px-12 py-3 rounded-full bg-[#2f61b9] text-white font-semibold shadow-lg shadow-blue-700/30 hover:bg-[#244e96] transition animate-pulseGlowBlue"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
