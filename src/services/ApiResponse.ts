// src/types/ApiResponse.ts
import { Produto } from "@/src/services/produtos";

export interface ListarProdutosResponse {
  status: "ok" | "erro";
  produtos: Produto[];
}
