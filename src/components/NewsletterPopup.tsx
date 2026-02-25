"use client";
import { useEffect, useState } from "react";

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [naoMostrar, setNaoMostrar] = useState(false);

  useEffect(() => {
    const ocultar = localStorage.getItem("ocultarNewsletter");

    if (!ocultar) {
      setOpen(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://10.0.0.120/api/newsletter.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      alert(data.msg);

      if (data.status === "ok") {
        if (naoMostrar) {
          localStorage.setItem("ocultarNewsletter", "true");
        }
        setOpen(false);
      }
    } catch {
      alert("Erro ao conectar ao servidor");
    }
  };

  const fecharPopup = () => {
    if (naoMostrar) {
      localStorage.setItem("ocultarNewsletter", "true");
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 text-white p-8 rounded-2xl w-full max-w-md relative shadow-2xl">

        <button
          onClick={fecharPopup}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-2">
          🎁 receba novidades!
        </h2>

        <p className="text-gray-400 mb-6">
          Cadastre seu email e receba ofertas exclusivas.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            required
            placeholder="Digite seu melhor email"
            className="w-full p-3 rounded-lg bg-zinc-800 outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={naoMostrar}
              onChange={(e) => setNaoMostrar(e.target.checked)}
            />
            <label>Não mostrar novamente</label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-semibold transition"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}