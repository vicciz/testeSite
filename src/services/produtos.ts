// services/produtos.ts – wrapper around Supabase table `produtos`
import { supabase } from '../../supabaseClient';

export interface Produto {
  id: number;
  nome: string;
  preco: string;
  originalPreco?: string;
  categoria: string;
  image: string | null;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  rating?: string;
  reviews?: number;
  descricao?: string;
  detalhes?: string;
  link?: string;
  fornecedor?: string | null;
}

/**
 * List all products, optionally filtering by categoria and/or tipo_cosmetico
 */
export async function listarProdutos(
  categoria?: string,
  tipo?: string
): Promise<{ data: Produto[] | null; error: any }> {
  let query = supabase.from('produtos').select('*');

  if (categoria && categoria !== 'Todos') {
    query = query.eq('categoria', categoria);
  }
  if (tipo && tipo !== 'Todos') {
    query = query.eq('tipo_cosmetico', tipo);
  }

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
