'use client';

import { useState, useEffect } from 'react';

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

interface Props {
  usuarios: Usuario[];
}

export default function EnviarEmailUsuarios({ usuarios }: Props) {
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);

  // Marca ou desmarca todos
  function toggleTodos() {
    setSelecionados(prev =>
      prev.length === usuarios.length ? [] : usuarios.map(u => u.id)
    );
  }

  function toggleUsuario(id: number) {
    setSelecionados(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }

  async function enviarEmails() {
    const emails = usuarios
      .filter(u => selecionados.includes(u.id))
      .map(u => u.email)
      .filter(Boolean);

    if (emails.length === 0) {
      alert('Selecione ao menos um usuário com email válido');
      return;
    }

    try {
      const formData = new FormData();
      emails.forEach((email, i) => formData.append(`emails[${i}]`, email));
      formData.append('assunto', assunto);
      formData.append('mensagem', mensagem);
      if (arquivo) formData.append('arquivo', arquivo);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enviar-email.php`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert('Emails enviados com sucesso!');
        setSelecionados([]);
        setAssunto('');
        setMensagem('');
        setArquivo(null);
      } else {
        alert('Erro ao enviar emails: ' + (data.error || 'Desconhecido'));
      }
    } catch (err) {
      alert('Erro ao conectar com o servidor');
    }
  }

  useEffect(() => {
    setSelecionados([]);
  }, [usuarios]);

  return (
    <div className="flex flex-col h-screen p-6 gap-4">
      <h2 className="text-xl font-bold">Enviar Email para Usuários</h2>

      {/* Botão único para selecionar/desmarcar todos */}
      <button
        onClick={toggleTodos}
        className="bg-blue-500 text-white px-3 py-1 rounded w-40"
      >
        {selecionados.length === usuarios.length ? 'Desmarcar todos' : 'Selecionar todos'}
      </button>

      {/* Lista de usuários com scroll interno */}
      <div className="flex-1 border rounded p-3 overflow-auto max-h-full">
        {usuarios.map(usuario => (
          <label key={usuario.id} className="flex gap-2 items-center mb-1">
            <input
              type="checkbox"
              checked={selecionados.includes(usuario.id)}
              onChange={() => toggleUsuario(usuario.id)}
            />
            {usuario.nome} ({usuario.email})
          </label>
        ))}
        {usuarios.length === 0 && <p>Nenhum usuário disponível</p>}
      </div>

      {/* Formulário de email */}
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Assunto do email"
          className="border p-2 rounded w-full"
          value={assunto}
          onChange={e => setAssunto(e.target.value)}
        />
        <textarea
          placeholder="Mensagem do email"
          className="border p-2 rounded h-32 w-full resize-none"
          value={mensagem}
          onChange={e => setMensagem(e.target.value)}
        />
        <input
          type="file"
          className="border p-2 rounded w-full"
          onChange={e => setArquivo(e.target.files ? e.target.files[0] : null)}
        />
        <button
          onClick={enviarEmails}
          className="bg-black text-white px-4 py-2 rounded w-60"
        >
          Enviar para selecionados
        </button>
      </div>
    </div>
  );
}
