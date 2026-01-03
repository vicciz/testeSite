"use client";

import { useState } from "react";
import { login } from "@/src/services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const resposta = await login(email, senha);
    console.log(resposta);

    if (resposta.success) {
      alert("Login realizado!");
    } else {
      alert(resposta.message || "Email ou senha inválidos");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-white shadow-xl">

        <h1 className="text-3xl font-bold text-center mb-2">
          Entrar
        </h1>

        <p className="text-center text-gray-400 mb-8">
          Acesse sua conta
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

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

          {/* Esqueci senha */}
          <div className="text-right text-sm">
            <a href="#" className="text-indigo-400 hover:underline">
              Esqueci minha senha
            </a>
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 
                       transition font-semibold text-white"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Não tem uma conta?{" "}
          <a href="/cadastro" className="text-indigo-400 hover:underline">
            Criar conta
          </a>
        </p>

      </div>
    </div>
  );
}
