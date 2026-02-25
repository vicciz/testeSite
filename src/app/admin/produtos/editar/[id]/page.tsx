'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditarProduto() {
  
  const params = useParams();
const id = params?.id as string;

  const [form, setForm] = useState<any>({
    nome: "",
    preco: "",
    link: "",
    rating: "",
    reviews: "",
    categoria: "",
    descricao: "",
    detalhes: "",
    fornecedor: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Carregar produto
useEffect(() => {
  if (!id) return;

  async function carregar() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/buscar-produto.php?id=${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data && data.produto) {
        const p: any = data.produto;
        const sanitized = {
          nome: p.nome ?? "",
          preco: p.preco ?? "",
          link: p.link ?? "",
          rating: p.rating ?? "",
          reviews: p.reviews ?? "",
          categoria: p.categoria ?? "",
          descricao: p.descricao ?? "",
          detalhes: p.detalhes ?? "",
          fornecedor: p.fornecedor ?? "",
          image: null,
        };

        setForm(sanitized);
      }
    } catch (error) {
      console.error("Erro ao carregar produto:", error);
    } finally {
      setLoading(false);
    }
  }

  carregar();
}, [id]);

  // 🔹 Inputs normais
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Upload imagem
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setForm({
      ...form,
      image: e.target.files[0],
    });
  };

  // 🔹 Submit correto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    formData.append("id", String(id));
    formData.append("nome", form.nome);
    formData.append("preco", form.preco);
    formData.append("link", form.link);
    formData.append("rating", form.rating);
    formData.append("reviews", form.reviews);
    formData.append("descricao", form.descricao);
    formData.append("detalhes", form.detalhes);
    formData.append("fornecedor", form.fornecedor);

    if (form.image) {
      formData.append("image", form.image);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/editar-produto.php`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data.status === "ok") {
      alert("Produto atualizado com sucesso!");
    } else {
      alert(data.msg || "Erro ao atualizar produto");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-10 text-white space-y-4 flex flex-col max-w-xl mx-auto"
    >
      <input
        name="nome"
        placeholder="Nome do produto"
        value={form.nome}
        onChange={handleChange}
        required
        className="p-2 rounded bg-gray-800"
      />

      <input
        name="fornecedor"
        placeholder="Fornecedor"
        value={form.fornecedor}
        onChange={handleChange}
        required
        className="p-2 rounded bg-gray-800"
      />

      <input
        name="preco"
        placeholder="Preço"
        value={form.preco}
        onChange={handleChange}
        required
        className="p-2 rounded bg-gray-800"
      />

      <input
        name="rating"
        placeholder="Avaliação (0-5)"
        value={form.rating}
        onChange={handleChange}
        className="p-2 rounded bg-gray-800"
      />

      <input
        name="reviews"
        placeholder="Qtd avaliações"
        value={form.reviews}
        onChange={handleChange}
        className="p-2 rounded bg-gray-800"
      />

      <input
        name="link"
        placeholder="Link do produto"
        value={form.link}
        onChange={handleChange}
        className="p-2 rounded bg-gray-800"
      />

      <textarea
        name="descricao"
        placeholder="Descrição"
        value={form.descricao}
        onChange={handleChange}
        className="p-2 rounded bg-gray-800"
      />

      <textarea
        name="detalhes"
        placeholder="Detalhes"
        value={form.detalhes}
        onChange={handleChange}
        className="p-2 rounded bg-gray-800"
      />

      <label>Imagem Principal</label>
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleFileChange}
        className="p-2"
      />

      <button
        type="submit"
        className="bg-indigo-500 px-4 py-2 rounded mt-4 hover:bg-indigo-600 transition"
        disabled={loading}
      >
        {loading ? "Atualizando..." : "Salvar Produto"}
      </button>
    </form>
  );
}