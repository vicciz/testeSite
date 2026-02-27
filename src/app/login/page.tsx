"use client";

import { useState } from "react";
import { supabase } from "@/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setNome("");
      return;
    }
    const capitalized = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    setNome(capitalized);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase
      .from("clientes")
      .select("id,nome,email,role")
      .eq("email", email)
      .eq("senha", senha)
      .single();

    if (error || !data) {
      alert("Email ou senha inválidos");
      return;
    }

    localStorage.setItem("user", JSON.stringify({
      id: data.id,
      nome: data.nome,
      email: data.email,
      role: data.role,
    }));
    alert("Login realizado!");
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2">Entrar</h1>
        <p className="text-center text-gray-400 mb-8">Acesse sua conta</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          

          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>


          {/* Senha */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Senha</label>
            <div className="relative">
              <input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {/* Botão de mostrar/ocultar */}
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {mostrarSenha ? "🙈" : "👁️"}
              </button>
            </div>
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
            className="w-full py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition font-semibold text-white"
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