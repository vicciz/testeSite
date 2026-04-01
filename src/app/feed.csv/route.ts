import { NextRequest } from 'next/server';
import { listarProdutos, Produto } from '@/src/services/produtos';
import { supabase } from '@/supabaseClient';

export const dynamic = 'force-static';
export const revalidate = 3600;

const BASE_URL = 'https://imbalavel.com.br';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function productRoute(prod: Produto): string {
  if (prod.link && prod.link.trim()) {
    return prod.link.startsWith('http') ? prod.link : `${BASE_URL}/produto/${prod.link}`;
  }
  return `${BASE_URL}/produto/${slugify(prod.nome || 'produto')}`;
}

function publicImageUrl(path?: string | null): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const url = supabase.storage.from('produtos').getPublicUrl(path).data.publicUrl;
  return url || '';
}

function csvEscape(value: any): string {
  if (value === undefined || value === null) return '';
  const s = String(value).replace(/\r\n|\r|\n/g, ' ');
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  const { data: produtos, error } = await listarProdutos(undefined, undefined, false);
  if (error) return new Response('Erro ao gerar CSV', { status: 500 });

  const headers = [
    'id','title','description','link','image_link',
    'additional_image_link_1','additional_image_link_2','additional_image_link_3',
    'availability','price','brand','condition','gtin','mpn'
  ];

  const rows = (produtos || []).map((p) => {
    const price = typeof p.preco === 'number' ? Number(p.preco).toFixed(2) : String(p.preco || '0').replace(',', '.');
    const images = [p.image, p.image1, p.image2, p.image3, p.image4, p.image5, p.image6].filter(Boolean) as string[];
    const imageUrls = images.map(publicImageUrl);

    const row = [
      p.id,
      p.nome || '',
      p.descricao || p.detalhes || '',
      productRoute(p),
      imageUrls[0] || '',
      imageUrls[1] || '',
      imageUrls[2] || '',
      imageUrls[3] || '',
      p.oculto ? 'out of stock' : 'in stock',
      price,
      p.fornecedor || 'Imbalavel',
      'new',
      (p as any).gtin || (p as any).ean || '',
      (p as any).mpn || '',
    ];

    return row.map(csvEscape).join(',');
  });

  const csv = `${headers.join(',')}\n${rows.join('\n')}`;

  return new Response(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'cache-control': 'public, max-age=600'
    }
  });
}
