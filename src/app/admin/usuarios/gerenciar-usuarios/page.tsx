'use client';

import { useEffect, useState } from 'react';
import { Usuario } from '@/src/services/Usuario';
import SelectUsuarios from '@/src/components/selectUsuarios';
import EnviarEmailUsuarios from '@/src/components/EnviarEmailUsuarios';

export default function CatalogoAdmin() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [termo, setTermo] = useState('');
  const [selecionados, setSelecionados] = useState<number[]>([]);

  useEffect(() => {
    async function buscar() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clientes.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letra: termo }),
      });

      const data = await res.json();
      setUsuarios(data.clientes);
    }

    buscar();
  }, [termo]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Título */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
          <p className="text-zinc-400 mt-1">
            Busque, selecione e envie comunicações
          </p>
        </header>

        {/* Conteúdo lado a lado */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Coluna esquerda */}
          <aside className="bg-zinc-900/70 rounded-2xl p-6 space-y-6 border border-white/10">
            
            <div>
              <label className="text-sm text-zinc-400">
                Buscar usuários
              </label>
              <input
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                placeholder="Digite o nome ou letra..."
                className="mt-2 w-full bg-zinc-950 border border-white/10
                           rounded-xl px-4 py-3 text-sm
                           placeholder:text-zinc-500
                           focus:outline-none focus:ring-2 focus:ring-pink-600"
              />
            </div>

            <div>
              <p className="text-sm text-zinc-400 mb-2">
                Ações em massa
              </p>

              <EnviarEmailUsuarios
                usuarios={usuarios.filter(u => selecionados.includes(u.id))}
              />
            </div>

            <div className="text-sm text-zinc-400">
              Selecionados:{" "}
              <span className="text-white font-semibold">
                {selecionados.length}
              </span>
            </div>
          </aside>

          {/* Coluna direita */}
          <div className="lg:col-span-2 bg-zinc-900/60 rounded-2xl p-6 border border-white/10">
            <SelectUsuarios
              usuarios={usuarios}
              selecionados={selecionados}
              onChange={setSelecionados}
            />
          </div>

        </section>
      </div>
    </main>
  );
}
