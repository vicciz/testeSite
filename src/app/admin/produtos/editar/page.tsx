import React, { Suspense } from 'react';
import EditarProdutoClientSearchParams from './EditarProdutoClientSearchParams';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-zinc-900 p-10">Carregando...</div>}>
      <EditarProdutoClientSearchParams />
    </Suspense>
  );
}
