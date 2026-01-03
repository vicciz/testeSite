'use client';

import { useEffect, useState } from 'react';

interface Produto {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  rating: string;
  reviews: number;
  image: string;
  category: string;
  descricao: string;
}

export default function ProductCarrossel() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [startIndex, setStartIndex] = useState(0); // índice inicial do grupo de 3

  useEffect(() => {
    fetch("http://10.0.0.120/api/listar_produtos.php")
      .then(res => res.json())
      .then(data => setProdutos(data))
      .catch(err => {
        console.error(err);
        setProdutos([]);
      });
  }, []);

  if (!produtos.length) {
    return <p className="text-white">Carregando produtos...</p>;
  }

  const totalProdutos = produtos.length;
  const visibleProdutos = produtos.slice(startIndex, startIndex + 3);

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 3 + totalProdutos) % totalProdutos);
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + 3) % totalProdutos);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-purple rounded-2xl p- shadow-xl px-1">

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrev}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          ◀
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg"
        >
          ▶
        </button>
      </div>

      <div className="flex gap-5 overflow-hidden">
        {visibleProdutos.map((produto) => (
          <div
            key={produto.id}
            className="w-1/3 bg-gray-50 rounded-xl p-4 flex flex-col items-center"
          >
            <img
              src={produto.image ? `/images/${produto.image}` : '/images/default.png'}
              alt={produto.name}
              className="w-full h-40 object-cover rounded-xl mb-2"
            />
            <h3 className="text-md font-bold">{produto.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{produto.descricao}</p>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-purple-600">R$ {produto.price}</span>
              <span className="text-sm line-through text-gray-400">R$ {produto.originalPrice}</span>
            </div>
            <p className="text-sm text-gray-500">⭐ {produto.rating} ({produto.reviews})</p>
          </div>
        ))}
      </div>
    </div>
  );
}
