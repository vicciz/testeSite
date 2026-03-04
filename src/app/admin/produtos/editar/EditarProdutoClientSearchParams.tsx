"use client";

import { useSearchParams } from "next/navigation";
import EditarProdutoClient from "./EditarProdutoClient";

export default function EditarProdutoClientSearchParams() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";

  if (!id) {
    return <div className="text-zinc-900 p-10">ID do produto não encontrado.</div>;
  }

  return <EditarProdutoClient id={id} />;
}
