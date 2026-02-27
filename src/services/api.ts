// compatibility wrapper that keeps the old API shape but uses
// supabase under the hood.  Parts of the app still import from
// services/api.ts so we maintain the existing interface.

import * as prod from './produtos';

export interface Produto {
  id: number;
  nome: string;
  preco: string;
  originalPreco?: string;
  categoria: string;
  image: string;
  image1?: string;
  image2?: string;
  image3?: string;
  rating?: string;
  reviews?: number;
  descricao?: string;
  detalhes?: string;
  link?: string;
}

export async function listarProdutos(): Promise<any> {
  const { data, error } = await prod.listarProdutos();
  if (error) {
    return { status: 'error', error };
  }
  return { status: 'ok', produtos: data || [] };
}

export async function buscarProduto(id: number): Promise<any> {
  const { data, error } = await prod.buscarProduto(id);
  if (error) {
    return { status: 'error', error };
  }
  return { status: 'ok', produto: data };
}

export async function cadastrarProduto(produto: any): Promise<any> {
  const { data, error } = await prod.cadastrarProduto(produto);
  if (error) {
    return { status: 'error', error };
  }
  return { status: 'ok', produto: data };
}

export async function editarProduto(id: number, produto: any): Promise<any> {
  const { data, error } = await prod.editarProduto(id, produto);
  if (error) {
    return { status: 'error', error };
  }
  return { status: 'ok', produto: data };
}

export async function excluirProduto(id: number): Promise<any> {
  const { data, error } = await prod.excluirProduto(id);
  if (error) {
    return { status: 'error', error };
  }
  return { status: 'ok', produto: data };
}
