// src/services/produtos.ts
const API_URL = "http://10.0.0.120/api";

export interface Produto {
  id: number;
  nome: string;
  preco: string;
  originalPreco?: string;
  categoria: string;
  image: string;
  image1?: string;
  image2?: string;
  image3?: string;
  rating?: string;
  reviews?: number;
  descricao?: string;
  detalhes?: string;
  link?: string;
}

/* =========================
   LISTAR PRODUTOS
========================= */
export async function listarProdutos(): Promise<any> {
  const res = await fetch(`${API_URL}/listar-produtos.php`);
  return res.json();
}

/* =========================
   BUSCAR PRODUTO POR ID
========================= */
export async function buscarProduto(id: number): Promise<any> {
  const res = await fetch(`${API_URL}/produto.php?id=${id}`);
  return res.json();
}

/* =========================
   CADASTRAR PRODUTO
   (usando FormData para imagens)
========================= */
export async function cadastrarProduto(produto: any): Promise<any> {
  const formData = new FormData();

  Object.keys(produto).forEach(key => {
    const value = produto[key];
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  const res = await fetch(`${API_URL}/cadastrar-produto.php`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}

/* =========================
   EDITAR PRODUTO
   (usando FormData para imagens)
========================= */
export async function editarProduto(id: number, produto: any): Promise<any> {
  const formData = new FormData();

  formData.append("id", id.toString());

  Object.keys(produto).forEach(key => {
    const value = produto[key];
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  const res = await fetch(`${API_URL}/editar-produto.php`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}

/* =========================
   EXCLUIR PRODUTO
========================= */
export async function excluirProduto(id: number): Promise<any> {
  const res = await fetch(`${API_URL}/excluir-produto.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  return res.json();
}
