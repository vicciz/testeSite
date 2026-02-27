// services/produtos.ts – wrapper around Supabase table `produtos`
import { supabase } from '../../supabaseClient';

export interface Produto {
  id: number;
  nome: string;
  preco: string | number;
  link?: string | null;
  rating?: number | null;
  reviews?: number | null;
  image?: string | null;
  descricao?: string | null;
  detalhes?: string | null;
  fornecedor?: string | null;
  categoria_id?: number | null;
  categorias?: { nome: string } | null;
}

/**
 * List all products, optionally filtering by categoria and/or tipo_cosmetico
 */
export async function listarProdutos(
  categoria?: string,
  tipo?: string
): Promise<{ data: Produto[] | null; error: any }> {
  let query = supabase.from('produtos').select('*, categorias(nome)');

  if (categoria && categoria !== 'Todos') {
    query = query.eq('categorias.nome', categoria);
  }
  // tipo_cosmetico not present in current table schema

  const { data, error } = await query;
  return { data, error };
}

/**
 * Fetch a single product by id
 */
export async function buscarProduto(
  id: number
): Promise<{ data: Produto | null; error: any }> {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
}

/**
 * Create or update product record. Images should already be uploaded to
 * Supabase Storage; pass the public path in the object.
 */
export async function cadastrarProduto(
  produto: Partial<Produto>
): Promise<{ data: Produto | null; error: any }> {
  const { data, error } = await supabase
    .from('produtos')
    .insert(produto)
    .select()
    .single();
  return { data, error };
}

export async function editarProduto(
  id: number,
  produto: Partial<Produto>
): Promise<{ data: Produto | null; error: any }> {
  const { data, error } = await supabase
    .from('produtos')
    .update(produto)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function excluirProduto(
  id: number
): Promise<{ data: Produto | null; error: any }> {
  const { data, error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', id)
    .single();
  return { data, error };
}
