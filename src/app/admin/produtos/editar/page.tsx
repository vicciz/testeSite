import React, { Suspense } from 'react';
import EditarProdutoClient from './EditarProdutoClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-zinc-900 p-10">Carregando...</div>}>
      <EditarProdutoClient />
    </Suspense>
  );
}
