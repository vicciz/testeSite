"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { buscarProduto, editarProduto } from '@/src/services/produtos';
import { listarCategorias, Categoria } from '@/src/services/categorias';
import { supabase } from '@/supabaseClient';

export default function EditarProduto() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";

  const [form, setForm] = useState<any>({
    nome: "",
    preco: "",
    link: "",
    rating: "",
    reviews: "",
    categoria_id: "",
    descricao: "",
    detalhes: "",
    fornecedor: "",
    image: null,
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function carregar() {
      setLoading(true);
      try {
        const { data: cats } = await listarCategorias();
        if (cats) setCategorias(cats);

        const { data: produto, error } = await buscarProduto(Number(id));
        if (error) throw error;

        if (produto) {
          const sanitized = {
            nome: produto.nome ?? "",
            preco: produto.preco ?? "",
            link: produto.link ?? "",
            rating: produto.rating ?? "",
            reviews: produto.reviews ?? "",
            categoria_id: produto.categoria_id ?? "",
            descricao: produto.descricao ?? "",
            detalhes: produto.detalhes ?? "",
            fornecedor: produto.fornecedor ?? "",
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    setForm({
      ...form,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imagePath = undefined;

      // Upload new image if provided
      if (form.image) {
        const fileName = `${Date.now()}-${form.image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('produtos')
          .upload(fileName, form.image, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Erro ao fazer upload:', uploadError);
          alert('Erro ao fazer upload da imagem');
          setLoading(false);
          return;
        }

        imagePath = uploadData.path;
      }

      const updateData: any = {
        nome: form.nome,
        preco: form.preco,
        link: form.link,
        rating: form.rating,
        reviews: form.reviews,
        descricao: form.descricao,
        detalhes: form.detalhes,
        fornecedor: form.fornecedor,
        ...(form.categoria_id ? { categoria_id: Number(form.categoria_id) } : {}),
      };

      if (imagePath) {
        updateData.image = imagePath;
      }

      const { data, error } = await editarProduto(Number(id), updateData);
      setLoading(false);

      if (error) {
        console.error('Erro ao atualizar:', error);
        alert('Erro ao atualizar produto');
        return;
      }

      alert('Produto atualizado com sucesso!');
    } catch (err) {
      console.error('Erro:', err);
      setLoading(false);
      alert('Erro ao atualizar produto');
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

      <select
        name="categoria_id"
        value={form.categoria_id}
        onChange={handleChange}
        className="p-2 rounded bg-gray-800"
      >
        <option value="">Selecione a categoria</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nome}
          </option>
        ))}
      </select>

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
