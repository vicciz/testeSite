'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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

export default function EditarColecaoClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [carregado, setCarregado] = useState(false);
  const [nomeColecao, setNomeColecao] = useState('');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [mostrarTodosProdutos, setMostrarTodosProdutos] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (!id) return;
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function carregarDados() {
    setCarregando(true);

    const [colecaoRes, produtosRes, relacoesRes] = await Promise.all([
      supabase.from('colecao').select('id,nome').eq('id', id).single(),
      listarProdutos(undefined, undefined, true),
      supabase.from('colecao_produto').select('produto_id').eq('colecao_id', id),
    ]);

    if (colecaoRes.error) {
      alert(colecaoRes.error.message || 'Erro ao carregar coleção');
      setCarregando(false);
      return;
    }

    setNomeColecao(colecaoRes.data?.nome || '');
    setProdutos((produtosRes.data as Produto[]) || []);

    const selected = new Set<number>();
    (relacoesRes.data || []).forEach((r: any) => selected.add(r.produto_id));
    setSelecionados(selected);

    setCarregando(false);
  }

  function toggleProduto(idProduto: number) {
    setSelecionados(prev => {
      const next = new Set(prev);
      if (next.has(idProduto)) next.delete(idProduto);
      else next.add(idProduto);
      return next;
    });
  }

  const produtosVisiveis = useMemo(
    () => (mostrarTodosProdutos ? produtos : produtos.slice(0, 3)),
    [mostrarTodosProdutos, produtos]
  );

  async function salvar() {
    if (!nomeColecao.trim()) {
      alert('Informe o nome da coleção');
      return;
    }

    setSalvando(true);

    const { error: updateError } = await supabase
      .from('colecao')
      .update({ nome: nomeColecao.trim() })
      .eq('id', id);

    if (updateError) {
      alert(updateError.message || 'Erro ao atualizar coleção');
      setSalvando(false);
      return;
    }

    const { data: relacoesExistentes, error: relacoesError } = await supabase
      .from('colecao_produto')
      .select('produto_id')
      .eq('colecao_id', id);

    if (relacoesError) {
      alert(relacoesError.message || 'Erro ao carregar relações');
      setSalvando(false);
      return;
    }

    const existentes = new Set<number>((relacoesExistentes || []).map((r: any) => r.produto_id));
    const novos = new Set<number>(selecionados);

    const toAdd = Array.from(novos).filter((pid) => !existentes.has(pid));
    const toRemove = Array.from(existentes).filter((pid) => !novos.has(pid));

    if (toAdd.length) {
      const { error: addError } = await supabase
        .from('colecao_produto')
        .insert(toAdd.map((produto_id) => ({ colecao_id: Number(id), produto_id })));

      if (addError) {
        alert(addError.message || 'Erro ao adicionar produtos');
        setSalvando(false);
        return;
      }
    }

    if (toRemove.length) {
      const { error: removeError } = await supabase
        .from('colecao_produto')
        .delete()
        .eq('colecao_id', id)
        .in('produto_id', toRemove);

      if (removeError) {
        alert(removeError.message || 'Erro ao remover produtos');
        setSalvando(false);
        return;
      }
    }

    setSalvando(false);
    alert('Coleção atualizada com sucesso!');
    router.push('/admin/catalogo');
  }

  if (!carregado) return <p className="p-10">Carregando...</p>;
  if (!user || user.role !== 'admin') return <p className="p-10">Acesso negado</p>;

  return (
    <div className="p-10 text-zinc-900">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Editar coleção</h1>
        <Link href="/admin/catalogo" className="text-indigo-600">Voltar</Link>
      </div>

      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div className="bg-white border border-black/10 rounded p-6 mb-6">
            <label className="block text-sm font-medium mb-2">Nome da coleção</label>
            <input
              type="text"
              value={nomeColecao}
              onChange={(e) => setNomeColecao(e.target.value)}
              placeholder="Ex: Coleção Masculina"
              className="w-full bg-white border border-black/10 rounded px-4 py-2"
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Produtos da coleção</h2>
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
            onClick={salvar}
            disabled={salvando}
            className={`px-6 py-2 rounded text-white ${
              salvando ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600'
            }`}
          >
            {salvando ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </>
      )}
    </div>
  );
}
