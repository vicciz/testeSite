'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { listarProdutos } from '@/src/services/produtos';
import { supabase } from '@/supabaseClient';

interface Produto {
  id: number;
  nome: string;
  image?: string | null;
}

interface User {
  role: string;
}

interface Colecao {
  id: number;
  nome: string;
  created_at?: string | null;
  totalProdutos: number;
  mostrar_home?: boolean | null;
}

export default function CatalogoAdmin() {
  const [user, setUser] = useState<User | null>(null);
  const [carregado, setCarregado] = useState(false);
  const [nomeCatalogo, setNomeCatalogo] = useState('');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());
  const [salvando, setSalvando] = useState(false);
  const [colecoes, setColecoes] = useState<Colecao[]>([]);
  const [carregandoColecoes, setCarregandoColecoes] = useState(false);
  const [mostrarTodosProdutos, setMostrarTodosProdutos] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
    setCarregado(true);
    carregarProdutos();
    carregarColecoes();
  }, []);

  async function carregarProdutos() {
    const { data, error } = await listarProdutos(undefined, undefined, true);
    if (error) {
      console.error('Erro ao carregar produtos:', error);
      return;
    }
    setProdutos((data as Produto[]) || []);
  }

  async function carregarColecoes() {
    setCarregandoColecoes(true);

    const { data: colecoesData, error: colecoesError } = await supabase
      .from('colecao')
      .select('id,nome,created_at,mostrar_home')
      .order('created_at', { ascending: false });

    if (colecoesError) {
      console.error('Erro ao carregar coleções:', colecoesError);

      const { data: fallbackData, error: fallbackError } = await supabase
        .from('colecao')
        .select('id,nome,created_at')
        .order('created_at', { ascending: false });

      if (fallbackError) {
        console.error('Erro ao carregar coleções (fallback):', fallbackError);
        alert(fallbackError.message || 'Erro ao carregar coleções');
        setCarregandoColecoes(false);
        return;
      }

      const { data: relacoes, error: relacoesError } = await supabase
        .from('colecao_produto')
        .select('colecao_id, produto_id');

      if (relacoesError) {
        console.error('Erro ao carregar relações:', relacoesError);
        const normalizedFallback = (fallbackData || []).map((c: any) => ({
          id: c.id,
          nome: c.nome,
          created_at: c.created_at,
          totalProdutos: 0,
          mostrar_home: false,
        }));

        setColecoes(normalizedFallback);
        setCarregandoColecoes(false);
        return;
      }

      const contagem = new Map<number, number>();
      (relacoes || []).forEach((r: any) => {
        const atual = contagem.get(r.colecao_id) || 0;
        contagem.set(r.colecao_id, atual + 1);
      });

      const normalizedFallback = (fallbackData || []).map((c: any) => ({
        id: c.id,
        nome: c.nome,
        created_at: c.created_at,
        totalProdutos: contagem.get(c.id) || 0,
        mostrar_home: false,
      }));

      setColecoes(normalizedFallback);
      setCarregandoColecoes(false);
      return;
    }

    const { data: relacoes, error: relacoesError } = await supabase
      .from('colecao_produto')
      .select('colecao_id, produto_id');

    if (relacoesError) {
      console.error('Erro ao carregar relações:', relacoesError);
      const normalized = (colecoesData || []).map((c: any) => ({
        id: c.id,
        nome: c.nome,
        created_at: c.created_at,
        totalProdutos: 0,
        mostrar_home: c.mostrar_home ?? false,
      }));

      setColecoes(normalized);
      setCarregandoColecoes(false);
      return;
    }

    const contagem = new Map<number, number>();
    (relacoes || []).forEach((r: any) => {
      const atual = contagem.get(r.colecao_id) || 0;
      contagem.set(r.colecao_id, atual + 1);
    });

    const normalized = (colecoesData || []).map((c: any) => ({
      id: c.id,
      nome: c.nome,
      created_at: c.created_at,
      totalProdutos: contagem.get(c.id) || 0,
      mostrar_home: c.mostrar_home ?? false,
    }));

    setColecoes(normalized);
    setCarregandoColecoes(false);
  }

  function toggleProduto(id: number) {
    setSelecionados(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const totalSelecionados = useMemo(() => selecionados.size, [selecionados]);
    async function toggleMostrarHome(colecaoId: number, atual?: boolean | null) {
      const { error } = await supabase
        .from('colecao')
        .update({ mostrar_home: !atual })
        .eq('id', colecaoId);

      if (error) {
        console.error('Erro ao atualizar visibilidade:', error);
        if (error.message?.toLowerCase().includes('column') && error.message?.toLowerCase().includes('mostrar_home')) {
          alert('A coluna "mostrar_home" não existe. Crie uma coluna boolean na tabela colecao com default false.');
        } else {
          alert(`Erro ao atualizar visibilidade: ${error.message}`);
        }
        return;
      }

      setColecoes((prev) =>
        prev.map((c) => (c.id === colecaoId ? { ...c, mostrar_home: !atual } : c))
      );
    }

  const produtosVisiveis = useMemo(
    () => (mostrarTodosProdutos ? produtos : produtos.slice(0, 3)),
    [mostrarTodosProdutos, produtos]
  );

  async function salvarCatalogo() {
    if (!nomeCatalogo.trim()) {
      alert('Informe o nome do catálogo');
      return;
    }
    if (!selecionados.size) {
      alert('Selecione pelo menos um produto');
      return;
    }
    setSalvando(true);

    const { data: novaColecao, error: colecaoError } = await supabase
      .from('colecao')
      .insert({ nome: nomeCatalogo.trim() })
      .select('id')
      .single();

    if (colecaoError || !novaColecao?.id) {
      alert(colecaoError?.message || 'Erro ao criar coleção');
      setSalvando(false);
      return;
    }

    const linhas = Array.from(selecionados).map((produtoId) => ({
      colecao_id: novaColecao.id,
      produto_id: produtoId,
    }));

    const { error: relacaoError } = await supabase
      .from('colecao_produto')
      .insert(linhas);

    if (relacaoError) {
      alert(relacaoError.message || 'Erro ao vincular produtos');
      setSalvando(false);
      return;
    }

    alert(`Coleção "${nomeCatalogo}" criada com ${selecionados.size} produto(s).`);
    setNomeCatalogo('');
    setSelecionados(new Set());
    setSalvando(false);
    carregarColecoes();
  }

  if (!carregado) return <p className="p-10">Carregando...</p>;

  if (!user || user.role !== 'admin') return <p className="p-10">Acesso negado</p>;

  return (
    <div className="p-10 text-zinc-900">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Criar catálogo</h1>
        <Link href="/admin" className="text-indigo-600">Voltar</Link>
      </div>

      <div className="bg-white border border-black/10 rounded p-6 mb-8">
        <label className="block text-sm font-medium mb-2">Nome do catálogo</label>
        <input
          type="text"
          value={nomeCatalogo}
          onChange={(e) => setNomeCatalogo(e.target.value)}
          placeholder="Ex: Catálogo de Verão"
          className="w-full bg-white border border-black/10 rounded px-4 py-2"
        />
      </div>

      <div className="bg-white border border-black/10 rounded p-6 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Coleções já criadas</h2>
          {carregandoColecoes && (
            <span className="text-sm text-zinc-500">Carregando...</span>
          )}
        </div>

        {colecoes.length === 0 && !carregandoColecoes ? (
          <p className="text-sm text-zinc-600">Nenhuma coleção criada ainda.</p>
        ) : (
          <ul className="divide-y divide-black/5">
            {colecoes.map((c) => (
              <li key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{c.nome}</p>
                  <p className="text-xs text-zinc-500">ID: {c.id}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => toggleMostrarHome(c.id, c.mostrar_home)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                      c.mostrar_home
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    {c.mostrar_home ? 'Mostrar na home' : 'Ocultar na home'}
                  </button>
                  <span className="text-sm text-zinc-600">
                    {c.totalProdutos} produto(s)
                  </span>
                  <Link
                    href={`/admin/catalogo/${c.id}`}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Editar
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Produtos do catálogo</h2>
        <span className="text-sm text-zinc-600">Selecionados: {totalSelecionados}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {produtosVisiveis.map((p) => {
          const checked = selecionados.has(p.id);
          const imageUrl = p.image
            ? supabase.storage.from('produtos').getPublicUrl(p.image).data.publicUrl
            : '';

          return (
            <label
              key={p.id}
              className={`flex items-center gap-4 border rounded p-4 cursor-pointer transition ${
                checked ? 'border-indigo-400 bg-indigo-50/50' : 'border-black/10 bg-white'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleProduto(p.id)}
                className="h-4 w-4"
              />
              {imageUrl ? (
                <img src={imageUrl} alt={p.nome} className="w-16 h-16 object-cover rounded" />
              ) : (
                <div className="w-16 h-16 bg-slate-100 border border-black/10 rounded flex items-center justify-center text-xs">
                  Sem imagem
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium">{p.nome}</p>
                <p className="text-xs text-zinc-500">ID: {p.id}</p>
              </div>
            </label>
          );
        })}
      </div>

      {produtos.length > 3 && (
        <div className="mb-8">
          <button
            type="button"
            onClick={() => setMostrarTodosProdutos(prev => !prev)}
            className="text-indigo-600 hover:underline text-sm"
          >
            {mostrarTodosProdutos ? 'Ver menos' : 'Ver mais'}
          </button>
        </div>
      )}

      <button
        onClick={salvarCatalogo}
        disabled={salvando}
        className={`px-6 py-2 rounded text-white ${
          salvando ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600'
        }`}
      >
        {salvando ? 'Salvando...' : 'Salvar catálogo'}
      </button>
    </div>
  );
}
