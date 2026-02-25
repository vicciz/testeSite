'use client';

import { Usuario } from '@/src/services/Usuario';

interface SelectUsuariosProps {
  usuarios: Usuario[];
  selecionados: number[];
  onChange: (ids: number[]) => void;
}

export default function SelectUsuarios({
  usuarios,
  selecionados,
  onChange,
}: SelectUsuariosProps) {
  function toggleUsuario(id: number) {
    if (selecionados.includes(id)) {
      onChange(selecionados.filter(i => i !== id));
    } else {
      onChange([...selecionados, id]);
    }
  }

  function toggleTodos() {
    if (selecionados.length === usuarios.length) {
      onChange([]);
    } else {
      onChange(usuarios.map(u => u.id));
    }
  }

  return (
    <div>
      {/* selecionar todos */}
      <label style={{ fontWeight: 'bold' }}>
        <input
          type="checkbox"
          checked={
            usuarios.length > 0 &&
            selecionados.length === usuarios.length
          }
          onChange={toggleTodos}
        />{' '}
        Selecionar todos
      </label>

      <ul style={{ marginTop: 10 }}>
        {usuarios.map(u => (
          <li key={u.id}>
            <label>
              <input
                type="checkbox"
                checked={selecionados.includes(u.id)}
                onChange={() => toggleUsuario(u.id)}
              />{' '}
              {u.nome} - {u.email}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
