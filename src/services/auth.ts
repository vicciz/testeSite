export async function registrar(nome: string, email: string, senha: string) {
  const response = await fetch("http://10.0.0.120/api/registro.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nome, email, senha }),
  });

  return response.json();
}

export async function login(email: string, senha: string) {
  const response = await fetch("http://10.0.0.120/api/login.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha }),
  });

  return response.json();
}
