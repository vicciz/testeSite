
 export interface Produto {
  id: number;

  nome: string;
  preco: string;
  link: string;

  rating: number | null;
  reviews: number | null;

  image: string | null;

  categoria: string | null;

  descricao: string;
  detalhes: string;

  imagem1: string | null;
  imagem2: string | null;
  imagem3: string | null;

  fornecedor: string | null;
}


export async function cadastrarProduto(produto: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cadastrar-produto.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(produto)
  });

  return res.json();
}

export async function listarProdutos(categoria?: string, tipo?: string) {
  const params = new URLSearchParams();

  if (categoria && categoria !== 'Todos') params.append('categoria', categoria);
  if (tipo && tipo !== 'Todos') params.append('tipo_cosmetico', tipo);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listar-produtos.php?${params.toString()}`);
  return res.json();
}


export async function excluirProduto(id: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/excluir-produto.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  });

  return res.json();
}
