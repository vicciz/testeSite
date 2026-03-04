'use client';

import Footer from '@/src/components/Footer';
import CarrosselCosmeticos from '@/src/components/Carrossel-Cosmeticos';

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* 1. HEADLINE */}
      <section className="pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 text-xs tracking-widest text-slate-600">
              IMBALÁVEL • Produtos premium
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
              A página definitiva para descobrir perfumes masculinos
              <span className="text-indigo-600"> com presença</span>.
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              Curadoria premium, entrega rápida e escolhas certeiras para elevar sua assinatura pessoal.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#destaques" className="px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition">
                Ver destaques
              </a>
              <a href="#faq" className="px-6 py-3 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 transition">
                Entender a curadoria
              </a>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
              <div className="surface-card p-4">
                <strong className="text-slate-900">+120</strong> produtos avaliados
              </div>
              <div className="surface-card p-4">
                <strong className="text-slate-900">Entrega</strong> 48h em capitais
              </div>
              <div className="surface-card p-4">
                <strong className="text-slate-900">Compra</strong> 100% segura
              </div>
            </div>
          </div>

          <div className="surface-card p-8 shadow-strong">
            <h2 className="text-xl font-semibold">Top escolhas da semana</h2>
            <p className="text-slate-600 mt-2">Perfis olfativos que dominam a cena.</p>
            <div className="mt-6 space-y-4">
              {[
                'Amadeirados intensos para noites marcantes',
                'Aromas frescos para performance diária',
                'Especiados elegantes para ocasiões especiais',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-amber-500">★</span>
                  <p className="text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEMA */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Escolha confusa', desc: 'Muitas opções e pouca orientação confiável.' },
            { title: 'Compra insegura', desc: 'Difícil separar fragrâncias originais de cópias.' },
            { title: 'Pouco impacto', desc: 'Produtos sem performance e fixação real.' },
          ].map((item) => (
            <div key={item.title} className="surface-card p-6">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-slate-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SOLUÇÃO / SERVIÇOS */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold">Nossa solução</h2>
          <p className="text-slate-600 mt-3 max-w-2xl">
            Uma curadoria que combina performance, autenticidade e estilo em três categorias centrais.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Perfumes Masculinos', desc: 'Fragrâncias intensas e sofisticadas.', icon: '🧴' },
              { title: 'Skincare Premium', desc: 'Rotina prática para homens exigentes.', icon: '✨' },
              { title: 'Moda & Outfit', desc: 'Presença visual que complementa a fragrância.', icon: '🕶️' },
            ].map((item) => (
              <div key={item.title} className="surface-card p-6">
                <div className="text-2xl">{item.icon}</div>
                <h3 className="text-lg font-semibold mt-4">{item.title}</h3>
                <p className="text-slate-600 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PROVA / PORTFÓLIO */}
      <section id="destaques" className="py-16 bg-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">Destaques da curadoria</h2>
              <p className="text-slate-600 mt-3">Produtos com melhor avaliação e performance comprovada.</p>
            </div>
            <a href="#cta" className="text-indigo-600 font-semibold">Quero ver tudo →</a>
          </div>
          <div className="mt-8">
            <CarrosselCosmeticos />
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
            <div className="surface-card p-5">
              <strong className="text-slate-900">Fixação</strong> acima da média
            </div>
            <div className="surface-card p-5">
              <strong className="text-slate-900">Avaliações reais</strong> e confiáveis
            </div>
            <div className="surface-card p-5">
              <strong className="text-slate-900">Garantia</strong> de autenticidade
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROVAS / TESTEMUNHOS */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold">O que clientes dizem</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Caio M.', text: 'Fixação perfeita e entrega rápida. Virei cliente fiel.' },
              { name: 'Rafael S.', text: 'Curadoria certeira, agora compro sem medo.' },
              { name: 'Lucas P.', text: 'Atendimento premium e produtos autênticos.' },
            ].map((item) => (
              <div key={item.name} className="surface-card p-6">
                <p className="text-slate-700">“{item.text}”</p>
                <p className="mt-4 text-sm text-slate-500">— {item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SOBRE */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold">Sobre a IMBALÁVEL</h2>
            <p className="text-slate-600 mt-4">
              Somos especialistas em fragrâncias masculinas premium e criamos uma seleção para homens que valorizam presença,
              sofisticação e autenticidade.
            </p>
          </div>
          <div className="surface-card p-6">
            <ul className="space-y-3 text-slate-700">
              <li>✔️ Curadoria com base em performance real</li>
              <li>✔️ Produtos originais e certificados</li>
              <li>✔️ Atendimento humano e rápido</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold">Perguntas frequentes</h2>
          <div className="mt-8 space-y-4">
            {[
              { q: 'Os produtos são originais?', a: 'Sim. Trabalhamos apenas com fornecedores certificados.' },
              { q: 'Qual o prazo de entrega?', a: 'Capitais: até 48h. Demais regiões: 3 a 7 dias úteis.' },
              { q: 'Posso trocar se não gostar?', a: 'Sim, seguimos o prazo legal de arrependimento.' },
            ].map((item) => (
              <details key={item.q} className="surface-card p-5 cursor-pointer">
                <summary className="font-semibold text-slate-900">{item.q}</summary>
                <p className="text-slate-600 mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section id="cta" className="py-16 bg-slate-900">
        <div className="max-w-5xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold">Pronto para escolher sua próxima assinatura?</h2>
          <p className="mt-4 text-slate-200">
            Explore a curadoria e encontre a fragrância que impõe respeito.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a href="#destaques" className="px-8 py-3 rounded-full bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300 transition">
              Ver produtos
            </a>
            <a href="/cadastro" className="px-8 py-3 rounded-full border border-white/30 hover:bg-white/10 transition">
              Criar conta
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
