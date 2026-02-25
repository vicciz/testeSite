"use client";
import { useState } from "react";

export default function Perfil() {
  const [editando, setEditando] = useState(false);

  const [usuario, setUsuario] = useState({
    nome: "Vinicios Borges",
    email: "vinicios@email.com",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const salvar = () => {
    console.log("Dados atualizados:", usuario);
    setEditando(false);
    alert("Perfil atualizado com sucesso!");
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center p-6">
      <div className="bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl p-8">

        {editando ? (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">
              Editar Perfil
            </h1>

            <input
              name="nome"
              value={usuario.nome}
              onChange={handleChange}
              className="w-full p-3 mb-4 rounded bg-zinc-800"
              placeholder="Nome"
            />

            <input
              name="email"
              value={usuario.email}
              onChange={handleChange}
              className="w-full p-3 mb-6 rounded bg-zinc-800"
              placeholder="Email"
            />

            <button
              onClick={salvar}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-semibold transition"
            >
              Salvar
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center">
              {usuario.nome}
            </h1>

            <p className="text-gray-400 text-center mt-2">
              {usuario.email}
            </p>

            <button
              onClick={() => setEditando(true)}
              className="mt-8 w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-semibold transition"
            >
              Editar Perfil
            </button>
          </>
        )}

      </div>
    </div>
  );
}