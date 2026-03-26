"use client";

import { useEffect, useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
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
    image4: null,
    image5: null,
    image6: null,
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [imagemPrincipalAtual, setImagemPrincipalAtual] = useState<string | null>(null);
  const [imagemDetalheAtual, setImagemDetalheAtual] = useState<string | null>(null);
  const [previewImagemPrincipal, setPreviewImagemPrincipal] = useState<string | null>(null);
  const [previewImagemDetalhe, setPreviewImagemDetalhe] = useState<string | null>(null);
  const [imagemExtraAtual1, setImagemExtraAtual1] = useState<string | null>(null);
  const [imagemExtraAtual2, setImagemExtraAtual2] = useState<string | null>(null);
  const [imagemExtraAtual3, setImagemExtraAtual3] = useState<string | null>(null);
  const [imagemExtraAtual4, setImagemExtraAtual4] = useState<string | null>(null);
  const [imagemExtraAtual5, setImagemExtraAtual5] = useState<string | null>(null);
  const [imagemExtraAtual6, setImagemExtraAtual6] = useState<string | null>(null);
  const [previewImagemExtra1, setPreviewImagemExtra1] = useState<string | null>(null);
  const [previewImagemExtra2, setPreviewImagemExtra2] = useState<string | null>(null);
  const [previewImagemExtra3, setPreviewImagemExtra3] = useState<string | null>(null);
  const [previewImagemExtra4, setPreviewImagemExtra4] = useState<string | null>(null);
  const [previewImagemExtra5, setPreviewImagemExtra5] = useState<string | null>(null);
  const [previewImagemExtra6, setPreviewImagemExtra6] = useState<string | null>(null);
  const detalhesRef = useRef<HTMLTextAreaElement | null>(null);
  const detalhesSelectionRef = useRef({ start: 0, end: 0 });
  const detalhesHistoryRef = useRef<string[]>([""]);
  const detalhesHistoryIndexRef = useRef(0);
  const detalhesImagemInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingDetalhesImagem, setUploadingDetalhesImagem] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropTarget, setCropTarget] = useState<"principal" | "detalhe" | "extra1" | "extra2" | "extra3" | "extra4" | "extra5" | "extra6" | null>(null);
  const [cropAspect, setCropAspect] = useState(4 / 5);

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
            image4: null,
            image5: null,
            image6: null,
          };

          setForm(sanitized);
          detalhesHistoryRef.current = [sanitized.detalhes ?? ""];
          detalhesHistoryIndexRef.current = 0;
          setImagemPrincipalAtual(getPublicUrl(produto.image));
          setImagemDetalheAtual(getPublicUrl(produto.imagem_detalhe));
          setImagemExtraAtual1(getPublicUrl((produto as any).image1));
          setImagemExtraAtual2(getPublicUrl((produto as any).image2));
          setImagemExtraAtual3(getPublicUrl((produto as any).image3));
          setImagemExtraAtual4(getPublicUrl((produto as any).image4));
          setImagemExtraAtual5(getPublicUrl((produto as any).image5));
          setImagemExtraAtual6(getPublicUrl((produto as any).image6));
          setPreviewImagemPrincipal(null);
          setPreviewImagemDetalhe(null);
          setPreviewImagemExtra1(null);
          setPreviewImagemExtra2(null);
          setPreviewImagemExtra3(null);
          setPreviewImagemExtra4(null);
          setPreviewImagemExtra5(null);
          setPreviewImagemExtra6(null);
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
    if (e.target.name === 'detalhes') {
      updateDetalhes(e.target.value, {
        pushHistory: true,
      });
      return;
    }

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const pushDetalhesHistory = (value: string) => {
    const current = detalhesHistoryRef.current[detalhesHistoryIndexRef.current];
    if (current === value) return;

    const nextHistory = detalhesHistoryRef.current.slice(0, detalhesHistoryIndexRef.current + 1);
    nextHistory.push(value);

    if (nextHistory.length > 100) {
      nextHistory.shift();
    } else {
      detalhesHistoryIndexRef.current += 1;
    }

    if (nextHistory.length === 100 && detalhesHistoryIndexRef.current >= nextHistory.length) {
      detalhesHistoryIndexRef.current = nextHistory.length - 1;
    }

    detalhesHistoryRef.current = nextHistory;
  };

  const updateDetalhes = (
    nextValue: string,
    options?: {
      selectionStart?: number;
      selectionEnd?: number;
      pushHistory?: boolean;
    }
  ) => {
    setForm((prev: any) => ({
      ...prev,
      detalhes: nextValue,
    }));

    if (options?.pushHistory !== false) {
      pushDetalhesHistory(nextValue);
    }

    if (typeof options?.selectionStart === 'number' && typeof options?.selectionEnd === 'number') {
      restoreDetalhesSelection(options.selectionStart, options.selectionEnd);
    }
  };

  const saveDetalhesSelection = () => {
    const el = detalhesRef.current;
    if (!el) return;

    detalhesSelectionRef.current = {
      start: el.selectionStart ?? 0,
      end: el.selectionEnd ?? 0,
    };
  };

  const getDetalhesSelection = () => {
    const el = detalhesRef.current;
    if (!el) return detalhesSelectionRef.current;

    if (document.activeElement === el) {
      return {
        start: el.selectionStart ?? 0,
        end: el.selectionEnd ?? 0,
      };
    }

    return detalhesSelectionRef.current;
  };

  const restoreDetalhesSelection = (start: number, end: number) => {
    requestAnimationFrame(() => {
      const el = detalhesRef.current;
      if (!el) return;

      const safeStart = Math.max(0, Math.min(start, el.value.length));
      const safeEnd = Math.max(0, Math.min(end, el.value.length));
      el.focus();
      el.setSelectionRange(safeStart, safeEnd);
      detalhesSelectionRef.current = { start: safeStart, end: safeEnd };
    });
  };

  const undoDetalhes = () => {
    if (detalhesHistoryIndexRef.current <= 0) return;

    detalhesHistoryIndexRef.current -= 1;
    const previousValue = detalhesHistoryRef.current[detalhesHistoryIndexRef.current] ?? "";
    updateDetalhes(previousValue, {
      selectionStart: previousValue.length,
      selectionEnd: previousValue.length,
      pushHistory: false,
    });
  };

  const redoDetalhes = () => {
    if (detalhesHistoryIndexRef.current >= detalhesHistoryRef.current.length - 1) return;

    detalhesHistoryIndexRef.current += 1;
    const nextValue = detalhesHistoryRef.current[detalhesHistoryIndexRef.current] ?? "";
    updateDetalhes(nextValue, {
      selectionStart: nextValue.length,
      selectionEnd: nextValue.length,
      pushHistory: false,
    });
  };

  const handleDetalhesKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isModifier = e.ctrlKey || e.metaKey;
    if (!isModifier) return;

    const key = e.key.toLowerCase();

    if (key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undoDetalhes();
      return;
    }

    if ((key === 'z' && e.shiftKey) || key === 'y') {
      e.preventDefault();
      redoDetalhes();
      return;
    }

    if (key === 'b') {
      e.preventDefault();
      applyStyledBlock({ 'font-weight': '700' });
      return;
    }

    if (key === 'u') {
      e.preventDefault();
      applyStyledBlock({ 'text-decoration': 'underline' });
    }
  };

  const applyWrap = (before: string, after: string = before) => {
    const el = detalhesRef.current;
    if (!el) return;

    const { start, end } = getDetalhesSelection();
    const value = el.value;
    const selected = value.slice(start, end);
    const nextValue = value.slice(0, start) + before + selected + after + value.slice(end);

    const cursorStart = start + before.length;
    const cursorEnd = cursorStart + selected.length;
    updateDetalhes(nextValue, {
      selectionStart: cursorStart,
      selectionEnd: cursorEnd,
    });
  };

  const insertText = (text: string) => {
    const el = detalhesRef.current;
    if (!el) return;

    const { start, end } = getDetalhesSelection();
    const value = el.value;
    const nextValue = value.slice(0, start) + text + value.slice(end);

    const cursor = start + text.length;
    updateDetalhes(nextValue, {
      selectionStart: cursor,
      selectionEnd: cursor,
    });
  };

  const normalizeDetalhesContent = (content: string) => {
    return content.replace(
      /<div\s+style="([^"]*)">\s*!\[([^\]]*)\]\(([^)]+)\)\s*<\/div>/gi,
      (_, styleString: string, alt: string, src: string) => {
        const parsedStyles = parseStyleString(styleString);
        const textAlign = parsedStyles['text-align'];
        const marginBottom = parsedStyles['margin-bottom'];
        const margin = textAlign === 'center'
          ? '0 auto'
          : textAlign === 'left'
            ? '0 auto 0 0'
            : textAlign === 'right'
              ? '0 0 0 auto'
              : parsedStyles.margin ?? '0 auto';

        return buildHtmlImage(src, alt, {
          margin,
          ...(marginBottom ? { 'margin-bottom': marginBottom } : {}),
        });
      }
    )
    // Converte \n para <br> dentro de elementos HTML (divs de texto formatado)
    .replace(
      /(<(?:div|p|span|h[1-6])[^>]*>)((?:[\s\S](?!<\/?(?:div|p|span|h[1-6])))*?)(<\/(?:div|p|span|h[1-6])>)/gi,
      (_, open, inner, close) => open + inner.replace(/\n/g, '<br>\n') + close
    );
  };

  const compactDetalhesForSave = (content: string) => {
    return content
      .replace(
        /!\[([^\]]*)\]\(https?:\/\/[^)]+\/storage\/v1\/object\/public\/produtos\/([^)]+)\)/gi,
        '![$1]($2)'
      )
      .replace(
        /<img\s+([^>]*?)src="https?:\/\/[^"\s]+\/storage\/v1\/object\/public\/produtos\/([^"\s]+)"([^>]*)>/gi,
        '<img $1src="$2"$3>'
      );
  };

  const parseStyleString = (styleString: string) => {
    return styleString
      .split(';')
      .map((item) => item.trim())
      .filter(Boolean)
      .reduce<Record<string, string>>((acc, item) => {
        const [key, ...rest] = item.split(':');
        if (!key || rest.length === 0) return acc;
        acc[key.trim()] = rest.join(':').trim();
        return acc;
      }, {});
  };

  const stringifyStyleObject = (styles: Record<string, string>) => {
    return Object.entries(styles)
      .filter(([, value]) => value !== '')
      .map(([key, value]) => `${key}:${value}`)
      .join(';');
  };

  const parseMarkdownImage = (content: string) => {
    const match = content.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (!match) return null;

    const [, alt, src] = match;
    return { alt, src };
  };

  const parseHtmlImage = (content: string) => {
    const match = content.trim().match(/^<img\s+([^>]*?)\/?>(?:<\/img>)?$/i);
    if (!match) return null;

    const attrs = match[1];
    const srcMatch = attrs.match(/src="([^"]+)"/i);
    const altMatch = attrs.match(/alt="([^"]*)"/i);
    const styleMatch = attrs.match(/style="([^"]*)"/i);

    if (!srcMatch) return null;

    return {
      src: srcMatch[1],
      alt: altMatch?.[1] ?? '',
      styles: parseStyleString(styleMatch?.[1] ?? ''),
    };
  };

  const buildHtmlImage = (src: string, alt: string, styleUpdates: Record<string, string> = {}) => {
    const baseStyles: Record<string, string> = {
      'max-width': '100%',
      display: 'block',
      ...styleUpdates,
    };

    return `<img src="${src}" alt="${alt}" style="${stringifyStyleObject(baseStyles)}" />`;
  };

  const applyStyledBlock = (styleUpdates: Record<string, string>) => {
    const el = detalhesRef.current;
    if (!el) return;

    const { start, end } = getDetalhesSelection();
    const value = el.value;
    const selected = value.slice(start, end);

    if (!selected.trim()) return;

    const markdownImage = parseMarkdownImage(selected);
    if (markdownImage) {
      const result = buildHtmlImage(markdownImage.src, markdownImage.alt, styleUpdates);
      const nextValue = value.slice(0, start) + result + value.slice(end);

      updateDetalhes(nextValue, {
        selectionStart: start,
        selectionEnd: start + result.length,
      });
      return;
    }

    const htmlImage = parseHtmlImage(selected);
    if (htmlImage) {
      const result = buildHtmlImage(htmlImage.src, htmlImage.alt, {
        ...htmlImage.styles,
        ...styleUpdates,
      });
      const nextValue = value.slice(0, start) + result + value.slice(end);

      updateDetalhes(nextValue, {
        selectionStart: start,
        selectionEnd: start + result.length,
      });
      return;
    }

    const trimmed = selected.trim();
    const wrapperMatch = trimmed.match(/^<div\s+style="([^"]*)">([\s\S]*)<\/div>$/i);

    let result = selected;

    if (wrapperMatch) {
      const [, styleString, innerContent] = wrapperMatch;
      const innerMarkdownImage = parseMarkdownImage(innerContent);
      const innerHtmlImage = parseHtmlImage(innerContent);
      const mergedStyles = {
        ...parseStyleString(styleString),
        ...styleUpdates,
      };

      if (innerMarkdownImage) {
        const textAlign = mergedStyles['text-align'];
        const margin = textAlign === 'center'
          ? '0 auto'
          : textAlign === 'left'
            ? '0 auto 0 0'
            : textAlign === 'right'
              ? '0 0 0 auto'
              : mergedStyles.margin ?? '0 auto';

        result = buildHtmlImage(innerMarkdownImage.src, innerMarkdownImage.alt, {
          ...mergedStyles,
          margin,
        });
      } else if (innerHtmlImage) {
        const textAlign = mergedStyles['text-align'];
        const margin = textAlign === 'center'
          ? '0 auto'
          : textAlign === 'left'
            ? '0 auto 0 0'
            : textAlign === 'right'
              ? '0 0 0 auto'
              : mergedStyles.margin ?? innerHtmlImage.styles.margin ?? '0 auto';

        result = buildHtmlImage(innerHtmlImage.src, innerHtmlImage.alt, {
          ...innerHtmlImage.styles,
          ...mergedStyles,
          margin,
        });
      } else {
        result = `<div style="${stringifyStyleObject(mergedStyles)}">${innerContent}</div>`;
      }
    } else {
      result = `<div style="${stringifyStyleObject(styleUpdates)}">${selected}</div>`;
    }

    const nextValue = value.slice(0, start) + result + value.slice(end);

    updateDetalhes(nextValue, {
      selectionStart: start,
      selectionEnd: start + result.length,
    });
  };

  const applyTextAlignment = (alignment: 'left' | 'center' | 'right' | 'top' | 'bottom') => {
    const el = detalhesRef.current;
    if (!el) return;

    const { start, end } = getDetalhesSelection();
    const value = el.value;
    const selected = value.slice(start, end);
    const imageMatch = parseMarkdownImage(selected);
    const htmlImage = parseHtmlImage(selected);

    let aligned = selected;

    if (imageMatch) {
      const margin = alignment === 'center'
        ? '0 auto'
        : alignment === 'left'
          ? '0 auto 0 0'
          : alignment === 'right'
            ? '0 0 0 auto'
            : '0 auto';
      const objectPosition = alignment === 'top'
        ? 'center top'
        : alignment === 'bottom'
          ? 'center bottom'
          : 'center center';

      aligned = buildHtmlImage(imageMatch.src, imageMatch.alt, {
        margin,
        'object-position': objectPosition,
      });
    } else if (htmlImage) {
      const margin = alignment === 'center'
        ? '0 auto'
        : alignment === 'left'
          ? '0 auto 0 0'
          : alignment === 'right'
            ? '0 0 0 auto'
            : htmlImage.styles.margin ?? '0 auto';
      const objectPosition = alignment === 'top'
        ? 'center top'
        : alignment === 'bottom'
          ? 'center bottom'
          : htmlImage.styles['object-position'] ?? 'center center';

      aligned = buildHtmlImage(htmlImage.src, htmlImage.alt, {
        ...htmlImage.styles,
        margin,
        'object-position': objectPosition,
      });
    } else {
      if (alignment === 'left' || alignment === 'center' || alignment === 'right') {
        applyStyledBlock({ 'text-align': alignment });
        return;
      }

      applyStyledBlock({
        display: 'flex',
        'flex-direction': 'column',
        'justify-content': alignment === 'top' ? 'flex-start' : 'flex-end',
        'min-height': '220px',
      });
      return;
    }

    const nextValue = value.slice(0, start) + aligned + value.slice(end);

    updateDetalhes(nextValue, {
      selectionStart: start,
      selectionEnd: start + aligned.length,
    });
  };

  const applyTextSpacing = (pixels: number) => {
    const el = detalhesRef.current;
    if (!el) return;

    const { start, end } = getDetalhesSelection();
    const value = el.value;
    const selected = value.slice(start, end);

    if (!selected.trim()) {
      insertText(`\n<div style="margin-bottom:${pixels}px;"></div>\n`);
      return;
    }

    applyStyledBlock({ 'margin-bottom': `${pixels}px` });
  };

  const applyHeading = (level: 'h1' | 'h2' | 'h3') => {
    const styles = level === 'h1'
      ? { 'font-size': '2rem', 'line-height': '1.2', 'font-weight': '700' }
      : level === 'h2'
        ? { 'font-size': '1.5rem', 'line-height': '1.3', 'font-weight': '700' }
        : { 'font-size': '1.25rem', 'line-height': '1.4', 'font-weight': '600' };

    applyStyledBlock(styles);
  };

  const applyTextColor = (color: 'red' | 'blue' | 'green' | 'yellow') => {
    const colorMap = {
      red: '#e11d48',
      blue: '#2563eb',
      green: '#16a34a',
      yellow: '#f59e0b',
    } as const;

    applyStyledBlock({ color: colorMap[color] });
  };

  const handleUploadImagemDetalhes = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDetalhesImagem(true);
    try {
      const safeName = file.name.replace(/\s+/g, '-');
      const fileName = `detalhes/${Date.now()}-${safeName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('produtos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        alert(`Erro ao enviar imagem para descrição: ${uploadError.message}`);
        return;
      }

      const publicUrl = supabase.storage
        .from('produtos')
        .getPublicUrl(uploadData.path).data.publicUrl;

      // Salva caminho curto para evitar estourar limite de coluna no banco
      const imageReference = uploadData.path || publicUrl;
      insertText(`\n![${file.name}](${imageReference})\n`);
    } catch (error) {
      console.error('Erro ao enviar imagem da descrição:', error);
      alert('Erro ao enviar imagem para descrição');
    } finally {
      setUploadingDetalhesImagem(false);
      e.target.value = '';
    }
  };

  const openCropper = (file: File, target: "principal" | "detalhe" | "extra1" | "extra2" | "extra3" | "extra4" | "extra5" | "extra6") => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    openCropper(file, "principal");
  };

  const handleDetailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    openCropper(file, "detalhe");
  };

  const handleExtraFileChange = (index: 1 | 2 | 3 | 4 | 5 | 6) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;
    const target =
      index === 1 ? "extra1" :
      index === 2 ? "extra2" :
      index === 3 ? "extra3" :
      index === 4 ? "extra4" :
      index === 5 ? "extra5" : "extra6";
    openCropper(file, target);
  };

  const onCropComplete = (_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const moveCrop = (direction: "left" | "right" | "up" | "down" | "center") => {
    const step = 20;
    setCrop((prev) => {
      if (direction === "center") return { x: 0, y: 0 };
      if (direction === "left") return { ...prev, x: clamp(prev.x - step, -100, 100) };
      if (direction === "right") return { ...prev, x: clamp(prev.x + step, -100, 100) };
      if (direction === "up") return { ...prev, y: clamp(prev.y - step, -100, 100) };
      return { ...prev, y: clamp(prev.y + step, -100, 100) };
    });
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
      setPreviewImagemPrincipal(previewUrl);
      setForm({ ...form, image: file });
    }
    if (cropTarget === "detalhe") {
      setPreviewImagemDetalhe(previewUrl);
      setForm({ ...form, imagem_detalhe: file });
    }
    if (cropTarget === "extra1") {
      setPreviewImagemExtra1(previewUrl);
      setForm({ ...form, image1: file });
    }
    if (cropTarget === "extra2") {
      setPreviewImagemExtra2(previewUrl);
      setForm({ ...form, image2: file });
    }
    if (cropTarget === "extra3") {
      setPreviewImagemExtra3(previewUrl);
      setForm({ ...form, image3: file });
    }
    if (cropTarget === "extra4") {
      setPreviewImagemExtra4(previewUrl);
      setForm({ ...form, image4: file });
    }
    if (cropTarget === "extra5") {
      setPreviewImagemExtra5(previewUrl);
      setForm({ ...form, image5: file });
    }
    if (cropTarget === "extra6") {
      setPreviewImagemExtra6(previewUrl);
      setForm({ ...form, image6: file });
    }

    setCropOpen(false);
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
      let extraImage4Path = undefined;
      let extraImage5Path = undefined;
      let extraImage6Path = undefined;

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

      if (form.image4) {
        const fileName = `${Date.now()}-${form.image4.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('produtos')
          .upload(fileName, form.image4, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Erro ao fazer upload da imagem extra 4:', uploadError);
          alert(`Erro ao fazer upload da imagem extra 4: ${uploadError.message}`);
          setLoading(false);
          return;
        }

        extraImage4Path = uploadData.path;
      }

      if (form.image5) {
        const fileName = `${Date.now()}-${form.image5.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('produtos')
          .upload(fileName, form.image5, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Erro ao fazer upload da imagem extra 5:', uploadError);
          alert(`Erro ao fazer upload da imagem extra 5: ${uploadError.message}`);
          setLoading(false);
          return;
        }

        extraImage5Path = uploadData.path;
      }

      if (form.image6) {
        const fileName = `${Date.now()}-${form.image6.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('produtos')
          .upload(fileName, form.image6, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Erro ao fazer upload da imagem extra 6:', uploadError);
          alert(`Erro ao fazer upload da imagem extra 6: ${uploadError.message}`);
          setLoading(false);
          return;
        }

        extraImage6Path = uploadData.path;
      }

      const toNumberOrUndefined = (value: string) => {
        if (value === "" || value === null || value === undefined) return undefined;
        const num = Number(value);
        return Number.isFinite(num) ? num : undefined;
      };

      const detalhesCompactado = compactDetalhesForSave(form.detalhes || '');

      const updateData: any = {
        nome: form.nome,
        link: form.link,
        descricao: form.descricao,
        detalhes: detalhesCompactado,
        fornecedor: form.fornecedor,
        ...(form.categoria_id ? { categoria_id: Number(form.categoria_id) } : {}),
      };

      const precoNumber = toNumberOrUndefined(form.preco);
      if (precoNumber !== undefined) updateData.preco = precoNumber;
      const ratingNumber = toNumberOrUndefined(form.rating);
      if (ratingNumber !== undefined) updateData.rating = ratingNumber;
      const reviewsNumber = toNumberOrUndefined(form.reviews);
      if (reviewsNumber !== undefined) updateData.reviews = reviewsNumber;

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

      if (extraImage4Path) {
        updateData.image4 = extraImage4Path;
      }

      if (extraImage5Path) {
        updateData.image5 = extraImage5Path;
      }

      if (extraImage6Path) {
        updateData.image6 = extraImage6Path;
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

  const detalhesCompactadoAtual = compactDetalhesForSave(form.detalhes || '');
  const detalhesChars = detalhesCompactadoAtual.length;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-10 text-zinc-900 space-y-4 flex flex-col max-w-4xl mx-auto"
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

      <div className="bg-white border border-black/10 rounded-xl p-4 space-y-3">
        <p className="text-sm font-medium text-zinc-700">Editor da copy</p>
        <p className="text-xs text-zinc-500">
          Atalhos: Ctrl + Z desfaz, Ctrl + Shift + Z refaz, Ctrl + B negrito, Ctrl + U sublinhado.
        </p>
        <p className="text-xs font-medium text-zinc-500">
          Copy: {detalhesChars} caracteres (coluna em formato text, sem limite curto)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <label className="flex flex-col gap-1 text-xs text-zinc-600">
            Tamanho do texto
            <select
              defaultValue=""
              onChange={(e) => {
                const value = e.target.value as '' | 'h1' | 'h2' | 'h3';
                if (!value) return;
                applyHeading(value);
                e.target.value = '';
              }}
              className="rounded-lg border border-black/10 bg-slate-50 px-3 py-2 text-sm text-zinc-900"
            >
              <option value="">Selecionar</option>
              <option value="h1">Título grande</option>
              <option value="h2">Título médio</option>
              <option value="h3">Título pequeno</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-zinc-600">
            Cor do texto
            <select
              defaultValue=""
              onChange={(e) => {
                const value = e.target.value as '' | 'red' | 'blue' | 'green' | 'yellow';
                if (!value) return;
                applyTextColor(value);
                e.target.value = '';
              }}
              className="rounded-lg border border-black/10 bg-slate-50 px-3 py-2 text-sm text-zinc-900"
            >
              <option value="">Selecionar</option>
              <option value="red">Vermelho</option>
              <option value="blue">Azul</option>
              <option value="green">Verde</option>
              <option value="yellow">Amarelo</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-zinc-600">
            Alinhamento
            <select
              defaultValue=""
              onChange={(e) => {
                const value = e.target.value as '' | 'left' | 'center' | 'right' | 'top' | 'bottom';
                if (!value) return;
                applyTextAlignment(value);
                e.target.value = '';
              }}
              className="rounded-lg border border-black/10 bg-slate-50 px-3 py-2 text-sm text-zinc-900"
            >
              <option value="">Selecionar</option>
              <option value="left">Esquerda</option>
              <option value="center">Centro</option>
              <option value="right">Direita</option>
              <option value="top">Cima</option>
              <option value="bottom">Baixo</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs text-zinc-600">
            Espaçamento
            <select
              defaultValue=""
              onChange={(e) => {
                const value = Number(e.target.value);
                if (!value) return;
                applyTextSpacing(value);
                e.target.value = '';
              }}
              className="rounded-lg border border-black/10 bg-slate-50 px-3 py-2 text-sm text-zinc-900"
            >
              <option value="">Selecionar</option>
              <option value="8">Margem pequena</option>
              <option value="16">Margem média</option>
              <option value="24">Margem grande</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => applyStyledBlock({ 'font-weight': '700' })} className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm font-semibold">Negrito</button>
          <button type="button" onClick={() => applyStyledBlock({ 'text-decoration': 'line-through' })} className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm line-through">Riscado</button>
          <button type="button" onClick={() => insertText('<br>\n')} className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-sm">↵ Quebra de linha</button>
          <label className="flex flex-col gap-1 text-xs text-zinc-600 min-w-[180px]">
            Emoji
            <select
              defaultValue=""
              onChange={(e) => {
                if (!e.target.value) return;
                insertText(e.target.value);
                e.target.value = '';
              }}
              className="rounded-lg border border-black/10 bg-slate-50 px-3 py-2 text-sm text-zinc-900"
            >
              <option value="">Inserir emoji</option>
              <option value="🔥">🔥 Destaque</option>
              <option value="✨">✨ Brilho</option>
              <option value="✅">✅ Check</option>
              <option value="⭐">⭐ Estrela</option>
              <option value="🧴">🧴 Produto</option>
              <option value="🛍️">🛍️ Oferta</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => detalhesImagemInputRef.current?.click()}
            disabled={uploadingDetalhesImagem}
            className="px-3 py-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-sm disabled:opacity-60"
          >
            {uploadingDetalhesImagem ? 'Enviando imagem...' : 'Inserir imagem'}
          </button>
        </div>

          <input
            ref={detalhesImagemInputRef}
            type="file"
            accept="image/*"
            onChange={handleUploadImagemDetalhes}
            className="hidden"
          />

        <textarea
        name="detalhes"
        placeholder="Descrição longa"
        value={form.detalhes}
        onChange={handleChange}
        onKeyDown={handleDetalhesKeyDown}
        onSelect={saveDetalhesSelection}
        onKeyUp={saveDetalhesSelection}
        onClick={saveDetalhesSelection}
        onBlur={saveDetalhesSelection}
        ref={detalhesRef}
        className="w-full p-3 rounded-lg bg-slate-50 border border-black/10 min-h-[220px] text-[15px] leading-relaxed"
        />

        <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
          <p className="text-sm font-medium text-indigo-900 mb-3">Pré-visualização da copy</p>
          <div className="space-y-3 text-[15px] leading-relaxed text-zinc-700">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ children }) => <h1 className="text-2xl font-bold text-zinc-900">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-semibold text-zinc-900">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-semibold text-zinc-900">{children}</h3>,
                p: ({ children }) => <p className="text-zinc-700">{children}</p>,
                img: ({ src = '', alt = '', style, ...props }) => (
                  <img
                    {...props}
                    src={typeof src === 'string' && src.startsWith('http')
                      ? src
                      : supabase.storage.from('produtos').getPublicUrl(String(src)).data.publicUrl}
                    alt={alt}
                    style={style as React.CSSProperties}
                    className="max-w-2xl rounded-xl border border-indigo-100 shadow-sm"
                  />
                ),
                a: ({ href = '', children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-700 underline break-all">
                    {children}
                  </a>
                ),
              }}
            >
              {normalizeDetalhesContent(form.detalhes || 'Nada para pré-visualizar ainda.')}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <label>Imagem Principal (com recorte)</label>
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleFileChange}
        className="p-2"
      />
      <p className="text-xs text-zinc-600 -mt-2">
        {form.image
          ? '✅ Nova imagem principal selecionada'
          : imagemPrincipalAtual
            ? '✅ Já existe imagem principal salva'
            : '⚠️ Nenhuma imagem principal salva'}
      </p>

      <label>Imagem Detalhe</label>
      <input
        type="file"
        name="imagem_detalhe"
        accept="image/*"
        onChange={handleDetailFileChange}
        className="p-2"
      />
      <p className="text-xs text-zinc-600 -mt-2">
        {form.imagem_detalhe
          ? '✅ Nova imagem detalhe selecionada'
          : imagemDetalheAtual
            ? '✅ Já existe imagem detalhe salva'
            : 'ℹ️ Sem imagem detalhe salva'}
      </p>

      <label>Galeria de imagens (opcional)</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleExtraFileChange(1)}
            className="p-2 w-full"
          />
          <p className="text-xs text-zinc-600 px-2">
            {form.image1 ? '✅ Nova extra 1 selecionada' : imagemExtraAtual1 ? '✅ Extra 1 já salva' : 'Sem arquivo'}
          </p>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleExtraFileChange(2)}
            className="p-2 w-full"
          />
          <p className="text-xs text-zinc-600 px-2">
            {form.image2 ? '✅ Nova extra 2 selecionada' : imagemExtraAtual2 ? '✅ Extra 2 já salva' : 'Sem arquivo'}
          </p>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleExtraFileChange(3)}
            className="p-2 w-full"
          />
          <p className="text-xs text-zinc-600 px-2">
            {form.image3 ? '✅ Nova extra 3 selecionada' : imagemExtraAtual3 ? '✅ Extra 3 já salva' : 'Sem arquivo'}
          </p>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleExtraFileChange(4)}
            className="p-2 w-full"
          />
          <p className="text-xs text-zinc-600 px-2">
            {form.image4 ? '✅ Nova extra 4 selecionada' : imagemExtraAtual4 ? '✅ Extra 4 já salva' : 'Sem arquivo'}
          </p>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleExtraFileChange(5)}
            className="p-2 w-full"
          />
          <p className="text-xs text-zinc-600 px-2">
            {form.image5 ? '✅ Nova extra 5 selecionada' : imagemExtraAtual5 ? '✅ Extra 5 já salva' : 'Sem arquivo'}
          </p>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleExtraFileChange(6)}
            className="p-2 w-full"
          />
          <p className="text-xs text-zinc-600 px-2">
            {form.image6 ? '✅ Nova extra 6 selecionada' : imagemExtraAtual6 ? '✅ Extra 6 já salva' : 'Sem arquivo'}
          </p>
        </div>
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
        <div className="bg-white rounded-xl border border-black/10 p-3">
          <p className="text-sm text-zinc-600 mb-2">Imagem extra 4</p>
          {previewImagemExtra4 || imagemExtraAtual4 ? (
            <img
              src={previewImagemExtra4 || imagemExtraAtual4 || ''}
              alt="Imagem extra 4"
              className="w-full h-40 object-contain rounded-lg bg-white"
            />
          ) : (
            <div className="w-full h-40 rounded-lg bg-slate-100 border border-black/10 flex items-center justify-center text-sm text-zinc-500">
              Sem imagem
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl border border-black/10 p-3">
          <p className="text-sm text-zinc-600 mb-2">Imagem extra 5</p>
          {previewImagemExtra5 || imagemExtraAtual5 ? (
            <img
              src={previewImagemExtra5 || imagemExtraAtual5 || ''}
              alt="Imagem extra 5"
              className="w-full h-40 object-contain rounded-lg bg-white"
            />
          ) : (
            <div className="w-full h-40 rounded-lg bg-slate-100 border border-black/10 flex items-center justify-center text-sm text-zinc-500">
              Sem imagem
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl border border-black/10 p-3">
          <p className="text-sm text-zinc-600 mb-2">Imagem extra 6</p>
          {previewImagemExtra6 || imagemExtraAtual6 ? (
            <img
              src={previewImagemExtra6 || imagemExtraAtual6 || ''}
              alt="Imagem extra 6"
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
                  <span className="text-xs text-zinc-600 ml-2">Posição:</span>
                  <button
                    type="button"
                    onClick={() => moveCrop("left")}
                    className="px-2 py-1 rounded text-xs border bg-slate-100 border-slate-200"
                  >
                    Esquerda
                  </button>
                  <button
                    type="button"
                    onClick={() => moveCrop("right")}
                    className="px-2 py-1 rounded text-xs border bg-slate-100 border-slate-200"
                  >
                    Direita
                  </button>
                  <button
                    type="button"
                    onClick={() => moveCrop("up")}
                    className="px-2 py-1 rounded text-xs border bg-slate-100 border-slate-200"
                  >
                    Cima
                  </button>
                  <button
                    type="button"
                    onClick={() => moveCrop("down")}
                    className="px-2 py-1 rounded text-xs border bg-slate-100 border-slate-200"
                  >
                    Baixo
                  </button>
                  <button
                    type="button"
                    onClick={() => moveCrop("center")}
                    className="px-2 py-1 rounded text-xs border bg-indigo-50 text-indigo-700 border-indigo-200"
                  >
                    Centro
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
  );
}
