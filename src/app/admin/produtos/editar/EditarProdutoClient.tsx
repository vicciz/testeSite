"use client";

import { useEffect, useRef, useState } from "react";
import { buscarProduto, editarProduto } from '@/src/services/produtos';
import { listarCategorias, Categoria } from '@/src/services/categorias';
import { supabase } from '@/supabaseClient';

interface EditarProdutoProps {
  id: string;
}

export default function EditarProduto({ id: idProp }: EditarProdutoProps) {
  const id = idProp ?? "";

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
    imagem_detalhe: null,
    image1: null,
    image2: null,
    image3: null,
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [imagemPrincipalAtual, setImagemPrincipalAtual] = useState<string | null>(null);
  const [imagemDetalheAtual, setImagemDetalheAtual] = useState<string | null>(null);
  const [previewImagemPrincipal, setPreviewImagemPrincipal] = useState<string | null>(null);
  const [previewImagemDetalhe, setPreviewImagemDetalhe] = useState<string | null>(null);
  const [imagemExtraAtual1, setImagemExtraAtual1] = useState<string | null>(null);
  const [imagemExtraAtual2, setImagemExtraAtual2] = useState<string | null>(null);
  const [imagemExtraAtual3, setImagemExtraAtual3] = useState<string | null>(null);
  const [previewImagemExtra1, setPreviewImagemExtra1] = useState<string | null>(null);
  const [previewImagemExtra2, setPreviewImagemExtra2] = useState<string | null>(null);
  const [previewImagemExtra3, setPreviewImagemExtra3] = useState<string | null>(null);
  const detalhesRef = useRef<HTMLTextAreaElement | null>(null);

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
          const getPublicUrl = (path?: string | null) => {
            if (!path) return null;
            return path.startsWith('http')
              ? path
              : supabase.storage.from('produtos').getPublicUrl(path).data.publicUrl;
          };

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
            imagem_detalhe: null,
            image1: null,
            image2: null,
            image3: null,
          };

          setForm(sanitized);
          setImagemPrincipalAtual(getPublicUrl(produto.image));
          setImagemDetalheAtual(getPublicUrl(produto.imagem_detalhe));
          setImagemExtraAtual1(getPublicUrl((produto as any).image1));
          setImagemExtraAtual2(getPublicUrl((produto as any).image2));
          setImagemExtraAtual3(getPublicUrl((produto as any).image3));
          setPreviewImagemPrincipal(null);
          setPreviewImagemDetalhe(null);
          setPreviewImagemExtra1(null);
          setPreviewImagemExtra2(null);
          setPreviewImagemExtra3(null);
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

  const applyWrap = (before: string, after: string = before) => {
    const el = detalhesRef.current;
    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const value = el.value;
    const selected = value.slice(start, end);
    const nextValue = value.slice(0, start) + before + selected + after + value.slice(end);

    setForm({
      ...form,
      detalhes: nextValue,
    });

    requestAnimationFrame(() => {
      const cursorStart = start + before.length;
      const cursorEnd = cursorStart + selected.length;
      el.focus();
      el.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const insertText = (text: string) => {
    const el = detalhesRef.current;
    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const value = el.value;
    const nextValue = value.slice(0, start) + text + value.slice(end);

    setForm({
      ...form,
      detalhes: nextValue,
    });

    requestAnimationFrame(() => {
      const cursor = start + text.length;
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    if (file) {
      setPreviewImagemPrincipal(URL.createObjectURL(file));
    }

    setForm({
      ...form,
      image: file,
    });
  };

  const handleDetailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    if (file) {
      setPreviewImagemDetalhe(URL.createObjectURL(file));
    }

    setForm({
      ...form,
      imagem_detalhe: file,
    });
  };

  const handleExtraFileChange = (index: 1 | 2 | 3) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    if (!file) return;

    if (index === 1) setPreviewImagemExtra1(URL.createObjectURL(file));
    if (index === 2) setPreviewImagemExtra2(URL.createObjectURL(file));
    if (index === 3) setPreviewImagemExtra3(URL.createObjectURL(file));

    setForm({
      ...form,
      [`image${index}`]: file,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!id) {
      alert('ID do produto inválido.');
      setLoading(false);
      return;
    }

    try {
      let imagePath = undefined;
      let detailImagePath = undefined;
      let extraImage1Path = undefined;
      let extraImage2Path = undefined;
      let extraImage3Path = undefined;

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
          alert(`Erro ao fazer upload da imagem: ${uploadError.message}`);
          setLoading(false);
          return;
        }

        imagePath = uploadData.path;
      }

      if (form.imagem_detalhe) {
        const detailFileName = `${Date.now()}-${form.imagem_detalhe.name}`;
        const { data: detailUploadData, error: detailUploadError } = await supabase.storage
          .from('produtos')
          .upload(detailFileName, form.imagem_detalhe, {
            cacheControl: '3600',
            upsert: false
          });

        if (detailUploadError) {
          console.error('Erro ao fazer upload da imagem detalhe:', detailUploadError);
          alert(`Erro ao fazer upload da imagem detalhe: ${detailUploadError.message}`);
          setLoading(false);
          return;
        }

        detailImagePath = detailUploadData.path;
      }

      if (form.image1) {
        const fileName = `${Date.now()}-${form.image1.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('produtos')
          .upload(fileName, form.image1, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Erro ao fazer upload da imagem extra 1:', uploadError);
          alert(`Erro ao fazer upload da imagem extra 1: ${uploadError.message}`);
          setLoading(false);
          return;
        }

        extraImage1Path = uploadData.path;
      }

      if (form.image2) {
        const fileName = `${Date.now()}-${form.image2.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('produtos')
          .upload(fileName, form.image2, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Erro ao fazer upload da imagem extra 2:', uploadError);
          alert(`Erro ao fazer upload da imagem extra 2: ${uploadError.message}`);
          setLoading(false);
          return;
        }

        extraImage2Path = uploadData.path;
      }

      if (form.image3) {
        const fileName = `${Date.now()}-${form.image3.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('produtos')
          .upload(fileName, form.image3, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Erro ao fazer upload da imagem extra 3:', uploadError);
          alert(`Erro ao fazer upload da imagem extra 3: ${uploadError.message}`);
          setLoading(false);
          return;
        }

        extraImage3Path = uploadData.path;
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

      if (detailImagePath) {
        updateData.imagem_detalhe = detailImagePath;
      }

      if (extraImage1Path) {
        updateData.image1 = extraImage1Path;
      }

      if (extraImage2Path) {
        updateData.image2 = extraImage2Path;
      }

      if (extraImage3Path) {
        updateData.image3 = extraImage3Path;
      }

      const { data, error } = await editarProduto(Number(id), updateData);
      setLoading(false);

      if (error) {
        console.error('Erro ao atualizar:', error);
        alert(`Erro ao atualizar produto: ${error.message}`);
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
      className="p-10 text-zinc-900 space-y-4 flex flex-col max-w-xl mx-auto"
    >
      <input
        name="nome"
        placeholder="Nome do produto"
        value={form.nome}
        onChange={handleChange}
        required
        className="p-2 rounded bg-slate-100 border border-black/10"
      />

      <input
        name="fornecedor"
        placeholder="Fornecedor"
        value={form.fornecedor}
        onChange={handleChange}
        required
        className="p-2 rounded bg-slate-100 border border-black/10"
      />

      <input
        name="preco"
        placeholder="Preço"
        value={form.preco}
        onChange={handleChange}
        required
        className="p-2 rounded bg-slate-100 border border-black/10"
      />

      <input
        name="rating"
        placeholder="Avaliação (0-5)"
        value={form.rating}
        onChange={handleChange}
        className="p-2 rounded bg-slate-100 border border-black/10"
      />

      <input
        name="reviews"
        placeholder="Qtd avaliações"
        value={form.reviews}
        onChange={handleChange}
        className="p-2 rounded bg-slate-100 border border-black/10"
      />

      <input
        name="link"
        placeholder="Link do produto"
        value={form.link}
        onChange={handleChange}
        className="p-2 rounded bg-slate-100 border border-black/10"
      />

      <select
        name="categoria_id"
        value={form.categoria_id}
        onChange={handleChange}
        className="p-2 rounded bg-slate-100 border border-black/10"
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
        className="p-2 rounded bg-slate-100 border border-black/10"
      />

      <div className="bg-white border border-black/10 rounded p-3">
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            type="button"
            onClick={() => insertText("# ")}
            className="px-3 py-1 rounded bg-slate-100 text-xs"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => insertText("## ")}
            className="px-3 py-1 rounded bg-slate-100 text-xs"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => insertText("### ")}
            className="px-3 py-1 rounded bg-slate-100 text-xs"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => applyWrap("**")}
            className="px-3 py-1 rounded bg-slate-100 text-xs font-bold"
          >
            Negrito
          </button>
          <button
            type="button"
            onClick={() => applyWrap("~~")}
            className="px-3 py-1 rounded bg-slate-100 text-xs line-through"
          >
            Riscado
          </button>
          <div className="flex items-center gap-1">
            {['🔥', '✨', '✅', '⭐', '🧴', '🛍️'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => insertText(emoji)}
                className="px-2 py-1 rounded bg-slate-100 text-sm"
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => applyWrap('<span style="color:#e11d48">', '</span>')}
              className="px-2 py-1 rounded bg-slate-100 text-xs text-rose-600"
            >
              Vermelho
            </button>
            <button
              type="button"
              onClick={() => applyWrap('<span style="color:#2563eb">', '</span>')}
              className="px-2 py-1 rounded bg-slate-100 text-xs text-blue-600"
            >
              Azul
            </button>
            <button
              type="button"
              onClick={() => applyWrap('<span style="color:#16a34a">', '</span>')}
              className="px-2 py-1 rounded bg-slate-100 text-xs text-green-600"
            >
              Verde
            </button>
            <button
              type="button"
              onClick={() => applyWrap('<span style="color:#f59e0b">', '</span>')}
              className="px-2 py-1 rounded bg-slate-100 text-xs text-amber-600"
            >
              Amarelo
            </button>
          </div>
        </div>

        <textarea
        name="detalhes"
        placeholder="Descrição longa"
        value={form.detalhes}
        onChange={handleChange}
        ref={detalhesRef}
        className="w-full p-2 rounded bg-slate-50 border border-black/10 min-h-[160px]"
        />
      </div>

      <label>Imagem Principal</label>
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleFileChange}
        className="p-2"
      />

      <label>Imagem Detalhe</label>
      <input
        type="file"
        name="imagem_detalhe"
        accept="image/*"
        onChange={handleDetailFileChange}
        className="p-2"
      />

      <label>Galeria de imagens (opcional)</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleExtraFileChange(1)}
          className="p-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleExtraFileChange(2)}
          className="p-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleExtraFileChange(3)}
          className="p-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-black/10 p-3">
          <p className="text-sm text-zinc-600 mb-2">Imagem principal</p>
          {previewImagemPrincipal || imagemPrincipalAtual ? (
            <img
              src={previewImagemPrincipal || imagemPrincipalAtual || ''}
              alt="Imagem principal"
              className="w-full h-52 object-contain rounded-lg bg-white"
            />
          ) : (
            <div className="w-full h-52 rounded-lg bg-slate-100 border border-black/10 flex items-center justify-center text-sm text-zinc-500">
              Sem imagem
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl border border-black/10 p-3">
          <p className="text-sm text-zinc-600 mb-2">Imagem detalhe</p>
          {previewImagemDetalhe || imagemDetalheAtual ? (
            <img
              src={previewImagemDetalhe || imagemDetalheAtual || ''}
              alt="Imagem detalhe"
              className="w-full h-52 object-contain rounded-lg bg-white"
            />
          ) : (
            <div className="w-full h-52 rounded-lg bg-slate-100 border border-black/10 flex items-center justify-center text-sm text-zinc-500">
              Sem imagem
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-black/10 p-3">
          <p className="text-sm text-zinc-600 mb-2">Imagem extra 1</p>
          {previewImagemExtra1 || imagemExtraAtual1 ? (
            <img
              src={previewImagemExtra1 || imagemExtraAtual1 || ''}
              alt="Imagem extra 1"
              className="w-full h-40 object-contain rounded-lg bg-white"
            />
          ) : (
            <div className="w-full h-40 rounded-lg bg-slate-100 border border-black/10 flex items-center justify-center text-sm text-zinc-500">
              Sem imagem
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl border border-black/10 p-3">
          <p className="text-sm text-zinc-600 mb-2">Imagem extra 2</p>
          {previewImagemExtra2 || imagemExtraAtual2 ? (
            <img
              src={previewImagemExtra2 || imagemExtraAtual2 || ''}
              alt="Imagem extra 2"
              className="w-full h-40 object-contain rounded-lg bg-white"
            />
          ) : (
            <div className="w-full h-40 rounded-lg bg-slate-100 border border-black/10 flex items-center justify-center text-sm text-zinc-500">
              Sem imagem
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl border border-black/10 p-3">
          <p className="text-sm text-zinc-600 mb-2">Imagem extra 3</p>
          {previewImagemExtra3 || imagemExtraAtual3 ? (
            <img
              src={previewImagemExtra3 || imagemExtraAtual3 || ''}
              alt="Imagem extra 3"
              className="w-full h-40 object-contain rounded-lg bg-white"
            />
          ) : (
            <div className="w-full h-40 rounded-lg bg-slate-100 border border-black/10 flex items-center justify-center text-sm text-zinc-500">
              Sem imagem
            </div>
          )}
        </div>
      </div>

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
