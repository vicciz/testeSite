import { notFound, redirect } from 'next/navigation';
import { decodeProductCode } from '@/src/utils/linkMask';

interface PageProps {
  params: { code: string };
}

export default function Page({ params }: PageProps) {
  const id = decodeProductCode(params.code);
  if (!id) {
    notFound();
  }
  redirect(`/produto?id=${id}`);
}
