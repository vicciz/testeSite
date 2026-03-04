import EditarProdutoClient from '../EditarProdutoClient';

interface PageProps {
  params: { id: string };
}

export default function EditarProdutoPage({ params }: PageProps) {
  return <EditarProdutoClient id={params.id} />;
}

export function generateStaticParams() {
  return [];
}
