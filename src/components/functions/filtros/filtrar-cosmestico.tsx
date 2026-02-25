import { useState } from 'react';

interface FiltroProps {
  categorias: ('Cosmético')[];
  tipos: ( 'Unissex' | 'Masculino' | 'Feminino')[];
  onChange: (categoria: string, tipo: string) => void;
}

export function Filtro({ categorias, tipos, onChange }: FiltroProps) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');
  const [tipoSelecionado, setTipoSelecionado] = useState('Todos');

  const handleCategoria = (c: string) => {
    setCategoriaSelecionada(c);
    onChange(c, tipoSelecionado);
  };

  const handleTipo = (t: string) => {
    setTipoSelecionado(t);
    onChange(categoriaSelecionada, t);
  };

  return (
    <section className="flex pt-4 flex-col md:flex-row gap-4 mb-6" aria-labelledby="filtro-produtos">
      
      {/* Filtro de Categoria */}
      <div className="flex pt -4 gap-2 flex-wrap" aria-label="Filtrar por categoria" role="group">
        <h3 className="text-xl font-medium mb-2">Categoria</h3>
        {categorias.map((c) => (
          <button
            key={c}
            onClick={() => handleCategoria(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${categoriaSelecionada === c
              ? 'bg-green-600 text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
            aria-pressed={categoriaSelecionada === c ? 'true' : 'false'}
            aria-label={`Filtrar produtos pela categoria ${c}`}
            role="button"
          >
            {c}
          </button>
        ))}
      </div>

      {/* Filtro de Tipo de Cosmético */}
      <div className="flex gap-2 flex-wrap mt-4 md:mt-0" aria-label="Filtrar por tipo de cosmético" role="group">
        <h3 className="text-xl font-medium mb-2">Tipo de Cosmético</h3>
        {tipos.map((t) => (
          <button
            key={t}
            onClick={() => handleTipo(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${tipoSelecionado === t
              ? 'bg-green-600 text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
            aria-pressed={tipoSelecionado === t ? 'true' : 'false'}
            aria-label={`Filtrar produtos do tipo ${t}`}
            role="button"
          >
            {t}
          </button>
        ))}
      </div>
    </section>
  );
}
