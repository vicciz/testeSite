import React, { Suspense } from 'react';
import EditarProdutoClient from './EditarProdutoClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-10">Carregando...</div>}>
      <EditarProdutoClient />
    </Suspense>
  );
}
