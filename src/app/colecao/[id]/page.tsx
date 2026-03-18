import ColecaoClient from './ColecaoClient';
import { supabase } from '@/supabaseClient';

export async function generateStaticParams() {
  const { data } = await supabase
    .from('colecao')
    .select('id');

  return (data || []).map((c: any) => ({ id: String(c.id) }));
}

export default function ColecaoPage() {
  return <ColecaoClient />;
}
