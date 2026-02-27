import { supabase } from '../../supabaseClient';

// register a new user; you can pass `nome` as metadata if required
export async function registrar(
  nome: string,
  email: string,
  senha: string
) {
  const { data, error } = await supabase.auth.signUp(
    { email, password: senha },
    { data: { nome } }
  );
  return { data, error };
}

// sign in existing user
export async function login(email: string, senha: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });
  return { data, error };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

