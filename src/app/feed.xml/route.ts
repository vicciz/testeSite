import { NextRequest } from 'next/server';
import { listarProdutos, Produto } from '@/src/services/produtos';
import { supabase } from '@/supabaseClient';

export const dynamic = 'force-static';
export const revalidate = 3600; // 1h

const BASE_URL = 'https://imbalavel.com.br';

function sanitize(value: any): string {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

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

export async function GET(req: NextRequest) {
  const { data: produtos, error } = await listarProdutos(undefined, undefined, false);

  if (error) {
    return new Response('Erro ao gerar o feed', { status: 500 });
  }

  const itemsXml = (produtos || [])
    .map((p) => {
      const price = typeof p.preco === 'number' ? Number(p.preco).toFixed(2) : String(p.preco || '0').replace(',', '.');

      // primary image + additional images
      const images = [p.image, p.image1, p.image2, p.image3, p.image4, p.image5, p.image6].filter(Boolean) as string[];
      const imageUrls = images.map((img) => publicImageUrl(img));

      const additionalImagesXml = imageUrls.slice(1).map((u) => `    <additional_image_link>${sanitize(u)}</additional_image_link>`).join('\n');

      // optional identifiers
      const gtin = (p as any).gtin || (p as any).ean || '';
      const mpn = (p as any).mpn || '';

      return `  <item>
    <id>${sanitize(p.id)}</id>
    <title>${sanitize(p.nome || '')}</title>
    <description>${sanitize(p.descricao || p.detalhes || '')}</description>
    <link>${sanitize(productRoute(p))}</link>
    <image_link>${sanitize(imageUrls[0] || '')}</image_link>
${additionalImagesXml ? additionalImagesXml + '\n' : ''}    <availability>${p.oculto ? 'out of stock' : 'in stock'}</availability>
    <price>${sanitize(price)} BRL</price>
    <brand>${sanitize(p.fornecedor || 'Imbalavel')}</brand>
    <condition>new</condition>
    ${gtin ? `<gtin>${sanitize(gtin)}</gtin>` : ''}${mpn ? `\n    <mpn>${sanitize(mpn)}</mpn>` : ''}
  </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<products>\n${itemsXml}\n</products>`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=600',
    },
  });
}
