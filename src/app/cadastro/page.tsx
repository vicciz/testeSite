"use client";

import { useState } from "react";
import { supabase } from "@/supabaseClient";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const normalizedEmail = email.trim().toLowerCase();

  const getPasswordStrength = (value: string) => {
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^\w\s]/.test(value)) score += 1;

    if (score <= 1) return { label: "Fraca", color: "bg-red-500", percent: 25 };
    if (score === 2) return { label: "Média", color: "bg-yellow-500", percent: 50 };
    if (score === 3) return { label: "Boa", color: "bg-blue-500", percent: 75 };
    return { label: "Forte", color: "bg-green-600", percent: 100 };
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!normalizedEmail || !senha || !confirmarSenha) {
      alert("Preencha email e senha");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não conferem");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: senha,
      options: {
        data: { nome },
      },
    });

    if (error) {
      console.error(error);
      alert(error.message || "Erro ao cadastrar");
      return;
    }

    if (data?.user) {
      const { error: insertError } = await supabase
        .from("clientes")
        .upsert(
          {
            nome,
            email: normalizedEmail,
            role: "user",
          },
          { onConflict: "email" }
        );

      if (insertError) {
        console.error(insertError);
        alert(insertError.message || "Erro ao salvar no banco de dados");
        return;
      }

      alert("Cadastro realizado com sucesso! Verifique seu email.");
      window.location.href = "/login";
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-black/10 rounded-2xl p-8 text-zinc-900 shadow-xl">

        <h1 className="text-3xl font-bold text-center mb-2">
          Criar conta
        </h1>

        <p className="text-center text-zinc-600 mb-8">
          Preencha os dados para continuar
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Nome */}
          <div>
            <label className="block text-sm mb-1 text-zinc-600">
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Seu nome"
              className="w-full px-4 py-3 rounded-lg bg-white border border-black/10 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-zinc-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-lg bg-white border border-black/10 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm mb-1 text-zinc-600">
              Senha
            </label>
            <div className="relative">
              <input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-white border border-black/10 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900"
              >
                {mostrarSenha ? "🙈" : "👁️"}
              </button>
            </div>
            {senha && (() => {
              const strength = getPasswordStrength(senha);
              return (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                    <span>Segurança: {strength.label}</span>
                    <span>{strength.percent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-200 overflow-hidden">
                    <div className={`h-full ${strength.color}`} style={{ width: `${strength.percent}%` }} />
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Confirmar senha */}
          <div>
            <label className="block text-sm mb-1 text-zinc-600">
              Confirmar senha
            </label>
            <div className="relative">
              <input
                type={mostrarConfirmarSenha ? "text" : "password"}
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-white border border-black/10 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900"
              >
                {mostrarConfirmarSenha ? "🙈" : "👁️"}
              </button>
            </div>
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

        <p className="text-center text-sm text-zinc-600 mt-6">
          Já tem uma conta?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Entrar
          </a>
        </p>

      </div>
    </div>
  );
}
