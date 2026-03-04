import EditarProdutoClient from '../EditarProdutoClient';
import { supabase } from '@/supabaseClient';

interface PageProps {
  params: { id: string };
}

export default function EditarProdutoPage({ params }: PageProps) {
  return <EditarProdutoClient id={params.id} />;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const { data, error } = await supabase.from('produtos').select('id');
    if (error || !data) return [];
    return data.map((p) => ({ id: String(p.id) }));
  } catch {
    return [];
  }
}
