"use client";
import { useEffect, useState } from "react";
import { cadastrarProduto } from '@/src/services/produtos';
import { listarCategorias, Categoria } from '@/src/services/categorias';
import { supabase } from '@/supabaseClient';

export default function CadastrarProduto() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [detailImageFile, setDetailImageFile] = useState<File | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    async function carregarCategorias() {
      const { data, error } = await listarCategorias();
      if (!error && data) setCategorias(data);
    }
    carregarCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Selecione uma imagem!");
      return;
    }

    try {
      // 1) Upload image to Supabase Storage
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('produtos')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Erro ao fazer upload:', uploadError);
        alert('Erro ao fazer upload da imagem');
        return;
      }

      let detailImagePath: string | undefined = undefined;

      if (detailImageFile) {
        const detailFileName = `${Date.now()}-${detailImageFile.name}`;
        const { data: detailUploadData, error: detailUploadError } = await supabase.storage
          .from('produtos')
          .upload(detailFileName, detailImageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (detailUploadError) {
          console.error('Erro ao fazer upload da imagem detalhe:', detailUploadError);
          alert('Erro ao fazer upload da imagem detalhe');
          return;
        }

        detailImagePath = detailUploadData.path;
      }

      // 2) Create product record with the uploaded file path
      const { data, error } = await cadastrarProduto({
        nome,
        preco,
        descricao,
        detalhes,
        fornecedor,
        link,
        ...(categoriaId ? { categoria_id: Number(categoriaId) } : {}),
        image: uploadData.path,
        ...(detailImagePath ? { imagem_detalhe: detailImagePath } : {})
      });

      if (error) {
        console.error('Erro ao cadastrar produto:', error);
        alert('Erro ao cadastrar produto');
        return;
      }

      alert('Produto cadastrado com sucesso!');
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao conectar com o servidor');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 p-6 bg-white border border-black/10 rounded-xl shadow-lg"
      >
        <h1 className="text-xl font-bold">Cadastrar Produto</h1>

        <input
          className="w-full p-3 rounded bg-slate-100 border border-black/10"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          className="w-full p-3 rounded bg-slate-100 border border-black/10"
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />

        <input
          className="w-full p-3 rounded bg-slate-100 border border-black/10"
          placeholder="Link do Produto"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          className="w-full p-3 rounded bg-slate-100 border border-black/10"
          onChange={(e) => {
            if (e.target.files) setImageFile(e.target.files[0]);
          }}
        />

        <label className="text-sm text-zinc-700">Imagem detalhe (opcional)</label>

        <input
          type="file"
          accept="image/*"
          className="w-full p-3 rounded bg-slate-100 border border-black/10"
          onChange={(e) => {
            if (e.target.files) setDetailImageFile(e.target.files[0]);
          }}
        />

        <textarea
          className="w-full p-3 rounded bg-slate-100 border border-black/10"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <textarea
          className="w-full p-3 rounded bg-slate-100 border border-black/10"
          placeholder="Detalhes"
          value={detalhes}
          onChange={(e) => setDetalhes(e.target.value)}
        />

        <select
          className="w-full p-3 rounded bg-slate-100 border border-black/10"
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
        >
          <option value="">Selecione a categoria</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>

        <input
          className="w-full p-3 rounded bg-slate-100 border border-black/10"
          placeholder="Fornecedor"
          value={fornecedor}
          onChange={(e) => setFornecedor(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded font-semibold"
        >
          Salvar Produto
        </button>
      </form>
    </div>
  );
}
