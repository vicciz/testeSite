"use client";
import { useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
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
  const [colecaoId, setColecaoId] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [detailImageFile, setDetailImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewDetailImage, setPreviewDetailImage] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropTarget, setCropTarget] = useState<"principal" | "detalhe" | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropAspect, setCropAspect] = useState(4 / 5);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [colecoes, setColecoes] = useState<{ id: number; nome: string }[]>([]);

  useEffect(() => {
    async function carregarCategorias() {
      const { data, error } = await listarCategorias();
      if (!error && data) setCategorias(data);
    }
    async function carregarColecoes() {
      const { data, error } = await supabase
        .from('colecao')
        .select('id,nome')
        .order('nome', { ascending: true });
      if (!error && data) setColecoes(data as { id: number; nome: string }[]);
    }
    carregarCategorias();
    carregarColecoes();
  }, []);

  const onCropComplete = (_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedBlob = async (imageSrc: string, pixelCrop: Area) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
    });
  };

  const openCropper = (file: File, target: "principal" | "detalhe") => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setCropTarget(target);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropAspect(4 / 5);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const aplicarCrop = async () => {
    if (!cropImageSrc || !croppedAreaPixels || !cropTarget) {
      setCropOpen(false);
      return;
    }

    const blob = await getCroppedBlob(cropImageSrc, croppedAreaPixels);
    if (!blob) {
      setCropOpen(false);
      return;
    }

    const file = new File([blob], `crop-${Date.now()}.jpg`, { type: 'image/jpeg' });
    const previewUrl = URL.createObjectURL(file);

    if (cropTarget === "principal") {
      setImageFile(file);
      setPreviewImage(previewUrl);
    } else {
      setDetailImageFile(file);
      setPreviewDetailImage(previewUrl);
    }

    setCropOpen(false);
  };

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

      if (colecaoId && data?.id) {
        const { error: relacaoError } = await supabase
          .from('colecao_produto')
          .insert({ colecao_id: Number(colecaoId), produto_id: data.id });

        if (relacaoError) {
          console.error('Erro ao vincular coleção:', relacaoError);
          alert('Produto cadastrado, mas não foi possível vincular à coleção.' );
          return;
        }
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
            if (e.target.files?.[0]) openCropper(e.target.files[0], "principal");
          }}
        />

        {previewImage && (
          <img
            src={previewImage}
            alt="Prévia imagem principal"
            className="w-full h-48 object-cover rounded-lg border border-black/10"
          />
        )}

        <label className="text-sm text-zinc-700">Imagem detalhe (opcional)</label>

        <input
          type="file"
          accept="image/*"
          className="w-full p-3 rounded bg-slate-100 border border-black/10"
          onChange={(e) => {
            if (e.target.files?.[0]) openCropper(e.target.files[0], "detalhe");
          }}
        />

        {previewDetailImage && (
          <img
            src={previewDetailImage}
            alt="Prévia imagem detalhe"
            className="w-full h-48 object-cover rounded-lg border border-black/10"
          />
        )}

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

        <select
          className="w-full p-3 rounded bg-slate-100 border border-black/10"
          value={colecaoId}
          onChange={(e) => setColecaoId(e.target.value)}
        >
          <option value="">Coleção (opcional)</option>
          {colecoes.map((c) => (
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

        {cropOpen && cropImageSrc && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-4 w-full max-w-3xl">
              <div className="relative w-full h-[60vh] bg-black/10 rounded-xl overflow-hidden">
                <Cropper
                  image={cropImageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={cropAspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-zinc-600">Dimensão:</span>
                  <button
                    type="button"
                    onClick={() => setCropAspect(1)}
                    className={`px-2 py-1 rounded text-xs border ${cropAspect === 1 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 border-slate-200'}`}
                  >
                    1:1
                  </button>
                  <button
                    type="button"
                    onClick={() => setCropAspect(4 / 5)}
                    className={`px-2 py-1 rounded text-xs border ${cropAspect === 4 / 5 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 border-slate-200'}`}
                  >
                    4:5
                  </button>
                  <button
                    type="button"
                    onClick={() => setCropAspect(16 / 9)}
                    className={`px-2 py-1 rounded text-xs border ${cropAspect === 16 / 9 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 border-slate-200'}`}
                  >
                    16:9
                  </button>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-40"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCropOpen(false)}
                    className="px-4 py-2 rounded bg-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={aplicarCrop}
                    className="px-4 py-2 rounded bg-indigo-600 text-white"
                  >
                    Usar imagem
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
