import { supabase } from '@/supabaseClient';

export interface Categoria {
  id: number;
  nome: string;
}

export async function listarCategorias(): Promise<{ data: Categoria[] | null; error: any }> {
  const { data, error } = await supabase
    .from('categorias')
    .select('id,nome')
    .order('nome', { ascending: true });

  return { data: (data as Categoria[]) || null, error };
}
