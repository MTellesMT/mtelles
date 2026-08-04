import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";

const TABLE = "produtos";

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;

  return (data ?? []) as Product[];
}

export async function getProductById(id: number) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as Product;
}

export async function createProduct(
  product: Omit<Product, "id" | "created_at">
) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error(error);
    alert(JSON.stringify(error, null, 2));
    throw error;
  }

  return data;
}

export async function updateProduct(
  id: number,
  product: Partial<Product>
) {
  console.log("UPDATE ID:", id);
  console.log("UPDATE DADOS:", product);

  const { data, error } = await supabase
    .from(TABLE)
    .update(product)
    .eq("id", id)
    .select("*");

  console.log("UPDATE RETORNO:", data);
  console.log("UPDATE ERRO:", error);

  if (error) throw error;

  return data?.[0] ?? null;
}
export async function deleteProduct(id: number) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) throw error;
}