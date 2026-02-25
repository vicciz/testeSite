'use client';

import { useEffect } from 'react';
import { Usuario } from '@/src/services/Usuario';

interface FiltrarUsersProps {
  usuarios: Usuario[];
  termo?: string;
  onFiltrar: (usuarios: Usuario[]) => void;
}

export default function FiltrarUsers({
  usuarios,
  termo = '',
  onFiltrar,
}: FiltrarUsersProps) {
  useEffect(() => {
    const busca = termo.trim().toLowerCase();

    if (!busca) {
      onFiltrar(usuarios);
      return;
    }

    const filtrados = usuarios.filter(
      (u) =>
        u.nome.toLowerCase().includes(busca) ||
        u.email.toLowerCase().includes(busca)
    );

    onFiltrar(filtrados);
  }, [usuarios, termo, onFiltrar]);

  return null; // não renderiza nada
}
