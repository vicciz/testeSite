"use client";
import { useState } from "react";
import { cadastrarProduto } from '@/src/services/produtos';
import { supabase } from '@/supabaseClient';

export default function CadastrarProduto() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [detalhes, setDetalhes] = useState("");
  const [fornecedor, setFornecedor] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

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

      // 2) Create product record with the uploaded file path
      const { data, error } = await cadastrarProduto({
        nome,
        preco,
        descricao,
        detalhes,
        fornecedor,
        link,
        image: uploadData.path
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 p-6 bg-zinc-900 rounded-xl"
      >
        <h1 className="text-xl font-bold">Cadastrar Produto</h1>

        <input
          className="w-full p-3 rounded bg-zinc-800"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          className="w-full p-3 rounded bg-zinc-800"
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />

        <input
          className="w-full p-3 rounded bg-zinc-800"
          placeholder="Link do Produto"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          className="w-full p-3 rounded bg-zinc-800 text-white"
          onChange={(e) => {
            if (e.target.files) setImageFile(e.target.files[0]);
          }}
        />

        <textarea
          className="w-full p-3 rounded bg-zinc-800"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <textarea
          className="w-full p-3 rounded bg-zinc-800"
          placeholder="Detalhes"
          value={detalhes}
          onChange={(e) => setDetalhes(e.target.value)}
        />

        <input
          className="w-full p-3 rounded bg-zinc-800"
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
