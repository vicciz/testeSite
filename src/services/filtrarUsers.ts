// src/components/functions/filtros/filtrar-users.ts

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  role: string;
};

export default function filtrarUsers(
  usuarios: Usuario[],
  campo: "nome" | "email",
  valor: string
): Usuario[] {
  if (!valor) return usuarios;

  return usuarios.filter(u =>
    u[campo].toLowerCase().includes(valor.toLowerCase())
  );
}
