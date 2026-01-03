"use client";

import { useState } from "react";
import { registrar } from "@/src/services/auth";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const resposta = await registrar(nome, email, senha);
    console.log(resposta);

    if (resposta.success) {
      alert("Cadastro realizado com sucesso!");
    } else {
      alert(resposta.message || "Erro ao cadastrar");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-white shadow-xl">

        <h1 className="text-3xl font-bold text-center mb-2">
          Criar conta
        </h1>

        <p className="text-center text-gray-400 mb-8">
          Preencha os dados para continuar
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Nome */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Seu nome"
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 
                       transition font-semibold text-white"
          >
            Criar conta
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Já tem uma conta?{" "}
          <a href="/login" className="text-indigo-400 hover:underline">
            Entrar
          </a>
        </p>

      </div>
    </div>
  );
}
