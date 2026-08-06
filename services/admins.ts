import { supabase } from "@/lib/supabase";

export async function getAdmins() {
  const { data, error } = await supabase
    .from("usuarios_admin")
    .select("*")
    .order("nome", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteAdmin(id: number) {
  const { error } = await supabase
    .from("usuarios_admin")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function alterarStatusAdmin(
  id: number,
  ativo: boolean
) {
  const { error } = await supabase
    .from("usuarios_admin")
    .update({
      ativo,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function updateAdmin(
  id: number,
  nome: string,
  usuario: string,
  nivel: string,
  senha?: string
) {
  const dados: {
    nome: string;
    usuario: string;
    nivel: string;
    senha_hash?: string;
  } = {
    nome,
    usuario,
    nivel,
  };

  if (senha && senha.trim() !== "") {
    dados.senha_hash = senha;
  }

  const { error } = await supabase
    .from("usuarios_admin")
    .update(dados)
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function alterarSenhaAdmin(
  id: number,
  senha: string
) {
  const { error } = await supabase
    .from("usuarios_admin")
    .update({
      senha_hash: senha,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}