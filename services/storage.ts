import { supabase } from "@/lib/supabase";

const BUCKET = "products";

function gerarNomeArquivo(nome: string) {
  const extensao = nome.split(".").pop();

  const nomeLimpo = nome
    .replace(/\.[^/.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return `${Date.now()}-${nomeLimpo}.${extensao}`;
}

export async function uploadImage(file: File) {
  const fileName = gerarNomeArquivo(file.name);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  return data.publicUrl;
}