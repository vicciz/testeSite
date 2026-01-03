import ProductCarousel from '@/src/components/productCarousel';

export default function Inicio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center text-white">
        <h1 className="text-4xl font-extrabold mb-6">
          Página de Início
        </h1>

        <ProductCarousel />

        <p className="text-gray-300 mt-10 text-lg">
          Bem-vindo à página inicial da aplicação!
        </p>
      </div>
    </div>
  );
}
